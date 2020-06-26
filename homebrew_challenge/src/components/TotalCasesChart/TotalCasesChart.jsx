import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js";
import "./TotalCasesChart.css";
import LoadingComponent from "../LoadingComponent/LoadingComponent";

const queryUrl = "https://statistics.gov.scot/sparql.csv";

const query = `PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX dim: <http://purl.org/linked-data/sdmx/2009/dimension#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?date ?shortValue ?count
WHERE {
   VALUES (?value ?shortValue) {
    ( <http://statistics.gov.scot/def/concept/variable/testing-cumulative-people-tested-for-covid-19-positive> "positive" )
  }
  ?obs qb:dataSet <http://statistics.gov.scot/data/coronavirus-covid-19-management-information> .
  ?obs dim:refArea <http://statistics.gov.scot/id/statistical-geography/S92000003> .
  ?obs <http://statistics.gov.scot/def/dimension/variable> ?value .
  ?obs <http://statistics.gov.scot/def/measure-properties/count> ?count .
  ?obs dim:refPeriod ?perioduri .
  ?perioduri rdfs:label ?date
}`;

// Exported for tests
export function parseCsvData(csvData) {
  var allTextLines = csvData.split(/\r\n|\n/);
  var lines = [];

  allTextLines.forEach((line) => {
    if (line.length > 0) {
      lines.push(line.split(",").map((s) => s.trim()));
    }
  });
  lines.shift();

  const positivesMap = new Map();
  const dateSet = new Set();

  lines.forEach(([date, countType, count], i) => {
    if ("positive" === countType) {
      positivesMap.set(date, Number(count));
    } else {
      throw new Error("Unrecognised input: " + countType);
    }

    dateSet.add(date);
  });

  const dates = [...dateSet].sort();
  const points = [];
  dates.forEach((date) => {
    const positive = positivesMap.get(date);
    points.push({
      t: Date.parse(date),
      y: positive,
    });
  });

  return points;
}

const TotalCasesChart = () => {
  const chartContainer = useRef();
  const chartInstance = useRef(null);

  const [seriesData, setSeriesData] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);

  const datasetLabel = "Total of Positive Tests";

  useEffect(() => {
    function createChart(chartRef) {
      const chart = new Chart(chartRef, {
        type: "line",

        data: {
          datasets: [
            {
              label: datasetLabel,
              data: seriesData,
              backgroundColor: " #fdeee8",
              borderColor: "#ec6730",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  maxTicksLimit: 100,
                  callback: function (value, index, values) {
                    return Math.round(value);
                  },
                },
              },
            ],
            xAxes: [
              {
                type: "time",
                distribution: "series",
                time: {
                  tooltipFormat: "D MMM YYYY",
                },
              },
            ],
          },
        },
      });
      return chart;
    }

    function updateChart() {
      chartInstance.current.data.datasets[0].data = seriesData;
      chartInstance.current.update();
    }

    // Only attempt to fetch data once
    if (!dataFetched) {
      setDataFetched(true);
      const form = new FormData();
      form.append("query", query);
      fetch(queryUrl, {
        method: "POST",
        body: form,
      })
        .then((res) => res.text())
        .then((csvData) => {
          setSeriesData(parseCsvData(csvData));
        })
        .catch((error) => {
          console.error(error);
        });
    }

    if (chartInstance.current === null) {
      const myChartRef = chartContainer.current.getContext("2d");
      chartInstance.current = createChart(myChartRef);
    } else {
      updateChart();
    }
  }, [dataFetched, seriesData]);

  const isDataReady = () => {
    return seriesData !== null;
  };

  return (
    <>
      <div
        className={
          isDataReady() ? "chart-container" : "chart-container hidden-chart"
        }
      >
        <canvas ref={chartContainer} />
      </div>
      {isDataReady() ? <></> : <LoadingComponent />}
    </>
  );
};

export default TotalCasesChart;

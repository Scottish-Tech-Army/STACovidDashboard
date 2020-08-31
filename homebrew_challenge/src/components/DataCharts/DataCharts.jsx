import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js";
import "./DataCharts.css";
import moment from "moment";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import {
  PERCENTAGE_CASES,
  DAILY_CASES,
  DAILY_DEATHS,
  TOTAL_CASES,
  TOTAL_DEATHS,
} from "./DataChartsConsts";
import { createDateAggregateValuesMap } from "../Utils/CsvUtils";
import "./FullscreenButton";

// Exported for tests
export function parseNhsCsvData(csvData) {
  const dateAggregateValuesMap = createDateAggregateValuesMap(csvData);

  const dates = [...dateAggregateValuesMap.keys()].sort();

  const percentageCasesPoints = [];
  const dailyCasesPoints = [];
  const dailyDeathsPoints = [];
  const totalCasesPoints = [];
  const totalDeathsPoints = [];

  function get5DayDiff(valueMap, key, endDate, dateSet) {
    const maximumStartDate = moment(endDate).subtract(5, "days");
    for (let i = dateSet.length - 1; i >= 0; i--) {
      if (maximumStartDate.isSameOrAfter(dateSet[i])) {
        const startDate = dateSet[i];
        return valueMap.get(endDate)[key] - valueMap.get(startDate)[key];
      }
    }
    // Entire dataset is withing the 5 day window - just return the end cumulative total
    return valueMap.get(endDate)[key];
  }

  dates.forEach((date) => {
    const {
      cases,
      deaths,
      cumulativeCases,
      cumulativeDeaths,
    } = dateAggregateValuesMap.get(date);

    const positiveCases5DayWindow = get5DayDiff(
      dateAggregateValuesMap,
      "cumulativeCases",
      date,
      dates
    );
    const negativeCases5DayWindow = get5DayDiff(
      dateAggregateValuesMap,
      "cumulativeNegativeTests",
      date,
      dates
    );
    const totalCases5DayWindow =
      positiveCases5DayWindow + negativeCases5DayWindow;

    percentageCasesPoints.push({
      t: date,
      y:
        totalCases5DayWindow === 0
          ? 0
          : (positiveCases5DayWindow * 100) / totalCases5DayWindow,
    });
    dailyCasesPoints.push({
      t: date,
      y: cases,
    });
    dailyDeathsPoints.push({
      t: date,
      y: deaths,
    });
    totalCasesPoints.push({
      t: date,
      y: cumulativeCases,
    });
    totalDeathsPoints.push({
      t: date,
      y: cumulativeDeaths,
    });
  });

  return {
    percentageCases: percentageCasesPoints,
    dailyCases: dailyCasesPoints,
    dailyDeaths: dailyDeathsPoints,
    totalCases: totalCasesPoints,
    totalDeaths: totalDeathsPoints,
  };
}

const DataCharts = ({
  chartType = PERCENTAGE_CASES,
  healthBoardDataset = null,
  fullscreenEnabled = false,
  toggleFullscreen,
}) => {
  const chartContainer = useRef();
  const chartInstance = useRef(null);
  const [percentageCasesSeriesData, setPercentageCasesSeriesData] = useState(
    null
  );
  const [dailyCasesSeriesData, setDailyCasesSeriesData] = useState(null);
  const [dailyDeathsSeriesData, setDailyDeathsSeriesData] = useState(null);
  const [totalCasesSeriesData, setTotalCasesSeriesData] = useState(null);
  const [totalDeathsSeriesData, setTotalDeathsSeriesData] = useState(null);

  const percentageCasesDatasetLabel =
    "% of Positive Tests (5 day moving average)";
  const dailyCasesDatasetLabel = "Daily Cases";
  const dailyDeathsDatasetLabel = "Daily Deaths";
  const totalCasesDatasetLabel = "Total Cases";
  const totalDeathsDatasetLabel = "Total Deaths";

  useEffect(() => {
    // Only attempt to fetch data once
    if (healthBoardDataset != null) {
      const {
        percentageCases,
        dailyCases,
        dailyDeaths,
        totalCases,
        totalDeaths,
      } = parseNhsCsvData(healthBoardDataset);
      setPercentageCasesSeriesData(percentageCases);
      setDailyCasesSeriesData(dailyCases);
      setDailyDeathsSeriesData(dailyDeaths);
      setTotalCasesSeriesData(totalCases);
      setTotalDeathsSeriesData(totalDeaths);
    }
  }, [healthBoardDataset]);

  useEffect(() => {
    function commonChartConfiguration(datasetLabel, seriesData) {
      return {
        type: "line",
        data: {
          datasets: [
            {
              label: datasetLabel,
              data: seriesData,
              backgroundColor: " #fdeee8",
              borderColor: "#ec6730",
              fill: false,
              pointRadius: 0,
              borderWidth: 2,
              lineTension: 0,
            },
          ],
        },
        options: {
          animation: {
            duration: 0,
          },
          hover: {
            animationDuration: 0,
            mode: "index",
            intersect: false,
          },
          responsiveAnimationDuration: 0,
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  maxTicksLimit: 20,
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
                gridLines: {
                  display: false,
                },
              },
            ],
          },
          legend: {
            position: "bottom",
          },
          plugins: {
            chartJsPluginFullscreenButton: {
              fullscreenEnabled: fullscreenEnabled,
              toggleFullscreen: toggleFullscreen,
            },
          },
        },
      };
    }

    function percentageCasesChartConfiguration(chartRef) {
      const configuration = commonChartConfiguration(
        percentageCasesDatasetLabel,
        percentageCasesSeriesData
      );
      configuration.options.scales.yAxes[0].ticks.callback = (
        value,
        index,
        values
      ) => {
        return Math.round(value) + "%";
      };
      configuration.options.tooltips = {
        backgroundColor: "White",
        titleFontColor: "#000000",
        bodyFontColor: "#000000",
        borderColor: "DarkGray;",
        borderWidth: 1,
        position: "nearest",
        callbacks: {
          label: (tooltipItem, data) => {
            let chartLabel = tooltipItem.yLabel.toFixed(2) + "% Tests Positive"
            return chartLabel
          },
          labelColor: (tooltipItem, data) => {
            return {
              backgroundColor: "#ec6730",
              borderColor: "#ec6730",
            };
          },
        },
      };
      return configuration;
    }

    function dailyCasesChartConfiguration(chartRef) {
      return commonChartConfiguration(
        dailyCasesDatasetLabel,
        dailyCasesSeriesData
      );
    }

    function dailyDeathsChartConfiguration(chartRef) {
      return commonChartConfiguration(
        dailyDeathsDatasetLabel,
        dailyDeathsSeriesData
      );
    }

    function totalCasesChartConfiguration(chartRef) {
      return commonChartConfiguration(
        totalCasesDatasetLabel,
        totalCasesSeriesData
      );
    }

    function totalDeathsChartConfiguration(chartRef) {
      return commonChartConfiguration(
        totalDeathsDatasetLabel,
        totalDeathsSeriesData
      );
    }

    if (chartInstance.current !== null) {
      chartInstance.current.destroy();
    }

    const chartRef = chartContainer.current.getContext("2d");
    if (chartType === PERCENTAGE_CASES) {
      chartInstance.current = new Chart(
        chartRef,
        percentageCasesChartConfiguration()
      );
    }
    if (chartType === DAILY_CASES) {
      chartInstance.current = new Chart(
        chartRef,
        dailyCasesChartConfiguration()
      );
    }
    if (chartType === DAILY_DEATHS) {
      chartInstance.current = new Chart(
        chartRef,
        dailyDeathsChartConfiguration()
      );
    }
    if (chartType === TOTAL_CASES) {
      chartInstance.current = new Chart(
        chartRef,
        totalCasesChartConfiguration()
      );
    }
    if (chartType === TOTAL_DEATHS) {
      chartInstance.current = new Chart(
        chartRef,
        totalDeathsChartConfiguration()
      );
    }
  }, [
    percentageCasesSeriesData,
    dailyCasesSeriesData,
    dailyDeathsSeriesData,
    totalCasesSeriesData,
    totalDeathsSeriesData,
    chartType,
    fullscreenEnabled,
    toggleFullscreen,
  ]);

  const isDataReady = () => {
    if (chartType === PERCENTAGE_CASES) {
      return percentageCasesSeriesData !== null;
    }
    if (chartType === DAILY_CASES) {
      return dailyCasesSeriesData !== null;
    }
    if (chartType === DAILY_DEATHS) {
      return dailyDeathsSeriesData !== null;
    }
    if (chartType === TOTAL_CASES) {
      return totalCasesSeriesData !== null;
    }
    if (chartType === TOTAL_DEATHS) {
      return totalDeathsSeriesData !== null;
    }
    return false;
  };

  function getScreenModeClassName() {
    if (isDataReady()) {
      return fullscreenEnabled
        ? "full-screen chart-container"
        : "chart-container";
    } else {
      return "chart-container hidden-chart";
    }
  }

  return (
    <div className="chart-border">
      <div className={getScreenModeClassName()}>
        <canvas ref={chartContainer} />
      </div>
      {isDataReady() ? <></> : <LoadingComponent />}
    </div>
  );
};

export default DataCharts;

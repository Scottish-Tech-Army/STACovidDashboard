import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js";
import "./DataCharts.css";
import "../../common.css";
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
import "chartjs-plugin-annotation";
import {
  commonChartConfiguration,
  datasetConfiguration,
  getWhoThresholdLine,
} from "./DataChartsUtils";
import SonificationPlayButton from "./SonificationPlayButton";

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
  dateRange
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
  const [audio, setAudio] = useState(null);
  const [seriesTitle, setSeriesTitle] = useState("No data");

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
    const DATASET_COLOUR = "#ec6730";

    function percentageCasesChartConfiguration() {
      const datasets = [
        datasetConfiguration(
          percentageCasesDatasetLabel,
          percentageCasesSeriesData,
          DATASET_COLOUR
        ),
      ];
      const configuration = commonChartConfiguration(datasets, dateRange);

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
            let chartLabel = tooltipItem.yLabel.toFixed(2) + "% Tests Positive";
            return chartLabel;
          },
          labelColor: (tooltipItem, data) => {
            return {
              backgroundColor: "#ec6730",
              borderColor: "#ec6730",
            };
          },
        },
      };
      configuration.options.annotation.annotations = [
        ...configuration.options.annotation.annotations,
        getWhoThresholdLine(),
      ];

      return configuration;
    }

    function basicChartConfiguration(datasetLabel, seriesData) {
      const datasets = [
        datasetConfiguration(datasetLabel, seriesData, DATASET_COLOUR),
      ];
      return commonChartConfiguration(datasets, dateRange);
    }

    if (chartInstance.current !== null) {
      chartInstance.current.destroy();
    }

    function setSonification(seriesData, seriesTitle) {
      if (seriesData !== null && seriesData !== undefined) {
        setAudio(seriesData.map(({ t, y }) => y));
        setSeriesTitle(seriesTitle);
      }
    }

    const chartRef = chartContainer.current.getContext("2d");
    if (chartType === PERCENTAGE_CASES) {
      chartInstance.current = new Chart(
        chartRef,
        percentageCasesChartConfiguration()
      );
      if (percentageCasesSeriesData !== undefined) {
        setSonification(percentageCasesSeriesData, "Percentage tests positive");
      }
    } else if (chartType === DAILY_CASES) {
      chartInstance.current = new Chart(
        chartRef,
        basicChartConfiguration(dailyCasesDatasetLabel, dailyCasesSeriesData)
      );
      setSonification(dailyCasesSeriesData, dailyCasesDatasetLabel);
    } else if (chartType === DAILY_DEATHS) {
      chartInstance.current = new Chart(
        chartRef,
        basicChartConfiguration(dailyDeathsDatasetLabel, dailyDeathsSeriesData)
      );
      setSonification(dailyDeathsSeriesData, dailyDeathsDatasetLabel);
    } else if (chartType === TOTAL_CASES) {
      chartInstance.current = new Chart(
        chartRef,
        basicChartConfiguration(totalCasesDatasetLabel, totalCasesSeriesData)
      );
      setSonification(totalCasesSeriesData, totalCasesDatasetLabel);
    } else if (chartType === TOTAL_DEATHS) {
      chartInstance.current = new Chart(
        chartRef,
        basicChartConfiguration(totalDeathsDatasetLabel, totalDeathsSeriesData)
      );
      setSonification(totalDeathsSeriesData, totalDeathsDatasetLabel);
    }
  }, [
    percentageCasesSeriesData,
    dailyCasesSeriesData,
    dailyDeathsSeriesData,
    totalCasesSeriesData,
    totalDeathsSeriesData,
    chartType,
    dateRange
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

  return (
    <div className="chart-border">
      <SonificationPlayButton seriesData={audio} seriesTitle={seriesTitle} />
      <div className="chart-container">
        <canvas ref={chartContainer} />
      </div>
      {isDataReady() ? <></> : <LoadingComponent />}
    </div>
  );
};

export default DataCharts;

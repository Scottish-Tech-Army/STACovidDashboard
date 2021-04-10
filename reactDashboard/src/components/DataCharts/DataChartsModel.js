import {
  Chart,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  TimeSeriesScale,
  Filler,
  Legend,
  Tooltip,
} from "chart.js";
import "./DataCharts.css";
import "../../common.css";
import {
  PERCENTAGE_TESTS,
  DAILY_CASES,
  DAILY_DEATHS,
  TOTAL_CASES,
  TOTAL_DEATHS,
  REGION_DATASET_COLOUR,
  AVERAGE_DATASET_COLOUR,
  ALL_DATES,
  LAST_WEEK,
  LAST_TWO_WEEKS,
  LAST_MONTH,
  LAST_THREE_MONTHS,
} from "../DataCharts/DataChartsConsts";
import { FEATURE_CODE_SCOTLAND } from "../Utils/CsvUtils";
import Annotation from "chartjs-plugin-annotation";
import moment from "moment";
import "chartjs-adapter-date-fns";

Chart.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  TimeSeriesScale,
  Filler,
  Legend,
  Tooltip,
  Annotation
);

const ONE_DAY_IN_MS = 24 * 3600 * 1000;

const keyDates = [
  { date: Date.parse("2020-03-24"), name: "LOCKDOWN" },
  { date: Date.parse("2020-05-29"), name: "PHASE 1" },
  { date: Date.parse("2020-06-19"), name: "PHASE 2" },
  { date: Date.parse("2020-07-10"), name: "PHASE 3" },
  { date: Date.parse("2020-07-15"), name: "BARS REOPEN" },
  { date: Date.parse("2020-08-11"), name: "SCHOOLS REOPEN" },
  { date: Date.parse("2020-10-09"), name: "BARS CLOSE" },
  { date: Date.parse("2021-01-05"), name: "SCOTLAND LOCKDOWN" },
];

function getDateLine({ date, name }, darkmode, index) {
  return {
    type: "line",
    drawTime: "afterDatasetsDraw",
    mode: "vertical",
    scaleID: "x",
    borderColor: darkmode ? "#f2f2f2" : "rgba(0,0,0,0.25)",
    borderWidth: 2,
    value: date,
    label: {
      backgroundColor: darkmode ? "#c1def1" : "#007EB9",
      color: darkmode ? "#121212" : "#ffffff",
      cornerRadius: 2,
      xPadding: 10,
      yPadding: 3,
      position: "start",
      enabled: true,
      yAdjust: index * 20,
      content: name,
    },
  };
}

export function getWhoThresholdLine() {
  return {
    type: "line",
    drawTime: "afterDatasetsDraw",
    mode: "horizontal",
    scaleID: "y",
    borderColor: "rgba(255,0,0,0.8)",
    borderWidth: 2,
    value: 5,
    label: {
      backgroundColor: "white",
      color: "black",
      xPadding: 0,
      yPadding: 0,
      position: "top",
      enabled: true,
      content: "WHO recommended threshold",
    },
  };
}

function getBox(startDate, endDate) {
  return {
    type: "box",
    display: true,
    drawTime: "beforeDatasetsDraw",
    xScaleID: "x",
    xMin: startDate,
    xMax: endDate,
    backgroundColor: "#287db220",
    borderColor: "#287db220",
  };
}

export function datasetConfiguration(
  datasetLabel,
  seriesData,
  colour,
  fillColour = null
) {
  return {
    label: datasetLabel,
    data: seriesData,
    backgroundColor: fillColour !== null ? fillColour : undefined,
    borderColor: colour,
    fill: fillColour !== null,
    pointRadius: 0,
    borderWidth: 2,
    lineTension: 0,
    pointHoverBackgroundColor: colour,
  };
}

function getSeriesYMax(dataset) {
  return Math.max(...dataset.data, 0);
}

export function getChartYMax(datasets) {
  if (datasets === null || datasets === undefined || datasets.length === 0) {
    return 0;
  }
  return Math.max(...datasets.map((dataset) => getSeriesYMax(dataset)));
}

export const getMaxTicks = (yMax) => {
  if (yMax === null || yMax === undefined || yMax === 0) {
    return 1;
  }
  if (yMax >= 20) {
    return 20;
  }
  return yMax;
};

export function commonChartConfiguration(
  dates,
  endDate,
  datasets,
  darkmode,
  dateRange = null
) {
  const maxTicks = getMaxTicks(getChartYMax(datasets));

  let result = {
    type: "line",
    data: { labels: dates, datasets: datasets },
    options: {
      animation: false,
      interaction: { mode: "index", intersect: false },
      maintainAspectRatio: false,
      scales: {
        y: {
          grid: { color: darkmode ? "#121212" : "#cccccc" },
          beginAtZero: true,
          ticks: {
            color: darkmode ? "#f2f2f2" : "#767676",
            maxTicksLimit: maxTicks,
            callback: (value) => Math.round(value),
          },
        },
        x: {
          type: "timeseries",
          time: { tooltipFormat: "d MMM yyyy", unit: "day" },
          grid: { display: false },
          ticks: {
            color: darkmode ? "#f2f2f2" : "#767676",
            source: "labels",
          },
        },
      },
      plugins: {
        legend: {
          onClick: () => {},
          position: "bottom",
          labels: {
            boxWidth: 20,
            font: { size: 14 },
            color: darkmode ? "#f2f2f2" : "#767676",
          },
        },
        tooltip: {
          callbacks: {
            labelColor: ({ datasetIndex }) => ({
              borderColor: "#000000",
              backgroundColor:
                datasetIndex === 0
                  ? REGION_DATASET_COLOUR
                  : AVERAGE_DATASET_COLOUR,
            }),
            label: ({ dataset, raw }) =>
              dataset.label +
              ": " +
              (Number.isInteger(raw) ? raw : raw.toFixed(1)),
          },
        },
      },
    },
  };

  if (datasets.length > 0) {
    const annotations = {};
    keyDates.forEach((date, i) => {
      annotations[`line${i}`] = getDateLine(date, darkmode, i);
    });

    annotations.endBox1 = getBox(endDate - ONE_DAY_IN_MS, endDate);
    annotations.endBox2 = getBox(endDate - ONE_DAY_IN_MS * 2, endDate);
    annotations.endBox3 = getBox(endDate - ONE_DAY_IN_MS * 3, endDate);

    result.options.plugins.annotation = { annotations: annotations };
  }

  if (dateRange != null) {
    result.options.scales.x.min = dateRange.startDate;
    result.options.scales.x.max = dateRange.endDate;
  }

  return result;
}

export function calculateDateRange(maxDateRange, timePeriod) {
  let startDate = 0;
  const endDate = maxDateRange.endDate;

  switch (timePeriod) {
    case ALL_DATES:
      return maxDateRange;
    case LAST_WEEK:
      startDate = moment(endDate).subtract(1, "weeks").valueOf();
      break;
    case LAST_TWO_WEEKS:
      startDate = moment(endDate).subtract(2, "weeks").valueOf();
      break;
    case LAST_MONTH:
      startDate = moment(endDate).subtract(1, "months").valueOf();
      break;
    case LAST_THREE_MONTHS:
      startDate = moment(endDate).subtract(3, "months").valueOf();
      break;
    default:
      throw new Error("timePeriod invalid: " + timePeriod);
  }

  if (startDate < maxDateRange.startDate) {
    startDate = maxDateRange.startDate;
  }

  return { startDate: startDate, endDate: endDate };
}

function getAverageSeriesData(
  allData,
  chartType,
  seriesDataName,
  populationProportion
) {
  const scotlandData =
    allData.regions[FEATURE_CODE_SCOTLAND].dailySeries[seriesDataName];
  if (chartType === PERCENTAGE_TESTS) {
    return scotlandData;
  }
  return scotlandData.map((y) => y * populationProportion);
}

const AVERAGE_DATASET_FILL_COLOUR = (darkmode) =>
  darkmode ? "rgb(118, 118, 118, 0.50)" : "rgb(118, 118, 118, 0.25)";

function getAverageSeriesLabel(chartType) {
  return chartType === PERCENTAGE_TESTS
    ? "Scotland average"
    : "Scotland average (adjusted for population)";
}

function getChartDatasets(allData, chartType, regionCode, darkmode) {
  let datasetLabel = datasetInfo[chartType].label;
  let seriesDataName = datasetInfo[chartType].seriesName;

  const datasets = [];
  const regionSeriesData =
    allData.regions[regionCode].dailySeries[seriesDataName];
  if (regionSeriesData !== undefined) {
    datasets.push(
      datasetConfiguration(
        datasetLabel,
        regionSeriesData,
        REGION_DATASET_COLOUR
      )
    );
    if (regionCode !== FEATURE_CODE_SCOTLAND) {
      const averageSeriesData = getAverageSeriesData(
        allData,
        chartType,
        seriesDataName,
        allData.regions[regionCode].populationProportion
      );
      if (averageSeriesData) {
        datasets.push(
          datasetConfiguration(
            getAverageSeriesLabel(chartType),
            averageSeriesData,
            AVERAGE_DATASET_COLOUR,
            AVERAGE_DATASET_FILL_COLOUR(darkmode)
          )
        );
      }
    }
  }
  return datasets;
}

const datasetInfo = {
  [DAILY_CASES]: { label: "Daily Cases", seriesName: "dailyCases" },
  [DAILY_DEATHS]: { label: "Daily Deaths", seriesName: "dailyDeaths" },
  [TOTAL_CASES]: { label: "Total Cases", seriesName: "totalCases" },
  [TOTAL_DEATHS]: { label: "Total Deaths", seriesName: "totalDeaths" },
  [PERCENTAGE_TESTS]: {
    label: "% of Tests Positive",
    seriesName: "percentPositiveTests",
  },
};

export function getDataSeries(allData, chartType, regionCode) {
  return (
    allData &&
    allData.regions[regionCode].dailySeries[datasetInfo[chartType].seriesName]
  );
}

export function getSonificationSeriesTitle(chartType) {
  return chartType === PERCENTAGE_TESTS
    ? "Percentage tests positive"
    : datasetInfo[chartType].label;
}

export function createChart(
  chartContainer,
  allData,
  chartType,
  regionCode,
  darkmode,
  dateRange
) {
  const datasets = getChartDatasets(allData, chartType, regionCode, darkmode);
  const chartConfiguration = commonChartConfiguration(
    allData.dates,
    allData.endDate,
    datasets,
    darkmode,
    dateRange
  );

  if (chartType === PERCENTAGE_TESTS) {
    chartConfiguration.options.scales.y.ticks.callback = (
      value,
      index,
      values
    ) => {
      return Math.round(value) + "%";
    };
    chartConfiguration.options.plugins.annotation.annotations.whoLine = getWhoThresholdLine();
  }

  const chartContext = chartContainer.getContext("2d");
  return new Chart(chartContext, chartConfiguration);
}

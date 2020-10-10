import moment from "moment";
import {
  ALL_DATES,
  LAST_WEEK,
  LAST_TWO_WEEKS,
  LAST_MONTH,
  LAST_THREE_MONTHS,
} from "../DataCharts/DataChartsConsts";

const keyDates = [
  { date: Date.parse("2020-03-24"), name: "LOCKDOWN" },
  { date: Date.parse("2020-05-29"), name: "PHASE 1" },
  { date: Date.parse("2020-06-19"), name: "PHASE 2" },
  { date: Date.parse("2020-07-10"), name: "PHASE 3" },
  { date: Date.parse("2020-07-15"), name: "BARS REOPEN" },
  { date: Date.parse("2020-08-11"), name: "SCHOOLS REOPEN" },
];

function getDateLine({ date, name }, index) {
  return {
    type: "line",
    drawTime: "afterDatasetsDraw",
    mode: "vertical",
    scaleID: "x-axis-0",
    borderColor: "rgba(0,0,0,0.25)",
    borderWidth: 2,
    value: date,
    label: {
      backgroundColor: "#007EB9",
      fontColor: "#ffffff",
      fontStyle: "bold",
      cornerRadius: 2,
      xPadding: 10,
      yPadding: 3,
      position: "top",
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
    scaleID: "y-axis-0",
    borderColor: "rgba(255,0,0,0.8)",
    borderWidth: 2,
    value: 5,
    label: {
      backgroundColor: "white",
      fontColor: "black",
      xPadding: 0,
      yPadding: 0,
      position: "top",
      enabled: true,
      content: "WHO recommended threshold",
    },
  };
}

export function datasetConfiguration(datasetLabel, seriesData, colour) {
  return {
    label: datasetLabel,
    data: seriesData,
    backgroundColor: colour,
    borderColor: colour,
    fill: false,
    pointRadius: 0,
    borderWidth: 2,
    lineTension: 0,
  };
}

export function commonChartConfiguration(datasets, dateRange = null) {
  let result = {
    type: "line",

    data: {
      datasets: datasets,
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
            id: "y-axis-0",
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
        display: false,
      },
      annotation: {
        annotations: keyDates.map(getDateLine),
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            return (
              data.datasets[tooltipItem.datasetIndex].label +
              ": " +
              (Number.isInteger(tooltipItem.yLabel)
                ? tooltipItem.yLabel
                : tooltipItem.yLabel.toFixed(1))
            );
          },
        },
      },
    },
  };
  if (dateRange != null) {
    result.options.scales.xAxes[0].ticks = {
      min: dateRange.startDate,
      max: dateRange.endDate,
    };
  }
  return result;
}

export function calculateDateRange(maxDateRange, timePeriod) {
  if (timePeriod === ALL_DATES) {
    return maxDateRange;
  }
  let startDate = 0;
  const endDate = maxDateRange.endDate;
  if (timePeriod === LAST_WEEK) {
    startDate = moment(endDate).subtract(1, "weeks");
  }
  if (timePeriod === LAST_TWO_WEEKS) {
    startDate = moment(endDate).subtract(2, "weeks");
  }
  if (timePeriod === LAST_MONTH) {
    startDate = moment(endDate).subtract(1, "months");
  }
  if (timePeriod === LAST_THREE_MONTHS) {
    startDate = moment(endDate).subtract(3, "months");
  }
  if (startDate < maxDateRange.startDate) {
    startDate = maxDateRange.startDate;
  }
  return { startDate: startDate, endDate: endDate };
}

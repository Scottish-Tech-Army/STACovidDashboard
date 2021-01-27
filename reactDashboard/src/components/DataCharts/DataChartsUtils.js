import moment from "moment";
import {
  ALL_DATES,
  LAST_FOUR_DAYS,
  LAST_WEEK,
  LAST_TWO_WEEKS,
  LAST_MONTH,
  LAST_THREE_MONTHS,
  REGION_DATASET_COLOUR,
  AVERAGE_DATASET_COLOUR,
} from "../DataCharts/DataChartsConsts";

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
    scaleID: "x-axis-0",
    borderColor: darkmode ? "#f2f2f2" : "rgba(0,0,0,0.25)",
    borderWidth: 2,
    value: date,
    label: {
      backgroundColor: darkmode ? "#c1def1" : "#007EB9",
      fontColor: darkmode ? "#121212" : "#ffffff",
      fontStyle: "bold",
      cornerRadius: 2,
      xPadding: 10,
      yPadding: 3,
      position: "top-fitted",
      enabled: true,
      yAdjust: index * 20,
      content: name,
    },
  };
}

function getBox(dates) {
  console.log("dates: ", dates);

  return {
    type: "box",

    // If true, display the annotation, default is true
    // A callback can also be used:
    //   display(context) {
    //     // context: {chart, element}
    //     return true;
    //   },
    display: true,

    // optional drawTime to control layering, overrides global drawTime setting
    drawTime: "beforeDatasetsDraw",

    // ID of the X scale to bind onto
    xScaleID: "x-axis-0",

    // ID of the Y scale to bind onto
    // yScaleID: "y",

    // Left edge of the box. in units along the x axis
    // xMin: "END -4",
    xMin: dates.startDate,
    // xMin: 20,

    // Right edge of the box
    // xMax: 40,
    // xMax: "END",
    xMax: dates.endDate,

    // Top edge of the box in units along the y axis
    // yMax: 20,
    // yMax: "TEST",

    // Bottom edge of the box
    // yMin: 15,

    // Stroke color
    // borderColor: "red",

    // Stroke width
    // borderWidth: 2,

    // Fill color
    backgroundColor: "blue",

    // Radius of box rectangle, default below
    // cornerRadius: 0,

    // Event hooks - context: {chart, element}
    // enter: function (context) {},
    // leave: function (context) {},
    // click: function (context) {},
    // dblclick: function (context) {},
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
  return Math.max(...dataset.data.map((data) => data.y), 0);
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
  datasets,
  darkmode,
  maxDateRange,
  dateRange = null
) {
  const maxTicks = getMaxTicks(getChartYMax(datasets));

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
            gridLines: {
              color: darkmode ? "#121212" : "#cccccc",
            },
            ticks: {
              beginAtZero: true,
              fontColor: darkmode ? "#f2f2f2" : "#767676",
              maxTicksLimit: maxTicks,
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
            ticks: {
              fontColor: darkmode ? "#f2f2f2" : "#767676",
            },
          },
        ],
      },
      legend: {
        onClick: (e) => e.stopPropagation(),
        position: "bottom",
        labels: {
          boxWidth: 20,
          fontSize: 14,
          fontColor: darkmode ? "#f2f2f2" : "#767676",
        },
      },
      tooltips: {
        callbacks: {
          labelColor: function (tooltipItem, chart) {
            return {
              borderColor: "#000000",
              backgroundColor:
                tooltipItem.datasetIndex === 0
                  ? REGION_DATASET_COLOUR
                  : AVERAGE_DATASET_COLOUR,
            };
          },
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

  if (datasets.length > 0) {
    const boxDates = calculateDateRange(ALL_DATES, LAST_FOUR_DAYS);
    result.options.annotation = {
      annotations: [
        ...keyDates.map((date, i) => getDateLine(date, darkmode, i)),
        getBox(boxDates),
      ],
    };
    console.log("maxDateRange: ", maxDateRange);
    console.log("boxDates: ", boxDates);
  }

  if (dateRange != null) {
    result.options.scales.xAxes[0].ticks = {
      ...result.options.scales.xAxes[0].ticks,
      min: dateRange.startDate,
      max: dateRange.endDate,
    };
  }

  return result;
}

export function calculateDateRange(maxDateRange, timePeriod) {
  let startDate = 0;
  const endDate = maxDateRange.endDate;

  switch (timePeriod) {
    case ALL_DATES:
      return maxDateRange;
    case LAST_FOUR_DAYS:
      startDate = moment(endDate).subtract(4, "days").valueOf();
      break;
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

import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import moment from "moment";
import {
  createDateAggregateValuesMap,
  getNhsCsvDataDateRange
} from "../Utils/CsvUtils";
import "./DataCharts.css";

const useStyles = makeStyles({
  root: {
    width: "90%",
    marginTop: 30,
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
    flexDirection: "column",
    textAlign: "center"
  }
});

export function getMarks({ startDate, endDate }) {
  if (startDate === 0 || endDate === 0) {
    return [];
  }
  const result = [
    {
      value: startDate,
      label: moment.utc(startDate).format("DD MMM, YYYY")
    },
    {
      value: endDate,
      label: moment.utc(endDate).format("DD MMM, YYYY")
    }
  ];
  let tickDate = moment.utc(startDate);
  while (tickDate.isBefore(endDate)) {
    if (tickDate.isAfter(startDate)) {
      result.push({ value: tickDate.valueOf() });
    }
    tickDate = tickDate.add(1, "month");
  }
  return result;
}

const DateSlider = withStyles({
  root: {
    color: "#007EB9",
    height: 3,
    padding: "13px 0"
  },
  thumb: {
    height: 30,
    width: 30,
    backgroundColor: "#ffffff",
    color: "#6C6C6C",
    border: "2px solid #6C6C6C",
    marginTop: -12,
    marginLeft: -13,
    boxShadow: "#ebebeb 0 2px 2px",
    "&:focus, &:hover, &$active": {
      boxShadow: "#ccc 0 2px 3px 1px"
    },
    "& .bar": {
      // display: inline-block !important;
      height: 9,
      width: 1,
      backgroundColor: "currentColor",
      marginLeft: 1,
      marginRight: 1
    }
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 12px)",
    top: -22,
    "& *": {
      background: "transparent",
      color: "#000"
    }
  },
  track: {
    height: 5
  },
  rail: {
    color: "#d8d8d8",
    opacity: 1,
    height: 2.5
  },
  mark: {
    backgroundColor: "#6C6C6C",
    height: 20,
    width: 1,
    marginTop: -5
  },
  markActive: {
    opacity: 1,
    backgroundColor: "#6C6C6C"
  }
})(Slider);

function sliderThumbComponent(props) {
  return (
    <span {...props}>
      <span className="bar" />
      <span className="bar" />
      <span className="bar" />
    </span>
  );
}

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
    // Entire dataset is within the 5 day window - just return the end cumulative total
    return valueMap.get(endDate)[key];
  }

  dates.forEach(date => {
    const {
      cases,
      deaths,
      cumulativeCases,
      cumulativeDeaths
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
          : (positiveCases5DayWindow * 100) / totalCases5DayWindow
    });
    dailyCasesPoints.push({
      t: date,
      y: cases
    });
    dailyDeathsPoints.push({
      t: date,
      y: deaths
    });
    totalCasesPoints.push({
      t: date,
      y: cumulativeCases
    });
    totalDeathsPoints.push({
      t: date,
      y: cumulativeDeaths
    });
  });

  return {
    percentageCases: percentageCasesPoints,
    dailyCases: dailyCasesPoints,
    dailyDeaths: dailyDeathsPoints,
    totalCases: totalCasesPoints,
    totalDeaths: totalDeathsPoints
  };
}

function DateRangeSlider({
  healthBoardDataset = null,
  councilAreaDataset = null,
  dateRange = { startDate: 0, endDate: 0 },
  setDateRange
}) {
  const classes = useStyles();

  const [maxDateRange, setMaxDateRange] = useState({
    startDate: 0,
    endDate: 0
  });

  useEffect(() => {
    // Only attempt to fetch data once
    if (healthBoardDataset != null || councilAreaDataset != null) {
      const parseDateRange = getNhsCsvDataDateRange(
        healthBoardDataset,
        councilAreaDataset
      );
      setMaxDateRange(parseDateRange);
    }
  }, [healthBoardDataset, councilAreaDataset]);

  function handleDateChange(event, value) {
    setDateRange({ startDate: value[0], endDate: value[1] });
  }

  return (
    <div className={classes.root}>
      <DateSlider
        id="date-range-slider-position"
        ThumbComponent={sliderThumbComponent}
        get-aria-label="date range slider"
        value={[dateRange.startDate, dateRange.endDate]}
        min={maxDateRange.startDate}
        max={maxDateRange.endDate}
        onChange={handleDateChange}
        marks={getMarks(maxDateRange)}
        onChange={handleDateChange}
      />
    </div>
  );
}

export default DateRangeSlider;

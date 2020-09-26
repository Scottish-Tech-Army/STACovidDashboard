import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import moment from "moment";
import { createDateAggregateValuesMap } from "../Utils/CsvUtils";

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

const DateSlider = withStyles({
  root: {
    color: "#133a53",
    height: 3,
    padding: "13px 0"
  },
  thumb: {
    height: 27,
    width: 27,
    backgroundColor: "#fff",
    border: "1px solid currentColor",
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
    height: 5
  },
  mark: {
    backgroundColor: "#bfbfbf",
    height: 15,
    width: 1,
    marginTop: -3
  },
  markActive: {
    opacity: 1,
    backgroundColor: "currentColor"
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

const marks = [
  {
    value: 1582848000000,
    label: 1582848000000,
  },
  {
    value: 1600128000000,
    label: 1600128000000,
  }
]

function DateRangeSlider({ healthBoardDataset = null }) {
  const classes = useStyles();
  const [value, setValue] = useState([20200228, 20200301]);
  const [dailyCasesSeriesData, setDailyCasesSeriesData] = useState(null);

  useEffect(() => {
    if (healthBoardDataset != null) {
      const { dailyCases } = parseNhsCsvData(healthBoardDataset);
      setDailyCasesSeriesData(dailyCases);
    }
  }, [healthBoardDataset]);

  useEffect(() => {
    if (dailyCasesSeriesData != null) {
      const dateArray = dailyCasesSeriesData.map(({ t, y }) => t);
      const minDate = Math.min(...dateArray);
      const maxDate = Math.max(...dateArray);
      setValue([minDate, maxDate]);
    }
  }, [dailyCasesSeriesData]);

  return (
    <div className={classes.root}>
      <DateSlider
        ThumbComponent={sliderThumbComponent}
        aria-label="date range slider"
        value={value}
        min={value[0]}
        max={value[1]}
        marks={marks}
      />
    </div>
  );
}

export default DateRangeSlider;

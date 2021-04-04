import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import moment from "moment";
import "./DataCharts.css";

const useStyles = makeStyles({
  root: {
    width: "90%",
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
    flexDirection: "column",
    textAlign: "center",
  },
});

export function getMarks({ startDate, endDate }) {
  if (startDate === 0 || endDate === 0) {
    return [];
  }
  return [
    { value: startDate, label: moment.utc(startDate).format("DD MMM, YYYY") },
    { value: endDate, label: moment.utc(endDate).format("DD MMM, YYYY") },
  ];
}

const DateSlider = withStyles({
  root: {
    color: "#c1def1",
    height: 3,
    padding: "13px 0",
  },
  thumb: {
    height: 25,
    width: 25,
    backgroundColor: "white",
    color: "#6c6c6c",
    border: "1px solid #6c6c6c",
    marginTop: -9,
    marginLeft: -13,
    boxShadow: "#ebebeb 0 2px 2px",
    "&:focus, &:hover, &$active": {
      boxShadow: "#ccc 0 2px 3px 1px",
    },
    "& .bar": {
      height: 9,
      width: 1,
      backgroundColor: "currentColor",
      marginLeft: 1,
      marginRight: 1,
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 12px)",
    top: -22,
    "& *": {
      background: "transparent",
      color: "#000",
    },
  },
  track: {
    height: 7.5,
  },
  rail: {
    color: "#cccccc",
    opacity: 1,
    height: 5,
  },
  mark: {
    backgroundColor: "#6C6C6C",
    height: 20,
    width: 1,
    marginTop: -5,
  },
  markActive: {
    opacity: 1,
    backgroundColor: "#6C6C6C",
  },
})(Slider);

export default function DateRangeSlider({
  maxDateRange = { startDate: 0, endDate: 1 },
  dateRange = { startDate: 0, endDate: 1 },
  setDateRange,
}) {
  const classes = useStyles();

  function handleDateChange(event, value) {
    setDateRange({ startDate: value[0], endDate: value[1] });
  }

  function sliderThumbComponent(props) {
    return (
      <span {...props}>
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </span>
    );
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
      />
    </div>
  );
}

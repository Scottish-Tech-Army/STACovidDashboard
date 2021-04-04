import React from "react";
import Button from "@material-ui/core/Button";
import {
  ALL_DATES,
  LAST_WEEK,
  LAST_TWO_WEEKS,
  LAST_MONTH,
  LAST_THREE_MONTHS,
} from "../DataCharts/DataChartsConsts";
import { calculateDateRange } from "./DataChartsModel";

function QuickSelectDateRange({ maxDateRange, setDateRange }) {
  if (maxDateRange === undefined) {
    throw new Error("missing maxDateRange");
  }
  const handleClick = (newTimePeriod) => {
    setDateRange(calculateDateRange(maxDateRange, newTimePeriod));
  };

  function createButton(id, timePeriod, buttonText, accessibleText) {
    return (
      <Button
        id={id}
        className="quick-select"
        onClick={() => handleClick(timePeriod)}
        variant="outlined"
        aria-label={accessibleText}
      >
        {buttonText}
      </Button>
    );
  }

  return (
    <div className="quick-select-dates">
    <label className="visually-hidden">Choose date range</label>
      {createButton("select-all", ALL_DATES, "ALL", "all dates")}
      {createButton("select-last-three-months", LAST_THREE_MONTHS, "Last 3M", "last three months")}
      {createButton("select-last-month", LAST_MONTH, "Last 1M", "last four weeks")}
      {createButton("select-last-two-weeks", LAST_TWO_WEEKS, "Last 2W", "last two weeks")}
      {createButton("select-last-week", LAST_WEEK, "Last 1W", "last 7 days")}
    </div>
  );
}

export default QuickSelectDateRange;

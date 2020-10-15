import React from "react";
import Button from "@material-ui/core/Button";
import {
  ALL_DATES,
  LAST_WEEK,
  LAST_TWO_WEEKS,
  LAST_MONTH,
  LAST_THREE_MONTHS,
} from "../DataCharts/DataChartsConsts";
import { calculateDateRange } from "./DataChartsUtils";

function QuickSelectDateRange({ maxDateRange, setDateRange }) {
  if (maxDateRange === undefined) {
    throw new Error("missing maxDateRange");
  }
  const handleClick = (newTimePeriod) => {
    setDateRange(calculateDateRange(maxDateRange, newTimePeriod));
  };

  function createButton(id, timePeriod, buttonText) {
    return (
      <Button
        id={id}
        className="quick-select"
        onClick={() => handleClick(timePeriod)}
        variant="outlined"
      >
        {buttonText}
      </Button>
    );
  }

  return (
    <div className="quick-select-dates">
      {createButton("select-all", ALL_DATES, "ALL")}
      {createButton("select-last-three-months", LAST_THREE_MONTHS, "Last 3M")}
      {createButton("select-last-month", LAST_MONTH, "Last 1M")}
      {createButton("select-last-two-weeks", LAST_TWO_WEEKS, "Last 2W")}
      {createButton("select-last-week", LAST_WEEK, "Last 1W")}
    </div>
  );
}

export default QuickSelectDateRange;

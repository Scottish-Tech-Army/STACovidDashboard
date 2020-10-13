import React from "react";
import Button from "@material-ui/core/Button";
import {
  ALL_DATES,
  LAST_WEEK,
  LAST_TWO_WEEKS,
  LAST_MONTH,
  LAST_THREE_MONTHS
} from "../DataCharts/DataChartsConsts";
import { calculateDateRange } from "./DataChartsUtils";

function QuickSelectDateRange({ maxDateRange, setDateRange }) {
  if (maxDateRange === undefined) {
    throw new Error("missing maxDateRange");
  }
  const handleClick = newTimePeriod => {
    setDateRange(calculateDateRange(maxDateRange, newTimePeriod));
  };

  return (
    <div className="quick-select-dates">
      <Button
        id="select-all"
        className="quick-select"
        onClick={() => handleClick(ALL_DATES)}
        variant="outlined"
      >
        ALL
      </Button>
      <Button
        id="select-last-three-months"
        className="quick-select"
        onClick={() => handleClick(LAST_THREE_MONTHS)}
        variant="outlined"
      >
        Last 3M
      </Button>
      <Button
        id="select-last-month"
        className="quick-select"
        onClick={() => handleClick(LAST_MONTH)}
        variant="outlined"
      >
        Last 1M
      </Button>
      <Button
        id="select-last-two-weeks"
        className="quick-select"
        onClick={() => handleClick(LAST_TWO_WEEKS)}
        variant="outlined"
      >
        Last 2W
      </Button>
      <Button
        id="select-last-week"
        className="quick-select"
        onClick={() => handleClick(LAST_WEEK)}
        variant="outlined"
      >
        Last 1W
      </Button>
    </div>
  );
}

export default QuickSelectDateRange;

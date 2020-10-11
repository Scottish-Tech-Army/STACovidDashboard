import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import {
  ALL_DATES,
  LAST_WEEK,
  LAST_TWO_WEEKS,
  LAST_MONTH,
  LAST_THREE_MONTHS
} from "../DataCharts/DataChartsConsts";
import { calculateDateRange } from "./DataChartsUtils";

function QuickSelectDateRange({ dateRange, setDateRange, maxDateRange }) {
  const handleClick = newTimePeriod => {
    setDateRange(calculateDateRange(maxDateRange, newTimePeriod));
    setTimePeriod(newTimePeriod);
  };

  const [timePeriod, setTimePeriod] = useState(ALL_DATES);

  return (
    <>
      <Button
        className="quick-select"
        onClick={() => handleClick(ALL_DATES)}
        variant="outlined"
      >
        ALL
      </Button>
      <Button
        className="quick-select"
        onClick={() => handleClick(LAST_THREE_MONTHS)}
        variant="outlined"
      >
        Last 3M
      </Button>
      <Button
        className="quick-select"
        onClick={() => handleClick(LAST_MONTH)}
        variant="outlined"
      >
        Last 1M
      </Button>
      <Button
        className="quick-select"
        onClick={() => handleClick(LAST_TWO_WEEKS)}
        variant="outlined"
      >
        Last 2W
      </Button>
      <Button
        className="quick-select"
        onClick={() => handleClick(LAST_WEEK)}
        variant="outlined"
      >
        Last 1W
      </Button>
    </>
  );
}

export default QuickSelectDateRange;

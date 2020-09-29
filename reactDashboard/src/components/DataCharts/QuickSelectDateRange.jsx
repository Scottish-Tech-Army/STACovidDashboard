import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import {
  ALL_DATES,
  LAST_WEEK,
  LAST_TWO_WEEKS,
  LAST_MONTH,
  LAST_THREE_MONTHS,
} from "../DataCharts/DataChartsConsts";
import { calculateDateRange } from "./DataChartsUtils";

function QuickSelectDateRange({
  dateRange,
  setDateRange,
  maxDateRange,
  setMaxDateRange,
}) {
  const handleClick = (newTimePeriod) => {
    setDateRange(calculateDateRange(maxDateRange, newTimePeriod));
    setTimePeriod(newTimePeriod);
  };

  const [timePeriod, setTimePeriod] = useState(ALL_DATES);

  return (
    <>
      <Button
        onClick={(event) => {
          handleClick();
        }}
        variant="outlined"
        value={ALL_DATES}
        className="quick-select-button"
      >
        All
      </Button>
      <Button
        onClick={(event) => {
          handleClick();
        }}
        variant="outlined"
        value={LAST_THREE_MONTHS}
        className="quick-select-button"
      >
        Last 3 Months
      </Button>
      <Button
        onClick={(event) => {
          handleClick();
        }}
        variant="outlined"
        value={LAST_MONTH}
        className="quick-select-button"
      >
        Last Month
      </Button>
      <Button
        onClick={(event) => {
          handleClick();
        }}
        variant="outlined"
        value={LAST_TWO_WEEKS}
        className="quick-select-button"
      >
        Last 2 Weeks
      </Button>
      <Button
        onClick={(event) => {
          handleClick();
        }}
        variant="outlined"
        value={LAST_WEEK}
        className="quick-select-button"
      >
        Last Week
      </Button>
    </>
  );
}

export default QuickSelectDateRange;

// <fieldset>
//   <legend>Select Date Range:</legend>
//   <ToggleButtonGroup
//     className="toggle-button-group"
//     type="radio"
//     vertical
//     name="timePeriod"
//     value={timePeriod}
//     onChange={handleChange}
//   >
//     <ToggleButton id="allDates" value={ALL_DATES}>
//       All
//     </ToggleButton>
//     <ToggleButton id="threeMonths" value={LAST_THREE_MONTHS}>
//       Last 3 Months
//     </ToggleButton>
//     <ToggleButton id="oneMonth" value={LAST_MONTH}>
//       Last Month
//     </ToggleButton>
//     <ToggleButton id="twoWeeks" value={LAST_TWO_WEEKS}>
//       Last 2 Weeks
//     </ToggleButton>
//     <ToggleButton id="oneWeek" value={LAST_WEEK}>
//       Last 7 days
//     </ToggleButton>
//   </ToggleButtonGroup>
// </fieldset>

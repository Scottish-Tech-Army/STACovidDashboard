import React, {useState} from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import "./DataChartsSelector.css";

import {
  PERCENTAGE_CASES,
  DAILY_CASES,
  DAILY_DEATHS,
  TOTAL_CASES,
  TOTAL_DEATHS,
} from "./DataChartsConsts";

function DataChartsSelector({ chartType, setChartType }) {
  if (
    chartType !== PERCENTAGE_CASES &&
    chartType !== DAILY_CASES &&
    chartType !== DAILY_DEATHS &&
    chartType !== TOTAL_CASES &&
    chartType !== TOTAL_DEATHS
  ) {
    throw new Error("Unrecognised chartType: " + chartType);
  }
  if (setChartType === null || setChartType === undefined) {
    throw new Error("Unrecognised setChartType: " + setChartType);
  }

  const [value, setValue] = useState(1);

  const handleChange = (val) => setValue(val);

  return (
    <div className="data-charts-selector">
      <fieldset>
        <legend>Select Chart:</legend>
        <ToggleButtonGroup
          className="toggle-button-group"
          type="radio"
          vertical
          value={chartType}
          name="chartType"
          onChange={handleChange}
        >
          <ToggleButton id="dailyCases" value={DAILY_CASES}>
            Daily Cases
          </ToggleButton>
          <ToggleButton id="totalCases" value={TOTAL_CASES}>
            Total Cases
          </ToggleButton>
          <ToggleButton id="dailyDeaths" value={DAILY_DEATHS}>
            Daily Deaths
          </ToggleButton>
          <ToggleButton id="totalDeaths" value={TOTAL_DEATHS}>
            Total Deaths
          </ToggleButton>
          <ToggleButton id="percentageCases" value={PERCENTAGE_CASES}>
            % Tests Positive
          </ToggleButton>
        </ToggleButtonGroup>
      </fieldset>
      <fieldset>
        <legend>Select Date Range:</legend>
        <ToggleButtonGroup
          className="toggle-button-group"
          type="radio"
          vertical
          name="dateRange"
          value={value}
          onChange={(val) => setValue(val)}
        >
          <ToggleButton id="all" value={1}>
            All
          </ToggleButton>
          <ToggleButton id="threeMonths" value={2}>
            3 Months
          </ToggleButton>
          <ToggleButton id="oneMonth" value={3}>
            1 Month
          </ToggleButton>
          <ToggleButton id="twoWeeks" value={4}>
            2 Weeks
          </ToggleButton>
          <ToggleButton id="oneWeek" value={5}>
            1 Week
          </ToggleButton>
        </ToggleButtonGroup>
      </fieldset>
    </div>
  );
}

export default DataChartsSelector;

// onChange={(val) => setChartType(val)}

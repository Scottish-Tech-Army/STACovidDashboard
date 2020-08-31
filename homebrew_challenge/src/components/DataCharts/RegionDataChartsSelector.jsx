import React from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import "./DataChartsSelector.css";

import {
  DAILY_CASES,
  DAILY_DEATHS,
  TOTAL_CASES,
  TOTAL_DEATHS,
} from "../DataCharts/DataChartsConsts";

function RegionDataChartsSelector({ chartType, setChartType }) {
  if (
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

  return (
    <div className="data-charts-selector">
      <div>
        <strong>Select chart:</strong>
      </div>
      <ToggleButtonGroup
        className="toggle-button-group"
        name="chartType"
        type="radio"
        vertical
        value={chartType}
        onChange={(val) => setChartType(val)}
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
      </ToggleButtonGroup>
    </div>
  );
}

export default RegionDataChartsSelector;

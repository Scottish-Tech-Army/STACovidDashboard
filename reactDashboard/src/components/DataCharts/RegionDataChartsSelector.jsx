import React, { useEffect } from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import "./DataChartsSelector.css";
import { getNhsCsvDataDateRange } from "../Utils/CsvUtils";
import {
  DAILY_CASES,
  DAILY_DEATHS,
  TOTAL_CASES,
  TOTAL_DEATHS,
} from "../DataCharts/DataChartsConsts";

function RegionDataChartsSelector({
  chartType,
  setChartType,
  dateRange,
  setDateRange,
  maxDateRange,
  setMaxDateRange,
  healthBoardDataset = null,
  councilAreaDataset = null,
}) {
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

  useEffect(() => {
    // Only attempt to fetch data once
    if (healthBoardDataset != null || councilAreaDataset != null) {
      const parseDateRange = getNhsCsvDataDateRange(
        healthBoardDataset,
        councilAreaDataset
      );
      setMaxDateRange(parseDateRange);
      setDateRange(parseDateRange);
    }
  }, [healthBoardDataset, setDateRange, councilAreaDataset, setMaxDateRange]);

  return (
    <div className="data-charts-selector">
      <fieldset>
        <legend>Select Chart:</legend>
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
      </fieldset>
    </div>
  );
}

export default RegionDataChartsSelector;

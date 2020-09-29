import React, { useState, useEffect } from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import "./DataChartsSelector.css";
import {
  getNhsCsvDataDateRange
} from "../Utils/CsvUtils";
import moment from "moment";
import {
  DAILY_CASES,
  DAILY_DEATHS,
  TOTAL_CASES,
  TOTAL_DEATHS,
  ALL_DATES,
  LAST_WEEK,
  LAST_TWO_WEEKS,
  LAST_MONTH,
  LAST_THREE_MONTHS
} from "../DataCharts/DataChartsConsts";
import {calculateDateRange} from "./DataChartsUtils";

function RegionDataChartsSelector({
  chartType,
  setChartType,
  dateRange,
  setDateRange,
  healthBoardDataset=null,
  councilAreaDataset=null,
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

  const [maxDateRange, setMaxDateRange] = useState({
    startDate: 0,
    endDate: 0
  });
  const [timePeriod, setTimePeriod] = useState(ALL_DATES);

  useEffect(() => {
    // Only attempt to fetch data once
    if (healthBoardDataset != null || councilAreaDataset != null) {
      const parseDateRange = getNhsCsvDataDateRange(healthBoardDataset, councilAreaDataset);
      setMaxDateRange(parseDateRange);
      setDateRange(parseDateRange);
    }
  }, [healthBoardDataset, setDateRange, councilAreaDataset]);

  const handleChange = newTimePeriod => {
    setDateRange(calculateDateRange(maxDateRange, newTimePeriod));
    setTimePeriod(newTimePeriod);
  };

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
          onChange={val => setChartType(val)}
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
      <fieldset>
        <legend>Select Date Range:</legend>
        <ToggleButtonGroup
          className="toggle-button-group"
          type="radio"
          vertical
          name="timePeriod"
          value={timePeriod}
          onChange={handleChange}
        >
          <ToggleButton id="allDates" value={ALL_DATES}>
            All
          </ToggleButton>
          <ToggleButton id="threeMonths" value={LAST_THREE_MONTHS}>
            Last 3 Months
          </ToggleButton>
          <ToggleButton id="oneMonth" value={LAST_MONTH}>
            Last Month
          </ToggleButton>
          <ToggleButton id="twoWeeks" value={LAST_TWO_WEEKS}>
            Last 2 Weeks
          </ToggleButton>
          <ToggleButton id="oneWeek" value={LAST_WEEK}>
            Last 7 days
          </ToggleButton>
        </ToggleButtonGroup>
      </fieldset>
    </div>
  );
}

export default RegionDataChartsSelector;

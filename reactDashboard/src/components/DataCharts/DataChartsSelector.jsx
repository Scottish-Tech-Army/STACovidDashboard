import React, { useState, useEffect } from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import "./DataChartsSelector.css";
import { createDateAggregateValuesMap } from "../Utils/CsvUtils";
import moment from "moment";

import {
  PERCENTAGE_CASES,
  DAILY_CASES,
  DAILY_DEATHS,
  TOTAL_CASES,
  TOTAL_DEATHS
} from "./DataChartsConsts";

// Exported for tests
export function parseNhsCsvData(csvData) {
  const dateAggregateValuesMap = createDateAggregateValuesMap(csvData);

  const dates = [...dateAggregateValuesMap.keys()].sort();

  if (dates.length === 0) {
    return { startDate: 0, endDate: 0 };
  }

  return {
    startDate: dates[0],
    endDate: dates.pop()
  };
}

const LAST_WEEK = "lastWeek";
const LAST_TWO_WEEKS = "lastTwoWeeks";
const LAST_MONTH = "lastMonth";
const LAST_THREE_MONTHS = "lastThreeMonths";
const ALL_DATES = "allDates";

export function calculateDateRange(maxDateRange, timePeriod) {
  if (timePeriod === ALL_DATES) {
    return maxDateRange;
  }
  let startDate = 0;
  const endDate = maxDateRange.endDate;
  if (timePeriod === LAST_WEEK) {
    startDate = moment(endDate).subtract(1, "weeks");
  }
  if (timePeriod === LAST_TWO_WEEKS) {
    startDate = moment(endDate).subtract(2, "weeks");
  }
  if (timePeriod === LAST_MONTH) {
    startDate = moment(endDate).subtract(1, "months");
  }
  if (timePeriod === LAST_THREE_MONTHS) {
    startDate = moment(endDate).subtract(3, "months");
  }
  if (startDate < maxDateRange.startDate) {
    startDate = maxDateRange.startDate;
  }
  return { startDate: startDate, endDate: endDate };
}

function DataChartsSelector({
  chartType,
  setChartType,
  dateRange,
  setDateRange,
  healthBoardDataset,
}) {
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

  const [maxDateRange, setMaxDateRange] = useState({
    startDate: 0,
    endDate: 0
  });
  const [timePeriod, setTimePeriod] = useState(ALL_DATES);

  useEffect(() => {
    // Only attempt to fetch data once
    if (healthBoardDataset != null) {
      const parseDateRange = parseNhsCsvData(healthBoardDataset);
      setMaxDateRange(parseDateRange);
      setDateRange(parseDateRange);
    }
  }, [healthBoardDataset, setDateRange]);

  const handleChange = (newTimePeriod) => {
    setDateRange(calculateDateRange(maxDateRange, newTimePeriod));
    setTimePeriod(newTimePeriod);
}

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

export default DataChartsSelector;

// onChange={(val) => setChartType(val)}

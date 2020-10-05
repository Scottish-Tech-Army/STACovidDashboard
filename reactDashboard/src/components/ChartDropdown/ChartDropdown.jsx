import React from "react";
import "./ChartDropdown.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "react-bootstrap/Dropdown";
import "../../common.css";
import {
  PERCENTAGE_CASES,
  DAILY_CASES,
  DAILY_DEATHS,
  TOTAL_CASES,
  TOTAL_DEATHS,
} from "../DataCharts/DataChartsConsts";

const ChartDropdown = ({chartType = DAILY_CASES,
setChartType,
dateRange,
setDateRange,
maxDateRange,
setMaxDateRange,
healthBoardDataset = null,
councilAreaDataset = null,}) => {

  return (
    <Dropdown onSelect={(eventKey) => setChartType(eventKey)}>
      <Dropdown.Toggle
        variant="primary"
        className="selected-chart"
        value={chartType}
        onChange={(val) => setChartType(val)}
        title={chartType}
      >
      {chartType == null
        ? "Select a chart"
        : "Daily Cases"}
      </Dropdown.Toggle>
      <Dropdown.Menu className="chart-menu">
        <Dropdown.Item id="dailyCases" value={DAILY_CASES}>Daily Cases</Dropdown.Item>
        <Dropdown.Item id="totalCases" value={TOTAL_CASES}>Total Cases</Dropdown.Item>
        <Dropdown.Item id="dailyDeaths" value={DAILY_DEATHS}>Daily Deaths</Dropdown.Item>
        <Dropdown.Item id="totalDeaths" value={TOTAL_DEATHS}>Total Death</Dropdown.Item>
        <Dropdown.Item id="percentageCases" value={PERCENTAGE_CASES}>% Tests Positive</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ChartDropdown;

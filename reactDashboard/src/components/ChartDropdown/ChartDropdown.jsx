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

const ChartDropdown = ({
  chartType = DAILY_CASES,
  setChartType,
}) => {
  

  return (
    <Dropdown onSelect={(eventKey) => setChartType(eventKey)}>
      <Dropdown.Toggle
        variant="primary"
        className="selected-chart"
        value={chartType}
        title={chartType}
      >
        {chartType == null ? "Select a chart" : "Daily Cases"}
      </Dropdown.Toggle>
      <Dropdown.Menu className="chart-menu">
        <Dropdown.Item id="dailyCases" eventKey={DAILY_CASES}>
          Daily Cases
        </Dropdown.Item>
        <Dropdown.Item id="totalCases" eventKey={TOTAL_CASES}>
          Total Cases
        </Dropdown.Item>
        <Dropdown.Item id="dailyDeaths" eventKey={DAILY_DEATHS}>
          Daily Deaths
        </Dropdown.Item>
        <Dropdown.Item id="totalDeaths" eventKey={TOTAL_DEATHS}>
          Total Death
        </Dropdown.Item>
        <Dropdown.Item id="percentageCases" eventKey={PERCENTAGE_CASES}>
          % Tests Positive
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ChartDropdown;

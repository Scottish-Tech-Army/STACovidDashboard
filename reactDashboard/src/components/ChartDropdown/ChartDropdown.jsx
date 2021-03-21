import React from "react";
import "./ChartDropdown.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "react-bootstrap/Dropdown";
import "../../common.css";
import {
  PERCENTAGE_TESTS,
  DAILY_CASES,
  DAILY_DEATHS,
  TOTAL_CASES,
  TOTAL_DEATHS,
} from "../DataCharts/DataChartsConsts";

const ChartDropdown = ({ chartType = DAILY_CASES, setChartType }) => {
  function getChartTypeText(chartType) {
    switch (chartType) {
      case DAILY_CASES:
        return "Daily Cases";
      case TOTAL_CASES:
        return "Total Cases";
      case DAILY_DEATHS:
        return "Daily Deaths";
      case TOTAL_DEATHS:
        return "Total Deaths";
      case PERCENTAGE_TESTS:
        return "% Tests Positive";
      default:
        throw new Error("Unrecognised chartType: " + chartType);
    }
  }

  function menuItem(chartType) {
    return (
      <Dropdown.Item key={chartType} eventKey={chartType}>
        {getChartTypeText(chartType)}
      </Dropdown.Item>
    );
  }

  return (
    <>
      <label id="select-chart">Select Chart:</label>
      <Dropdown onSelect={(eventKey) => setChartType(eventKey)}>
        <Dropdown.Toggle className="selected-chart" value={chartType}>
          {getChartTypeText(chartType)}
        </Dropdown.Toggle>
        <Dropdown.Menu className="chart-menu">
          {[DAILY_CASES, TOTAL_CASES, DAILY_DEATHS, TOTAL_DEATHS, PERCENTAGE_TESTS].map(menuItem)}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default ChartDropdown;

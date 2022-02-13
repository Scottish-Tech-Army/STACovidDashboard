import React from "react";
import "./ChartDropdown.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "react-bootstrap/Dropdown";
import "../../common.css";
import {
  DAILY_CASES,
  DAILY_DEATHS,
  TOTAL_CASES,
  TOTAL_DEATHS,
} from "../DataCharts/DataChartsConsts";

const ChartDropdown = ({ chartType = DAILY_CASES, setChartType }) => {
  function getChartTypeText(itemChartType) {
    switch (itemChartType) {
      case DAILY_CASES:
        return "Daily Cases";
      case TOTAL_CASES:
        return "Total Cases";
      case DAILY_DEATHS:
        return "Daily Deaths";
      case TOTAL_DEATHS:
        return "Total Deaths";
      default:
        throw new Error("Unrecognised chartType: " + itemChartType);
    }
  }

  function menuItem(itemChartType) {
    return (
      <Dropdown.Item key={itemChartType} eventKey={itemChartType}>
        {getChartTypeText(itemChartType)}
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
          {[DAILY_CASES, TOTAL_CASES, DAILY_DEATHS, TOTAL_DEATHS].map(menuItem)}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default ChartDropdown;

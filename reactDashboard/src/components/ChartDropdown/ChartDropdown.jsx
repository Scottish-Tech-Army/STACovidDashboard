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

const ChartDropdown = (chartType = DAILY_CASES,
setChartType,
dateRange,
setDateRange,
maxDateRange,
setMaxDateRange,
healthBoardDataset = null,
councilAreaDataset = null,) => {



  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="primary"
        className="selected-region"
        value={chartType}
        onChange={(val) => setChartType(val)}
         title={chartType}
      ></Dropdown.Toggle>
      <Dropdown.Menu className="region-menu">
        <Dropdown.Item id="dailyCases" value={DAILY_CASES}>Daily Cases</Dropdown.Item>
        <Dropdown.Item id="totalCases" value={TOTAL_CASES}>Total Cases</Dropdown.Item>
        <Dropdown.Item id="dailyDeaths" value={DAILY_DEATHS}>Daily Deaths</Dropdown.Item>
        <Dropdown.Item id="totalDeaths" value={TOTAL_DEATHS}>Total Death</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ChartDropdown;
//
// if (
//   chartType !== DAILY_CASES &&
//   chartType !== DAILY_DEATHS &&
//   chartType !== TOTAL_CASES &&
//   chartType !== TOTAL_DEATHS
// ) {
//   throw new Error("Unrecognised chartType: " + chartType);
// }
// if (setChartType === null || setChartType === undefined) {
//   throw new Error("Unrecognised setChartType: " + setChartType);
// }

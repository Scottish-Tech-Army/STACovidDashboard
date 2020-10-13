import React from "react";
import ChartDropdown from "./ChartDropdown";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import {
  DAILY_CASES,
  TOTAL_CASES,
  DAILY_DEATHS,
  TOTAL_DEATHS,
  PERCENTAGE_CASES,
} from "../DataCharts/DataChartsConsts";

var storedChartType = DAILY_CASES;
const setChartType = (value) => (storedChartType = value);

var container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

function checkDropdownText() {
  expect(dailyCasesDropdown().textContent).toBe("Daily Cases");
  expect(dailyDeathsDropdown().textContent).toBe("Daily Deaths");
  expect(totalCasesDropdown().textContent).toBe("Total Cases");
  expect(totalDeathsDropdown().textContent).toBe("Total Deaths");
  expect(percentageCasesDropdown().textContent).toBe("% Tests Positive");
}

const dailyCasesDropdown = () => container.querySelector("#dailyCases");
const dailyDeathsDropdown = () => container.querySelector("#dailyDeaths");
const totalCasesDropdown = () => container.querySelector("#totalCases");
const totalDeathsDropdown = () => container.querySelector("#totalDeaths");
const percentageCasesDropdown = () =>
  container.querySelector("#percentageCases");

const selectedItem = () => container.querySelector(".selected-chart");
const dropdownItems = () => container.querySelectorAll(".chart-menu a");
const dropdownItem = (text) =>
  Array.from(dropdownItems()).find((el) => el.textContent === text);

function click(dropDownButton) {
  act(() => {
    dropDownButton.dispatchEvent(new MouseEvent("click"));
    render(
      <RegionDropdown
        regionCode={storedRegionCode}
        setRegionCode={setRegionCode}
      />,
      container
    );
  });
}

test("null/undefined input throws error", async () => {
  global.suppressConsoleErrorLogs();

  expect(() => {
    render(
      <ChartDropdown chartType={null} setChartType={setChartType} />,
      container
    );
  }).toThrow("Unrecognised chartType: null");

  expect(() => {
    render(
      <ChartDropdown chartType="unknown" setChartType={setChartType} />,
      container
    );
  }).toThrow("Unrecognised chartType: unknown");
});

test("default render", () => {
  act(() => {
    render(<ChartDropdown chartType={storedChartType} />, container);
  });
  expect(selectedItem().textContent).toBe("Daily Cases");
});

test("supplied chartType totalCases render", () => {
  act(() => {
    render(
      <ChartDropdown chartType={TOTAL_CASES} setChartType={setChartType} />,
      container
    );
  });

  expect(selectedItem().textContent).toBe("Total Cases");
});

test("supplied chartType dailyDeaths render", () => {
  act(() => {
    render(
      <ChartDropdown chartType={DAILY_DEATHS} setChartType={setChartType} />,
      container
    );
  });

  expect(selectedItem().textContent).toBe("Daily Deaths");
});

test("supplied chartType totalDeaths render", () => {
  act(() => {
    render(
      <ChartDropdown chartType={TOTAL_DEATHS} setChartType={setChartType} />,
      container
    );
  });

  expect(selectedItem().textContent).toBe("Total Deaths");
});

test("supplied chartType percentCases render", () => {
  act(() => {
    render(
      <ChartDropdown
        chartType={PERCENTAGE_CASES}
        setChartType={setChartType}
      />,
      container
    );
  });

  expect(selectedItem().textContent).toBe("% Positive Cases");
});

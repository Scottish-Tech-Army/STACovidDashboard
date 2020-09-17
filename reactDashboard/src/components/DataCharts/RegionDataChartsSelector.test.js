/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkStoredValue"] }] */

import React from "react";
import RegionDataChartsSelector from "./RegionDataChartsSelector";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { DAILY_CASES } from "./DataChartsConsts";

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

function checkButtonText() {
  expect(dailyCasesButton().textContent).toBe("Daily Cases");
  expect(dailyDeathsButton().textContent).toBe("Daily Deaths");
  expect(totalCasesButton().textContent).toBe("Total Cases");
  expect(totalDeathsButton().textContent).toBe("Total Deaths");
}

function checkStoredValue(expectedChartType) {
  expect(storedChartType).toBe(expectedChartType);
}

const dailyCasesButton = () => container.querySelector("#dailyCases");
const dailyDeathsButton = () => container.querySelector("#dailyDeaths");
const totalCasesButton = () => container.querySelector("#totalCases");
const totalDeathsButton = () => container.querySelector("#totalDeaths");

function click(button) {
  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    render(
      <RegionDataChartsSelector
        chartType={storedChartType}
        setChartType={setChartType}
      />,
      container
    );
  });
}

test("null/undefined input throws error", async () => {
  global.suppressConsoleErrorLogs();

  expect(() => {
    render(
      <RegionDataChartsSelector chartType={null} setChartType={setChartType} />,
      container
    );
  }).toThrow("Unrecognised chartType: null");

  expect(() => {
    render(<RegionDataChartsSelector setChartType={setChartType} />, container);
  }).toThrow("Unrecognised chartType: undefined");

  expect(() => {
    render(<RegionDataChartsSelector chartType={storedChartType} />, container);
  }).toThrow("Unrecognised setChartType: undefined");

  expect(() => {
    render(
      <RegionDataChartsSelector chartType="unknown" setChartType={setChartType} />,
      container
    );
  }).toThrow("Unrecognised chartType: unknown");
});

test("default render", async () => {
  act(() => {
    render(
      <RegionDataChartsSelector
        chartType={storedChartType}
        setChartType={setChartType}
      />,
      container
    );
  });

  checkButtonText();
  checkStoredValue("dailyCases");

  click(dailyDeathsButton());
  checkStoredValue("dailyDeaths");

  click(totalCasesButton());
  checkStoredValue("totalCases");

  click(totalDeathsButton());
  checkStoredValue("totalDeaths");

  click(dailyCasesButton());
  checkStoredValue("dailyCases");
});

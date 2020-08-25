/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkStoredValue"] }] */

import React from "react";
import DataChartsSelector from "./DataChartsSelector";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { PERCENTAGE_CASES } from "./DataChartsConsts";

var storedChartType = PERCENTAGE_CASES;
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
  expect(percentageCasesButton().textContent).toBe("% Tests Positive");
  expect(dailyCasesButton().textContent).toBe("Daily Cases");
  expect(dailyDeathsButton().textContent).toBe("Daily Deaths");
  expect(totalCasesButton().textContent).toBe("Total Cases");
  expect(totalDeathsButton().textContent).toBe("Total Deaths");
}

function checkStoredValue(expectedChartType) {
  expect(storedChartType).toBe(expectedChartType);
}

const percentageCasesButton = () => container.querySelector("#percentageCases");
const dailyCasesButton = () => container.querySelector("#dailyCases");
const dailyDeathsButton = () => container.querySelector("#dailyDeaths");
const totalCasesButton = () => container.querySelector("#totalCases");
const totalDeathsButton = () => container.querySelector("#totalDeaths");

function click(button) {
  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    render(
      <DataChartsSelector
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
      <DataChartsSelector chartType={null} setChartType={setChartType} />,
      container
    );
  }).toThrow("Unrecognised chartType: null");

  expect(() => {
    render(<DataChartsSelector setChartType={setChartType} />, container);
  }).toThrow("Unrecognised chartType: undefined");

  expect(() => {
    render(<DataChartsSelector chartType={storedChartType} />, container);
  }).toThrow("Unrecognised setChartType: undefined");

  expect(() => {
    render(
      <DataChartsSelector chartType="unknown" setChartType={setChartType} />,
      container
    );
  }).toThrow("Unrecognised chartType: unknown");
});

test("default render", async () => {
  act(() => {
    render(
      <DataChartsSelector
        chartType={storedChartType}
        setChartType={setChartType}
      />,
      container
    );
  });

  checkButtonText();
  checkStoredValue("percentCases");

  click(dailyCasesButton());
  checkStoredValue("dailyCases");

  click(dailyDeathsButton());
  checkStoredValue("dailyDeaths");

  click(totalCasesButton());
  checkStoredValue("totalCases");

  click(totalDeathsButton());
  checkStoredValue("totalDeaths");

  click(percentageCasesButton());
  checkStoredValue("percentCases");
});

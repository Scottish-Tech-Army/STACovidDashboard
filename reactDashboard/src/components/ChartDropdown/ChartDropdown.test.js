/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkDropdownMenuItems"] }] */
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
var storedShowPercentageTests = true;
const setChartType = (value) => (storedChartType = value);

var container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  storedShowPercentageTests = true;
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const selectedItem = () => container.querySelector(".selected-chart");
const dropdownMenuItems = () => container.querySelectorAll(".chart-menu a");
const dropdownMenuItem = (text) =>
  Array.from(dropdownMenuItems()).find((el) => el.textContent === text);

async function click(button) {
  await act(async () => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    render(
      <ChartDropdown
        chartType={storedChartType}
        setChartType={setChartType}
        showPercentageTests={storedShowPercentageTests}
      />,
      container
    );
  });
}

describe("chartType input property", () => {
  it("null/unknown throws error", () => {
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

  it("undefined", () => {
    act(() => {
      render(<ChartDropdown setChartType={setChartType} />, container);
    });
    expect(selectedItem().textContent).toBe("Daily Cases");
  });

  it("daily cases", () => {
    act(() => {
      render(
        <ChartDropdown chartType={DAILY_CASES} setChartType={setChartType} />,
        container
      );
    });
    expect(selectedItem().textContent).toBe("Daily Cases");
  });

  it("totalCases", () => {
    act(() => {
      render(
        <ChartDropdown chartType={TOTAL_CASES} setChartType={setChartType} />,
        container
      );
    });
    expect(selectedItem().textContent).toBe("Total Cases");
  });

  it("dailyDeaths", () => {
    act(() => {
      render(
        <ChartDropdown chartType={DAILY_DEATHS} setChartType={setChartType} />,
        container
      );
    });
    expect(selectedItem().textContent).toBe("Daily Deaths");
  });

  it("totalDeaths", () => {
    act(() => {
      render(
        <ChartDropdown chartType={TOTAL_DEATHS} setChartType={setChartType} />,
        container
      );
    });
    expect(selectedItem().textContent).toBe("Total Deaths");
  });

  it("percentCases", () => {
    act(() => {
      render(
        <ChartDropdown
          chartType={PERCENTAGE_CASES}
          setChartType={setChartType}
        />,
        container
      );
      expect(selectedItem().textContent).toBe("% Tests Positive");
    });
  });
});

describe("available choices", () => {
  function checkDropdownMenuItems(expectedMenuItems) {
    const menuItems = dropdownMenuItems();
    expect(menuItems).toHaveLength(expectedMenuItems.length);
    expectedMenuItems.forEach((expectedText, i) => {
      expect(menuItems[i].textContent).toBe(expectedText);
    });
  }

  it("normal", () => {
    act(() => {
      render(
        <ChartDropdown
          chartType={storedChartType}
          setChartType={setChartType}
        />,
        container
      );
    });

    // Make the menu appear
    click(selectedItem());

    checkDropdownMenuItems([
      "Daily Cases",
      "Total Cases",
      "Daily Deaths",
      "Total Deaths",
      "% Tests Positive",
    ]);
  });

  it("showPercentageTests=false", () => {
    storedShowPercentageTests = false;
    act(() => {
      render(
        <ChartDropdown
          chartType={storedChartType}
          setChartType={setChartType}
          showPercentageTests={storedShowPercentageTests}
        />,
        container
      );
    });

    // Make the menu appear
    click(selectedItem());

    checkDropdownMenuItems([
      "Daily Cases",
      "Total Cases",
      "Daily Deaths",
      "Total Deaths",
    ]);
  });
});

test("choose chartTypes", async () => {
  await act(async () => {
    render(
      <ChartDropdown chartType={storedChartType} setChartType={setChartType} />,
      container
    );
  });

  // Make the menu appear
  await click(selectedItem());

  await click(dropdownMenuItem("Total Cases"));
  expect(storedChartType).toBe(TOTAL_CASES);
  expect(selectedItem().textContent).toBe("Total Cases");

  await click(dropdownMenuItem("Daily Deaths"));
  expect(storedChartType).toBe(DAILY_DEATHS);
  expect(selectedItem().textContent).toBe("Daily Deaths");

  await click(dropdownMenuItem("Total Deaths"));
  expect(storedChartType).toBe(TOTAL_DEATHS);
  expect(selectedItem().textContent).toBe("Total Deaths");

  await click(dropdownMenuItem("% Tests Positive"));
  expect(storedChartType).toBe(PERCENTAGE_CASES);
  expect(selectedItem().textContent).toBe("% Tests Positive");

  await click(dropdownMenuItem("Daily Cases"));
  expect(storedChartType).toBe(DAILY_CASES);
  expect(selectedItem().textContent).toBe("Daily Cases");
});

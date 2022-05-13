/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkDropdownMenuItems"] }] */
import React from "react";
import ChartDropdown from "./ChartDropdown";
import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import {
  DAILY_CASES,
  TOTAL_CASES,
  DAILY_DEATHS,
  TOTAL_DEATHS,
} from "../DataCharts/DataChartsConsts";

var storedChartType = DAILY_CASES;
const setChartType = (value) => (storedChartType = value);

var container = null;
var root = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  // cleanup on exiting
  root.unmount(container);
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
    root.render(
      <ChartDropdown chartType={storedChartType} setChartType={setChartType} />
    );
  });
}

describe("chartType input property", () => {
  it("null/unknown throws error", () => {
    global.suppressConsoleErrorLogs();

    expect(() => {
      act(() => {
        root.render(
          <ChartDropdown chartType={null} setChartType={setChartType} />
        );
      });
    }).toThrow("Unrecognised chartType: null");

    expect(() => {
      act(() => {
        root.render(
          <ChartDropdown chartType="unknown" setChartType={setChartType} />
        );
      });
    }).toThrow("Unrecognised chartType: unknown");
  });

  it("undefined", () => {
    act(() => {
      root.render(<ChartDropdown setChartType={setChartType} />);
    });
    expect(selectedItem().textContent).toBe("Daily Cases");
  });

  it("daily cases", () => {
    act(() => {
      root.render(
        <ChartDropdown chartType={DAILY_CASES} setChartType={setChartType} />
      );
    });
    expect(selectedItem().textContent).toBe("Daily Cases");
  });

  it("totalCases", () => {
    act(() => {
      root.render(
        <ChartDropdown chartType={TOTAL_CASES} setChartType={setChartType} />
      );
    });
    expect(selectedItem().textContent).toBe("Total Cases");
  });

  it("dailyDeaths", () => {
    act(() => {
      root.render(
        <ChartDropdown chartType={DAILY_DEATHS} setChartType={setChartType} />
      );
    });
    expect(selectedItem().textContent).toBe("Daily Deaths");
  });

  it("totalDeaths", () => {
    act(() => {
      root.render(
        <ChartDropdown chartType={TOTAL_DEATHS} setChartType={setChartType} />
      );
    });
    expect(selectedItem().textContent).toBe("Total Deaths");
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

  it("normal", async () => {
    act(() => {
      root.render(
        <ChartDropdown
          chartType={storedChartType}
          setChartType={setChartType}
        />
      );
    });

    // Make the menu appear
    await click(selectedItem());

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
    root.render(
      <ChartDropdown chartType={storedChartType} setChartType={setChartType} />
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

  await click(dropdownMenuItem("Daily Cases"));
  expect(storedChartType).toBe(DAILY_CASES);
  expect(selectedItem().textContent).toBe("Daily Cases");
});

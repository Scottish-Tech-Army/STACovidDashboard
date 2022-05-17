/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkDropdownMenuItems"] }] */
import React from "react";
import ChartDropdown from "./ChartDropdown";
import {
  DAILY_CASES,
  TOTAL_CASES,
  DAILY_DEATHS,
  TOTAL_DEATHS,
} from "../DataCharts/DataChartsConsts";
import { renderWithUser } from "../../ReactTestUtils";
import { render } from "@testing-library/react";

const setChartType = jest.fn();

const selectedItem = () => document.querySelector(".selected-chart");
const dropdownMenuItems = () => document.querySelectorAll(".chart-menu a");
const dropdownMenuItem = (text) =>
  Array.from(dropdownMenuItems()).find((el) => el.textContent === text);

describe("chartType input property", () => {
  it("null/unknown throws error", () => {
    global.suppressConsoleErrorLogs();

    expect(() => {
      render(<ChartDropdown chartType={null} setChartType={setChartType} />);
    }).toThrow("Unrecognised chartType: null");

    expect(() => {
      render(<ChartDropdown chartType="unknown" setChartType={setChartType} />);
    }).toThrow("Unrecognised chartType: unknown");
  });

  it("undefined", () => {
    render(<ChartDropdown setChartType={setChartType} />);
    expect(selectedItem().textContent).toBe("Daily Cases");
  });

  it("daily cases", () => {
    render(
      <ChartDropdown chartType={DAILY_CASES} setChartType={setChartType} />
    );
    expect(selectedItem().textContent).toBe("Daily Cases");
  });

  it("totalCases", () => {
    render(
      <ChartDropdown chartType={TOTAL_CASES} setChartType={setChartType} />
    );
    expect(selectedItem().textContent).toBe("Total Cases");
  });

  it("dailyDeaths", () => {
    render(
      <ChartDropdown chartType={DAILY_DEATHS} setChartType={setChartType} />
    );
    expect(selectedItem().textContent).toBe("Daily Deaths");
  });

  it("totalDeaths", () => {
    render(
      <ChartDropdown chartType={TOTAL_DEATHS} setChartType={setChartType} />
    );
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
    const { user } = renderWithUser(
      <ChartDropdown chartType={DAILY_CASES} setChartType={setChartType} />
    );

    // Make the menu appear
    await user.click(selectedItem());

    checkDropdownMenuItems([
      "Daily Cases",
      "Total Cases",
      "Daily Deaths",
      "Total Deaths",
    ]);
  });
});

test("choose chartTypes", async () => {
  const { user } = renderWithUser(
    <ChartDropdown chartType={DAILY_CASES} setChartType={setChartType} />
  );

  // Make the menu appear
  await user.click(selectedItem());

  await user.click(dropdownMenuItem("Total Cases"));
  expect(setChartType).toHaveBeenLastCalledWith(TOTAL_CASES);

  await user.click(dropdownMenuItem("Daily Deaths"));
  expect(setChartType).toHaveBeenLastCalledWith(DAILY_DEATHS);

  await user.click(dropdownMenuItem("Total Deaths"));
  expect(setChartType).toHaveBeenLastCalledWith(TOTAL_DEATHS);

  await user.click(dropdownMenuItem("Daily Cases"));
  expect(setChartType).toHaveBeenLastCalledWith(DAILY_CASES);
});

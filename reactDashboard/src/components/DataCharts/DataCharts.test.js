import React from "react";
import DataCharts from "./DataCharts";
import { FEATURE_CODE_SCOTLAND } from "../Utils/CsvUtils";
import { DAILY_CASES, TOTAL_CASES } from "./DataChartsConsts";
import { createChart, getSonificationSeriesTitle } from "./DataChartsModel";
import { render } from "@testing-library/react";
import { renderWithUser } from "../../ReactTestUtils";

jest.mock("./DataChartsModel");

beforeEach(() => {
  createChart.mockReturnValue(null);
  getSonificationSeriesTitle.mockImplementation((chartType) => chartType);
});

const canvas = () => document.querySelector("canvas");

test("dataCharts renders default data input dataset is null", async () => {
  global.suppressConsoleErrorLogs();

  render(<DataCharts />);

  expect(document.querySelector(".hidden-chart")).not.toBeNull();
  expect(document.querySelector(".loading-component")).not.toBeNull();
});

test("dataCharts renders dynamic fetched data", async () => {
  render(<DataCharts allData={testAllData} />);

  expect(document.querySelector(".hidden-chart")).toBeNull();
  expect(document.querySelector(".loading-component")).toBeNull();
  // TODO need to figure out how to test chart.js content
  expect(createChart).toHaveBeenCalledTimes(2);
  expect(createChart).toHaveBeenNthCalledWith(
    2,
    canvas(),
    testAllData,
    DAILY_CASES,
    FEATURE_CODE_SCOTLAND,
    undefined,
    { startDate: Date.parse("2020-03-02"), endDate: Date.parse("2020-03-09") }
  );
});

test("dataCharts renders changes of selected region", async () => {
  render(<DataCharts allData={testAllData} regionCode={"S12000033"} />);

  expect(createChart).toHaveBeenCalledTimes(2);
  expect(createChart).toHaveBeenNthCalledWith(
    2,
    canvas(),
    testAllData,
    DAILY_CASES,
    "S12000033",
    undefined,
    { startDate: Date.parse("2020-03-02"), endDate: Date.parse("2020-03-09") }
  );
});

test("dataCharts renders with dark mode value selected", async () => {
  render(<DataCharts allData={testAllData} darkmode={true} />);

  expect(createChart).toHaveBeenCalledTimes(2);
  expect(createChart).toHaveBeenNthCalledWith(
    2,
    canvas(),
    testAllData,
    DAILY_CASES,
    FEATURE_CODE_SCOTLAND,
    true,
    { startDate: Date.parse("2020-03-02"), endDate: Date.parse("2020-03-09") }
  );
});

test("dataCharts renders with TOTAL_CASES selected", async () => {
  const dropdownMenuItems = () => document.querySelectorAll(".chart-menu a");
  const dropdownMenuItem = (text) =>
    Array.from(dropdownMenuItems()).find((el) => el.textContent === text);
  const selectedItem = () => document.querySelector(".selected-chart");

  const { user } = renderWithUser(<DataCharts allData={testAllData} />);

  await user.click(selectedItem());
  await user.click(dropdownMenuItem("Total Cases"));
  expect(selectedItem().textContent).toBe("Total Cases");

  expect(createChart).toHaveBeenLastCalledWith(
    canvas(),
    testAllData,
    TOTAL_CASES,
    FEATURE_CODE_SCOTLAND,
    undefined,
    { startDate: Date.parse("2020-03-02"), endDate: Date.parse("2020-03-09") }
  );
});

const testAllData = {
  dates: [
    Date.parse("2020-03-02"),
    Date.parse("2020-03-03"),
    Date.parse("2020-03-04"),
    Date.parse("2020-03-05"),
    Date.parse("2020-03-06"),
    Date.parse("2020-03-07"),
    Date.parse("2020-03-08"),
    Date.parse("2020-03-09"),
  ],
  startDate: Date.parse("2020-03-02"),
  endDate: Date.parse("2020-03-09"),
  regions: {
    S08000031: {
      dailySeries: {
        dailyCases: [1, 31, 61, 91, 121, 151, 181, 211],
        dailyDeaths: [5, 35, 65, 95, 125, 155, 185, 215],
        totalCases: [2, 32, 62, 92, 122, 152, 182, 212],
        totalDeaths: [6, 36, 66, 96, 126, 156, 186, 216],
      },
    },
    S08000022: {
      dailySeries: {
        dailyCases: [11, 41, 71, 101, 131, 161, 191, 221],
        dailyDeaths: [15, 45, 75, 105, 135, 165, 195, 225],
        totalCases: [12, 42, 72, 102, 132, 162, 192, 222],
        totalDeaths: [16, 46, 76, 106, 136, 166, 196, 226],
      },
    },
    S12000013: {
      dailySeries: {
        dailyCases: [21, 51, 81, 111, 141, 171, 201, 231],
        dailyDeaths: [25, 55, 85, 115, 145, 175, 205, 235],
        totalCases: [22, 52, 82, 112, 142, 172, 202, 232],
        totalDeaths: [26, 56, 86, 116, 146, 176, 206, 236],
      },
    },
    S92000003: {
      dailySeries: {
        dailyCases: [33, 123, 213, 303, 393, 483, 573, 663],
        dailyDeaths: [45, 135, 225, 315, 405, 495, 585, 675],
        totalCases: [36, 126, 216, 306, 396, 486, 576, 888],
        totalDeaths: [48, 138, 228, 318, 408, 498, 588, 678],
      },
    },
  },
};

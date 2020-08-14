import React from "react";
import DataCharts, { parseNhsCsvData } from "./DataCharts";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { readCsvData } from "../Utils/CsvUtils";

var container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  fetch.resetMocks();
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("dataCharts renders default data input dataset is null", async () => {
  global.suppressConsoleErrorLogs();

  await act(async () => {
    render(<DataCharts />, container);
  });

  const canvas = container.querySelector(".chart-container canvas");
  expect(canvas).not.toBeNull();
});

test("dataCharts renders dynamic fetched data", async () => {
  await act(async () => {
    render(<DataCharts healthBoardDataset={healthBoardDataset} />, container);
  });

  const canvas = container.querySelector(".chart-container canvas");
  expect(canvas).not.toBeNull();
  // TODO need to figure out how to test chart.js content
});

test("parseNhsCsvData", () => {
  // We expect to see a 5 day moving window over the percentageCases
  const expectedResult = {
    percentageCases: [
      { t: Date.parse("2020-03-02"), y: (100 * 1) / (1 + 1) },
      { t: Date.parse("2020-03-03"), y: (100 * 2) / (2 + 5) },
      { t: Date.parse("2020-03-04"), y: (100 * 4) / (4 + 25) },
      { t: Date.parse("2020-03-05"), y: (100 * 8) / (8 + 125) },
      { t: Date.parse("2020-03-06"), y: (100 * 16) / (16 + 625) },
      { t: Date.parse("2020-03-07"), y: (100 * (32 - 1)) / (32 - 1 + 3125 - 1) },
      { t: Date.parse("2020-03-08"), y: (100 * (64 - 2)) / (64 - 2 + 15625 - 5) },
      { t: Date.parse("2020-03-09"), y: (100 * (128 - 4)) / (128 - 4 + 78625 - 25) },
    ],
    totalCases: [
      { t: Date.parse("2020-03-02"), y: 1 },
      { t: Date.parse("2020-03-03"), y: 2 },
      { t: Date.parse("2020-03-04"), y: 4 },
      { t: Date.parse("2020-03-05"), y: 8 },
      { t: Date.parse("2020-03-06"), y: 16 },
      { t: Date.parse("2020-03-07"), y: 32 },
      { t: Date.parse("2020-03-08"), y: 64 },
      { t: Date.parse("2020-03-09"), y: 128 },
    ],
    totalDeaths: [
      { t: Date.parse("2020-03-02"), y: 1 },
      { t: Date.parse("2020-03-03"), y: 3 },
      { t: Date.parse("2020-03-04"), y: 9 },
      { t: Date.parse("2020-03-05"), y: 27 },
      { t: Date.parse("2020-03-06"), y: 81 },
      { t: Date.parse("2020-03-07"), y: 243 },
      { t: Date.parse("2020-03-08"), y: 729 },
      { t: Date.parse("2020-03-09"), y: 2187 },
    ],
  };

  expect(parseNhsCsvData(healthBoardDataset)).toStrictEqual(expectedResult);
});

const nhsCsvData = `Date,HB,DailyPositive,CumulativePositive,CrudeRatePositive,CumulativePositivePercent,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,CumulativeNegative,CrudeRateNegative
20200302,S08000031,0,1,0,0,0,0,0,0,0
20200302,S08000022,0,0,0,0,0,1,0,0,0
20200302,S12000013,0,0,0,0,0,0,0,1,0
20200303,S08000031,0,2,0,0,0,0,0,0,0
20200303,S08000022,0,0,0,0,0,3,0,0,0
20200303,S12000013,0,0,0,0,0,0,0,5,0
20200304,S08000031,0,4,0,0,0,0,0,0,0
20200304,S08000022,0,0,0,0,0,9,0,0,0
20200304,S12000013,0,0,0,0,0,0,0,25,0
20200305,S08000031,0,8,0,0,0,0,0,0,0
20200305,S08000022,0,0,0,0,0,27,0,0,0
20200305,S12000013,0,0,0,0,0,0,0,125,0
20200306,S08000031,0,16,0,0,0,0,0,0,0
20200306,S08000022,0,0,0,0,0,81,0,0,0
20200306,S12000013,0,0,0,0,0,0,0,625,0
20200307,S08000031,0,32,0,0,0,0,0,0,0
20200307,S08000022,0,0,0,0,0,243,0,0,0
20200307,S12000013,0,0,0,0,0,0,0,3125,0
20200308,S08000031,0,64,0,0,0,0,0,0,0
20200308,S08000022,0,0,0,0,0,729,0,0,0
20200308,S12000013,0,0,0,0,0,0,0,15625,0
20200309,S08000031,0,128,0,0,0,0,0,0,0
20200309,S08000022,0,0,0,0,0,2187,0,0,0
20200309,S12000013,0,0,0,0,0,0,0,78625,0`;

const healthBoardDataset = readCsvData(nhsCsvData);

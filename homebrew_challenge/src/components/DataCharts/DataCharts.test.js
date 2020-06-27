import React from "react";
import DataCharts, { parseCsvData } from "./DataCharts";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

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

it("DataCharts renders default data when fetch fails", async () => {
  fetch.mockReject(new Error("fetch failed"));
  // Suppress console error message
  spyOn(console, "error");

  await act(async () => {
    render(<DataCharts />, container);
  });

  const canvas = container.querySelector(".chart-container canvas");
  expect(canvas).not.toBeNull();
  expect(fetch.mock.calls.length).toEqual(1);
});

it("DataCharts renders dynamic fetched data", async () => {
  fetch.mockResponse(csvData);

  await act(async () => {
    render(<DataCharts />, container);
  });

  const canvas = container.querySelector(".chart-container canvas");
  expect(canvas).not.toBeNull();
  expect(fetch.mock.calls.length).toEqual(1);
});

it("parseCsvData", () => {
  const expectedResult = {
    percentageCases: [
      { t: Date.parse("2020-03-02"), y: 0 },
      { t: Date.parse("2020-03-03"), y: 100 / 915 },
      { t: Date.parse("2020-03-04"), y: 300 / 1046 },
      { t: Date.parse("2020-03-05"), y: 600 / 1256 },
      { t: Date.parse("2020-03-06"), y: 1100 / 1525 },
    ],
    totalCases: [
      { t: Date.parse("2020-03-02"), y: 1 },
      { t: Date.parse("2020-03-03"), y: 1 },
      { t: Date.parse("2020-03-04"), y: 3 },
      { t: Date.parse("2020-03-05"), y: 6 },
      { t: Date.parse("2020-03-06"), y: 11 },
    ],
    totalDeaths: [
      { t: Date.parse("2020-03-02"), y: 0 },
      { t: Date.parse("2020-03-03"), y: 1 },
      { t: Date.parse("2020-03-04"), y: 2 },
      { t: Date.parse("2020-03-05"), y: 3 },
      { t: Date.parse("2020-03-06"), y: 4 },
    ],
  };

  expect(parseCsvData(csvData)).toEqual(expectedResult);
});

it("parseCsvData with bad count type", () => {
  const badCsvData = `date,shortValue,count
    2020-03-02,unknown,815`;

  // Suppress console error message
  spyOn(console, "error");

  expect(() => {
    parseCsvData(badCsvData);
  }).toThrow("Unrecognised input: unknown");
});

const csvData = `date,shortValue,count
2020-03-02,totalCases,0
2020-03-02,positiveCases,1
  2020-03-02,totalDeaths,0
  2020-03-05,positiveCases,6
2020-03-05,totalCases,1256
2020-03-05,totalDeaths,3
2020-03-03,totalCases,915
2020-03-03,positiveCases,1
2020-03-03,totalDeaths,1
2020-03-04,positiveCases,3
2020-03-04,totalCases,1046
2020-03-04,totalDeaths,2
2020-03-06,positiveCases,11
2020-03-06,totalDeaths,4
2020-03-06,totalCases,1525`;

const defaultSeriesData = [
  { t: Date.parse("2020-04-06"), y: 5 },
  { t: Date.parse("2020-04-07"), y: 7 },
  { t: Date.parse("2020-04-08"), y: 12 },
  { t: Date.parse("2020-04-09"), y: 16 },
  { t: Date.parse("2020-04-10"), y: 25 },
  { t: Date.parse("2020-04-11"), y: 22 },
];

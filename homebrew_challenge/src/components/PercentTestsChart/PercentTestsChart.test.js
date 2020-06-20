import React from "react";
import PercentTestsChart, { parseCsvData } from "./PercentTestsChart";
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

it("PercentTestsChart renders default data when fetch fails", async () => {
  fetch.mockReject(new Error("fetch failed"));
  // Suppress console error message
  spyOn(console, "error");

  await act(async () => {
    render(<PercentTestsChart />, container);
  });

  const canvas = container.querySelector(".chart-container canvas");
  expect(canvas).not.toBeNull();
  expect(fetch.mock.calls.length).toEqual(1);
});

it("PercentTestsChart renders dynamic fetched data", async () => {
  fetch.mockResponse(csvData);

  await act(async () => {
    render(<PercentTestsChart />, container);
  });

  const canvas = container.querySelector(".chart-container canvas");
  expect(canvas).not.toBeNull();
  expect(fetch.mock.calls.length).toEqual(1);
});

it("parseCsvData", () => {
  const expectedResult = [
    { t: Date.parse("2020-03-02"), y: 1 / 815 },
    { t: Date.parse("2020-03-03"), y: 1 / 915 },
    { t: Date.parse("2020-03-04"), y: 3 / 1046 },
    { t: Date.parse("2020-03-05"), y: 6 / 1256 },
    { t: Date.parse("2020-03-06"), y: 11 / 1525 },
  ];

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
2020-03-02,total,815
2020-03-02,positive,1
2020-03-05,positive,6
  2020-03-05,total,1256
  2020-03-03,total,915
2020-03-03,positive,1
2020-03-04,positive,3
2020-03-04,total,1046
2020-03-06,positive,11
2020-03-06,total,1525`;

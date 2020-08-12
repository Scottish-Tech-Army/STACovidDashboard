/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkSingleValue"] }] */

import React from "react";
import SingleValueBar, {
  parseCsvData,
  getRelativeDate,
} from "./SingleValueBar";
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
  jest.resetAllMocks();
});

test("singleValueBar renders default data when fetch fails", async () => {
  fetch.mockReject(new Error("fetch failed"));
  global.suppressConsoleErrorLogs();

  await act(async () => {
    render(<SingleValueBar />, container);
  });

  checkSingleValue("dailyCases", "01/01/1999", "0");
  checkSingleValue("totalCases", "Total", "0");
  checkSingleValue("dailyFatalities", "01/01/1999", "0");
  checkSingleValue("totalFatalities", "Total", "0");
  checkSingleValue("fatalityCaseRatio", "Death / Case Ratio", "0");
  checkSingleValue("dailyTestsCompleted", "Daily", "0");
  checkSingleValue("totalTestsCompleted", "Total", "0");
});

test("singleValueBar renders dynamic fetched data for today", async () => {
  fetch.mockResponse(csvData);

  // Set today to be 2020-06-21
  setMockDate("2020-06-21");

  await act(async () => {
    render(<SingleValueBar />, container);
  });

  checkSingleValue("dailyCases", "Today", "26");
  checkSingleValue("totalCases", "Total", "18156");
  checkSingleValue("dailyFatalities", "Today", "-1");
  checkSingleValue("totalFatalities", "Total", "2472");
  checkSingleValue("fatalityCaseRatio", "Death / Case Ratio", "13.6%");
  checkSingleValue("dailyTestsCompleted", "Daily", "3442");
  checkSingleValue("totalTestsCompleted", "Total", "231525");
});

test("singleValueBar renders dynamic fetched data for yesterday", async () => {
  fetch.mockResponse(csvData);

  // Set today to be 2020-06-22
  setMockDate("2020-06-22");

  await act(async () => {
    render(<SingleValueBar />, container);
  });

  checkSingleValue("dailyCases", "Yesterday", "26");
  checkSingleValue("totalCases", "Total", "18156");
  checkSingleValue("dailyFatalities", "Yesterday", "-1");
  checkSingleValue("totalFatalities", "Total", "2472");
  checkSingleValue("fatalityCaseRatio", "Death / Case Ratio", "13.6%");
  checkSingleValue("dailyTestsCompleted", "Daily", "3442");
  checkSingleValue("totalTestsCompleted", "Total", "231525");
});

test("singleValueBar renders dynamic fetched data with incomplete diff data", async () => {
  fetch.mockResponse(incompleteDiffCsvData);

  // Set today to be 2020-06-22
  setMockDate("2020-06-22");

  await act(async () => {
    render(<SingleValueBar />, container);
  });

  checkSingleValue("dailyCases", "Yesterday", "26");
  checkSingleValue("totalCases", "Total", "18156");
  checkSingleValue("dailyFatalities", "Not available", "Not available");
  checkSingleValue("totalFatalities", "Total", "2472");
  checkSingleValue("fatalityCaseRatio", "Death / Case Ratio", "13.6%");
  checkSingleValue("dailyTestsCompleted", "Daily", "Not available");
  checkSingleValue("totalTestsCompleted", "Total", "231525");
});

test("singleValueBar renders dynamic fetched data with missing data", async () => {
  fetch.mockResponse(missingCsvData);

  // Set today to be 2020-06-22
  setMockDate("2020-06-22");

  await act(async () => {
    render(<SingleValueBar />, container);
  });

  checkSingleValue("dailyCases", "Not available", "Not available");
  checkSingleValue("totalCases", "Total", "Not available");
  checkSingleValue("dailyFatalities", "Not available", "Not available");
  checkSingleValue("totalFatalities", "Total", "Not available");
  checkSingleValue("fatalityCaseRatio", "Death / Case Ratio", "Not available");
  checkSingleValue("dailyTestsCompleted", "Daily", "Not available");
  checkSingleValue("totalTestsCompleted", "Total", "Not available");
});

test("getRelativeDate", () => {
  // Set today to be 2020-06-22
  setMockDate("2020-06-22");

  expect(getRelativeDate(Date.parse("2020-06-22"))).toBe("Today");
  expect(getRelativeDate(Date.parse("2020-06-21"))).toBe("Yesterday");
  expect(getRelativeDate(Date.parse("2020-06-20"))).toBe("last Saturday");
  expect(getRelativeDate(Date.parse("2020-06-19"))).toBe("last Friday");
  expect(getRelativeDate(Date.parse("2020-06-18"))).toBe("last Thursday");
  expect(getRelativeDate(Date.parse("2020-06-17"))).toBe("last Wednesday");
  expect(getRelativeDate(Date.parse("2020-06-16"))).toBe("last Tuesday");
  expect(getRelativeDate(Date.parse("2020-06-15"))).toBe("15/06/2020");
  expect(getRelativeDate(undefined)).toBeUndefined();
  expect(getRelativeDate(null)).toBeUndefined();
});

test("parseCsvData", () => {
  const expectedResult = {
    dailyCases: { date: 1592697600000, value: 26 },
    dailyFatalities: { date: 1592697600000, value: -1 },
    dailyTestsCompleted: { date: 1592697600000, value: 3442 },
    fatalityCaseRatio: "13.6%",
    totalCases: { date: 1592697600000, value: 18156 },
    totalFatalities: { date: 1592697600000, value: 2472 },
    totalTestsCompleted: { date: 1592697600000, value: 231525 },
  };

  expect(parseCsvData(csvData)).toStrictEqual(expectedResult);
});

test("parseCsvData with bad count type", () => {
  const badCsvData = `date,shortValue,count
    2020-03-02,unknown,815`;

  global.suppressConsoleErrorLogs();

  expect(() => {
    parseCsvData(badCsvData);
  }).toThrow("Unrecognised input: unknown");
});

function checkSingleValue(singleValueId, expectedTitle, expectedValue) {
  const singleValueElement = container.querySelector("#" + singleValueId);
  const title = singleValueElement.querySelector(".single-value-header");
  const value = singleValueElement.querySelector(".single-value-total");
  expect(title.textContent).toBe(expectedTitle);
  expect(value.textContent).toBe(expectedValue);
}

function setMockDate(date) {
  jest
    .spyOn(global.Date, "now")
    .mockImplementation(() => Date.parse(date).valueOf());
}

const csvData = `date,shortValue,count
2020-04-20,cumulativeDeaths,915
2020-05-20,cumulativeDeaths,2184
2020-04-20,cumulativePositiveTests,8450
2020-05-20,cumulativePositiveTests,14751
2020-04-20,cumulativeTotalTests,40700
2020-05-20,cumulativeTotalTests,92594
2020-04-20,dailyPositiveTests,263
2020-05-20,dailyPositiveTests,96
2020-06-20,cumulativePositiveTests,18130
2020-06-20,cumulativeTotalTests,228083
2020-06-20,dailyPositiveTests,26
2020-06-20,cumulativeDeaths,2473
2020-06-21,cumulativePositiveTests,18156
2020-06-21,cumulativeTotalTests,231525
2020-06-21,dailyPositiveTests,26
2020-06-21,cumulativeDeaths,2472`;

// On the cases where there isn't enough data to do diffs of cumulative values
const incompleteDiffCsvData = `date,shortValue,count
2020-06-21,cumulativePositiveTests,18156
2020-06-21,cumulativeTotalTests,231525
2020-06-21,dailyPositiveTests,26
2020-06-21,cumulativeDeaths,2472`;

// On the cases where there isn't data available
const missingCsvData = `date,shortValue,count`;

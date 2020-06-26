import React from "react";
import SingleValueBar, {
  parseCsvData,
  getDateValueClause,
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

it("SingleValueBar renders default data when fetch fails", async () => {
  fetch.mockReject(new Error("fetch failed"));
  // Suppress console error message
  spyOn(console, "error");

  await act(async () => {
    render(<SingleValueBar />, container);
  });

  checkSingleValue("dailyCases", "Cases 01/01/1999", "0");
  checkSingleValue("totalCases", "Total Cases", "0");
  checkSingleValue("dailyFatalities", "Fatalities 01/01/1999", "0");
  checkSingleValue("totalFatalities", "Total Fatalities", "0");
  checkSingleValue("fatalityCaseRatio", "Fatality / Case Ratio", "0");
  checkSingleValue("dailyTestsCompleted", "Daily Tests Completed", "0");
  checkSingleValue("totalTestsCompleted", "Total Tests Completed", "0");
});

it("SingleValueBar renders dynamic fetched data for today", async () => {
  fetch.mockResponse(csvData);

  // Set today to be 2020-06-21
  setMockDate("2020-06-21");

  await act(async () => {
    render(<SingleValueBar />, container);
  });

  checkSingleValue("dailyCases", "Cases today", "26");
  checkSingleValue("totalCases", "Total Cases", "18156");
  checkSingleValue("dailyFatalities", "Fatalities today", "-1");
  checkSingleValue("totalFatalities", "Total Fatalities", "2472");
  checkSingleValue("fatalityCaseRatio", "Fatality / Case Ratio", "13.62%");
  checkSingleValue("dailyTestsCompleted", "Daily Tests Completed", "3442");
  checkSingleValue("totalTestsCompleted", "Total Tests Completed", "231525");
});

it("SingleValueBar renders dynamic fetched data for yesterday", async () => {
  fetch.mockResponse(csvData);

  // Set today to be 2020-06-22
  setMockDate("2020-06-22");

  await act(async () => {
    render(<SingleValueBar />, container);
  });

  checkSingleValue("dailyCases", "Cases yesterday", "26");
  checkSingleValue("totalCases", "Total Cases", "18156");
  checkSingleValue("dailyFatalities", "Fatalities yesterday", "-1");
  checkSingleValue("totalFatalities", "Total Fatalities", "2472");
  checkSingleValue("fatalityCaseRatio", "Fatality / Case Ratio", "13.62%");
  checkSingleValue("dailyTestsCompleted", "Daily Tests Completed", "3442");
  checkSingleValue("totalTestsCompleted", "Total Tests Completed", "231525");
});

it("getDateValueClause", () => {
  // Set today to be 2020-06-22
  setMockDate("2020-06-22");

  expect(getDateValueClause()).toBe(
    '( <http://reference.data.gov.uk/id/day/2020-06-22> "2020-06-22" )' +
      '( <http://reference.data.gov.uk/id/day/2020-06-21> "2020-06-21" )' +
      '( <http://reference.data.gov.uk/id/day/2020-06-20> "2020-06-20" )' +
      '( <http://reference.data.gov.uk/id/day/2020-06-19> "2020-06-19" )'
  );
});

it("parseCsvData", () => {
  const expectedResult = {
    dailyCases: { date: 1592697600000, value: 26 },
    dailyFatalities: { date: 1592697600000, value: -1 },
    dailyTestsCompleted: { date: 1592697600000, value: 3442 },
    fatalityCaseRatio: "13.62%",
    totalCases: { date: 1592697600000, value: 18156 },
    totalFatalities: { date: 1592697600000, value: 2472 },
    totalTestsCompleted: { date: 1592697600000, value: 231525 },
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

function checkSingleValue(singleValueId, expectedTitle, expectedValue) {
  const singleValueElement = container.querySelector("#" + singleValueId);
  const title = singleValueElement.querySelector(".singlevalue .title");
  const value = singleValueElement.querySelector(".singlevalue .value");
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

/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkSingleValue"] }] */

import React from "react";
import SingleValueBar, {
  parseCsvData,
  parseNhsCsvData,
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

function setFetchResponses(testsCsvData, nhsCsvData) {
  fetch.mockResponse((req) => {
    return req.url === "data/summaryCounts.csv"
      ? Promise.resolve(testsCsvData)
      : req.url === "data/currentTotalsHealthBoards.csv"
      ? Promise.resolve(nhsCsvData)
      : Promise.reject(new Error("bad url: " + req.url));
  });
}

test("singleValueBar renders dynamic fetched data for today", async () => {
  setFetchResponses(csvData, nhsCsvData);

  // Set today to be 2020-06-21
  setMockDate("2020-06-21");

  await act(async () => {
    render(<SingleValueBar />, container);
  });

  checkSingleValue("dailyCases", "Today", "47");
  checkSingleValue("totalCases", "Total", "19126");
  checkSingleValue("dailyFatalities", "Today", "0");
  checkSingleValue("totalFatalities", "Total", "2491");
  checkSingleValue("fatalityCaseRatio", "Death / Case Ratio", "13.0%");
  checkSingleValue("dailyTestsCompleted", "Daily", "3442");
  checkSingleValue("totalTestsCompleted", "Total", "231525");
});

test("singleValueBar renders dynamic fetched data for yesterday", async () => {
  setFetchResponses(csvData, nhsCsvData);

  // Set today to be 2020-06-22
  setMockDate("2020-06-22");

  await act(async () => {
    render(<SingleValueBar />, container);
  });

  checkSingleValue("dailyCases", "Yesterday", "47");
  checkSingleValue("totalCases", "Total", "19126");
  checkSingleValue("dailyFatalities", "Yesterday", "0");
  checkSingleValue("totalFatalities", "Total", "2491");
  checkSingleValue("fatalityCaseRatio", "Death / Case Ratio", "13.0%");
  checkSingleValue("dailyTestsCompleted", "Daily", "3442");
  checkSingleValue("totalTestsCompleted", "Total", "231525");
});

test("singleValueBar renders dynamic fetched data with incomplete diff data", async () => {
  setFetchResponses(incompleteDiffCsvData, nhsCsvData);

  // Set today to be 2020-06-22
  setMockDate("2020-06-22");

  await act(async () => {
    render(<SingleValueBar />, container);
  });

  checkSingleValue("dailyCases", "Yesterday", "47");
  checkSingleValue("totalCases", "Total", "19126");
  checkSingleValue("dailyFatalities", "Yesterday", "0");
  checkSingleValue("totalFatalities", "Total", "2491");
  checkSingleValue("fatalityCaseRatio", "Death / Case Ratio", "13.0%");
  checkSingleValue("dailyTestsCompleted", "Daily", "Not available");
  checkSingleValue("totalTestsCompleted", "Total", "231525");
});

test("singleValueBar renders dynamic fetched data with missing data", async () => {
  setFetchResponses(missingCsvData, nhsCsvData);

  // Set today to be 2020-06-22
  setMockDate("2020-06-22");

  await act(async () => {
    render(<SingleValueBar />, container);
  });

  checkSingleValue("dailyCases", "Yesterday", "47");
  checkSingleValue("totalCases", "Total", "19126");
  checkSingleValue("dailyFatalities", "Yesterday", "0");
  checkSingleValue("totalFatalities", "Total", "2491");
  checkSingleValue("fatalityCaseRatio", "Death / Case Ratio", "13.0%");
  checkSingleValue("dailyTestsCompleted", "Daily", "Not available");
  checkSingleValue("totalTestsCompleted", "Total", "Not available");
});

test("singleValueBar renders dynamic fetched data with missing NHS data", async () => {
  setFetchResponses(csvData, missingNhsCsvData);

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
  checkSingleValue("dailyTestsCompleted", "Daily", "3442");
  checkSingleValue("totalTestsCompleted", "Total", "231525");
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
    dailyTestsCompleted: { date: 1592697600000, value: 3442 },
    totalTestsCompleted: { date: 1592697600000, value: 231525 },
  };

  expect(parseCsvData(csvData)).toStrictEqual(expectedResult);
});

test("parseNhsCsvData", () => {
  const expectedResult = {
    cases: { date: 1592697600000, value: 47 },
    deaths: { date: 1592697600000, value: 0 },
    cumulativeCases: { date: 1592697600000, value: 19126 },
    cumulativeDeaths: { date: 1592697600000, value: 2491 },
    fatalityCaseRatio: "13.0%",
  };

  expect(parseNhsCsvData(nhsCsvData)).toStrictEqual(expectedResult);
});

// 2020-08-13 Disabled temporarily while we decide to keep ot bin the tests completed metric
// test("parseCsvData with bad count type", () => {
//   const badCsvData = `date,shortValue,count
//     2020-03-02,unknown,815`;
//
//   global.suppressConsoleErrorLogs();
//
//   expect(() => {
//     parseCsvData(badCsvData);
//   }).toThrow("Unrecognised input: unknown");
// });

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

const nhsCsvData = `Date,HB,HBQF,NewPositive,TotalCases,CrudeRatePositive,TotalPositivePercent,NewDeaths,TotalDeaths,CrudeRateDeaths,TotalNegative,CrudeRateNegative
20200621,S08000015,"",2,1285,347.899068659303,0.0476243421540286,0,171,46.2962962962963,25697,6957.16915746156
20200621,S08000016,"",0,349,302.138343000606,0.0427015783677964,0,39,33.7633105358843,7824,6773.4395290451
20200621,S08000017,"",0,305,204.890501142013,0.0252713563675532,0,40,26.8708853956738,11764,7902.72739486766
20200621,S08000019,"",2,1106,360.68353769893,0.0500701706731857,0,131,42.7211061831464,20983,6842.87764153405
20200621,S08000020,"",24,1733,295.88526549428,0.0358472612940592,0,149,25.4396448693871,46611,7958.16971145638
20200621,S08000022,"",0,388,120.609263288778,0.0197686859937841,0,65,20.2051600870376,19239,5980.41653714641
20200621,S08000024,"",5,3236,356.552590405254,0.0534319634100028,0,477,52.5573503162256,57327,6316.46796976575
20200621,S08000025,"",0,9,40.4131118096093,0.008,0,1,4.49034575662326,1116,5011.22586439156
20200621,S08000026,"",0,56,244.328097731239,0.0277915632754342,0,5,21.8150087260035,1959,8547.12041884817
20200621,S08000028,"",0,7,26.1976047904192,0.00444726810673443,0,0,0,1567,5864.52095808383
20200621,S08000029,"",0,957,256.190603667514,0.0386713541035277,0,127,33.9981260875385,23790,6368.62535135859
20200621,S08000030,"",4,1815,434.76177928953,0.0570790615761998,0,205,49.1053249335282,29983,7182.07296332671
20200621,S08000031,"",8,5079,429.288660490905,0.0530987329067871,0,728,61.5322198931638,90573,7655.4364730543
20200621,S08000032,"",2,2801,423.175706300045,0.0533879729343372,0,353,53.331318930352,49664,7503.24822480737
20200621,S92000003,d,47,19126,350.081452601907,0.046966895288331,0,2491,45.5951531125876,388097,7103.71021177676`;

const missingNhsCsvData = `Date,HB,HBQF,NewPositive,TotalCases,CrudeRatePositive,TotalPositivePercent,NewDeaths,TotalDeaths,CrudeRateDeaths,TotalNegative,CrudeRateNegative`;

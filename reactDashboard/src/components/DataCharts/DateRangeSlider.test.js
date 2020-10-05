import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { getMarks } from "./DateRangeSlider";

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

const councilAreaData = [
  ["20200902", "S12000005", "0", "204"],
  ["20200907", "S12000008", "0", "420"],
  ["20200904", "S12000011", "2", "415"],
  ["20209905", "S12000014", "3", "702"],
  ["20200906", "S12000007", "0", "553"],
  ["20200903", "S12000006", "0", "314"],
  ["20200908", "S12000009", "0", "570"],
];
const healthBoardData = [
  ["20200902", "S12000005", "0", "204"],
  ["20200903", "S12000006", "0", "314"],
  ["20200904", "S12000011", "2", "415"],
  ["20209905", "S12000014", "3", "702"],
  ["20200906", "S12000007", "0", "553"],
  ["20200907", "S12000008", "0", "420"],
  ["20200908", "S12000009", "0", "570"],
];

describe("getMarks", () => {
  it("normalRange", () => {
    const expectedResult = [
      {
        value: Date.parse("2020-02-28"),
        label: "28 Feb 2020"
      },
      {
        value: Date.parse("2020-04-02"),
        label: "02 Apr 2020"
      },
      {
        value: Date.parse("2020-03-01")
      },
      {
        value: Date.parse("2020-04-01")
      }
    ];

    expect(
      getMarks({
        startDate: Date.parse("2020-02-28"),
        endDate: Date.parse("2020-04-02")
      })
    ).toStrictEqual(expectedResult);
  });

  it("firstOfMonth", () => {
    const expectedResult = [
      {
        value: Date.parse("2020-02-01"),
        label: "01 Feb 2020"
      },
      {
        value: Date.parse("2020-06-01"),
        label: "01 Jun 2020"
      },
      {
        value: Date.parse("2020-03-01")
      },
      {
        value: Date.parse("2020-04-01")
      },
      {
        value: Date.parse("2020-05-01")
      }
    ];

    expect(
      getMarks({
        startDate: Date.parse("2020-02-01"),
        endDate: Date.parse("2020-06-01")
      })
    ).toStrictEqual(expectedResult);
  });

  it("defaultValues", () => {
    const expectedResult = [];

    expect(
      getMarks({
        startDate: 0,
        endDate: 0
      })
    ).toStrictEqual(expectedResult);
  });
});

describe("councilAreas", () => {
  it("", () => {
    const expectedResult = ;
    const value = {[dateRange.startDate, dateRange.endDate]}
    expect(
      handleDateChange(value);
    ).toStrictEqual(expectedResult);
  });

  it("", () => {
    const expectedResult = ;
    const value = {[dateRange.startDate, dateRange.endDate]}
    expect(
      handleDateChange(value);
    ).toStrictEqual(expectedResult);
  });

  it("", () => {
    const expectedResult = [];
    const value = {[dateRange.startDate, dateRange.endDate]}  
    expect(
      handleDateChange(value);
    ).toStrictEqual(expectedResult);
  });
});

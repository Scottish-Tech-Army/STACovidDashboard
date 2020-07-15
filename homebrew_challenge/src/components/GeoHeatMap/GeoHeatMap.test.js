import React from "react";
import GeoHeatMap, {
  parse7DayDiffCsvData,
  parseWeeklyCsvData,
} from "./GeoHeatMap";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import moment from "moment";

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

// These are cumulative values, the deltas are calculated
const dailyCasesCsvData = `date,areaname,count
  2020-03-09,Grampian,-8
  2020-03-08,Grampian,26
  2020-03-07,Grampian,-1
  2020-03-06,Grampian,1
  2020-03-05,Grampian,1
  2020-03-04,Grampian,1
  2020-03-03,Grampian,1
  2020-03-02,Grampian,-6
  2020-03-01,Grampian,1
  2020-02-29,Grampian,1
  2020-03-07,Greater Glasgow and Clyde,*
  2020-03-06,Greater Glasgow and Clyde,400
  2020-03-05,Greater Glasgow and Clyde,300
  2020-03-04,Greater Glasgow and Clyde,200
  2020-03-03,Greater Glasgow and Clyde,100
  2020-03-02,Greater Glasgow and Clyde,50
  2020-03-01,Greater Glasgow and Clyde,20
  2020-02-25,Greater Glasgow and Clyde,*
  2020-02-24,Greater Glasgow and Clyde,10
  2020-03-09,Highland,300
  2020-03-08,Highland,201
  2020-03-06,Highland,1
  2020-03-07,Highland,-1

    `;

it("parse7DayDiffCsvData", () => {
  // Remember these are deltas of cumulative figures
  // Grampian : 09/03 - 02/03 : 7 day diff
  // Glasgow : 07/03 - 25/02 : end date 2 days behind, start date missing days till first available date
  // Highland : 09/03 - ? : no start date available, calc diff from 0 instead
  // From date is diff start date + 1 day
  const expectedResult = new Map()
    .set("Grampian", {
      count: -2,
      fromDate: Date.parse("2020-03-03"),
      toDate: Date.parse("2020-03-09"),
      totalCases: -8,
    })
    .set("Greater Glasgow and Clyde", {
      count: 0,
      fromDate: Date.parse("2020-02-26"),
      toDate: Date.parse("2020-03-07"),
      totalCases: 0,
    })
    .set("Highland", {
      count: 300,
      fromDate: Date.parse("2020-03-06"),
      toDate: Date.parse("2020-03-09"),
      totalCases: 300,
    });

  expect(parse7DayDiffCsvData(dailyCasesCsvData)).toEqual(expectedResult);
});

const weeklyDeathsCsvData = `date,areaname,count
    w/c 2020-03-16,Orkney Islands,0
    w/c 2020-03-16,Glasgow City,1
    w/c 2020-03-16,Aberdeen City,1
    w/c 2020-03-23,Orkney Islands,0
    w/c 2020-03-23,Glasgow City,7
    w/c 2020-03-23,Aberdeen City,0
    w/c 2020-03-30,Orkney Islands,0
    w/c 2020-03-30,Glasgow City,46
    w/c 2020-03-30,Aberdeen City,2
    w/c 2020-04-06,Orkney Islands,2
    w/c 2020-04-06,Aberdeen City,12`;

it("parseWeeklyCsvData", () => {
  const expectedResult = new Map()
    .set("Aberdeen City", {
      count: 12,
      fromDate: Date.parse("2020-04-06"),
      toDate: Date.parse("2020-04-12"),
      totalDeaths: 15,
    })
    .set("Glasgow City", {
      count: 46,
      fromDate: Date.parse("2020-03-30"),
      toDate: Date.parse("2020-04-05"),
      totalDeaths: 54,
    })
    .set("Orkney Islands", {
      count: 2,
      fromDate: Date.parse("2020-04-06"),
      toDate: Date.parse("2020-04-12"),
      totalDeaths: 2,
    });

  expect(parseWeeklyCsvData(weeklyDeathsCsvData)).toEqual(expectedResult);
});

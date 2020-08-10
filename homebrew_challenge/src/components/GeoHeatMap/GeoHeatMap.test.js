import React from "react";
import GeoHeatMap, {
  parse7DayWindowCsvData,
  createPlaceDateValuesMap,
} from "./GeoHeatMap";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import moment from "moment";
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

// These are daily values

const dailyCasesCsvData = `
  Date,HB,DailyPositive,CumulativePositive,CrudeRatePositive,CumulativePositivePercent,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,CumulativeNegative,CrudeRateNegative
  20200309,S08000020,-8,0,0,0,-2,0,0,28,7.58068009529998
  20200308,S08000020,26,0,0,0,0,0,0,28,7.58068009529998
  20200307,S08000020,-1,0,0,0,-1,0,0,28,7.58068009529998
  20200306,S08000020,1,0,0,0,1,0,0,28,7.58068009529998
  20200305,S08000020,1,0,0,0,1,0,0,28,7.58068009529998
  20200304,S08000020,1,0,0,0,1,0,0,28,7.58068009529998
  20200303,S08000020,1,0,0,0,1,0,0,28,7.58068009529998
  20200302,S08000020,-6,0,0,0,-2,0,0,28,7.58068009529998
  20200301,S08000020,1,0,0,0,1,0,0,28,7.58068009529998
  20200229,S08000020,1,0,0,0,1,0,0,28,7.58068009529998
  20200307,S08000031,0,0,0,0,11,0,0,26,22.5088736905896
  20200306,S08000031,400,0,0,0,10,0,0,26,22.5088736905896
  20200305,S08000031,300,0,0,0,9,0,0,26,22.5088736905896
  20200304,S08000031,200,0,0,0,8,0,0,26,22.5088736905896
  20200303,S08000031,100,0,0,0,7,0,0,26,22.5088736905896
  20200302,S08000031,50,0,0,0,6,0,0,26,22.5088736905896
  20200226,S08000031,20,0,0,0,5,0,0,26,22.5088736905896
  20200225,S08000031,0,0,0,0,4,0,0,26,22.5088736905896
  20200224,S08000031,10,0,0,0,3,0,0,26,22.5088736905896
  20200309,S08000022,300,0,0,0,10,0,0,21,14.1072148327287
  20200308,S08000022,201,0,0,0,9,0,0,21,14.1072148327287
  20200306,S08000022,1,0,0,0,8,0,0,21,14.1072148327287
  20200307,S08000022,-1,0,0,0,7,0,0,21,14.1072148327287
    `;
it("parse7DayWindowCsvData", () => {
  // Grampian : 09/03 - 03/03 : 7 days of data
  // Glasgow : 07/03 - 02/03 : 6 days of data
  // Highland : 09/03 - 06/03 : 4 days of data
  const expectedResult = new Map()
    .set("S08000020", {
      cases: 21,
      deaths: 1,
      name: "Grampian",
      fromDate: Date.parse("2020-03-03"),
      toDate: Date.parse("2020-03-09"),
    })
    .set("S08000031", {
      cases: 1050,
      deaths: 51,
      name: "Greater Glasgow & Clyde",
      fromDate: Date.parse("2020-03-02"),
      toDate: Date.parse("2020-03-07"),
    })
    .set("S08000022", {
      cases: 501,
      deaths: 34,
      name: "Highland",
      fromDate: Date.parse("2020-03-06"),
      toDate: Date.parse("2020-03-09"),
    });

  expect(parse7DayWindowCsvData(dailyCasesCsvData)).toEqual(expectedResult);
});

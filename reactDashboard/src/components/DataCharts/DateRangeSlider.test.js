import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import DateRangeSlider from "./DateRangeSlider";
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

const nhsHealthBoardsCsvData = `Date,HB,HBName,DailyPositive,CumulativePositive,CrudeRatePositive,CumulativePositivePercent,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,CumulativeNegative,CrudeRateNegative
20200302,S08000031,unknown,1,2,2,4,5,6,7,8,9
20200303,S08000031,unknown,31,32,32,34,35,36,37,38,39
20200304,S08000031,unknown,61,62,62,64,65,66,67,68,69
20200305,S08000031,unknown,91,92,92,94,95,96,97,98,99
20200306,S08000031,unknown,121,122,122,124,125,126,127,128,129
20200307,S08000031,unknown,151,152,152,154,155,156,157,158,159
20200308,S08000031,unknown,181,182,182,184,185,186,187,188,189
20200309,S08000031,unknown,211,212,212,214,215,216,217,218,219`;

const healthBoardDataset = readCsvData(nhsHealthBoardsCsvData);

const nhsCouncilAreasCsvData = `Date,CA,CAName,DailyPositive,CumulativePositive,CrudeRatePositive,CumulativePositivePercent,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,CumulativeNegative,CrudeRateNegative
20200228,S12000005,Clackmannanshire,0,0,0,0,0,0,0,13,25.2231276678308
20200301,S12000005,Clackmannanshire,1,1,1.94024058983314,0.0666666666666667,0,0,0,14,27.1633682576639
20200302,S12000005,Clackmannanshire,0,1,1.94024058983314,0.0555555555555556,0,0,0,17,32.9840900271634
20200303,S12000005,Clackmannanshire,1,2,3.88048117966628,0.0909090909090909,0,0,0,20,38.8048117966628
20200304,S12000005,Clackmannanshire,0,2,3.88048117966628,0.08,0,0,0,23,44.6255335661622
20200305,S12000005,Clackmannanshire,0,2,3.88048117966628,0.0689655172413793,0,0,0,27,52.3864959254948
20200306,S12000005,Clackmannanshire,0,2,3.88048117966628,0.0645161290322581,0,0,0,29,56.266977105161
20200307,S12000005,Clackmannanshire,0,2,3.88048117966628,0.0571428571428571,0,0,0,33,64.0279394644936`;

const councilAreaDataset = readCsvData(nhsCouncilAreasCsvData);

const dateRange = {
  startDate: Date.parse("2020-03-06"),
  endDate: Date.parse("2020-03-06")
};

describe("check maximum date ranges", () => {

  const minimumDateValue = () =>
    container
      .querySelector(".MuiSlider-root .MuiSlider-thumb")
      .getAttribute("aria-valuemin");

  const maximumDateValue = () =>
    container
      .querySelector(".MuiSlider-root .MuiSlider-thumb")
      .getAttribute("aria-valuemax");

  it("healthBoards", async () => {
    await act(async () => {
      render(
        <DateRangeSlider
          healthBoardDataset={healthBoardDataset}
          dateRange={dateRange}
        />,
        container
      );
    });
    expect(minimumDateValue()).toStrictEqual(String(Date.parse("2020-03-02")));
    expect(maximumDateValue()).toStrictEqual(String(Date.parse("2020-03-09")));
  });

  it("both datasets", async () => {
    await act(async () => {
      render(
        <DateRangeSlider
          healthBoardDataset={healthBoardDataset}
          councilAreaDataset={councilAreaDataset}
          dateRange={dateRange}
        />,
        container
      );
    });
    expect(minimumDateValue()).toStrictEqual(String(Date.parse("2020-02-28")));
    expect(maximumDateValue()).toStrictEqual(String(Date.parse("2020-03-09")));
  });
});

/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkSingleValue", "expectNormalScotlandValues", "expectNormalHealthBoardValues", "expectNormalCouncilAreaValues"] }] */

import React from "react";
import RegionSingleValueBar, {
  parseNhsCACsvData,
  parseNhsHBCsvData,
} from "./RegionSingleValueBar";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { readCsvData, FEATURE_CODE_SCOTLAND } from "../Utils/CsvUtils";

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

describe("normal rendering, all data available", () => {
  it("scotland today", () => {
    // Set today to be 2020-06-21
    setMockDate("2020-06-21");

    act(() => {
      render(
        <RegionSingleValueBar
          currentTotalsCouncilAreaDataset={testCurrentTotalsCouncilAreaDataset}
          currentTotalsHealthBoardDataset={testCurrentTotalsHealthBoardDataset}
          councilAreaDataset={testCouncilAreaDataset}
          healthBoardDataset={testHealthBoardDataset}
          regionCode={FEATURE_CODE_SCOTLAND}
        />,
        container
      );
    });

    expectNormalScotlandValues();
  });

  it("health board today", () => {
    // Set today to be 2020-06-21
    setMockDate("2020-06-21");

    act(() => {
      render(
        <RegionSingleValueBar
          currentTotalsCouncilAreaDataset={testCurrentTotalsCouncilAreaDataset}
          currentTotalsHealthBoardDataset={testCurrentTotalsHealthBoardDataset}
          councilAreaDataset={testCouncilAreaDataset}
          healthBoardDataset={testHealthBoardDataset}
          regionCode="S08000017"
        />,
        container
      );
    });

    expectNormalHealthBoardValues();
  });

  it("council area yesterday", () => {
    // Set today to be 2020-06-22
    setMockDate("2020-06-22");

    act(() => {
      render(
        <RegionSingleValueBar
          currentTotalsCouncilAreaDataset={testCurrentTotalsCouncilAreaDataset}
          currentTotalsHealthBoardDataset={testCurrentTotalsHealthBoardDataset}
          councilAreaDataset={testCouncilAreaDataset}
          healthBoardDataset={testHealthBoardDataset}
          regionCode="S12000006"
        />,
        container
      );
    });

    expectNormalCouncilAreaValues();
  });
});

describe("normal rendering, currentTotalsCouncilAreaDataset null", () => {
  it("scotland today", () => {
    // Set today to be 2020-06-21
    setMockDate("2020-06-21");

    act(() => {
      render(
        <RegionSingleValueBar
          currentTotalsCouncilAreaDataset={null}
          currentTotalsHealthBoardDataset={testCurrentTotalsHealthBoardDataset}
          councilAreaDataset={testCouncilAreaDataset}
          healthBoardDataset={testHealthBoardDataset}
          regionCode={FEATURE_CODE_SCOTLAND}
        />,
        container
      );
    });

    expectNormalScotlandValues();
  });

  it("health board today", () => {
    // Set today to be 2020-06-21
    setMockDate("2020-06-21");

    act(() => {
      render(
        <RegionSingleValueBar
          currentTotalsCouncilAreaDataset={null}
          currentTotalsHealthBoardDataset={testCurrentTotalsHealthBoardDataset}
          councilAreaDataset={testCouncilAreaDataset}
          healthBoardDataset={testHealthBoardDataset}
          regionCode="S08000017"
        />,
        container
      );
    });

    expectNormalHealthBoardValues();
  });

  it("council area yesterday", () => {
    // Set today to be 2020-06-22
    setMockDate("2020-06-22");

    act(() => {
      render(
        <RegionSingleValueBar
          currentTotalsCouncilAreaDataset={null}
          currentTotalsHealthBoardDataset={testCurrentTotalsHealthBoardDataset}
          councilAreaDataset={testCouncilAreaDataset}
          healthBoardDataset={testHealthBoardDataset}
          regionCode="S12000006"
        />,
        container
      );
    });

    checkSingleValue("dailyCases", "Not available", "Not available");
    checkSingleValue("weeklyCases", "This week", "150");
    checkSingleValue("totalCases", "Total", "Not available");
    checkSingleValue("dailyDeaths", "Not available", "Not available");
    checkSingleValue("weeklyDeaths", "This week", "37");
    checkSingleValue("totalDeaths", "Total", "Not available");
  });
});

describe("normal rendering, currentTotalsHealthBoardDataset null", () => {
  it("scotland today", () => {
    // Set today to be 2020-06-21
    setMockDate("2020-06-21");

    act(() => {
      render(
        <RegionSingleValueBar
          currentTotalsCouncilAreaDataset={testCurrentTotalsCouncilAreaDataset}
          currentTotalsHealthBoardDataset={null}
          councilAreaDataset={testCouncilAreaDataset}
          healthBoardDataset={testHealthBoardDataset}
          regionCode={FEATURE_CODE_SCOTLAND}
        />,
        container
      );
    });

    checkSingleValue("dailyCases", "Not available", "Not available");
    checkSingleValue("weeklyCases", "This week", "1572");
    checkSingleValue("totalCases", "Total", "Not available");
    checkSingleValue("dailyDeaths", "Not available", "Not available");
    checkSingleValue("weeklyDeaths", "This week", "86");
    checkSingleValue("totalDeaths", "Total", "Not available");
  });

  it("health board today", () => {
    // Set today to be 2020-06-21
    setMockDate("2020-06-21");

    act(() => {
      render(
        <RegionSingleValueBar
          currentTotalsCouncilAreaDataset={testCurrentTotalsCouncilAreaDataset}
          currentTotalsHealthBoardDataset={null}
          councilAreaDataset={testCouncilAreaDataset}
          healthBoardDataset={testHealthBoardDataset}
          regionCode="S08000017"
        />,
        container
      );
    });

    checkSingleValue("dailyCases", "Not available", "Not available");
    checkSingleValue("weeklyCases", "This week", "501");
    checkSingleValue("totalCases", "Total", "Not available");
    checkSingleValue("dailyDeaths", "Not available", "Not available");
    checkSingleValue("weeklyDeaths", "This week", "34");
    checkSingleValue("totalDeaths", "Total", "Not available");
  });

  it("council area yesterday", () => {
    // Set today to be 2020-06-22
    setMockDate("2020-06-22");

    act(() => {
      render(
        <RegionSingleValueBar
          currentTotalsCouncilAreaDataset={testCurrentTotalsCouncilAreaDataset}
          currentTotalsHealthBoardDataset={null}
          councilAreaDataset={testCouncilAreaDataset}
          healthBoardDataset={testHealthBoardDataset}
          regionCode="S12000006"
        />,
        container
      );
    });

    expectNormalCouncilAreaValues();
  });
});

describe("normal rendering, councilAreaDataset null", () => {
  it("scotland today", () => {
    // Set today to be 2020-06-21
    setMockDate("2020-06-21");

    act(() => {
      render(
        <RegionSingleValueBar
          currentTotalsCouncilAreaDataset={testCurrentTotalsCouncilAreaDataset}
          currentTotalsHealthBoardDataset={testCurrentTotalsHealthBoardDataset}
          councilAreaDataset={null}
          healthBoardDataset={testHealthBoardDataset}
          regionCode={FEATURE_CODE_SCOTLAND}
        />,
        container
      );
    });

    expectNormalScotlandValues();
  });

  it("health board today", () => {
    // Set today to be 2020-06-21
    setMockDate("2020-06-21");

    act(() => {
      render(
        <RegionSingleValueBar
          currentTotalsCouncilAreaDataset={testCurrentTotalsCouncilAreaDataset}
          currentTotalsHealthBoardDataset={testCurrentTotalsHealthBoardDataset}
          councilAreaDataset={null}
          healthBoardDataset={testHealthBoardDataset}
          regionCode="S08000017"
        />,
        container
      );
    });

    expectNormalHealthBoardValues();
  });

  it("council area yesterday", () => {
    // Set today to be 2020-06-22
    setMockDate("2020-06-22");

    act(() => {
      render(
        <RegionSingleValueBar
          currentTotalsCouncilAreaDataset={testCurrentTotalsCouncilAreaDataset}
          currentTotalsHealthBoardDataset={testCurrentTotalsHealthBoardDataset}
          councilAreaDataset={null}
          healthBoardDataset={testHealthBoardDataset}
          regionCode="S12000006"
        />,
        container
      );
    });

    checkSingleValue("dailyCases", "Reported Yesterday", "1");
    checkSingleValue("weeklyCases", "This week", "Not available");
    checkSingleValue("totalCases", "Total", "311");
    checkSingleValue("dailyDeaths", "Reported Yesterday", "2");
    checkSingleValue("weeklyDeaths", "This week", "Not available");
    checkSingleValue("totalDeaths", "Total", "40");
  });
});

describe("normal rendering, healthBoardDataset null", () => {
  it("scotland today", () => {
    // Set today to be 2020-06-21
    setMockDate("2020-06-21");

    act(() => {
      render(
        <RegionSingleValueBar
          currentTotalsCouncilAreaDataset={testCurrentTotalsCouncilAreaDataset}
          currentTotalsHealthBoardDataset={testCurrentTotalsHealthBoardDataset}
          councilAreaDataset={testCouncilAreaDataset}
          healthBoardDataset={null}
          regionCode={FEATURE_CODE_SCOTLAND}
        />,
        container
      );
    });

    checkSingleValue("dailyCases", "Reported Today", "7");
    // Falls back on value calculated from CA data
    checkSingleValue("weeklyCases", "This week", "672");
    checkSingleValue("totalCases", "Total", "19126");
    checkSingleValue("dailyDeaths", "Reported Today", "3");
    // Falls back on value calculated from CA data
    checkSingleValue("weeklyDeaths", "This week", "72");
    checkSingleValue("totalDeaths", "Total", "2491");
  });

  it("health board today", () => {
    // Set today to be 2020-06-21
    setMockDate("2020-06-21");

    act(() => {
      render(
        <RegionSingleValueBar
          currentTotalsCouncilAreaDataset={testCurrentTotalsCouncilAreaDataset}
          currentTotalsHealthBoardDataset={testCurrentTotalsHealthBoardDataset}
          councilAreaDataset={testCouncilAreaDataset}
          healthBoardDataset={null}
          regionCode="S08000017"
        />,
        container
      );
    });

    checkSingleValue("dailyCases", "Reported Today", "4");
    checkSingleValue("weeklyCases", "This week", "Not available");
    checkSingleValue("totalCases", "Total", "305");
    checkSingleValue("dailyDeaths", "Reported Today", "0");
    checkSingleValue("weeklyDeaths", "This week", "Not available");
    checkSingleValue("totalDeaths", "Total", "40");
  });

  it("council area yesterday", () => {
    // Set today to be 2020-06-22
    setMockDate("2020-06-22");

    act(() => {
      render(
        <RegionSingleValueBar
          currentTotalsCouncilAreaDataset={testCurrentTotalsCouncilAreaDataset}
          currentTotalsHealthBoardDataset={testCurrentTotalsHealthBoardDataset}
          councilAreaDataset={testCouncilAreaDataset}
          healthBoardDataset={null}
          regionCode="S12000006"
        />,
        container
      );
    });

    expectNormalCouncilAreaValues();
  });
});

describe("regionCode", () => {
  it("missing should default to Scotland", () => {
    // Set today to be 2020-06-21
    setMockDate("2020-06-21");

    act(() => {
      render(
        <RegionSingleValueBar
          currentTotalsCouncilAreaDataset={testCurrentTotalsCouncilAreaDataset}
          currentTotalsHealthBoardDataset={testCurrentTotalsHealthBoardDataset}
          councilAreaDataset={testCouncilAreaDataset}
          healthBoardDataset={testHealthBoardDataset}
        />,
        container
      );
    });

    expectNormalScotlandValues();
  });

  it("null should default to Scotland", () => {
    // Set today to be 2020-06-21
    setMockDate("2020-06-21");

    act(() => {
      render(
        <RegionSingleValueBar
          currentTotalsCouncilAreaDataset={testCurrentTotalsCouncilAreaDataset}
          currentTotalsHealthBoardDataset={testCurrentTotalsHealthBoardDataset}
          councilAreaDataset={testCouncilAreaDataset}
          healthBoardDataset={testHealthBoardDataset}
          regionCode={null}
        />,
        container
      );
    });

    expectNormalScotlandValues();
  });

  it("unknown should throw error", () => {
    // Set today to be 2020-06-21
    setMockDate("2020-06-21");

    global.suppressConsoleErrorLogs();

    expect(() => {
      render(
        <RegionSingleValueBar
          currentTotalsCouncilAreaDataset={testCurrentTotalsCouncilAreaDataset}
          currentTotalsHealthBoardDataset={testCurrentTotalsHealthBoardDataset}
          councilAreaDataset={testCouncilAreaDataset}
          healthBoardDataset={testHealthBoardDataset}
          regionCode="unknown"
        />,
        container
      );
    }).toThrow("Unrecognised regionCode: unknown");
  });
});

test("parseNhsHBCsvData", () => {
  const expectedDate = Date.parse("2020-06-21");
  const expectedResult = new Map()
    .set("S08000015", {
      cases: { date: expectedDate, value: 3 },
      cumulativeCases: { date: expectedDate, value: 1285 },
      cumulativeDeaths: { date: expectedDate, value: 171 },
      deaths: { date: expectedDate, value: 1 },
    })
    .set("S08000016", {
      cases: { date: expectedDate, value: 0 },
      cumulativeCases: { date: expectedDate, value: 349 },
      cumulativeDeaths: { date: expectedDate, value: 39 },
      deaths: { date: expectedDate, value: 2 },
    })
    .set("S08000017", {
      cases: { date: expectedDate, value: 4 },
      cumulativeCases: { date: expectedDate, value: 305 },
      cumulativeDeaths: { date: expectedDate, value: 40 },
      deaths: { date: expectedDate, value: 0 },
    })
    .set("S92000003", {
      cases: { date: expectedDate, value: 7 },
      cumulativeCases: { date: expectedDate, value: 19126 },
      cumulativeDeaths: { date: expectedDate, value: 2491 },
      deaths: { date: expectedDate, value: 3 },
    });

  expect(parseNhsHBCsvData(testCurrentTotalsHealthBoardDataset)).toStrictEqual(
    expectedResult
  );
});

test("parseNhsCACsvData", () => {
  const expectedDate = Date.parse("2020-06-21");
  const expectedResult = new Map()
    .set("S12000005", {
      cases: { date: expectedDate, value: 0 },
      cumulativeCases: { date: expectedDate, value: 200 },
      cumulativeDeaths: { date: expectedDate, value: 31 },
      deaths: { date: expectedDate, value: 1 },
    })
    .set("S12000006", {
      cases: { date: expectedDate, value: 1 },
      cumulativeCases: { date: expectedDate, value: 311 },
      cumulativeDeaths: { date: expectedDate, value: 40 },
      deaths: { date: expectedDate, value: 2 },
    })
    .set("S12000008", {
      cases: { date: expectedDate, value: 0 },
      cumulativeCases: { date: expectedDate, value: 458 },
      cumulativeDeaths: { date: expectedDate, value: 51 },
      deaths: { date: expectedDate, value: 0 },
    });

  expect(parseNhsCACsvData(testCurrentTotalsCouncilAreaDataset)).toStrictEqual(
    expectedResult
  );
});

function expectNormalScotlandValues() {
  checkSingleValue("dailyCases", "Reported Today", "7");
  checkSingleValue("weeklyCases", "This week", "1572");
  checkSingleValue("totalCases", "Total", "19126");
  checkSingleValue("dailyDeaths", "Reported Today", "3");
  checkSingleValue("weeklyDeaths", "This week", "86");
  checkSingleValue("totalDeaths", "Total", "2491");
}

function expectNormalCouncilAreaValues() {
  checkSingleValue("dailyCases", "Reported Yesterday", "1");
  checkSingleValue("weeklyCases", "This week", "150");
  checkSingleValue("totalCases", "Total", "311");
  checkSingleValue("dailyDeaths", "Reported Yesterday", "2");
  checkSingleValue("weeklyDeaths", "This week", "37");
  checkSingleValue("totalDeaths", "Total", "40");
}

function expectNormalHealthBoardValues() {
  checkSingleValue("dailyCases", "Reported Today", "4");
  checkSingleValue("weeklyCases", "This week", "501");
  checkSingleValue("totalCases", "Total", "305");
  checkSingleValue("dailyDeaths", "Reported Today", "0");
  checkSingleValue("weeklyDeaths", "This week", "34");
  checkSingleValue("totalDeaths", "Total", "40");
}

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

const totalCACsvData = `Date,CA,NewPositive,TotalCases,CrudeRatePositive,TotalPositivePercent,NewDeaths,TotalDeaths,CrudeRateDeaths,TotalNegative,CrudeRateNegative
20200621,S12000005,0,200,388.048117966628,0.0428724544480171,1,31,60.1474582848273,4465,8663.17423360497
20200621,S12000006,1,311,208.921133951364,0.0216408043977455,2,40,26.8708853956738,14060,9445.11621657934
20200621,S12000008,0,458,375.379067289566,0.0452569169960474,0,51,41.7998524711089,9662,7919.02303089911`;

const totalHBCsvData = `Date,HB,HBQF,NewPositive,TotalCases,CrudeRatePositive,TotalPositivePercent,NewDeaths,TotalDeaths,CrudeRateDeaths,TotalNegative,CrudeRateNegative
20200621,S08000015,"",3,1285,347.899068659303,0.0476243421540286,1,171,46.2962962962963,25697,6957.16915746156
20200621,S08000016,"",0,349,302.138343000606,0.0427015783677964,2,39,33.7633105358843,7824,6773.4395290451
20200621,S08000017,"",4,305,204.890501142013,0.0252713563675532,0,40,26.8708853956738,11764,7902.72739486766
20200621,S92000003,d,7,19126,350.081452601907,0.046966895288331,3,2491,45.5951531125876,388097,7103.71021177676`;

const dailyCACsvData = `
  Date,HB,DailyPositive,CumulativePositive,CrudeRatePositive,CumulativePositivePercent,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,CumulativeNegative,CrudeRateNegative
  20200309,S12000005,-8,0,0,0,-2,0,0,28,7.58068009529998
  20200308,S12000005,26,0,0,0,0,0,0,28,7.58068009529998
  20200307,S12000005,-1,0,0,0,-1,0,0,28,7.58068009529998
  20200306,S12000005,1,0,0,0,1,0,0,28,7.58068009529998
  20200305,S12000005,1,0,0,0,1,0,0,28,7.58068009529998
  20200304,S12000005,1,0,0,0,1,0,0,28,7.58068009529998
  20200303,S12000005,1,0,0,0,1,0,0,28,7.58068009529998
  20200302,S12000005,-6,0,0,0,-2,0,0,28,7.58068009529998
  20200301,S12000005,1,0,0,0,1,0,0,28,7.58068009529998
  20200229,S12000005,1,0,0,0,1,0,0,28,7.58068009529998
  20200308,S12000006,0,0,0,0,11,0,0,26,22.5088736905896
  20200307,S12000006,40,0,0,0,10,0,0,26,22.5088736905896
  20200306,S12000006,30,0,0,0,5,0,0,26,22.5088736905896
  20200305,S12000006,20,0,0,0,3,0,0,26,22.5088736905896
  20200304,S12000006,10,0,0,0,2,0,0,26,22.5088736905896
  20200303,S12000006,50,0,0,0,6,0,0,26,22.5088736905896
  20200226,S12000006,20,0,0,0,5,0,0,26,22.5088736905896
  20200225,S12000006,0,0,0,0,4,0,0,26,22.5088736905896
  20200224,S12000006,10,0,0,0,3,0,0,26,22.5088736905896
  20200309,S12000008,300,0,0,0,10,0,0,21,14.1072148327287
  20200308,S12000008,201,0,0,0,9,0,0,21,14.1072148327287
  20200306,S12000008,1,0,0,0,8,0,0,21,14.1072148327287
  20200307,S12000008,-1,0,0,0,7,0,0,21,14.1072148327287
    `;

const dailyHBCsvData = `
      Date,HB,DailyPositive,CumulativePositive,CrudeRatePositive,CumulativePositivePercent,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,CumulativeNegative,CrudeRateNegative
      20200309,S08000015,-8,0,0,0,-2,0,0,28,7.58068009529998
      20200308,S08000015,26,0,0,0,0,0,0,28,7.58068009529998
      20200307,S08000015,-1,0,0,0,-1,0,0,28,7.58068009529998
      20200306,S08000015,1,0,0,0,1,0,0,28,7.58068009529998
      20200305,S08000015,1,0,0,0,1,0,0,28,7.58068009529998
      20200304,S08000015,1,0,0,0,1,0,0,28,7.58068009529998
      20200303,S08000015,1,0,0,0,1,0,0,28,7.58068009529998
      20200302,S08000015,-6,0,0,0,-2,0,0,28,7.58068009529998
      20200301,S08000015,1,0,0,0,1,0,0,28,7.58068009529998
      20200229,S08000015,1,0,0,0,1,0,0,28,7.58068009529998
      20200308,S08000016,0,0,0,0,11,0,0,26,22.5088736905896
      20200307,S08000016,400,0,0,0,10,0,0,26,22.5088736905896
      20200306,S08000016,300,0,0,0,9,0,0,26,22.5088736905896
      20200305,S08000016,200,0,0,0,8,0,0,26,22.5088736905896
      20200304,S08000016,100,0,0,0,7,0,0,26,22.5088736905896
      20200303,S08000016,50,0,0,0,6,0,0,26,22.5088736905896
      20200226,S08000016,20,0,0,0,5,0,0,26,22.5088736905896
      20200225,S08000016,0,0,0,0,4,0,0,26,22.5088736905896
      20200224,S08000016,10,0,0,0,3,0,0,26,22.5088736905896
      20200309,S08000017,300,0,0,0,10,0,0,21,14.1072148327287
      20200308,S08000017,201,0,0,0,9,0,0,21,14.1072148327287
      20200306,S08000017,1,0,0,0,8,0,0,21,14.1072148327287
      20200307,S08000017,-1,0,0,0,7,0,0,21,14.1072148327287
        `;

const testCurrentTotalsCouncilAreaDataset = readCsvData(totalCACsvData);
const testCurrentTotalsHealthBoardDataset = readCsvData(totalHBCsvData);
const testCouncilAreaDataset = readCsvData(dailyCACsvData);
const testHealthBoardDataset = readCsvData(dailyHBCsvData);

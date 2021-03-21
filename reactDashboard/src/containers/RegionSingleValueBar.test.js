import React from "react";
import RegionSingleValueBarContainer, {
  parseNhsCACsvData,
  parseNhsHBCsvData,
} from "./RegionSingleValueBar";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import {
  readCsvData,
  FEATURE_CODE_SCOTLAND,
} from "../components/Utils/CsvUtils";
import MockDate from "mockdate";
import RegionSingleValueBar from "../components/SingleValue/RegionSingleValueBar";
import moment from "moment";

const DATE_TODAY = moment.utc("2020-10-17").valueOf();
const FROM_DATE = moment.utc("2020-03-03").valueOf();
const TO_DATE = moment.utc("2020-03-09").valueOf();

jest.mock("../components/SingleValue/RegionSingleValueBar", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => <div></div>),
  };
});

describe("parsing input props", () => {
  var container = null;
  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    fetch.resetMocks();
    RegionSingleValueBar.mockClear();
    MockDate.set(DATE_TODAY);
  });

  afterEach(() => {
    // cleanup on exiting
    MockDate.reset();
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it("normal rendering, all data available", () => {
    act(() => {
      render(
        <RegionSingleValueBarContainer
          currentTotalsCouncilAreaDataset={testCurrentTotalsCouncilAreaDataset}
          currentTotalsHealthBoardDataset={testCurrentTotalsHealthBoardDataset}
          councilAreaDataset={testCouncilAreaDataset}
          healthBoardDataset={testHealthBoardDataset}
          regionCode={FEATURE_CODE_SCOTLAND}
        />,
        container
      );
    });

    expect(RegionSingleValueBar).toHaveBeenLastCalledWith(
      {
        placeStatsMap: {
          ...healthBoardStats,
          ...councilAreaStats,
          ...scotlandStats,
        },
        regionCode: "S92000003",
      },
      {}
    );
  });

  it("currentTotalsCouncilAreaDataset null", () => {
    act(() => {
      render(
        <RegionSingleValueBarContainer
          currentTotalsCouncilAreaDataset={null}
          currentTotalsHealthBoardDataset={testCurrentTotalsHealthBoardDataset}
          councilAreaDataset={testCouncilAreaDataset}
          healthBoardDataset={testHealthBoardDataset}
          regionCode="S08000017"
        />,
        container
      );
    });

    expect(RegionSingleValueBar).toHaveBeenLastCalledWith(
      {
        placeStatsMap: {
          ...healthBoardStats,
          S12000005: {
            fromDate: FROM_DATE,
            name: "Clackmannanshire",
            toDate: TO_DATE,
            weeklyCases: 21,
            weeklyDeaths: 1,
          },
          S12000006: {
            fromDate: FROM_DATE,
            name: "Dumfries & Galloway",
            toDate: TO_DATE,
            weeklyCases: 150,
            weeklyDeaths: 37,
          },
          S12000008: {
            fromDate: FROM_DATE,
            name: "East Ayrshire",
            toDate: TO_DATE,
            weeklyCases: 501,
            weeklyDeaths: 34,
          },
          ...scotlandStats,
        },
        regionCode: "S08000017",
      },
      {}
    );
  });

  it("currentTotalsHealthBoardDataset null", () => {
    act(() => {
      render(
        <RegionSingleValueBarContainer
          currentTotalsCouncilAreaDataset={testCurrentTotalsCouncilAreaDataset}
          currentTotalsHealthBoardDataset={null}
          councilAreaDataset={testCouncilAreaDataset}
          healthBoardDataset={testHealthBoardDataset}
          regionCode={FEATURE_CODE_SCOTLAND}
        />,
        container
      );
    });

    expect(RegionSingleValueBar).toHaveBeenLastCalledWith(
      {
        placeStatsMap: {
          S08000015: {
            fromDate: FROM_DATE,
            name: "Ayrshire & Arran",
            toDate: TO_DATE,
            weeklyCases: 21,
            weeklyDeaths: 1,
          },
          S08000016: {
            fromDate: FROM_DATE,
            name: "Borders",
            toDate: TO_DATE,
            weeklyCases: 1050,
            weeklyDeaths: 51,
          },
          S08000017: {
            fromDate: FROM_DATE,
            name: "Dumfries & Galloway",
            toDate: TO_DATE,
            weeklyCases: 501,
            weeklyDeaths: 34,
          },
          ...councilAreaStats,
          S92000003: {
            fromDate: FROM_DATE,
            name: "Scotland",
            toDate: TO_DATE,
            weeklyCases: 1572,
            weeklyDeaths: 86,
          },
        },
        regionCode: "S92000003",
      },
      {}
    );
  });

  it("councilAreaDataset null", () => {
    act(() => {
      render(
        <RegionSingleValueBarContainer
          currentTotalsCouncilAreaDataset={testCurrentTotalsCouncilAreaDataset}
          currentTotalsHealthBoardDataset={testCurrentTotalsHealthBoardDataset}
          councilAreaDataset={null}
          healthBoardDataset={testHealthBoardDataset}
          regionCode={FEATURE_CODE_SCOTLAND}
        />,
        container
      );
    });

    expect(RegionSingleValueBar).toHaveBeenLastCalledWith(
      {
        placeStatsMap: {
          ...healthBoardStats,
          S12000005: {
            cumulativeCases: { date: DATE_TODAY, value: 200 },
            cumulativeDeaths: { date: DATE_TODAY, value: 31 },
            dailyCases: { date: DATE_TODAY, value: 0 },
            dailyDeaths: { date: DATE_TODAY, value: 1 },
          },
          S12000006: {
            cumulativeCases: { date: DATE_TODAY, value: 311 },
            cumulativeDeaths: { date: DATE_TODAY, value: 40 },
            dailyCases: { date: DATE_TODAY, value: 1 },
            dailyDeaths: { date: DATE_TODAY, value: 2 },
          },
          S12000008: {
            cumulativeCases: { date: DATE_TODAY, value: 458 },
            cumulativeDeaths: { date: DATE_TODAY, value: 51 },
            dailyCases: { date: DATE_TODAY, value: 0 },
            dailyDeaths: { date: DATE_TODAY, value: 0 },
          },
          ...scotlandStats,
        },
        regionCode: "S92000003",
      },
      {}
    );
  });

  it("healthBoardDataset null", () => {
    act(() => {
      render(
        <RegionSingleValueBarContainer
          currentTotalsCouncilAreaDataset={testCurrentTotalsCouncilAreaDataset}
          currentTotalsHealthBoardDataset={testCurrentTotalsHealthBoardDataset}
          councilAreaDataset={testCouncilAreaDataset}
          healthBoardDataset={null}
          regionCode={FEATURE_CODE_SCOTLAND}
        />,
        container
      );
    });

    expect(RegionSingleValueBar).toHaveBeenLastCalledWith(
      {
        placeStatsMap: {
          S08000015: {
            cumulativeCases: { date: DATE_TODAY, value: 1285 },
            cumulativeDeaths: { date: DATE_TODAY, value: 171 },
            dailyCases: { date: DATE_TODAY, value: 3 },
            dailyDeaths: { date: DATE_TODAY, value: 1 },
          },
          S08000016: {
            cumulativeCases: { date: DATE_TODAY, value: 349 },
            cumulativeDeaths: { date: DATE_TODAY, value: 39 },
            dailyCases: { date: DATE_TODAY, value: 0 },
            dailyDeaths: { date: DATE_TODAY, value: 2 },
          },
          S08000017: {
            cumulativeCases: { date: DATE_TODAY, value: 305 },
            cumulativeDeaths: { date: DATE_TODAY, value: 40 },
            dailyCases: { date: DATE_TODAY, value: 4 },
            dailyDeaths: { date: DATE_TODAY, value: 0 },
          },
          ...councilAreaStats,
          S92000003: {
            cumulativeCases: { date: DATE_TODAY, value: 19126 },
            cumulativeDeaths: { date: DATE_TODAY, value: 2491 },
            dailyCases: { date: DATE_TODAY, value: 7 },
            dailyDeaths: { date: DATE_TODAY, value: 3 },
            fromDate: FROM_DATE,
            name: "Scotland",
            toDate: TO_DATE,
            weeklyCases: 672,
            weeklyDeaths: 72,
          },
        },
        regionCode: "S92000003",
      },
      {}
    );
  });

  it("healthBoardDataset and councilAreaDataset null", () => {
    act(() => {
      render(
        <RegionSingleValueBarContainer
          currentTotalsCouncilAreaDataset={testCurrentTotalsCouncilAreaDataset}
          currentTotalsHealthBoardDataset={testCurrentTotalsHealthBoardDataset}
          councilAreaDataset={null}
          healthBoardDataset={null}
          regionCode={FEATURE_CODE_SCOTLAND}
        />,
        container
      );
    });

    expect(RegionSingleValueBar).toHaveBeenLastCalledWith(
      {
        placeStatsMap: {
          S08000015: {
            cumulativeCases: { date: DATE_TODAY, value: 1285 },
            cumulativeDeaths: { date: DATE_TODAY, value: 171 },
            dailyCases: { date: DATE_TODAY, value: 3 },
            dailyDeaths: { date: DATE_TODAY, value: 1 },
          },
          S08000016: {
            cumulativeCases: { date: DATE_TODAY, value: 349 },
            cumulativeDeaths: { date: DATE_TODAY, value: 39 },
            dailyCases: { date: DATE_TODAY, value: 0 },
            dailyDeaths: { date: DATE_TODAY, value: 2 },
          },
          S08000017: {
            cumulativeCases: { date: DATE_TODAY, value: 305 },
            cumulativeDeaths: { date: DATE_TODAY, value: 40 },
            dailyCases: { date: DATE_TODAY, value: 4 },
            dailyDeaths: { date: DATE_TODAY, value: 0 },
          },
          S12000005: {
            cumulativeCases: { date: DATE_TODAY, value: 200 },
            cumulativeDeaths: { date: DATE_TODAY, value: 31 },
            dailyCases: { date: DATE_TODAY, value: 0 },
            dailyDeaths: { date: DATE_TODAY, value: 1 },
          },
          S12000006: {
            cumulativeCases: { date: DATE_TODAY, value: 311 },
            cumulativeDeaths: { date: DATE_TODAY, value: 40 },
            dailyCases: { date: DATE_TODAY, value: 1 },
            dailyDeaths: { date: DATE_TODAY, value: 2 },
          },
          S12000008: {
            cumulativeCases: { date: DATE_TODAY, value: 458 },
            cumulativeDeaths: { date: DATE_TODAY, value: 51 },
            dailyCases: { date: DATE_TODAY, value: 0 },
            dailyDeaths: { date: DATE_TODAY, value: 0 },
          },
          S92000003: {
            cumulativeCases: { date: DATE_TODAY, value: 19126 },
            cumulativeDeaths: { date: DATE_TODAY, value: 2491 },
            dailyCases: { date: DATE_TODAY, value: 7 },
            dailyDeaths: { date: DATE_TODAY, value: 3 },
          },
        },
        regionCode: "S92000003",
      },
      {}
    );
  });

  it("all datasets null", () => {
    act(() => {
      render(
        <RegionSingleValueBarContainer
          currentTotalsCouncilAreaDataset={null}
          currentTotalsHealthBoardDataset={null}
          councilAreaDataset={null}
          healthBoardDataset={null}
          regionCode={FEATURE_CODE_SCOTLAND}
        />,
        container
      );
    });

    expect(RegionSingleValueBar).toHaveBeenLastCalledWith(
      { placeStatsMap: {}, regionCode: "S92000003" },
      {}
    );
  });
});

test("parseNhsHBCsvData", () => {
  const expectedDate = DATE_TODAY;
  const expectedResult = {
    S08000015: {
      dailyCases: { date: expectedDate, value: 3 },
      cumulativeCases: { date: expectedDate, value: 1285 },
      cumulativeDeaths: { date: expectedDate, value: 171 },
      dailyDeaths: { date: expectedDate, value: 1 },
    },
    S08000016: {
      dailyCases: { date: expectedDate, value: 0 },
      cumulativeCases: { date: expectedDate, value: 349 },
      cumulativeDeaths: { date: expectedDate, value: 39 },
      dailyDeaths: { date: expectedDate, value: 2 },
    },
    S08000017: {
      dailyCases: { date: expectedDate, value: 4 },
      cumulativeCases: { date: expectedDate, value: 305 },
      cumulativeDeaths: { date: expectedDate, value: 40 },
      dailyDeaths: { date: expectedDate, value: 0 },
    },
    S92000003: {
      dailyCases: { date: expectedDate, value: 7 },
      cumulativeCases: { date: expectedDate, value: 19126 },
      cumulativeDeaths: { date: expectedDate, value: 2491 },
      dailyDeaths: { date: expectedDate, value: 3 },
    },
  };

  expect(parseNhsHBCsvData(testCurrentTotalsHealthBoardDataset)).toStrictEqual(
    expectedResult
  );
});

test("parseNhsCACsvData", () => {
  const expectedDate = DATE_TODAY;
  const expectedResult = {
    S12000005: {
      dailyCases: { date: expectedDate, value: 0 },
      cumulativeCases: { date: expectedDate, value: 200 },
      cumulativeDeaths: { date: expectedDate, value: 31 },
      dailyDeaths: { date: expectedDate, value: 1 },
    },
    S12000006: {
      dailyCases: { date: expectedDate, value: 1 },
      cumulativeCases: { date: expectedDate, value: 311 },
      cumulativeDeaths: { date: expectedDate, value: 40 },
      dailyDeaths: { date: expectedDate, value: 2 },
    },
    S12000008: {
      dailyCases: { date: expectedDate, value: 0 },
      cumulativeCases: { date: expectedDate, value: 458 },
      cumulativeDeaths: { date: expectedDate, value: 51 },
      dailyDeaths: { date: expectedDate, value: 0 },
    },
  };

  expect(parseNhsCACsvData(testCurrentTotalsCouncilAreaDataset)).toStrictEqual(
    expectedResult
  );
});

const totalCACsvData = `Date,CA,CAName,NewPositive,TotalCases,CrudeRatePositive,NewDeaths,TotalDeaths,CrudeRateDeaths,TotalNegative,CrudeRateNegative
20201017,S12000005,unknown,0,200,388.048117966628,1,31,60.1474582848273,4465,8663.17423360497
20201017,S12000006,unknown,1,311,208.921133951364,2,40,26.8708853956738,14060,9445.11621657934
20201017,S12000008,unknown,0,458,375.379067289566,0,51,41.7998524711089,9662,7919.02303089911`;

const totalHBCsvData = `Date,HB,HBQF,HBName,NewPositive,TotalCases,CrudeRatePositive,NewDeaths,TotalDeaths,CrudeRateDeaths,TotalNegative,CrudeRateNegative
20201017,S08000015,"",unknown,3,1285,347.8990686593031,1,171,46.2962962962963,25697,6957.16915746156
20201017,S08000016,"",unknown,0,349,302.138343000606,2,39,33.7633105358843,7824,6773.4395290451
20201017,S08000017,"",unknown,4,305,204.890501142013,0,40,26.8708853956738,11764,7902.72739486766
20201017,S92000003,d,unknown,7,19126,350.081452601907,3,2491,45.5951531125876,388097,7103.71021177676`;

const dailyCACsvData = `
  Date,CA,CAName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,CumulativeNegative,CrudeRateNegative
  20200309,S12000005,unknown,-8,0,0,0,-2,0,0,28,7.58068009529998
  20200308,S12000005,unknown,26,0,0,0,0,0,0,28,7.58068009529998
  20200307,S12000005,unknown,-1,0,0,0,-1,0,0,28,7.58068009529998
  20200306,S12000005,unknown,1,0,0,0,1,0,0,28,7.58068009529998
  20200305,S12000005,unknown,1,0,0,0,1,0,0,28,7.58068009529998
  20200304,S12000005,unknown,1,0,0,0,1,0,0,28,7.58068009529998
  20200303,S12000005,unknown,1,0,0,0,1,0,0,28,7.58068009529998
  20200302,S12000005,unknown,-6,0,0,0,-2,0,0,28,7.58068009529998
  20200301,S12000005,unknown,1,0,0,0,1,0,0,28,7.58068009529998
  20200229,S12000005,unknown,1,0,0,0,1,0,0,28,7.58068009529998
  20200308,S12000006,unknown,0,0,0,0,11,0,0,26,22.5088736905896
  20200307,S12000006,unknown,40,0,0,0,10,0,0,26,22.5088736905896
  20200306,S12000006,unknown,30,0,0,0,5,0,0,26,22.5088736905896
  20200305,S12000006,unknown,20,0,0,0,3,0,0,26,22.5088736905896
  20200304,S12000006,unknown,10,0,0,0,2,0,0,26,22.5088736905896
  20200303,S12000006,unknown,50,0,0,0,6,0,0,26,22.5088736905896
  20200226,S12000006,unknown,20,0,0,0,5,0,0,26,22.5088736905896
  20200225,S12000006,unknown,0,0,0,0,4,0,0,26,22.5088736905896
  20200224,S12000006,unknown,10,0,0,0,3,0,0,26,22.5088736905896
  20200309,S12000008,unknown,300,0,0,0,10,0,0,21,14.1072148327287
  20200308,S12000008,unknown,201,0,0,0,9,0,0,21,14.1072148327287
  20200306,S12000008,unknown,1,0,0,0,8,0,0,21,14.1072148327287
  20200307,S12000008,unknown,-1,0,0,0,7,0,0,21,14.1072148327287
    `;

const dailyHBCsvData = `
      Date,HB,HBName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,CumulativeNegative,CrudeRateNegative
      20200309,S08000015,unknown,-8,0,0,0,-2,0,0,28,7.58068009529998
      20200308,S08000015,unknown,26,0,0,0,0,0,0,28,7.58068009529998
      20200307,S08000015,unknown,-1,0,0,0,-1,0,0,28,7.58068009529998
      20200306,S08000015,unknown,1,0,0,0,1,0,0,28,7.58068009529998
      20200305,S08000015,unknown,1,0,0,0,1,0,0,28,7.58068009529998
      20200304,S08000015,unknown,1,0,0,0,1,0,0,28,7.58068009529998
      20200303,S08000015,unknown,1,0,0,0,1,0,0,28,7.58068009529998
      20200302,S08000015,unknown,-6,0,0,0,-2,0,0,28,7.58068009529998
      20200301,S08000015,unknown,1,0,0,0,1,0,0,28,7.58068009529998
      20200229,S08000015,unknown,1,0,0,0,1,0,0,28,7.58068009529998
      20200308,S08000016,unknown,0,0,0,0,11,0,0,26,22.5088736905896
      20200307,S08000016,unknown,400,0,0,0,10,0,0,26,22.5088736905896
      20200306,S08000016,unknown,300,0,0,0,9,0,0,26,22.5088736905896
      20200305,S08000016,unknown,200,0,0,0,8,0,0,26,22.5088736905896
      20200304,S08000016,unknown,100,0,0,0,7,0,0,26,22.5088736905896
      20200303,S08000016,unknown,50,0,0,0,6,0,0,26,22.5088736905896
      20200226,S08000016,unknown,20,0,0,0,5,0,0,26,22.5088736905896
      20200225,S08000016,unknown,0,0,0,0,4,0,0,26,22.5088736905896
      20200224,S08000016,unknown,10,0,0,0,3,0,0,26,22.5088736905896
      20200309,S08000017,unknown,300,0,0,0,10,0,0,21,14.1072148327287
      20200308,S08000017,unknown,201,0,0,0,9,0,0,21,14.1072148327287
      20200306,S08000017,unknown,1,0,0,0,8,0,0,21,14.1072148327287
      20200307,S08000017,unknown,-1,0,0,0,7,0,0,21,14.1072148327287
        `;

const testCurrentTotalsCouncilAreaDataset = readCsvData(totalCACsvData);
const testCurrentTotalsHealthBoardDataset = readCsvData(totalHBCsvData);
const testCouncilAreaDataset = readCsvData(dailyCACsvData);
const testHealthBoardDataset = readCsvData(dailyHBCsvData);

const healthBoardStats = {
  S08000015: {
    cumulativeCases: { date: DATE_TODAY, value: 1285 },
    cumulativeDeaths: { date: DATE_TODAY, value: 171 },
    dailyCases: { date: DATE_TODAY, value: 3 },
    dailyDeaths: { date: DATE_TODAY, value: 1 },
    fromDate: FROM_DATE,
    name: "Ayrshire & Arran",
    toDate: TO_DATE,
    weeklyCases: 21,
    weeklyDeaths: 1,
  },
  S08000016: {
    cumulativeCases: { date: DATE_TODAY, value: 349 },
    cumulativeDeaths: { date: DATE_TODAY, value: 39 },
    dailyCases: { date: DATE_TODAY, value: 0 },
    dailyDeaths: { date: DATE_TODAY, value: 2 },
    fromDate: FROM_DATE,
    name: "Borders",
    toDate: TO_DATE,
    weeklyCases: 1050,
    weeklyDeaths: 51,
  },
  S08000017: {
    cumulativeCases: { date: DATE_TODAY, value: 305 },
    cumulativeDeaths: { date: DATE_TODAY, value: 40 },
    dailyCases: { date: DATE_TODAY, value: 4 },
    dailyDeaths: { date: DATE_TODAY, value: 0 },
    fromDate: FROM_DATE,
    name: "Dumfries & Galloway",
    toDate: TO_DATE,
    weeklyCases: 501,
    weeklyDeaths: 34,
  },
};

const councilAreaStats = {
  S12000005: {
    cumulativeCases: { date: DATE_TODAY, value: 200 },
    cumulativeDeaths: { date: DATE_TODAY, value: 31 },
    dailyCases: { date: DATE_TODAY, value: 0 },
    dailyDeaths: { date: DATE_TODAY, value: 1 },
    fromDate: FROM_DATE,
    name: "Clackmannanshire",
    toDate: TO_DATE,
    weeklyCases: 21,
    weeklyDeaths: 1,
  },
  S12000006: {
    cumulativeCases: { date: DATE_TODAY, value: 311 },
    cumulativeDeaths: { date: DATE_TODAY, value: 40 },
    dailyCases: { date: DATE_TODAY, value: 1 },
    dailyDeaths: { date: DATE_TODAY, value: 2 },
    fromDate: FROM_DATE,
    name: "Dumfries & Galloway",
    toDate: TO_DATE,
    weeklyCases: 150,
    weeklyDeaths: 37,
  },
  S12000008: {
    cumulativeCases: { date: DATE_TODAY, value: 458 },
    cumulativeDeaths: { date: DATE_TODAY, value: 51 },
    dailyCases: { date: DATE_TODAY, value: 0 },
    dailyDeaths: { date: DATE_TODAY, value: 0 },
    fromDate: FROM_DATE,
    name: "East Ayrshire",
    toDate: TO_DATE,
    weeklyCases: 501,
    weeklyDeaths: 34,
  },
};

const scotlandStats = {
  S92000003: {
    cumulativeCases: { date: DATE_TODAY, value: 19126 },
    cumulativeDeaths: { date: DATE_TODAY, value: 2491 },
    dailyCases: { date: DATE_TODAY, value: 7 },
    dailyDeaths: { date: DATE_TODAY, value: 3 },
    fromDate: FROM_DATE,
    name: "Scotland",
    toDate: TO_DATE,
    weeklyCases: 1572,
    weeklyDeaths: 86,
  },
};

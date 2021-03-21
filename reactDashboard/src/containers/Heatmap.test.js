import React from "react";
import HeatmapContainer, { parseCsvData, getScotlandRegion } from "./Heatmap";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import {
  readCsvData,
  FEATURE_CODE_SCOTLAND,
} from "../components/Utils/CsvUtils";
import Heatmap from "../components/HeatMap/Heatmap";

jest.mock("../components/HeatMap/Heatmap", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => <div></div>),
  };
});

var container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  fetch.resetMocks();
  Heatmap.mockClear();
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const START_DATE = Date.parse("2020-03-01");
const END_DATE = Date.parse("2020-03-09");

const dailyHealthBoardWithScotlandCsvData = readCsvData(`Date,HB,HBName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,CumulativeNegative,CrudeRateNegative
    20200301,S08000031,unknown,0,21,0,0,1,10,0,0,0
    20200301,S08000022,unknown,1,22,0,0,2,20,0,0,0
    20200301,S08000020,unknown,1,23,0,0,3,30,0,0,0
    20200301,S92000003,Scotland,51,53,0,0,73,130,0,0,0
    20200309,S08000031,unknown,0,24,0,0,4,40,0,0,0
    20200309,S08000022,unknown,300,25,0,0,5,50,0,0,0
    20200309,S08000020,unknown,-8,26,0,0,6,60,0,0,0
    20200309,S92000003,Scotland,51,63,0,0,74,140,0,0,0
    20200308,S08000031,unknown,0,27,0,0,7,70,0,0,0
    20200308,S08000022,unknown,201,28,0,0,8,80,0,0,0
    20200308,S08000020,unknown,26,29,0,0,9,90,0,0,0
    20200308,S92000003,Scotland,57,73,0,0,75,150,0,0,0
    20200307,S08000031,unknown,0,0,0,0,0,0,0,0,0
    20200307,S08000022,unknown,-1,-21,0,0,-1,-10,0,0,0
    20200307,S08000020,unknown,-1,-22,0,0,-2,-20,0,0,0
    20200307,S92000003,Scotland,-51,83,0,0,76,160,0,0,0
    `);
const dailyHealthBoardWithoutScotlandCsvData = readCsvData(`Date,HB,HBName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,CumulativeNegative,CrudeRateNegative
    20200301,S08000031,unknown,0,21,0,0,1,10,0,0,0
    20200301,S08000022,unknown,1,22,0,0,2,20,0,0,0
    20200301,S08000020,unknown,1,23,0,0,3,30,0,0,0
    20200309,S08000031,unknown,0,24,0,0,4,40,0,0,0
    20200309,S08000022,unknown,300,25,0,0,5,50,0,0,0
    20200309,S08000020,unknown,-8,26,0,0,6,60,0,0,0
    20200308,S08000031,unknown,0,27,0,0,7,70,0,0,0
    20200308,S08000022,unknown,201,28,0,0,8,80,0,0,0
    20200308,S08000020,unknown,26,29,0,0,9,90,0,0,0
    20200307,S08000031,unknown,0,0,0,0,0,0,0,0,0
    20200307,S08000022,unknown,-1,-21,0,0,-1,-10,0,0,0
    20200307,S08000020,unknown,-1,-22,0,0,-2,-20,0,0,0
    `);

const dailyCouncilAreaCsvData = readCsvData(`Date,CA,CAName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,CumulativeNegative,CrudeRateNegative
    20200301,S12000013,unknown,0,21,0,0,1,10,0,0,0
    20200301,S12000035,unknown,1,22,0,0,2,20,0,0,0
    20200301,S12000019,unknown,1,23,0,0,3,30,0,0,0
    20200309,S12000013,unknown,0,24,0,0,4,40,0,0,0
    20200309,S12000035,unknown,300,25,0,0,5,50,0,0,0
    20200309,S12000019,unknown,-8,26,0,0,6,60,0,0,0
    20200308,S12000013,unknown,0,27,0,0,7,70,0,0,0
    20200308,S12000035,unknown,201,28,0,0,8,80,0,0,0
    20200308,S12000019,unknown,26,29,0,0,9,90,0,0,0
    20200307,S12000013,unknown,0,0,0,0,0,0,0,0,0
    20200307,S12000035,unknown,-1,-21,0,0,-1,-10,0,0,0
    20200307,S12000019,unknown,-1,-22,0,0,-2,-20,0,0,0
    `);

describe("data processing", () => {
  it("no data", async () => {
    await act(async () => {
      render(<HeatmapContainer />, container);
    });

    expect(Heatmap).toHaveBeenLastCalledWith(
      {
        parsedCouncilAreaDataset: undefined,
        parsedHealthBoardDataset: undefined,
        areaType: undefined,
        valueType: undefined,
      },
      {}
    );
  });

  it("all data available", async () => {
    await act(async () => {
      render(
        <HeatmapContainer
          councilAreaDataset={dailyCouncilAreaCsvData}
          healthBoardDataset={dailyHealthBoardWithScotlandCsvData}
          valueType="deaths"
          areaType="council-areas"
        />,
        container
      );
    });

    expect(Heatmap).toHaveBeenLastCalledWith(
      {
        parsedCouncilAreaDataset: parsedCouncilAreaDataset,
        parsedHealthBoardDataset: parsedHealthBoardDataset,
        areaType: "council-areas",
        valueType: "deaths",
      },
      {}
    );
  });

  it("health boards missing", async () => {
    await act(async () => {
      render(
        <HeatmapContainer
          councilAreaDataset={dailyCouncilAreaCsvData}
          valueType="deaths"
          areaType="council-areas"
        />,
        container
      );
    });

    expect(Heatmap).toHaveBeenLastCalledWith(
      {
        parsedCouncilAreaDataset: parsedCouncilAreaDataset,
        parsedHealthBoardDataset: undefined,
        areaType: "council-areas",
        valueType: "deaths",
      },
      {}
    );
  });

  it("council areas missing", async () => {
    await act(async () => {
      render(
        <HeatmapContainer
          healthBoardDataset={dailyHealthBoardWithScotlandCsvData}
          valueType="cases"
          areaType="health-boards"
        />,
        container
      );
    });

    expect(Heatmap).toHaveBeenLastCalledWith(
      {
        parsedCouncilAreaDataset: undefined,
        parsedHealthBoardDataset: parsedHealthBoardDataset,
        valueType: "cases",
        areaType: "health-boards",
      },
      {}
    );
  });

  it("health boards (without Scotland)", async () => {
    await act(async () => {
      render(
        <HeatmapContainer
          councilAreaDataset={dailyCouncilAreaCsvData}
          healthBoardDataset={dailyHealthBoardWithoutScotlandCsvData}
          valueType="deaths"
          areaType="council-areas"
        />,
        container
      );
    });

    expect(Heatmap).toHaveBeenLastCalledWith(
      {
        parsedCouncilAreaDataset: parsedCouncilAreaDataset,
        parsedHealthBoardDataset: parsedHealthBoardWithoutScotlandDataset,
        areaType: "council-areas",
        valueType: "deaths",
      },
      {}
    );
  });
});

describe("parseCsvData", () => {
  it("council areas", () => {
    const expectedResult = {
      startDate: Date.parse("2020-03-01"),
      endDate: Date.parse("2020-03-09"),
      dates: [Date.parse("2020-03-01"), Date.parse("2020-03-08")],
      scotland: {
        featureCode: FEATURE_CODE_SCOTLAND,
        name: "Scotland",
        cases: [0, 519],
        deaths: [3, 39],
        totalCases: 75,
        totalDeaths: 150,
      },
      regions: [
        // In alphabetical order of area name
        {
          featureCode: "S12000035",
          name: "Argyll & Bute",
          cases: [0, 501],
          deaths: [1, 13],
          totalCases: 25,
          totalDeaths: 50,
        },
        {
          featureCode: "S12000019",
          name: "Midlothian",
          cases: [0, 18],
          deaths: [1, 15],
          totalCases: 26,
          totalDeaths: 60,
        },
        {
          featureCode: "S12000013",
          name: "Na h-Eileanan Siar",
          cases: [0, 0],
          deaths: [1, 11],
          totalCases: 24,
          totalDeaths: 40,
        },
      ],
    };

    expect(parseCsvData(dailyCouncilAreaCsvData)).toStrictEqual(expectedResult);
  });

  it("health boards (with Scotland)", () => {
    const expectedResult = {
      startDate: Date.parse("2020-03-01"),
      endDate: Date.parse("2020-03-09"),
      dates: [Date.parse("2020-03-01"), Date.parse("2020-03-08")],
      scotland: {
        featureCode: FEATURE_CODE_SCOTLAND,
        name: "Scotland",
        cases: [0, 108],
        deaths: [149, 149],
        totalCases: 63,
        totalDeaths: 140,
      },
      regions: [
        // In alphabetical order of area name
        {
          featureCode: "S08000020",
          name: "Grampian",
          cases: [0, 18],
          deaths: [1, 15],
          totalCases: 26,
          totalDeaths: 60,
        },
        {
          featureCode: "S08000031",
          name: "Greater Glasgow & Clyde",
          cases: [0, 0],
          deaths: [1, 11],
          totalCases: 24,
          totalDeaths: 40,
        },
        {
          featureCode: "S08000022",
          name: "Highland",
          cases: [0, 501],
          deaths: [1, 13],
          totalCases: 25,
          totalDeaths: 50,
        },
      ],
    };

    expect(parseCsvData(dailyHealthBoardWithScotlandCsvData)).toStrictEqual(
      expectedResult
    );
  });

  it("health boards (without Scotland)", () => {
    const expectedResult = {
      startDate: Date.parse("2020-03-01"),
      endDate: Date.parse("2020-03-09"),
      dates: [Date.parse("2020-03-01"), Date.parse("2020-03-08")],
      scotland: {
        featureCode: FEATURE_CODE_SCOTLAND,
        name: "Scotland",
        cases: [0, 519],
        deaths: [3, 39],
        totalCases: 75,
        totalDeaths: 150,
      },
      regions: [
        // In alphabetical order of area name
        {
          featureCode: "S08000020",
          name: "Grampian",
          cases: [0, 18],
          deaths: [1, 15],
          totalCases: 26,
          totalDeaths: 60,
        },
        {
          featureCode: "S08000031",
          name: "Greater Glasgow & Clyde",
          cases: [0, 0],
          deaths: [1, 11],
          totalCases: 24,
          totalDeaths: 40,
        },
        {
          featureCode: "S08000022",
          name: "Highland",
          cases: [0, 501],
          deaths: [1, 13],
          totalCases: 25,
          totalDeaths: 50,
        },
      ],
    };

    expect(parseCsvData(dailyHealthBoardWithoutScotlandCsvData)).toStrictEqual(
      expectedResult
    );
  });
});

test("getScotlandRegion", () => {
  const regions = [
    {
      featureCode: "S08000020",
      name: "Grampian",
      cases: [0, 18],
      deaths: [1, 15],
      totalCases: 26,
      totalDeaths: 60,
    },
    {
      featureCode: "S08000031",
      name: "Greater Glasgow & Clyde",
      cases: [0, 0],
      deaths: [1, 11],
      totalCases: 24,
      totalDeaths: 40,
    },
    {
      featureCode: "S08000022",
      name: "Highland",
      cases: [0, 501],
      deaths: [1, 13],
      totalCases: 25,
      totalDeaths: 50,
    },
  ];

  const expectedResult = {
    featureCode: FEATURE_CODE_SCOTLAND,
    name: "Scotland",
    cases: [0, 519],
    deaths: [3, 39],
    totalCases: 75,
    totalDeaths: 150,
  };

  expect(getScotlandRegion(regions)).toStrictEqual(expectedResult);
});

const parsedCouncilAreaDataset = {
  dates: [START_DATE, Date.parse("2020-03-08")],
  endDate: END_DATE,
  regions: [
    {
      cases: [0, 501],
      deaths: [1, 13],
      featureCode: "S12000035",
      name: "Argyll & Bute",
      totalCases: 25,
      totalDeaths: 50,
    },
    {
      cases: [0, 18],
      deaths: [1, 15],
      featureCode: "S12000019",
      name: "Midlothian",
      totalCases: 26,
      totalDeaths: 60,
    },
    {
      cases: [0, 0],
      deaths: [1, 11],
      featureCode: "S12000013",
      name: "Na h-Eileanan Siar",
      totalCases: 24,
      totalDeaths: 40,
    },
  ],
  scotland: {
    cases: [0, 519],
    deaths: [3, 39],
    featureCode: "S92000003",
    name: "Scotland",
    totalCases: 75,
    totalDeaths: 150,
  },
  startDate: START_DATE,
};

const parsedHealthBoardDataset = {
  dates: [START_DATE, Date.parse("2020-03-08")],
  endDate: END_DATE,
  regions: [
    {
      cases: [0, 18],
      deaths: [1, 15],
      featureCode: "S08000020",
      name: "Grampian",
      totalCases: 26,
      totalDeaths: 60,
    },
    {
      cases: [0, 0],
      deaths: [1, 11],
      featureCode: "S08000031",
      name: "Greater Glasgow & Clyde",
      totalCases: 24,
      totalDeaths: 40,
    },
    {
      cases: [0, 501],
      deaths: [1, 13],
      featureCode: "S08000022",
      name: "Highland",
      totalCases: 25,
      totalDeaths: 50,
    },
  ],
  scotland: {
    cases: [0, 108],
    deaths: [149, 149],
    featureCode: "S92000003",
    name: "Scotland",
    totalCases: 63,
    totalDeaths: 140,
  },
  startDate: START_DATE,
};

const parsedHealthBoardWithoutScotlandDataset = {
  ...parsedHealthBoardDataset,
  scotland: {
    cases: [0, 519],
    deaths: [3, 39],
    featureCode: "S92000003",
    name: "Scotland",
    totalCases: 75,
    totalDeaths: 150,
  },
};

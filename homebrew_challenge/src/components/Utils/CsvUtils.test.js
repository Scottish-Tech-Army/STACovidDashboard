import {
  readCsvData,
  createPlaceDateValuesMap,
  fetchAndStore,
  getPlaceNameByFeatureCode,
} from "../Utils/CsvUtils";
import { act } from "react-dom/test-utils";

beforeEach(() => {
  fetch.resetMocks();
});

const inputCsvData = `date,areaname,count
    2020-03-16,Orkney Islands,0
    2020-03-23,Glasgow City,7
    2020-03-23,Aberdeen City,0
    2020-03-30,Orkney Islands,0
    2020-03-30,Glasgow City,46
    2020-03-16,Glasgow City,1
    2020-03-16,Aberdeen City,1
    2020-03-23,Orkney Islands,0
    2020-03-30,Aberdeen City,2

    `;

const parsedCsvData = [
  ["2020-03-16", "Orkney Islands", "0"],
  ["2020-03-23", "Glasgow City", "7"],
  ["2020-03-23", "Aberdeen City", "0"],
  ["2020-03-30", "Orkney Islands", "0"],
  ["2020-03-30", "Glasgow City", "46"],
  ["2020-03-16", "Glasgow City", "1"],
  ["2020-03-16", "Aberdeen City", "1"],
  ["2020-03-23", "Orkney Islands", "0"],
  ["2020-03-30", "Aberdeen City", "2"],
];

test("readCsvData", () => {
  expect(readCsvData(inputCsvData)).toStrictEqual(parsedCsvData);
});

test("fetchAndStore when fetch fails", async () => {
  fetch.mockReject(new Error("fetch failed"));
  global.suppressConsoleErrorLogs();
  var processedResult = null;

  await act(async () => {
    await fetchAndStore(
      "test query",
      readCsvData,
      (val) => (processedResult = parsedCsvData)
    );
  });

  expect(processedResult).toBeNull();
  expect(fetch.mock.calls).toHaveLength(1);
});

test("fetchAndStore when fetch succeeds", async () => {
  fetch.mockResponse(inputCsvData);
  var processedResult = null;

  await act(async () => {
    await fetchAndStore(
      "test query",
      readCsvData,
      (val) => (processedResult = parsedCsvData)
    );
  });

  expect(processedResult).toStrictEqual(parsedCsvData);
  expect(fetch.mock.calls).toHaveLength(1);
});

test("getPlaceNameByFeatureCode", async () => {
  // Health board
  expect(getPlaceNameByFeatureCode("S08000031")).toStrictEqual(
    "Greater Glasgow & Clyde"
  );
  expect(getPlaceNameByFeatureCode("S08000017")).toStrictEqual("Dumfries & Galloway");
  // Council area
  expect(getPlaceNameByFeatureCode("S12000040")).toStrictEqual("West Lothian");
  expect(getPlaceNameByFeatureCode("S12000013")).toStrictEqual("Na h-Eileanan Siar");
  // Country
  expect(getPlaceNameByFeatureCode("S92000003")).toStrictEqual("Scotland");
  expect(() => getPlaceNameByFeatureCode("S12345678")).toThrow(
    "Unknown feature code: S12345678"
  );
  expect(() => getPlaceNameByFeatureCode("unknown")).toThrow(
    "Unknown feature code: unknown"
  );
  expect(() => getPlaceNameByFeatureCode("")).toThrow("Unknown feature code: ");
  expect(() => getPlaceNameByFeatureCode(null)).toThrow(
    "Unknown feature code: null"
  );
  expect(() => getPlaceNameByFeatureCode(undefined)).toThrow(
    "Unknown feature code: undefined"
  );
});

// Contains both health board and council area feature codes
const dailyNHSCsvData = `
20200306,S08000031,0,21,0,0,1,10,0,0,0
20200306,S08000022,1,22,0,0,2,20,0,0,0
20200306,S12000013,1,23,0,0,3,30,0,0,0
20200309,S08000031,0,24,0,0,4,40,0,0,0
20200309,S08000022,300,25,0,0,5,50,0,0,0
20200309,S12000013,-8,26,0,0,6,60,0,0,0
20200308,S08000031,0,27,0,0,7,70,0,0,0
20200308,S08000022,201,28,0,0,8,80,0,0,0
20200308,S12000013,26,29,0,0,9,90,0,0,0
20200307,S08000031,0,0,0,0,0,0,0,0,0
20200307,S08000022,-1,-21,0,0,-1,-10,0,0,0
20200307,S12000013,-1,-22,0,0,-2,-20,0,0,0
`;

describe("createPlaceDateValuesMap", () => {
  const dailyHealthBoardCsvLabels =
    "Date,HB,DailyPositive,CumulativePositive,CrudeRatePositive,CumulativePositivePercent,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,CumulativeNegative,CrudeRateNegative";
  const dailyCouncilAreaCsvLabels =
    "Date,CA,DailyPositive,CumulativePositive,CrudeRatePositive,CumulativePositivePercent,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,CumulativeNegative,CrudeRateNegative";

  const dailyHealthBoardCsvData = dailyHealthBoardCsvLabels + dailyNHSCsvData;
  const dailyCouncilAreaCsvData = dailyCouncilAreaCsvLabels + dailyNHSCsvData;

  const expectedPlaceDateValuesMap = {
    dates: [
      Date.parse("2020-03-06"),
      Date.parse("2020-03-07"),
      Date.parse("2020-03-08"),
      Date.parse("2020-03-09"),
    ],
    placeDateValuesMap: new Map()
      .set(
        "S08000022",
        new Map()
          .set(Date.parse("2020-03-06"), {
            cases: 1,
            deaths: 2,
            cumulativeDeaths: 20,
            cumulativeCases: 22,
          })
          .set(Date.parse("2020-03-07"), {
            cases: -1,
            deaths: -1,
            cumulativeDeaths: -10,
            cumulativeCases: -21,
          })
          .set(Date.parse("2020-03-08"), {
            cases: 201,
            deaths: 8,
            cumulativeDeaths: 80,
            cumulativeCases: 28,
          })
          .set(Date.parse("2020-03-09"), {
            cases: 300,
            deaths: 5,
            cumulativeDeaths: 50,
            cumulativeCases: 25,
          })
      )
      .set(
        "S08000031",
        new Map()
          .set(Date.parse("2020-03-06"), {
            cases: 0,
            deaths: 1,
            cumulativeDeaths: 10,
            cumulativeCases: 21,
          })
          .set(Date.parse("2020-03-07"), {
            cases: 0,
            deaths: 0,
            cumulativeDeaths: 0,
            cumulativeCases: 0,
          })
          .set(Date.parse("2020-03-08"), {
            cases: 0,
            deaths: 7,
            cumulativeDeaths: 70,
            cumulativeCases: 27,
          })
          .set(Date.parse("2020-03-09"), {
            cases: 0,
            deaths: 4,
            cumulativeDeaths: 40,
            cumulativeCases: 24,
          })
      )
      .set(
        "S12000013",
        new Map()
          .set(Date.parse("2020-03-06"), {
            cases: 1,
            deaths: 3,
            cumulativeDeaths: 30,
            cumulativeCases: 23,
          })
          .set(Date.parse("2020-03-07"), {
            cases: -1,
            deaths: -2,
            cumulativeDeaths: -20,
            cumulativeCases: -22,
          })
          .set(Date.parse("2020-03-08"), {
            cases: 26,
            deaths: 9,
            cumulativeDeaths: 90,
            cumulativeCases: 29,
          })
          .set(Date.parse("2020-03-09"), {
            cases: -8,
            deaths: 6,
            cumulativeDeaths: 60,
            cumulativeCases: 26,
          })
      ),
  };

  it("health boards", () => {
    const parsedDailyHealthBoardData = readCsvData(dailyHealthBoardCsvData);
    expect(createPlaceDateValuesMap(parsedDailyHealthBoardData)).toStrictEqual(
      expectedPlaceDateValuesMap
    );
  });

  it("council areas", () => {
    const parsedDailyCouncilAreaData = readCsvData(dailyCouncilAreaCsvData);
    expect(createPlaceDateValuesMap(parsedDailyCouncilAreaData)).toStrictEqual(
      expectedPlaceDateValuesMap
    );
  });
});

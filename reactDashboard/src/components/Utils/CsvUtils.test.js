import {
  readCsvData,
  createPlaceDateValuesMap,
  fetchAndStore,
  getPlaceNameByFeatureCode,
  getPhoneticPlaceNameByFeatureCode,
  parse7DayWindowCsvData,
  getRelativeReportedDate,
  getNhsCsvDataDateRange,
  calculatePopulationProportionMap,
  getPopulationMap,
} from "../Utils/CsvUtils";
import { act } from "react-dom/test-utils";

beforeEach(() => {
  fetch.resetMocks();
});

const inputCsvData = `

Date,CA,NewPositive,TotalCases
20200902,S12000005,0,204

20200903,S12000006,0,314
,S12000008,2,474
unknown,S12000013,0,7
20209999,S12000014,3,702
20200905,,0,289


20200902,unknown,3,240
20200906,S12000011,2,415


    `;

const parsedCsvData = [
  ["20200902", "S12000005", "0", "204"],
  ["20200903", "S12000006", "0", "314"],
  ["20200906", "S12000011", "2", "415"],
];

test("readCsvData", () => {
  global.suppressConsoleWarnLogs();
  expect(readCsvData(inputCsvData)).toStrictEqual(parsedCsvData);
});

test("fetchAndStore when fetch fails", async () => {
  fetch.mockReject(new Error("fetch failed"));
  global.suppressConsoleErrorLogs();
  var processedResult = null;

  await act(async () => {
    await fetchAndStore(
      "test query",
      (val) => (processedResult = "something not null"),
      readCsvData
    );
  });

  expect(processedResult).toBeNull();
  expect(fetch.mock.calls).toHaveLength(1);
});

test("fetchAndStore when fetch succeeds", async () => {
  fetch.mockResponse(inputCsvData);
  global.suppressConsoleWarnLogs();
  var processedResult = null;

  await act(async () => {
    await fetchAndStore(
      "test query",
      (val) => (processedResult = val),
      readCsvData
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
  expect(getPlaceNameByFeatureCode("S08000017")).toStrictEqual(
    "Dumfries & Galloway"
  );
  // Council area
  expect(getPlaceNameByFeatureCode("S12000040")).toStrictEqual("West Lothian");
  expect(getPlaceNameByFeatureCode("S12000013")).toStrictEqual(
    "Na h-Eileanan Siar"
  );
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

test("getPhoneticPlaceNameByFeatureCode", async () => {
  // Health board
  expect(getPhoneticPlaceNameByFeatureCode("S08000031")).toStrictEqual(
    "Greater Glasgow & Clyde"
  );
  expect(getPhoneticPlaceNameByFeatureCode("S08000017")).toStrictEqual(
    "Dumfries & Galloway"
  );
  // Council area
  expect(getPhoneticPlaceNameByFeatureCode("S12000040")).toStrictEqual(
    "West Lothian"
  );
  expect(getPhoneticPlaceNameByFeatureCode("S12000013")).toStrictEqual(
    "Nahelen an sheer"
  );
  // Country
  expect(getPhoneticPlaceNameByFeatureCode("S92000003")).toStrictEqual(
    "Scotland"
  );
  expect(() => getPhoneticPlaceNameByFeatureCode("S12345678")).toThrow(
    "Unknown feature code: S12345678"
  );
  expect(() => getPhoneticPlaceNameByFeatureCode("unknown")).toThrow(
    "Unknown feature code: unknown"
  );
  expect(() => getPhoneticPlaceNameByFeatureCode("")).toThrow(
    "Unknown feature code: "
  );
  expect(() => getPhoneticPlaceNameByFeatureCode(null)).toThrow(
    "Unknown feature code: null"
  );
  expect(() => getPhoneticPlaceNameByFeatureCode(undefined)).toThrow(
    "Unknown feature code: undefined"
  );
});

// Contains both health board and council area feature codes
const dailyNHSCsvData = `
20200306,S08000031,place 1,0,21,0.21,1,10,0,31,0,0,0,0,0.1
20200306,S08000022,place 2,1,22,0.22,2,20,0,32,0,0,0,0,1.1
20200306,S12000013,place 3,1,23,0.23,3,30,0,33,0,0,0,0,2.1
20200306,S92000003,Scotland,1,23,0.23,3,30,0,33,0,0,0,0,3.1
20200309,S08000031,place 1,0,24,0.24,4,40,0,34,0,0,0,0,4.1
20200309,S08000022,place 2,300,25,0.25,5,50,0,35,0,0,0,0,5.1
20200309,S12000013,place 3,-8,26,0.26,6,60,0,36,0,0,0,0,6.1
20200309,S92000003,Scotland,-8,26,0.26,6,60,0,36,0,0,0,0,7.1
20200308,S08000031,place 1,0,27,0.27,7,70,0,37,0,0,0,0,8.1
20200308,S08000022,place 2,201,28,0.28,8,80,0,38,0,0,0,0,9.1
20200308,S12000013,place 3,26,29,0.29,9,90,0,39,0,0,0,0,10.1
20200308,S92000003,Scotland,26,29,0.29,9,90,0,39,0,0,0,0,11.1
20200307,S08000031,place 1,0,0,0,0,0,0,0,0,0,0,0,0
20200307,S08000022,place 2,-1,-21,-0.21,-1,-10,0,-31,0,0,0,0,12.1
20200307,S12000013,place 3,-1,-22,-0.22,-2,-20,0,-32,0,0,0,0,13.1
20200307,S92000003,Scotland,-1,-22,-0.22,-2,-20,0,-32,0,0,0,0,14.1
`;

const dailyHealthBoardCsvLabels =
  "Date,HB,HBName,DailyPositive,CumulativePositive,CrudeRatePositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,TotalPillar1,TotalPillar2,HospitalAdmissions,HospitalAdmissionsQF,ICUAdmissions,ICUAdmissionsQF";

const dailyCouncilAreaCsvLabels =
  "Date,CA,CAName,DailyPositive,CumulativePositive,CrudeRatePositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,TotalPillar1,TotalPillar2";

const dailyHealthBoardCsvData = dailyHealthBoardCsvLabels + dailyNHSCsvData;
const dailyCouncilAreaCsvData = dailyCouncilAreaCsvLabels + dailyNHSCsvData;

describe("createPlaceDateValuesMap", () => {
  const expectedPlaceDateValuesMap = {
    dates: [
      Date.parse("2020-03-06"),
      Date.parse("2020-03-07"),
      Date.parse("2020-03-08"),
      Date.parse("2020-03-09"),
    ],
    placeDateValuesMap: new Map()
      .set(
        "S08000031",
        new Map()
          .set(Date.parse("2020-03-06"), {
            cases: 0,
            deaths: 1,
            cumulativeDeaths: 10,
            cumulativeCases: 21,
            crudeRatePositive: 0.21,
            positivePercentage: 0.1,
          })
          .set(Date.parse("2020-03-07"), {
            cases: 0,
            deaths: 0,
            cumulativeDeaths: 0,
            cumulativeCases: 0,
            crudeRatePositive: 0,
            positivePercentage: 0,
          })
          .set(Date.parse("2020-03-08"), {
            cases: 0,
            deaths: 7,
            cumulativeDeaths: 70,
            cumulativeCases: 27,
            crudeRatePositive: 0.27,
            positivePercentage: 8.1,
          })
          .set(Date.parse("2020-03-09"), {
            cases: 0,
            deaths: 4,
            cumulativeDeaths: 40,
            cumulativeCases: 24,
            crudeRatePositive: 0.24,
            positivePercentage: 4.1,
          })
      )
      .set(
        "S08000022",
        new Map()
          .set(Date.parse("2020-03-06"), {
            cases: 1,
            deaths: 2,
            cumulativeDeaths: 20,
            cumulativeCases: 22,
            crudeRatePositive: 0.22,
            positivePercentage: 1.1,
          })
          .set(Date.parse("2020-03-07"), {
            cases: -1,
            deaths: -1,
            cumulativeDeaths: -10,
            cumulativeCases: -21,
            crudeRatePositive: -0.21,
            positivePercentage: 12.1,
          })
          .set(Date.parse("2020-03-08"), {
            cases: 201,
            deaths: 8,
            cumulativeDeaths: 80,
            cumulativeCases: 28,
            crudeRatePositive: 0.28,
            positivePercentage: 9.1,
          })
          .set(Date.parse("2020-03-09"), {
            cases: 300,
            deaths: 5,
            cumulativeDeaths: 50,
            cumulativeCases: 25,
            crudeRatePositive: 0.25,
            positivePercentage: 5.1,
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
            crudeRatePositive: 0.23,
            positivePercentage: 2.1,
          })
          .set(Date.parse("2020-03-07"), {
            cases: -1,
            deaths: -2,
            cumulativeDeaths: -20,
            cumulativeCases: -22,
            crudeRatePositive: -0.22,
            positivePercentage: 13.1,
          })
          .set(Date.parse("2020-03-08"), {
            cases: 26,
            deaths: 9,
            cumulativeDeaths: 90,
            cumulativeCases: 29,
            crudeRatePositive: 0.29,
            positivePercentage: 10.1,
          })
          .set(Date.parse("2020-03-09"), {
            cases: -8,
            deaths: 6,
            cumulativeDeaths: 60,
            cumulativeCases: 26,
            crudeRatePositive: 0.26,
            positivePercentage: 6.1,
          })
      )
      .set(
        "S92000003",
        new Map()
          .set(Date.parse("2020-03-06"), {
            cases: 1,
            deaths: 3,
            cumulativeDeaths: 30,
            cumulativeCases: 23,
            crudeRatePositive: 0.23,
            positivePercentage: 3.1,
          })
          .set(Date.parse("2020-03-07"), {
            cases: -1,
            deaths: -2,
            cumulativeDeaths: -20,
            cumulativeCases: -22,
            crudeRatePositive: -0.22,
            positivePercentage: 14.1,
          })
          .set(Date.parse("2020-03-08"), {
            cases: 26,
            deaths: 9,
            cumulativeDeaths: 90,
            cumulativeCases: 29,
            crudeRatePositive: 0.29,
            positivePercentage: 11.1,
          })
          .set(Date.parse("2020-03-09"), {
            cases: -8,
            deaths: 6,
            cumulativeDeaths: 60,
            cumulativeCases: 26,
            crudeRatePositive: 0.26,
            positivePercentage: 7.1,
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

test("getRelativeReportedDate", () => {
  // Set today to be 2020-06-22
  setMockDate("2020-06-22");

  expect(getRelativeReportedDate(Date.parse("2020-06-22"))).toBe(
    "reported today"
  );
  expect(getRelativeReportedDate(Date.parse("2020-06-21"))).toBe(
    "reported yesterday"
  );
  expect(getRelativeReportedDate(Date.parse("2020-06-20"))).toBe(
    "reported last Saturday"
  );
  expect(getRelativeReportedDate(Date.parse("2020-06-19"))).toBe(
    "reported last Friday"
  );
  expect(getRelativeReportedDate(Date.parse("2020-06-18"))).toBe(
    "reported last Thursday"
  );
  expect(getRelativeReportedDate(Date.parse("2020-06-17"))).toBe(
    "reported last Wednesday"
  );
  expect(getRelativeReportedDate(Date.parse("2020-06-16"))).toBe(
    "reported last Tuesday"
  );
  expect(getRelativeReportedDate(Date.parse("2020-06-15"))).toBe(
    "reported on 15 June, 2020"
  );
  expect(getRelativeReportedDate(undefined)).toBeUndefined();
  expect(getRelativeReportedDate(null)).toBeUndefined();
});

const dailyCasesCsvData = `
  Date,HB,HBName,DailyPositive,CumulativePositive,CrudeRatePositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,CumulativeNegative,CrudeRateNegative
  20200309,S08000020,unknown,-8,0,0,-2,0,0,28,7.58068009529998
  20200308,S08000020,unknown,26,0,0,0,0,0,28,7.58068009529998
  20200307,S08000020,unknown,-1,0,0,-1,0,0,28,7.58068009529998
  20200306,S08000020,unknown,1,0,0,1,0,0,28,7.58068009529998
  20200305,S08000020,unknown,1,0,0,1,0,0,28,7.58068009529998
  20200304,S08000020,unknown,1,0,0,1,0,0,28,7.58068009529998
  20200303,S08000020,unknown,1,0,0,1,0,0,28,7.58068009529998
  20200302,S08000020,unknown,-6,0,0,-2,0,0,28,7.58068009529998
  20200301,S08000020,unknown,1,0,0,1,0,0,28,7.58068009529998
  20200229,S08000020,unknown,1,0,0,1,0,0,28,7.58068009529998
  20200308,S08000031,unknown,0,0,0,11,0,0,26,22.5088736905896
  20200307,S08000031,unknown,400,0,0,10,0,0,26,22.5088736905896
  20200306,S08000031,unknown,300,0,0,9,0,0,26,22.5088736905896
  20200305,S08000031,unknown,200,0,0,8,0,0,26,22.5088736905896
  20200304,S08000031,unknown,100,0,0,7,0,0,26,22.5088736905896
  20200303,S08000031,unknown,50,0,0,6,0,0,26,22.5088736905896
  20200226,S08000031,unknown,20,0,0,5,0,0,26,22.5088736905896
  20200225,S08000031,unknown,0,0,0,4,0,0,26,22.5088736905896
  20200224,S08000031,unknown,10,0,0,3,0,0,26,22.5088736905896
  20200309,S08000022,unknown,300,0,0,10,0,0,21,14.1072148327287
  20200308,S08000022,unknown,201,0,0,9,0,0,21,14.1072148327287
  20200306,S08000022,unknown,1,0,0,8,0,0,21,14.1072148327287
  20200307,S08000022,unknown,-1,0,0,7,0,0,21,14.1072148327287
    `;

describe("getNhsCsvDataDateRange", () => {
  const parsedDailyHealthBoardData = readCsvData(dailyHealthBoardCsvData);
  const parsedDailyCouncilAreaData = readCsvData(
    dailyCouncilAreaCsvData +
      `
  20200408,S08000031,place 1,0,27,0.27,0,7,70,0,37,0
  `
  );

  it("health board and council area", () => {
    expect(
      getNhsCsvDataDateRange(
        parsedDailyHealthBoardData,
        parsedDailyCouncilAreaData
      )
    ).toStrictEqual({
      startDate: Date.parse("2020-03-06"),
      endDate: Date.parse("2020-04-08"),
    });
  });

  it("health board", () => {
    expect(getNhsCsvDataDateRange(parsedDailyHealthBoardData)).toStrictEqual({
      startDate: Date.parse("2020-03-06"),
      endDate: Date.parse("2020-03-09"),
    });
  });
});

test("parse7DayWindowCsvData", () => {
  // Grampian : 09/03 - 03/03 : 7 days of data
  // Glasgow : 08/03 - 03/03 : 6 days of data
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
      fromDate: Date.parse("2020-03-03"),
      toDate: Date.parse("2020-03-09"),
    })
    .set("S08000022", {
      cases: 501,
      deaths: 34,
      name: "Highland",
      fromDate: Date.parse("2020-03-03"),
      toDate: Date.parse("2020-03-09"),
    })
    .set("S92000003", {
      cases: 1572,
      deaths: 86,
      name: "Scotland",
      fromDate: Date.parse("2020-03-03"),
      toDate: Date.parse("2020-03-09"),
    });

  expect(parse7DayWindowCsvData(readCsvData(dailyCasesCsvData))).toStrictEqual(
    expectedResult
  );
});

test("getPopulationMap", () => {
  const nhsCsvData = `Date,HB,HBName,DailyPositive,CumulativePositive,CrudeRatePositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,CumulativeNegative,CrudeRateNegative
    20200302,S08000031,unknown,1,2,2,5,6,7,8,9
    20200302,S08000022,unknown,11,12,6,15,16,17,18,19
    20200302,S12000013,unknown,21,22,4.4,25,26,27,28,29
    20200302,S92000003,Scotland,33,36,4.133333333333334,45,48,17,54,19
    20200303,S08000031,unknown,31,32,32,35,36,37,38,39
    20200303,S08000022,unknown,41,42,21,45,46,47,48,49
    20200303,S12000013,unknown,51,52,10.4,55,56,57,58,59
    20200303,S92000003,Scotland,123,126,21.133333333333333,135,138,47,144,49
    20200304,S08000031,unknown,61,62,62,65,66,67,68,69
    20200304,S08000022,unknown,71,72,36,75,76,77,78,79
    20200304,S12000013,unknown,81,82,16.4,85,86,87,88,89
    20200304,S92000003,Scotland,213,216,38.13333333333333,225,228,77,234,79
    20200305,S08000031,unknown,91,92,92,95,96,97,98,99
    20200305,S08000022,unknown,101,102,51,105,106,107,108,109
    20200305,S12000013,unknown,111,112,22.4,115,116,117,118,119
    20200305,S92000003,Scotland,303,306,55.13333333333333,315,318,107,324,109
    20200306,S08000031,unknown,121,122,122,125,126,127,128,129
    20200306,S08000022,unknown,131,132,66,135,136,137,138,139
    20200306,S12000013,unknown,141,142,28.4,145,146,147,148,149
    20200306,S92000003,Scotland,393,396,72.13333333333334,405,408,137,414,139
    20200307,S08000031,unknown,151,152,152,155,156,157,158,159
    20200307,S08000022,unknown,161,162,81,165,166,167,168,169
    20200307,S12000013,unknown,171,172,34.4,175,176,177,178,179
    20200307,S92000003,Scotland,483,486,89.13333333333333,495,498,167,504,169
    20200308,S08000031,unknown,181,182,182,185,186,187,188,189
    20200308,S08000022,unknown,191,192,96,195,196,197,198,199
    20200308,S12000013,unknown,201,202,40.4,205,206,207,208,209
    20200308,S92000003,Scotland,573,576,106.13333333333333,585,588,197,594,199
    20200309,S08000031,unknown,211,212,212,215,216,217,218,219
    20200309,S08000022,unknown,221,222,111,225,226,227,228,229
    20200309,S12000013,unknown,231,232,46.4,235,236,237,238,239
    20200309,S92000003,Scotland,663,888,111,675,678,227,684,229
    `;

  const healthBoardDataset = readCsvData(nhsCsvData);

  const expectedResult = new Map()
    .set("S08000031", 100000)
    .set("S08000022", 200000)
    .set("S12000013", 500000)
    .set("S92000003", 800000);

  expect(
    getPopulationMap(createPlaceDateValuesMap(healthBoardDataset))
  ).toStrictEqual(expectedResult);
});

describe("calculatePopulationProportionMap", () => {
  it("empty populationMap", () => {
    expect(calculatePopulationProportionMap(new Map())).toStrictEqual(
      new Map()
    );
  });

  it("without Scotland", () => {
    const populationMap = new Map()
      .set("S08000031", 100000)
      .set("S08000022", 200000)
      .set("S12000013", 500000);

    expect(calculatePopulationProportionMap(populationMap)).toStrictEqual(
      new Map()
    );
  });

  it("with Scotland", () => {
    const populationMap = new Map()
      .set("S08000031", 100000)
      .set("S08000022", 200000)
      .set("S12000013", 500000)
      .set("S92000003", 800000);

    const expectedResult = new Map()
      .set("S08000031", 0.125)
      .set("S08000022", 0.25)
      .set("S12000013", 0.625)
      .set("S92000003", 1);

    expect(calculatePopulationProportionMap(populationMap)).toStrictEqual(
      expectedResult
    );
  });
});

function setMockDate(date) {
  jest
    .spyOn(global.Date, "now")
    .mockImplementation(() => Date.parse(date).valueOf());
}

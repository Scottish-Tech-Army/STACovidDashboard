import { readCsvData, createJsonData } from "./dataProcessingUtils";

jest.mock("./featureCodes", () => {
  return {
    ...jest.requireActual("./featureCodes"),
    getAllFeatureCodes: jest
      .fn()
      .mockReturnValue([
        "S92000003",
        "S12000013",
        "S12000049",
        "S08000024",
        "S08000025",
      ]),
  };
});

beforeAll(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("readCsvData", () => {
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
    ["", "S12000008", "2", "474"],
    ["unknown", "S12000013", "0", "7"],
    ["20209999", "S12000014", "3", "702"],
    ["20200905", "", "0", "289"],
    ["20200902", "unknown", "3", "240"],
    ["20200906", "S12000011", "2", "415"],
  ];

  it("success", () => {
    expect(
      readCsvData(inputCsvData, ["ca", "Date", "Newpositive"])
    ).toStrictEqual({
      columnIndices: {
        Date: 0,
        ca: 1,
        Newpositive: 2,
      },
      lines: parsedCsvData,
    });
  });

  it("missing column", () => {
    expect(() => readCsvData(inputCsvData, ["unknown column"])).toThrow(
      "Required column missing: unknown column"
    );
  });
});

describe("createJsonData", () => {
  it("all data", () => {
    expect(
      createJsonData(
        dailyCouncilAreasCsvData,
        dailyHealthBoardsCsvData,
        currentTotalsCouncilAreasCsvData,
        currentTotalsHealthBoardsCsvData
      )
    ).toStrictEqual(testAllData);
  });

  it("input data missing", () => {
    expect(
      createJsonData(
        dailyCouncilAreasCsvData,
        null,
        currentTotalsCouncilAreasCsvData,
        currentTotalsHealthBoardsCsvData
      )
    ).toBeNull();
  });

  it("input data undefined", () => {
    expect(createJsonData()).toBeNull();
  });
});

const TOTALS_DATE = Date.parse("2021-01-21");

// prettier-ignore
const testAllData = {
  regions: {
    S12000013: {
      weeklyCases: 50,
      weeklyDeaths: 0,
      name: "Na h-Eileanan Siar",
      dailyCases: { date: TOTALS_DATE, value: 5 },
      dailyDeaths: { date: TOTALS_DATE, value: 0 },
      crudeRatePositive: 617.51,
      cumulativeCases: { date: TOTALS_DATE, value: 165 },
      cumulativeDeaths: { date: TOTALS_DATE, value: 1 },
      fatalityCaseRatio: "0.6%",
      population: 26720.215057246038,
      populationProportion: 0.004890848815896522,
      weeklySeries: { cases: [7, 44, 7], deaths: [0, 0, 0] },
      dailySeries: {
        dailyCases: [0, 1, 3, 1, 0, 0, 2, 1, 0, 9, 15, 2, 13, 4, 2, 5],
        dailyDeaths: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        totalCases: [107, 108, 111, 112, 112, 112, 114, 115, 115, 124, 139, 141, 154, 158, 160, 165],
        totalDeaths: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      },
    },
    S12000049: {
      weeklyCases: 1770,
      weeklyDeaths: 28,
      name: "Glasgow City",
      dailyCases: { date: TOTALS_DATE, value: 242 },
      dailyDeaths: { date: TOTALS_DATE, value: 8 },
      crudeRatePositive: 4956.72,
      cumulativeCases: { date: TOTALS_DATE, value: 31382 },
      cumulativeDeaths: { date: TOTALS_DATE, value: 856 },
      fatalityCaseRatio: "2.7%",
      population: 633120.2892235187,
      populationProportion: 0.1158858792953164,
      weeklySeries: { cases: [2514, 1963, 513], deaths: [30, 35, 4] },
      dailySeries: {
        dailyCases: [360, 489, 414, 325, 337, 295, 294, 375, 331, 280, 253, 307, 222, 195, 271, 242],
        dailyDeaths: [4, 2, 2, 6, 7, 3, 6, 4, 7, 9, 5, 2, 6, 2, 4, 0],
        totalCases: [26752, 27241, 27655, 27980, 28317, 28612, 28906, 29281, 29612, 29892, 30145, 30452, 30674, 30869, 31140, 31382],
        totalDeaths: [791, 793, 795, 801, 808, 811, 817, 821, 828, 837, 842, 844, 850, 852, 856, 856],
      },
    },
    S08000024: {
      weeklyCases: 1115,
      weeklyDeaths: 25,
      name: "Lothian",
      dailyCases: { date: TOTALS_DATE, value: 166 },
      dailyDeaths: { date: TOTALS_DATE, value: 10 },
      crudeRatePositive: 2536.42,
      cumulativeCases: { date: TOTALS_DATE, value: 23020 },
      cumulativeDeaths: { date: TOTALS_DATE, value: 863 },
      fatalityCaseRatio: "3.7%",
      population: 907578.3978994014,
      populationProportion: 0.16612249277147267,
      weeklySeries: { cases: [1642, 1206, 340], deaths: [33, 39, 2] },
      dailySeries: {
        dailyCases: [254, 364, 295, 270, 147, 165, 147, 207, 224, 204, 160, 136, 134, 141, 174, 166],
        dailyDeaths: [7, 6, 4, 4, 6, 3, 3, 8, 8, 4, 3, 6, 6, 4, 2, 0],
        totalCases: [20086, 20450, 20745, 21015, 21162, 21327, 21474, 21681, 21905, 22109, 22269, 22405, 22539, 22680, 22854, 23020],
        totalDeaths: [796, 802, 806, 810, 816, 819, 822, 830, 838, 842, 845, 851, 857, 861, 863, 863],
      },
    },
    S08000025: {
      weeklyCases: 8,
      weeklyDeaths: 0,
      name: "Orkney",
      dailyCases: { date: TOTALS_DATE, value: 0 },
      dailyDeaths: { date: TOTALS_DATE, value: 0 },
      crudeRatePositive: 237.99,
      cumulativeCases: { date: TOTALS_DATE, value: 53 },
      cumulativeDeaths: { date: TOTALS_DATE, value: 2 },
      fatalityCaseRatio: "3.8%",
      population: 22269.843270725658,
      populationProportion: 0.004076255986618379,
      weeklySeries: { cases: [5, 7, 1], deaths: [0, 0, 0] },
      dailySeries: {
        dailyCases: [0, 1, 0, 1, 3, 0, 0, 0, 0, 0, 1, 2, 0, 4, 1, 0],
        dailyDeaths: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        totalCases: [40, 41, 41, 42, 45, 45, 45, 45, 45, 45, 46, 48, 48, 52, 53, 53],
        totalDeaths: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      },
    },
    S92000003: {
      weeklyCases: 10368,
      weeklyDeaths: 290,
      name: "Scotland",
      dailyCases: { date: TOTALS_DATE, value: 1406 },
      dailyDeaths: { date: TOTALS_DATE, value: 89 },
      crudeRatePositive: 3069.77,
      cumulativeCases: { date: TOTALS_DATE, value: 167711 },
      cumulativeDeaths: { date: TOTALS_DATE, value: 5557 },
      fatalityCaseRatio: "3.3%",
      population: 5463308.326030941,
      populationProportion: 1,
      weeklySeries: {
        cases: [14979, 11343, 3119],
        deaths: [298, 331, 55],
      },
      dailySeries: {
        dailyCases: [ 2385, 3061, 2560, 2205, 1839, 1497, 1432, 2107, 1987, 1709, 1625, 1549, 1171, 1195, 1713, 1406 ],
        dailyDeaths: [ 35, 37, 48, 44, 41, 35, 58, 47, 49, 49, 51, 48, 59, 28, 37, 18 ],
        totalCases: [ 140655, 143716, 146276, 148481, 150320, 151817, 153249, 155356, 157343, 159052, 160677, 162226, 163397, 164592, 166305, 167711 ],
        totalDeaths: [ 4906, 4943, 4991, 5035, 5076, 5111, 5169, 5216, 5265, 5314, 5365, 5413, 5472, 5500, 5537, 5555 ],
      },
    },
  },
  dates: [
    Date.parse("2021-01-04"),
    Date.parse("2021-01-05"),
    Date.parse("2021-01-06"),
    Date.parse("2021-01-07"),
    Date.parse("2021-01-08"),
    Date.parse("2021-01-09"),
    Date.parse("2021-01-10"),
    Date.parse("2021-01-11"),
    Date.parse("2021-01-12"),
    Date.parse("2021-01-13"),
    Date.parse("2021-01-14"),
    Date.parse("2021-01-15"),
    Date.parse("2021-01-16"),
    Date.parse("2021-01-17"),
    Date.parse("2021-01-18"),
    Date.parse("2021-01-19"),
  ],
  weekStartDates: [Date.parse("2021-01-04"), Date.parse("2021-01-11"), Date.parse("2021-01-18")],
  startDate: Date.parse("2021-01-04"),
  endDate: Date.parse("2021-01-19"),
  currentWeekStartDate: Date.parse("2021-01-13"),
};

describe("createJsonData handle bad data", () => {
  it("all data", () => {
    expect(
      createJsonData(
        shortDailyCouncilAreasCsvData,
        shortDailyHealthBoardsCsvData,
        currentTotalsCouncilAreasCsvData,
        currentTotalsHealthBoardsCsvData
      )
    ).toStrictEqual(shortAllData);
  });

  it("HB daily contains additional region", () => {
    expect(
      createJsonData(
        shortDailyCouncilAreasCsvData,
        `
Date,HB,HBName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,DailyNegative,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,PositivePercentage7Day,TotalPillar1,TotalPillar2,HospitalAdmissions,HospitalAdmissionsQF,ICUAdmissions,ICUAdmissionsQF
20210117,S08000024,NHS Lothian,141,22680,2498.95,0,4,861,0,0,0,0,0,0,9.47,0,0,0,0,0,0,0
20210117,S08000025,NHS Orkney,4,52,233.50,0,0,2,0,0,0,0,0,0,12.12,0,0,0,0,0,0,0
20210117,S92000003,Scotland,1195,164592,3012.68,0,28,5500,0,0,0,0,0,0,12.88,0,0,0,0,0,0,0
20210117,,Golden Jubilee National Hospital,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20210118,S08000024,NHS Lothian,174,22854,2518.13,0,2,863,0,0,0,0,0,0,5.07,0,0,0,0,0,0,0
20210118,S08000025,NHS Orkney,1,53,237.99,0,0,2,0,0,0,0,0,0,0.81,0,0,0,0,0,0,0
20210118,S92000003,Scotland,1713,166305,3044.04,0,37,5537,0,0,0,0,0,0,7.67,0,0,0,0,0,0,0
20210118,,Golden Jubilee National Hospital,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20210119,S08000024,NHS Lothian,166,23020,2536.42,0,0,863,0,0,0,0,0,0,5.91,0,0,0,0,0,0,0
20210119,S08000025,NHS Orkney,0,53,237.99,0,0,2,0,0,0,0,0,0,0.00,0,0,0,0,0,0,0
20210119,S92000003,Scotland,1406,167711,3069.77,0,18,5555,0,0,0,0,0,0,6.84,0,0,0,0,0,0,0
20210119,,Golden Jubilee National Hospital,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
`,
        currentTotalsCouncilAreasCsvData,
        currentTotalsHealthBoardsCsvData
      )
    ).toStrictEqual(shortAllData);
  });

  it("daily CA row missing", () => {
    expect(
      createJsonData(
        `Date,CA,CAName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,DailyNegative,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,PositivePercentage7Day,TotalPillar1,TotalPillar2
        20210118,S12000013,Na h-Eileanan Siar,2,160,598.80,0,0,1,0,0,0,0,0,0,1.72,0,0,0
        20210119,S12000013,Na h-Eileanan Siar,5,165,617.51,0,0,1,0,0,0,0,0,0,3.21,0,0,0
        20210117,S12000049,Glasgow City,195,30869,4875.69,0,2,852,0,0,0,0,0,0,15.72,0,0,0
        20210118,S12000049,Glasgow City,271,31140,4918.50,0,4,856,0,0,0,0,0,0,10.76,0,0,0
        20210119,S12000049,Glasgow City,242,31382,4956.72,0,0,856,0,0,0,0,0,0,11.37,0,0,0`,
        shortDailyHealthBoardsCsvData,
        currentTotalsCouncilAreasCsvData,
        currentTotalsHealthBoardsCsvData
      )
    ).toStrictEqual({
      ...shortAllData,
      regions: {
        ...shortAllData.regions,
        S12000013: {
          ...shortAllData.regions.S12000013,
          weeklyCases: 7,
          weeklySeries: { cases: [7], deaths: [0] },
          dailySeries: {
            dailyCases: [0, 2, 5],
            dailyDeaths: [0, 0, 0],
            totalCases: [0, 160, 165],
            totalDeaths: [0, 1, 1],
          },
        },
      },
    });
  });

  it("daily HB row missing", () => {
    expect(
      createJsonData(
        shortDailyCouncilAreasCsvData,
        `Date,HB,HBName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,DailyNegative,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,PositivePercentage7Day,TotalPillar1,TotalPillar2,HospitalAdmissions,HospitalAdmissionsQF,ICUAdmissions,ICUAdmissionsQF
        20210117,S08000024,NHS Lothian,141,22680,2498.95,0,4,861,0,0,0,0,0,0,9.47,0,0,0,0,0,0,0
        20210117,S08000025,NHS Orkney,4,52,233.50,0,0,2,0,0,0,0,0,0,12.12,0,0,0,0,0,0,0
        20210117,S92000003,Scotland,1195,164592,3012.68,0,28,5500,0,0,0,0,0,0,12.88,0,0,0,0,0,0,0
        20210118,S08000025,NHS Orkney,1,53,237.99,0,0,2,0,0,0,0,0,0,0.81,0,0,0,0,0,0,0
        20210118,S92000003,Scotland,1713,166305,3044.04,0,37,5537,0,0,0,0,0,0,7.67,0,0,0,0,0,0,0
        20210119,S08000024,NHS Lothian,166,23020,2536.42,0,0,863,0,0,0,0,0,0,5.91,0,0,0,0,0,0,0
        20210119,S08000025,NHS Orkney,0,53,237.99,0,0,2,0,0,0,0,0,0,0.00,0,0,0,0,0,0,0
        20210119,S92000003,Scotland,1406,167711,3069.77,0,18,5555,0,0,0,0,0,0,6.84,0,0,0,0,0,0,0`,
        currentTotalsCouncilAreasCsvData,
        currentTotalsHealthBoardsCsvData
      )
    ).toStrictEqual({
      ...shortAllData,
      regions: {
        ...shortAllData.regions,
        S08000024: {
          ...shortAllData.regions.S08000024,
          weeklyCases: 307,
          weeklyDeaths: 4,
          weeklySeries: { cases: [307], deaths: [4] },
          dailySeries: {
            dailyCases: [141, 0, 166],
            dailyDeaths: [4, 0, 0],
            totalCases: [22680, 0, 23020],
            totalDeaths: [861, 0, 863],
          },
        },
      },
    });
  });

  it("daily CA columns out of order", () => {
    expect(
      createJsonData(
        `CAName,Date,CA,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,DailyNegative,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,PositivePercentage7Day,TotalPillar1,TotalPillar2
          Na h-Eileanan Siar,20210117,S12000013,4,158,591.32,0,0,1,0,0,0,0,0,0,5.26,0,0,0
          Na h-Eileanan Siar,20210118,S12000013,2,160,598.80,0,0,1,0,0,0,0,0,0,1.72,0,0,0
          Na h-Eileanan Siar,20210119,S12000013,5,165,617.51,0,0,1,0,0,0,0,0,0,3.21,0,0,0
          Glasgow City,20210117,S12000049,195,30869,4875.69,0,2,852,0,0,0,0,0,0,15.72,0,0,0
          Glasgow City,20210118,S12000049,271,31140,4918.50,0,4,856,0,0,0,0,0,0,10.76,0,0,0
          Glasgow City,20210119,S12000049,242,31382,4956.72,0,0,856,0,0,0,0,0,0,11.37,0,0,0`,
        shortDailyHealthBoardsCsvData,
        currentTotalsCouncilAreasCsvData,
        currentTotalsHealthBoardsCsvData
      )
    ).toStrictEqual(shortAllData);
  });

  it("daily HB columns out of order", () => {
    expect(
      createJsonData(
        shortDailyCouncilAreasCsvData,
        `DailyPositive,CumulativePositive,Date,HB,HBName,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,DailyNegative,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,PositivePercentage7Day,TotalPillar1,TotalPillar2,HospitalAdmissions,HospitalAdmissionsQF,ICUAdmissions,ICUAdmissionsQF
        141,22680,20210117,S08000024,NHS Lothian,2498.95,0,4,861,0,0,0,0,0,0,9.47,0,0,0,0,0,0,0
        4,52,20210117,S08000025,NHS Orkney,233.50,0,0,2,0,0,0,0,0,0,12.12,0,0,0,0,0,0,0
        1195,164592,20210117,S92000003,Scotland,3012.68,0,28,5500,0,0,0,0,0,0,12.88,0,0,0,0,0,0,0
        174,22854,20210118,S08000024,NHS Lothian,2518.13,0,2,863,0,0,0,0,0,0,5.07,0,0,0,0,0,0,0
        1,53,20210118,S08000025,NHS Orkney,237.99,0,0,2,0,0,0,0,0,0,0.81,0,0,0,0,0,0,0
        1713,166305,20210118,S92000003,Scotland,3044.04,0,37,5537,0,0,0,0,0,0,7.67,0,0,0,0,0,0,0
        166,23020,20210119,S08000024,NHS Lothian,2536.42,0,0,863,0,0,0,0,0,0,5.91,0,0,0,0,0,0,0
        0,53,20210119,S08000025,NHS Orkney,237.99,0,0,2,0,0,0,0,0,0,0.00,0,0,0,0,0,0,0
        1406,167711,20210119,S92000003,Scotland,3069.77,0,18,5555,0,0,0,0,0,0,6.84,0,0,0,0,0,0,0`,
        currentTotalsCouncilAreasCsvData,
        currentTotalsHealthBoardsCsvData
      )
    ).toStrictEqual(shortAllData);
  });

  it("total CA columns out of order", () => {
    expect(
      createJsonData(
        shortDailyCouncilAreasCsvData,
        shortDailyHealthBoardsCsvData,
        `Date,NewPositive,TotalCases,CrudeRatePositive,NewDeaths,TotalDeaths,CrudeRateDeaths,TotalNegative,CrudeRateNegative,CA,CAName
       2021-01-21,5,165,617.51,0,1,0,0,0,S12000013,Na h-Eileanan Siar
       2021-01-21,242,31382,4956.72,8,856,0,0,0,S12000049,Glasgow City`,
        currentTotalsHealthBoardsCsvData
      )
    ).toStrictEqual(shortAllData);
  });

  it("total HB columns out of order", () => {
    expect(
      createJsonData(
        shortDailyCouncilAreasCsvData,
        shortDailyHealthBoardsCsvData,
        currentTotalsCouncilAreasCsvData,
        `HB,Date,HBQF,HBName,NewPositive,TotalCases,CrudeRatePositive,NewDeaths,TotalDeaths,CrudeRateDeaths,TotalNegative,CrudeRateNegative
        S08000024,2021-01-21,,NHS Lothian,166,23020,2536.42,10,863,0,0,0
        S08000025,2021-01-21,,NHS Orkney,0,53,237.99,0,2,0,0,0
        S92000003,2021-01-21,d,Scotland,1406,167711,3069.77,89,5557,0,0,0`
      )
    ).toStrictEqual(shortAllData);
  });

  // Failure cases

  it("daily CA region missing", () => {
    expect(
      createJsonData(
        `Date,CA,CAName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,DailyNegative,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,PositivePercentage7Day,TotalPillar1,TotalPillar2
            20210117,S12000049,Glasgow City,195,30869,4875.69,0,2,852,0,0,0,0,0,0,15.72,0,0,0
            20210118,S12000049,Glasgow City,271,31140,4918.50,0,4,856,0,0,0,0,0,0,10.76,0,0,0
            20210119,S12000049,Glasgow City,242,31382,4956.72,0,0,856,0,0,0,0,0,0,11.37,0,0,0`,
        shortDailyHealthBoardsCsvData,
        currentTotalsCouncilAreasCsvData,
        currentTotalsHealthBoardsCsvData
      )
    ).toBeNull();
  });

  it("daily HB region missing", () => {
    expect(
      createJsonData(
        shortDailyCouncilAreasCsvData,
        `Date,HB,HBName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,DailyNegative,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,PositivePercentage7Day,TotalPillar1,TotalPillar2,HospitalAdmissions,HospitalAdmissionsQF,ICUAdmissions,ICUAdmissionsQF
        20210117,S08000025,NHS Orkney,4,52,233.50,0,0,2,0,0,0,0,0,0,12.12,0,0,0,0,0,0,0
        20210117,S92000003,Scotland,1195,164592,3012.68,0,28,5500,0,0,0,0,0,0,12.88,0,0,0,0,0,0,0
        20210118,S08000025,NHS Orkney,1,53,237.99,0,0,2,0,0,0,0,0,0,0.81,0,0,0,0,0,0,0
        20210118,S92000003,Scotland,1713,166305,3044.04,0,37,5537,0,0,0,0,0,0,7.67,0,0,0,0,0,0,0
        20210119,S08000025,NHS Orkney,0,53,237.99,0,0,2,0,0,0,0,0,0,0.00,0,0,0,0,0,0,0
        20210119,S92000003,Scotland,1406,167711,3069.77,0,18,5555,0,0,0,0,0,0,6.84,0,0,0,0,0,0,0`,
        currentTotalsCouncilAreasCsvData,
        currentTotalsHealthBoardsCsvData
      )
    ).toBeNull();
  });

  it("total CA region missing", () => {
    expect(
      createJsonData(
        shortDailyCouncilAreasCsvData,
        shortDailyHealthBoardsCsvData,
        `Date,CA,CAName,NewPositive,TotalCases,CrudeRatePositive,NewDeaths,TotalDeaths,CrudeRateDeaths,TotalNegative,CrudeRateNegative
         2021-01-21,S12000013,Na h-Eileanan Siar,5,165,0,0,1,0,0,0`,
        currentTotalsHealthBoardsCsvData
      )
    ).toBeNull();
  });
  it("total HB region missing", () => {
    expect(
      createJsonData(
        shortDailyCouncilAreasCsvData,
        shortDailyHealthBoardsCsvData,
        currentTotalsCouncilAreasCsvData,
        `Date,HB,HBQF,HBName,NewPositive,TotalCases,CrudeRatePositive,NewDeaths,TotalDeaths,CrudeRateDeaths,TotalNegative,CrudeRateNegative
          2021-01-21,S08000024,,NHS Lothian,166,23020,0,10,863,0,0,0
          2021-01-21,S92000003,d,Scotland,1406,167711,0,89,5557,0,0,0`
      )
    ).toBeNull();
  });

  it("daily HB scotland missing", () => {
    expect(
      createJsonData(
        shortDailyCouncilAreasCsvData,
        `Date,HB,HBName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,DailyNegative,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,PositivePercentage7Day,TotalPillar1,TotalPillar2,HospitalAdmissions,HospitalAdmissionsQF,ICUAdmissions,ICUAdmissionsQF
            20210117,S08000024,NHS Lothian,141,22680,2498.95,0,4,861,0,0,0,0,0,0,9.47,0,0,0,0,0,0,0
            20210117,S08000025,NHS Orkney,4,52,233.50,0,0,2,0,0,0,0,0,0,12.12,0,0,0,0,0,0,0
            20210118,S08000024,NHS Lothian,174,22854,2518.13,0,2,863,0,0,0,0,0,0,5.07,0,0,0,0,0,0,0
            20210118,S08000025,NHS Orkney,1,53,237.99,0,0,2,0,0,0,0,0,0,0.81,0,0,0,0,0,0,0
            20210119,S08000024,NHS Lothian,166,23020,2536.42,0,0,863,0,0,0,0,0,0,5.91,0,0,0,0,0,0,0
            20210119,S08000025,NHS Orkney,0,53,237.99,0,0,2,0,0,0,0,0,0,0.00,0,0,0,0,0,0,0`,
        currentTotalsCouncilAreasCsvData,
        currentTotalsHealthBoardsCsvData
      )
    ).toBeNull();
  });

  it("total HB scotland missing", () => {
    expect(
      createJsonData(
        shortDailyCouncilAreasCsvData,
        shortDailyHealthBoardsCsvData,
        currentTotalsCouncilAreasCsvData,
        `Date,HB,HBQF,HBName,NewPositive,TotalCases,CrudeRatePositive,NewDeaths,TotalDeaths,CrudeRateDeaths,TotalNegative,CrudeRateNegative
          2021-01-21,S08000024,,NHS Lothian,166,23020,0,10,863,0,0,0
          2021-01-21,S08000025,,NHS Orkney,0,53,0,0,2,0,0,0`
      )
    ).toBeNull();
  });

  it("daily CA missing column", () => {
    expect(
      createJsonData(
        `Date,CA,CAName,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,DailyNegative,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,PositivePercentage7Day,TotalPillar1,TotalPillar2
          20210117,S12000013,Na h-Eileanan Siar,158,591.32,0,0,1,0,0,0,0,0,0,5.26,0,0,0
          20210118,S12000013,Na h-Eileanan Siar,160,598.80,0,0,1,0,0,0,0,0,0,1.72,0,0,0
          20210119,S12000013,Na h-Eileanan Siar,165,617.51,0,0,1,0,0,0,0,0,0,3.21,0,0,0
          20210117,S12000049,Glasgow City,30869,4875.69,0,2,852,0,0,0,0,0,0,15.72,0,0,0
          20210118,S12000049,Glasgow City,31140,4918.50,0,4,856,0,0,0,0,0,0,10.76,0,0,0
          20210119,S12000049,Glasgow City,31382,4956.72,0,0,856,0,0,0,0,0,0,11.37,0,0,0`,
        shortDailyHealthBoardsCsvData,
        currentTotalsCouncilAreasCsvData,
        currentTotalsHealthBoardsCsvData
      )
    ).toBeNull();
  });

  it("daily HB missing column", () => {
    expect(
      createJsonData(
        shortDailyCouncilAreasCsvData,
        `Date,HB,HBName,DailyPositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,DailyNegative,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,PositivePercentage7Day,TotalPillar1,TotalPillar2,HospitalAdmissions,HospitalAdmissionsQF,ICUAdmissions,ICUAdmissionsQF
        20210117,S08000024,NHS Lothian,141,2498.95,0,4,861,0,0,0,0,0,0,9.47,0,0,0,0,0,0,0
        20210117,S08000025,NHS Orkney,4,233.50,0,0,2,0,0,0,0,0,0,12.12,0,0,0,0,0,0,0
        20210117,S92000003,Scotland,1195,3012.68,0,28,5500,0,0,0,0,0,0,12.88,0,0,0,0,0,0,0
        20210118,S08000024,NHS Lothian,174,2518.13,0,2,863,0,0,0,0,0,0,5.07,0,0,0,0,0,0,0
        20210118,S08000025,NHS Orkney,1,237.99,0,0,2,0,0,0,0,0,0,0.81,0,0,0,0,0,0,0
        20210118,S92000003,Scotland,1713,3044.04,0,37,5537,0,0,0,0,0,0,7.67,0,0,0,0,0,0,0
        20210119,S08000024,NHS Lothian,166,2536.42,0,0,863,0,0,0,0,0,0,5.91,0,0,0,0,0,0,0
        20210119,S08000025,NHS Orkney,0,237.99,0,0,2,0,0,0,0,0,0,0.00,0,0,0,0,0,0,0
        20210119,S92000003,Scotland,1406,3069.77,0,18,5555,0,0,0,0,0,0,6.84,0,0,0,0,0,0,0`,
        currentTotalsCouncilAreasCsvData,
        currentTotalsHealthBoardsCsvData
      )
    ).toBeNull();
  });

  it("total CA missing column", () => {
    expect(
      createJsonData(
        shortDailyCouncilAreasCsvData,
        shortDailyHealthBoardsCsvData,
        `CA,CAName,NewPositive,TotalCases,CrudeRatePositive,NewDeaths,TotalDeaths,CrudeRateDeaths,TotalNegative,CrudeRateNegative
       S12000013,Na h-Eileanan Siar,5,165,0,0,1,0,0,0
       S12000049,Glasgow City,242,31382,0,8,856,0,0,0`,
        currentTotalsHealthBoardsCsvData
      )
    ).toBeNull();
  });

  it("total HB missing column", () => {
    expect(
      createJsonData(
        shortDailyCouncilAreasCsvData,
        shortDailyHealthBoardsCsvData,
        currentTotalsCouncilAreasCsvData,
        `Date,HBQF,HBName,NewPositive,TotalCases,CrudeRatePositive,NewDeaths,TotalDeaths,CrudeRateDeaths,TotalNegative,CrudeRateNegative
        2021-01-21,,NHS Lothian,166,23020,0,10,863,0,0,0
        2021-01-21,,NHS Orkney,0,53,0,0,2,0,0,0
        2021-01-21,d,Scotland,1406,167711,0,89,5557,0,0,0`
      )
    ).toBeNull();
  });

  it("daily CA missing date", () => {
    expect(
      createJsonData(
        `Date,CA,CAName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,DailyNegative,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,PositivePercentage7Day,TotalPillar1,TotalPillar2
          20210117,S12000013,Na h-Eileanan Siar,4,158,591.32,0,0,1,0,0,0,0,0,0,5.26,0,0,0
                  ,S12000013,Na h-Eileanan Siar,2,160,598.80,0,0,1,0,0,0,0,0,0,1.72,0,0,0
          20210119,S12000013,Na h-Eileanan Siar,5,165,617.51,0,0,1,0,0,0,0,0,0,3.21,0,0,0
          20210117,S12000049,Glasgow City,195,30869,4875.69,0,2,852,0,0,0,0,0,0,15.72,0,0,0
          20210118,S12000049,Glasgow City,271,31140,4918.50,0,4,856,0,0,0,0,0,0,10.76,0,0,0
          20210119,S12000049,Glasgow City,242,31382,4956.72,0,0,856,0,0,0,0,0,0,11.37,0,0,0`,
        shortDailyHealthBoardsCsvData,
        currentTotalsCouncilAreasCsvData,
        currentTotalsHealthBoardsCsvData
      )
    ).toBeNull();
  });

  it("daily HB missing date", () => {
    expect(
      createJsonData(
        shortDailyCouncilAreasCsvData,
        `Date,HB,HBName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,DailyNegative,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,PositivePercentage7Day,TotalPillar1,TotalPillar2,HospitalAdmissions,HospitalAdmissionsQF,ICUAdmissions,ICUAdmissionsQF
        20210117,S08000024,NHS Lothian,141,22680,2498.95,0,4,861,0,0,0,0,0,0,9.47,0,0,0,0,0,0,0
        20210117,S08000025,NHS Orkney,4,52,233.50,0,0,2,0,0,0,0,0,0,12.12,0,0,0,0,0,0,0
        20210117,S92000003,Scotland,1195,164592,3012.68,0,28,5500,0,0,0,0,0,0,12.88,0,0,0,0,0,0,0
        20210118,S08000024,NHS Lothian,174,22854,2518.13,0,2,863,0,0,0,0,0,0,5.07,0,0,0,0,0,0,0
                ,S08000025,NHS Orkney,1,53,237.99,0,0,2,0,0,0,0,0,0,0.81,0,0,0,0,0,0,0
        20210118,S92000003,Scotland,1713,166305,3044.04,0,37,5537,0,0,0,0,0,0,7.67,0,0,0,0,0,0,0
        20210119,S08000024,NHS Lothian,166,23020,2536.42,0,0,863,0,0,0,0,0,0,5.91,0,0,0,0,0,0,0
        20210119,S08000025,NHS Orkney,0,53,237.99,0,0,2,0,0,0,0,0,0,0.00,0,0,0,0,0,0,0
        20210119,S92000003,Scotland,1406,167711,3069.77,0,18,5555,0,0,0,0,0,0,6.84,0,0,0,0,0,0,0`,
        currentTotalsCouncilAreasCsvData,
        currentTotalsHealthBoardsCsvData
      )
    ).toBeNull();
  });

  it("total CA missing date", () => {
    expect(
      createJsonData(
        shortDailyCouncilAreasCsvData,
        shortDailyHealthBoardsCsvData,
        `Date,CA,CAName,NewPositive,TotalCases,CrudeRatePositive,NewDeaths,TotalDeaths,CrudeRateDeaths,TotalNegative,CrudeRateNegative
       2021-01-21,S12000013,Na h-Eileanan Siar,5,165,0,0,1,0,0,0
               ,S12000049,Glasgow City,242,31382,0,8,856,0,0,0`,
        currentTotalsHealthBoardsCsvData
      )
    ).toBeNull();
  });

  it("total HB missing date", () => {
    expect(
      createJsonData(
        shortDailyCouncilAreasCsvData,
        shortDailyHealthBoardsCsvData,
        currentTotalsCouncilAreasCsvData,
        `Date,HB,HBQF,HBName,NewPositive,TotalCases,CrudeRatePositive,NewDeaths,TotalDeaths,CrudeRateDeaths,TotalNegative,CrudeRateNegative
        2021-01-21,S08000024,,NHS Lothian,166,23020,0,10,863,0,0,0
                ,S08000025,,NHS Orkney,0,53,0,0,2,0,0,0
        2021-01-21,S92000003,d,Scotland,1406,167711,0,89,5557,0,0,0`
      )
    ).toBeNull();
  });

  it("daily CA missing value cell", () => {
    expect(
      createJsonData(
        `Date,CA,CAName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,DailyNegative,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,PositivePercentage7Day,TotalPillar1,TotalPillar2
          20210117,S12000013,Na h-Eileanan Siar,something,158,591.32,0,0,1,0,0,0,0,0,0,5.26,0,0,0
          20210118,S12000013,Na h-Eileanan Siar,2,160,598.80,0,0,1,0,0,0,0,0,0,1.72,0,0,0
          20210119,S12000013,Na h-Eileanan Siar,5,165,617.51,0,0,1,0,0,0,0,0,0,3.21,0,0,0
          20210117,S12000049,Glasgow City,195,30869,4875.69,0,2,852,0,0,0,0,0,0,15.72,0,0,0
          20210118,S12000049,Glasgow City,271,31140,4918.50,0,4,856,0,0,0,0,0,0,10.76,0,0,0
          20210119,S12000049,Glasgow City,242,31382,4956.72,0,0,856,0,0,0,0,0,0,11.37,0,0,0`,
        shortDailyHealthBoardsCsvData,
        currentTotalsCouncilAreasCsvData,
        currentTotalsHealthBoardsCsvData
      )
    ).toBeNull();
  });

  it("daily HB missing  value cell", () => {
    expect(
      createJsonData(
        shortDailyCouncilAreasCsvData,
        `Date,HB,HBName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,DailyNegative,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,PositivePercentage7Day,TotalPillar1,TotalPillar2,HospitalAdmissions,HospitalAdmissionsQF,ICUAdmissions,ICUAdmissionsQF
        20210117,S08000024,NHS Lothian,141,     ,2498.95,0,4,861,0,0,0,0,0,0,9.47,0,0,0,0,0,0,0
        20210117,S08000025,NHS Orkney,4,52,233.50,0,0,2,0,0,0,0,0,0,12.12,0,0,0,0,0,0,0
        20210117,S92000003,Scotland,1195,164592,3012.68,0,28,5500,0,0,0,0,0,0,12.88,0,0,0,0,0,0,0
        20210118,S08000024,NHS Lothian,174,22854,2518.13,0,2,863,0,0,0,0,0,0,5.07,0,0,0,0,0,0,0
        20210118,S08000025,NHS Orkney,1,53,237.99,0,0,2,0,0,0,0,0,0,0.81,0,0,0,0,0,0,0
        20210118,S92000003,Scotland,1713,166305,3044.04,0,37,5537,0,0,0,0,0,0,7.67,0,0,0,0,0,0,0
        20210119,S08000024,NHS Lothian,166,23020,2536.42,0,0,863,0,0,0,0,0,0,5.91,0,0,0,0,0,0,0
        20210119,S08000025,NHS Orkney,0,53,237.99,0,0,2,0,0,0,0,0,0,0.00,0,0,0,0,0,0,0
        20210119,S92000003,Scotland,1406,167711,3069.77,0,18,5555,0,0,0,0,0,0,6.84,0,0,0,0,0,0,0`,
        currentTotalsCouncilAreasCsvData,
        currentTotalsHealthBoardsCsvData
      )
    ).toBeNull();
  });

  it("total CA missing value cell", () => {
    expect(
      createJsonData(
        shortDailyCouncilAreasCsvData,
        shortDailyHealthBoardsCsvData,
        `Date,CA,CAName,NewPositive,TotalCases,CrudeRatePositive,NewDeaths,TotalDeaths,CrudeRateDeaths,TotalNegative,CrudeRateNegative
       2021-01-21,S12000013,Na h-Eileanan Siar, ,165,0,0,1,0,0,0
       2021-01-21,S12000049,Glasgow City,242,31382,0,8,856,0,0,0`,
        currentTotalsHealthBoardsCsvData
      )
    ).toBeNull();
  });

  it("total HB missing value cell", () => {
    expect(
      createJsonData(
        shortDailyCouncilAreasCsvData,
        shortDailyHealthBoardsCsvData,
        currentTotalsCouncilAreasCsvData,
        `Date,HB,HBQF,HBName,NewPositive,TotalCases,CrudeRatePositive,NewDeaths,TotalDeaths,CrudeRateDeaths,TotalNegative,CrudeRateNegative
        2021-01-21,S08000024,,NHS Lothian,166,23020,0,10,863,0,0,0
        2021-01-21,S08000025,,NHS Orkney,0,53,0,0,2,0,0,0
        2021-01-21,S92000003,d,Scotland,1636,    ,0,89,5557,0,0,0`
      )
    ).toBeNull();
  });
});

// prettier-ignore
const shortAllData = {
  regions: {
    S12000013: {
      weeklyCases: 11,
      weeklyDeaths: 0,
      name: "Na h-Eileanan Siar",
      dailyCases: { date: TOTALS_DATE, value: 5 },
      dailyDeaths: { date: TOTALS_DATE, value: 0 },
      crudeRatePositive: 617.51,
      cumulativeCases: { date: TOTALS_DATE, value: 165 },
      cumulativeDeaths: { date: TOTALS_DATE, value: 1 },
      fatalityCaseRatio: "0.6%",
      population: 26720.215057246038,
      populationProportion: 0.004890848815896522,
      weeklySeries: { cases: [11], deaths: [0] },
      dailySeries: {
        dailyCases: [ 4, 2, 5],
        dailyDeaths: [0, 0, 0],
        totalCases: [158, 160, 165],
        totalDeaths: [ 1, 1, 1],
      },
    },
    S12000049: {
      weeklyCases: 708,
      weeklyDeaths: 6,
      name: "Glasgow City",
      dailyCases: { date: TOTALS_DATE, value: 242 },
      dailyDeaths: { date: TOTALS_DATE, value: 8 },
      crudeRatePositive: 4956.72,
      cumulativeCases: { date: TOTALS_DATE, value: 31382 },
      cumulativeDeaths: { date: TOTALS_DATE, value: 856 },
      fatalityCaseRatio: "2.7%",
      population: 633120.2892235187,
      populationProportion: 0.1158858792953164,
      weeklySeries: { cases: [708], deaths: [6] },
      dailySeries: {
        dailyCases: [ 195, 271, 242],
        dailyDeaths: [ 2, 4, 0],
        totalCases: [ 30869, 31140, 31382],
        totalDeaths: [ 852, 856, 856],
      },
    },
    S08000024: {
      weeklyCases: 481,
      weeklyDeaths: 6,
      name: "Lothian",
      dailyCases: { date: TOTALS_DATE, value: 166 },
      dailyDeaths: { date: TOTALS_DATE, value: 10 },
      crudeRatePositive: 2536.42,
      cumulativeCases: { date: TOTALS_DATE, value: 23020 },
      cumulativeDeaths: { date: TOTALS_DATE, value: 863 },
      fatalityCaseRatio: "3.7%",
      population: 907578.3978994014,
      populationProportion: 0.16612249277147267,
      weeklySeries: { cases: [481], deaths: [6] },
      dailySeries: {
        dailyCases: [ 141, 174, 166],
        dailyDeaths: [ 4, 2, 0],
        totalCases: [ 22680, 22854, 23020],
        totalDeaths: [ 861, 863, 863],
      },
    },
    S08000025: {
      weeklyCases: 5,
      weeklyDeaths: 0,
      name: "Orkney",
      dailyCases: { date: TOTALS_DATE, value: 0 },
      dailyDeaths: { date: TOTALS_DATE, value: 0 },
      crudeRatePositive: 237.99,
      cumulativeCases: { date: TOTALS_DATE, value: 53 },
      cumulativeDeaths: { date: TOTALS_DATE, value: 2 },
      fatalityCaseRatio: "3.8%",
      population: 22269.843270725658,
      populationProportion: 0.004076255986618379,
      weeklySeries: { cases: [5], deaths: [0] },
      dailySeries: {
        dailyCases: [ 4, 1, 0],
        dailyDeaths: [ 0, 0, 0],
        totalCases: [ 52, 53, 53],
        totalDeaths: [ 2, 2, 2],
      },
    },
    S92000003: {
      weeklyCases: 4314,
      weeklyDeaths: 83,
      name: "Scotland",
      dailyCases: { date: TOTALS_DATE, value: 1406 },
      dailyDeaths: { date: TOTALS_DATE, value: 89 },
      crudeRatePositive: 3069.77,
      cumulativeCases: { date: TOTALS_DATE, value: 167711 },
      cumulativeDeaths: { date: TOTALS_DATE, value: 5557 },
      fatalityCaseRatio: "3.3%",
      population: 5463308.326030941,
      populationProportion: 1,
      weeklySeries: { cases: [4314], deaths: [83] },
      dailySeries: {
        dailyCases: [ 1195, 1713, 1406 ],
        dailyDeaths: [ 28, 37, 18 ],
        totalCases: [  164592, 166305, 167711 ],
        totalDeaths: [ 5500, 5537, 5555 ],
      },
    },
  },
  dates: [
    Date.parse("2021-01-17"),
    Date.parse("2021-01-18"),
    Date.parse("2021-01-19"),
  ],
  weekStartDates: [Date.parse("2021-01-17")],
  startDate: Date.parse("2021-01-17"),
  endDate: Date.parse("2021-01-19"),
  currentWeekStartDate: Date.parse("2021-01-17"),
};

const currentTotalsCouncilAreasCsvData = `

Date,CA,CAName,NewPositive,TotalCases,CrudeRatePositive,NewDeaths,TotalDeaths,CrudeRateDeaths,TotalNegative,CrudeRateNegative
2021-01-21,S12000013,Na h-Eileanan Siar,5,165,617.51,0,1,0,0,0
2021-01-21,S12000049,Glasgow City,242,31382,4956.72,8,856,0,0,0

`;

const currentTotalsHealthBoardsCsvData = `
Date,HB,HBQF,HBName,NewPositive,TotalCases,CrudeRatePositive,NewDeaths,TotalDeaths,CrudeRateDeaths,TotalNegative,CrudeRateNegative
2021-01-21,S08000024,,NHS Lothian,166,23020,2536.42,10,863,0,0,0
2021-01-21,S08000025,,NHS Orkney,0,53,237.99,0,2,0,0,0
2021-01-21,S92000003,d,Scotland,1406,167711,3069.77,89,5557,0,0,0
`;

// Date range 04-01 - 19-01
const dailyCouncilAreasCsvData = `
Date,CA,CAName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,DailyNegative,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,PositivePercentage7Day,TotalPillar1,TotalPillar2
20210103,S12000013,Na h-Eileanan Siar,0,107,400.45,0,0,1,0,0,0,0,0,0,0.00,0,0,0
20210104,S12000013,Na h-Eileanan Siar,0,107,400.45,0,0,1,0,0,0,0,0,0,0.00,0,0,0
20210105,S12000013,Na h-Eileanan Siar,1,108,404.19,0,0,1,0,0,0,0,0,0,0.57,0,0,0
20210106,S12000013,Na h-Eileanan Siar,3,111,415.42,0,0,1,0,0,0,0,0,0,1.74,0,0,0
20210107,S12000013,Na h-Eileanan Siar,1,112,419.16,0,0,1,0,0,0,0,0,0,0.91,0,0,0
20210108,S12000013,Na h-Eileanan Siar,0,112,419.16,0,0,1,0,0,0,0,0,0,0.00,0,0,0
20210109,S12000013,Na h-Eileanan Siar,0,112,419.16,0,0,1,0,0,0,0,0,0,0.00,0,0,0
20210110,S12000013,Na h-Eileanan Siar,2,114,426.65,0,0,1,0,0,0,0,0,0,4.88,0,0,0
20210111,S12000013,Na h-Eileanan Siar,1,115,430.39,0,0,1,0,0,0,0,0,0,1.85,0,0,0
20210112,S12000013,Na h-Eileanan Siar,0,115,430.39,0,0,1,0,0,0,0,0,0,1.75,0,0,0
20210113,S12000013,Na h-Eileanan Siar,9,124,464.07,0,0,1,0,0,0,0,0,0,5.78,0,0,0
20210114,S12000013,Na h-Eileanan Siar,15,139,520.21,0,0,1,0,0,0,0,0,0,12.93,0,0,0
20210115,S12000013,Na h-Eileanan Siar,2,141,527.69,0,0,1,0,0,0,0,0,0,3.23,0,0,0
20210116,S12000013,Na h-Eileanan Siar,13,154,576.35,0,0,1,0,0,0,0,0,0,14.08,0,0,0
20210117,S12000013,Na h-Eileanan Siar,4,158,591.32,0,0,1,0,0,0,0,0,0,5.26,0,0,0
20210118,S12000013,Na h-Eileanan Siar,2,160,598.80,0,0,1,0,0,0,0,0,0,1.72,0,0,0
20210119,S12000013,Na h-Eileanan Siar,5,165,617.51,0,0,1,0,0,0,0,0,0,3.21,0,0,0
20210103,S12000049,Glasgow City,327,26392,4168.56,0,6,787,0,0,0,0,0,0,13.88,0,0,0
20210104,S12000049,Glasgow City,360,26752,4225.42,0,4,791,0,0,0,0,0,0,13.39,0,0,0
20210105,S12000049,Glasgow City,489,27241,4302.66,0,2,793,0,0,0,0,0,0,12.39,0,0,0
20210106,S12000049,Glasgow City,414,27655,4368.05,0,2,795,0,0,0,0,0,0,11.24,0,0,0
20210107,S12000049,Glasgow City,325,27980,4419.38,0,6,801,0,0,0,0,0,0,10.66,0,0,0
20210108,S12000049,Glasgow City,337,28317,4472.61,0,7,808,0,0,0,0,0,0,13.98,0,0,0
20210109,S12000049,Glasgow City,295,28612,4519.21,0,3,811,0,0,0,0,0,0,17.50,0,0,0
20210110,S12000049,Glasgow City,294,28906,4565.64,0,6,817,0,0,0,0,0,0,16.08,0,0,0
20210111,S12000049,Glasgow City,375,29281,4624.87,0,4,821,0,0,0,0,0,0,10.59,0,0,0
20210112,S12000049,Glasgow City,331,29612,4677.15,0,7,828,0,0,0,0,0,0,10.11,0,0,0
20210113,S12000049,Glasgow City,280,29892,4721.38,0,9,837,0,0,0,0,0,0,11.37,0,0,0
20210114,S12000049,Glasgow City,253,30145,4761.34,0,5,842,0,0,0,0,0,0,11.11,0,0,0
20210115,S12000049,Glasgow City,307,30452,4809.83,0,2,844,0,0,0,0,0,0,12.53,0,0,0
20210116,S12000049,Glasgow City,222,30674,4844.90,0,6,850,0,0,0,0,0,0,14.31,0,0,0
20210117,S12000049,Glasgow City,195,30869,4875.69,0,2,852,0,0,0,0,0,0,15.72,0,0,0
20210118,S12000049,Glasgow City,271,31140,4918.50,0,4,856,0,0,0,0,0,0,10.76,0,0,0
20210119,S12000049,Glasgow City,242,31382,4956.72,0,0,856,0,0,0,0,0,0,11.37,0,0,0
`;

// Date range 04-01 - 20-01
const dailyHealthBoardsCsvData = `
Date,HB,HBName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,DailyNegative,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,PositivePercentage7Day,TotalPillar1,TotalPillar2,HospitalAdmissions,HospitalAdmissionsQF,ICUAdmissions,ICUAdmissionsQF
20210104,S08000024,NHS Lothian,254,20086,2213.14,0,7,796,0,0,0,0,0,0,8.31,0,0,0,0,0,0,0
20210104,S08000025,NHS Orkney,0,40,179.61,0,0,2,0,0,0,0,0,0,0.00,0,0,0,0,0,0,0
20210104,S92000003,Scotland,2385,140655,2574.54,0,35,4906,0,0,0,0,0,0,10.73,0,0,0,0,0,0,0
20210105,S08000024,NHS Lothian,364,20450,2253.24,0,6,802,0,0,0,0,0,0,9.08,0,0,0,0,0,0,0
20210105,S08000025,NHS Orkney,1,41,184.10,0,0,2,0,0,0,0,0,0,1.32,0,0,0,0,0,0,0
20210105,S92000003,Scotland,3061,143716,2630.57,0,37,4943,0,0,0,0,0,0,9.13,0,0,0,0,0,0,0
20210106,S08000024,NHS Lothian,295,20745,2285.75,0,4,806,0,0,0,0,0,0,7.68,0,0,0,0,0,0,0
20210106,S08000025,NHS Orkney,0,41,184.10,0,0,2,0,0,0,0,0,0,0.00,0,0,0,0,0,0,0
20210106,S92000003,Scotland,2560,146276,2677.43,0,48,4991,0,0,0,0,0,0,9.53,0,0,0,0,0,0,0
20210107,S08000024,NHS Lothian,270,21015,2315.50,0,4,810,0,0,0,0,0,0,10.63,0,0,0,0,0,0,0
20210107,S08000025,NHS Orkney,1,42,188.59,0,0,2,0,0,0,0,0,0,3.85,0,0,0,0,0,0,0
20210107,S92000003,Scotland,2205,148481,2717.79,0,44,5035,0,0,0,0,0,0,10.32,0,0,0,0,0,0,0
20210108,S08000024,NHS Lothian,147,21162,2331.70,0,6,816,0,0,0,0,0,0,7.62,0,0,0,0,0,0,0
20210108,S08000025,NHS Orkney,3,45,202.07,0,0,2,0,0,0,0,0,0,14.29,0,0,0,0,0,0,0
20210108,S92000003,Scotland,1839,150320,2751.45,0,41,5076,0,0,0,0,0,0,10.22,0,0,0,0,0,0,0
20210109,S08000024,NHS Lothian,165,21327,2349.88,0,3,819,0,0,0,0,0,0,8.77,0,0,0,0,0,0,0
20210109,S08000025,NHS Orkney,0,45,202.07,0,0,2,0,0,0,0,0,0,0.00,0,0,0,0,0,0,0
20210109,S92000003,Scotland,1497,151817,2778.85,0,35,5111,0,0,0,0,0,0,12.64,0,0,0,0,0,0,0
20210110,S08000024,NHS Lothian,147,21474,2366.07,0,3,822,0,0,0,0,0,0,8.31,0,0,0,0,0,0,0
20210110,S08000025,NHS Orkney,0,45,202.07,0,0,2,0,0,0,0,0,0,0.00,0,0,0,0,0,0,0
20210110,S92000003,Scotland,1432,153249,2805.06,0,58,5169,0,0,0,0,0,0,12.34,0,0,0,0,0,0,0
20210111,S08000024,NHS Lothian,207,21681,2388.88,0,8,830,0,0,0,0,0,0,5.63,0,0,0,0,0,0,0
20210111,S08000025,NHS Orkney,0,45,202.07,0,0,2,0,0,0,0,0,0,0.00,0,0,0,0,0,0,0
20210111,S92000003,Scotland,2107,155356,2843.63,0,47,5216,0,0,0,0,0,0,8.19,0,0,0,0,0,0,0
20210112,S08000024,NHS Lothian,224,21905,2413.56,0,8,838,0,0,0,0,0,0,6.07,0,0,0,0,0,0,0
20210112,S08000025,NHS Orkney,0,45,202.07,0,0,2,0,0,0,0,0,0,1.59,0,0,0,0,0,0,0
20210112,S92000003,Scotland,1987,157343,2880.00,0,49,5265,0,0,0,0,0,0,7.77,0,0,0,0,0,0,0
20210113,S08000024,NHS Lothian,204,22109,2436.04,0,4,842,0,0,0,0,0,0,10.02,0,0,0,0,0,0,0
20210113,S08000025,NHS Orkney,0,45,202.07,0,0,2,0,0,0,0,0,0,0.00,0,0,0,0,0,0,0
20210113,S92000003,Scotland,1709,159052,2911.28,0,49,5314,0,0,0,0,0,0,8.47,0,0,0,0,0,0,0
20210114,S08000024,NHS Lothian,160,22269,2453.67,0,3,845,0,0,0,0,0,0,6.29,0,0,0,0,0,0,0
20210114,S08000025,NHS Orkney,1,46,206.56,0,0,2,0,0,0,0,0,0,28.57,0,0,0,0,0,0,0
20210114,S92000003,Scotland,1625,160677,2941.02,0,51,5365,0,0,0,0,0,0,9.73,0,0,0,0,0,0,0
20210115,S08000024,NHS Lothian,136,22405,2468.65,0,6,851,0,0,0,0,0,0,6.02,0,0,0,0,0,0,0
20210115,S08000025,NHS Orkney,2,48,215.54,0,0,2,0,0,0,0,0,0,6.90,0,0,0,0,0,0,0
20210115,S92000003,Scotland,1549,162226,2969.38,0,48,5413,0,0,0,0,0,0,9.33,0,0,0,0,0,0,0
20210116,S08000024,NHS Lothian,134,22539,2483.42,0,6,857,0,0,0,0,0,0,8.42,0,0,0,0,0,0,0
20210116,S08000025,NHS Orkney,0,48,215.54,0,0,2,0,0,0,0,0,0,0.00,0,0,0,0,0,0,0
20210116,S92000003,Scotland,1171,163397,2990.81,0,59,5472,0,0,0,0,0,0,11.66,0,0,0,0,0,0,0
20210117,S08000024,NHS Lothian,141,22680,2498.95,0,4,861,0,0,0,0,0,0,9.47,0,0,0,0,0,0,0
20210117,S08000025,NHS Orkney,4,52,233.50,0,0,2,0,0,0,0,0,0,12.12,0,0,0,0,0,0,0
20210117,S92000003,Scotland,1195,164592,3012.68,0,28,5500,0,0,0,0,0,0,12.88,0,0,0,0,0,0,0
20210118,S08000024,NHS Lothian,174,22854,2518.13,0,2,863,0,0,0,0,0,0,5.07,0,0,0,0,0,0,0
20210118,S08000025,NHS Orkney,1,53,237.99,0,0,2,0,0,0,0,0,0,0.81,0,0,0,0,0,0,0
20210118,S92000003,Scotland,1713,166305,3044.04,0,37,5537,0,0,0,0,0,0,7.67,0,0,0,0,0,0,0
20210119,S08000024,NHS Lothian,166,23020,2536.42,0,0,863,0,0,0,0,0,0,5.91,0,0,0,0,0,0,0
20210119,S08000025,NHS Orkney,0,53,237.99,0,0,2,0,0,0,0,0,0,0.00,0,0,0,0,0,0,0
20210119,S92000003,Scotland,1406,167711,3069.77,0,18,5555,0,0,0,0,0,0,6.84,0,0,0,0,0,0,0
20210120,S08000024,NHS Lothian,41,23061,2540.93,0,0,863,0,0,0,0,0,0,9.34,0,0,0,0,0,0,0
20210120,S08000025,NHS Orkney,0,53,237.99,0,0,2,0,0,0,0,0,0,0.00,0,0,0,0,0,0,0
20210120,S92000003,Scotland,504,168215,3079.00,0,2,5557,0,0,0,0,0,0,13.10,0,0,0,0,0,0,0
`;

// Date range 17-01 - 19-01
const shortDailyCouncilAreasCsvData = `
Date,CA,CAName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,DailyNegative,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,PositivePercentage7Day,TotalPillar1,TotalPillar2
20210117,S12000013,Na h-Eileanan Siar,4,158,591.32,0,0,1,0,0,0,0,0,0,5.26,0,0,0
20210118,S12000013,Na h-Eileanan Siar,2,160,598.80,0,0,1,0,0,0,0,0,0,1.72,0,0,0
20210119,S12000013,Na h-Eileanan Siar,5,165,617.51,0,0,1,0,0,0,0,0,0,3.21,0,0,0
20210117,S12000049,Glasgow City,195,30869,4875.69,0,2,852,0,0,0,0,0,0,15.72,0,0,0
20210118,S12000049,Glasgow City,271,31140,4918.50,0,4,856,0,0,0,0,0,0,10.76,0,0,0
20210119,S12000049,Glasgow City,242,31382,4956.72,0,0,856,0,0,0,0,0,0,11.37,0,0,0
`;

// Date range 17-01 - 19-01
const shortDailyHealthBoardsCsvData = `
Date,HB,HBName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,DailyNegative,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,PositivePercentage7Day,TotalPillar1,TotalPillar2,HospitalAdmissions,HospitalAdmissionsQF,ICUAdmissions,ICUAdmissionsQF
20210117,S08000024,NHS Lothian,141,22680,2498.95,0,4,861,0,0,0,0,0,0,9.47,0,0,0,0,0,0,0
20210117,S08000025,NHS Orkney,4,52,233.50,0,0,2,0,0,0,0,0,0,12.12,0,0,0,0,0,0,0
20210117,S92000003,Scotland,1195,164592,3012.68,0,28,5500,0,0,0,0,0,0,12.88,0,0,0,0,0,0,0
20210118,S08000024,NHS Lothian,174,22854,2518.13,0,2,863,0,0,0,0,0,0,5.07,0,0,0,0,0,0,0
20210118,S08000025,NHS Orkney,1,53,237.99,0,0,2,0,0,0,0,0,0,0.81,0,0,0,0,0,0,0
20210118,S92000003,Scotland,1713,166305,3044.04,0,37,5537,0,0,0,0,0,0,7.67,0,0,0,0,0,0,0
20210119,S08000024,NHS Lothian,166,23020,2536.42,0,0,863,0,0,0,0,0,0,5.91,0,0,0,0,0,0,0
20210119,S08000025,NHS Orkney,0,53,237.99,0,0,2,0,0,0,0,0,0,0.00,0,0,0,0,0,0,0
20210119,S92000003,Scotland,1406,167711,3069.77,0,18,5555,0,0,0,0,0,0,6.84,0,0,0,0,0,0,0
`;

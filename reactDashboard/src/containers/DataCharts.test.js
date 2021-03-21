import React from "react";
import DataChartsContainer, { parseNhsCsvData } from "./DataCharts";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import {
  readCsvData,
  FEATURE_CODE_SCOTLAND,
} from "../components/Utils/CsvUtils";
import DataCharts from "../components/DataCharts/DataCharts";

jest.mock("../components/DataCharts/DataCharts", () => {
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
  DataCharts.mockClear();
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const MAX_DATE_RANGE = {
  startDate: Date.parse("2020-03-02"),
  endDate: Date.parse("2020-03-09"),
};
const populationProportionMap = new Map().set("population", 500);

test("dataCharts renders default data input dataset is null", async () => {
  global.suppressConsoleErrorLogs();

  await act(async () => {
    render(<DataChartsContainer />, container);
  });

  expect(DataCharts).toHaveBeenLastCalledWith(
    {
      percentageTestsSeriesData: undefined,
      dailyCasesSeriesData: undefined,
      dailyDeathsSeriesData: undefined,
      totalCasesSeriesData: undefined,
      totalDeathsSeriesData: undefined,
      darkmode: undefined,
      regionCode: undefined,
      populationProportionMap: undefined,
      maxDateRange: { startDate: 0, endDate: 1 },
    },
    {}
  );
});

test("dataCharts processes input data", async () => {
  await act(async () => {
    render(
      <DataChartsContainer
        healthBoardDataset={healthBoardDataset}
        councilAreaDataset={councilAreaDataset}
        populationProportionMap={populationProportionMap}
        darkmode={true}
        regionCode={FEATURE_CODE_SCOTLAND}
      />,
      container
    );
  });

  expect(DataCharts).toHaveBeenLastCalledWith(
    {
      percentageTestsSeriesData: regionPercentageTestsMap,
      dailyCasesSeriesData: regionDailyCasesMap,
      dailyDeathsSeriesData: regionDailyDeathsMap,
      totalCasesSeriesData: regionTotalCasesMap,
      totalDeathsSeriesData: regionTotalDeathsMap,
      darkmode: true,
      regionCode: FEATURE_CODE_SCOTLAND,
      populationProportionMap: populationProportionMap,
      maxDateRange: MAX_DATE_RANGE,
    },
    {}
  );
});

test("parseNhsCsvData", () => {
  const expectedResult = {
    regionPercentageTestsMap: regionPercentageTestsMapHBOnly,
    regionDailyCasesMap: regionDailyCasesMapHBOnly,
    regionDailyDeathsMap: regionDailyDeathsMapHBOnly,
    regionTotalCasesMap: regionTotalCasesMapHBOnly,
    regionTotalDeathsMap: regionTotalDeathsMapHBOnly,
  };

  expect(parseNhsCsvData(healthBoardDataset)).toStrictEqual(expectedResult);
});

const nhsHBCsvData = `Date,HB,HBName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,DailyNegative,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,TotalPillar1,TotalPillar2,HospitalAdmissions,HospitalAdmissionsQF,ICUAdmissions,ICUAdmissionsQF
20200302,S08000031,unknown,1,2,2,0,5,6,7,8,9,0,0,0,0.1
20200302,S08000022,unknown,11,12,6,0,15,16,17,18,19,0,0,0,1.1
20200302,S92000003,Scotland,33,36,4.133333333333334,0,45,48,17,54,19,0,0,0,3.3
20200303,S08000031,unknown,31,32,32,0,35,36,37,38,39,0,0,0,3.1
20200303,S08000022,unknown,41,42,21,0,45,46,47,48,49,0,0,0,4.1
20200303,S92000003,Scotland,123,126,21.133333333333333,0,135,138,47,144,49,0,0,0,12.3
20200304,S08000031,unknown,61,62,62,0,65,66,67,68,69,0,0,0,6.1
20200304,S08000022,unknown,71,72,36,0,75,76,77,78,79,0,0,0,7.1
20200304,S92000003,Scotland,213,216,38.13333333333333,0,225,228,77,234,79,0,0,0,21.3
20200305,S08000031,unknown,91,92,92,0,95,96,97,98,99,0,0,0,9.1
20200305,S08000022,unknown,101,102,51,0,105,106,107,108,109,0,0,0,10.1
20200305,S92000003,Scotland,303,306,55.13333333333333,0,315,318,107,324,109,0,0,0,30.3
20200306,S08000031,unknown,121,122,122,0,125,126,127,128,129,0,0,0,12.1
20200306,S08000022,unknown,131,132,66,0,135,136,137,138,139,0,0,0,13.1
20200306,S92000003,Scotland,393,396,72.13333333333334,0,405,408,137,414,139,0,0,0,39.3
20200307,S08000031,unknown,151,152,152,0,155,156,157,158,159,0,0,0,15.1
20200307,S08000022,unknown,161,162,81,0,165,166,167,168,169,0,0,0,16.1
20200307,S92000003,Scotland,483,486,89.13333333333333,0,495,498,167,504,169,0,0,0,48.3
20200308,S08000031,unknown,181,182,182,0,185,186,187,188,189,0,0,0,18.1
20200308,S08000022,unknown,191,192,96,0,195,196,197,198,199,0,0,0,19.1
20200308,S92000003,Scotland,573,576,106.13333333333333,0,585,588,197,594,199,0,0,0,57.3
20200309,S08000031,unknown,211,212,212,0,215,216,217,218,219,0,0,0,21.1
20200309,S08000022,unknown,221,222,111,0,225,226,227,228,229,0,0,0,22.1
20200309,S92000003,Scotland,663,888,111,0,675,678,227,684,229,0,0,0,66.3
`;

const nhsCACsvData = `Date,CA,CAName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,DailyNegative,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,TotalPillar1,TotalPillar2,HospitalAdmissions,HospitalAdmissionsQF,ICUAdmissions,ICUAdmissionsQF
20200302,S12000013,unknown,21,22,4.4,0,25,26,27,28,29,0,0,0,2.1
20200303,S12000013,unknown,51,52,10.4,0,55,56,57,58,59,0,0,0,5.1
20200304,S12000013,unknown,81,82,16.4,0,85,86,87,88,89,0,0,0,8.1
20200305,S12000013,unknown,111,112,22.4,0,115,116,117,118,119,0,0,0,11.1
20200306,S12000013,unknown,141,142,28.4,0,145,146,147,148,149,0,0,0,14.1
20200307,S12000013,unknown,171,172,34.4,0,175,176,177,178,179,0,0,0,17.1
20200308,S12000013,unknown,201,202,40.4,0,205,206,207,208,209,0,0,0,20.1
20200309,S12000013,unknown,231,232,46.4,0,235,236,237,238,239,0,0,0,23.1
`;

const healthBoardDataset = readCsvData(nhsHBCsvData);

const councilAreaDataset = readCsvData(nhsCACsvData);

const regionPercentageTestsMapHBOnly = new Map()
  .set("S08000031", [
    { t: Date.parse("2020-03-02"), y: 0.1 },
    { t: Date.parse("2020-03-03"), y: 3.1 },
    { t: Date.parse("2020-03-04"), y: 6.1 },
    { t: Date.parse("2020-03-05"), y: 9.1 },
    { t: Date.parse("2020-03-06"), y: 12.1 },
    { t: Date.parse("2020-03-07"), y: 15.1 },
    { t: Date.parse("2020-03-08"), y: 18.1 },
    { t: Date.parse("2020-03-09"), y: 21.1 },
  ])
  .set("S08000022", [
    { t: Date.parse("2020-03-02"), y: 1.1 },
    { t: Date.parse("2020-03-03"), y: 4.1 },
    { t: Date.parse("2020-03-04"), y: 7.1 },
    { t: Date.parse("2020-03-05"), y: 10.1 },
    { t: Date.parse("2020-03-06"), y: 13.1 },
    { t: Date.parse("2020-03-07"), y: 16.1 },
    { t: Date.parse("2020-03-08"), y: 19.1 },
    { t: Date.parse("2020-03-09"), y: 22.1 },
  ])
  .set("S92000003", [
    { t: Date.parse("2020-03-02"), y: 3.3 },
    { t: Date.parse("2020-03-03"), y: 12.3 },
    { t: Date.parse("2020-03-04"), y: 21.3 },
    { t: Date.parse("2020-03-05"), y: 30.3 },
    { t: Date.parse("2020-03-06"), y: 39.3 },
    { t: Date.parse("2020-03-07"), y: 48.3 },
    { t: Date.parse("2020-03-08"), y: 57.3 },
    { t: Date.parse("2020-03-09"), y: 66.3 },
  ]);

const regionDailyCasesMapHBOnly = new Map()
  .set("S08000031", [
    { t: Date.parse("2020-03-02"), y: 1 },
    { t: Date.parse("2020-03-03"), y: 31 },
    { t: Date.parse("2020-03-04"), y: 61 },
    { t: Date.parse("2020-03-05"), y: 91 },
    { t: Date.parse("2020-03-06"), y: 121 },
    { t: Date.parse("2020-03-07"), y: 151 },
    { t: Date.parse("2020-03-08"), y: 181 },
    { t: Date.parse("2020-03-09"), y: 211 },
  ])
  .set("S08000022", [
    { t: Date.parse("2020-03-02"), y: 11 },
    { t: Date.parse("2020-03-03"), y: 41 },
    { t: Date.parse("2020-03-04"), y: 71 },
    { t: Date.parse("2020-03-05"), y: 101 },
    { t: Date.parse("2020-03-06"), y: 131 },
    { t: Date.parse("2020-03-07"), y: 161 },
    { t: Date.parse("2020-03-08"), y: 191 },
    { t: Date.parse("2020-03-09"), y: 221 },
  ])
  .set("S92000003", [
    { t: Date.parse("2020-03-02"), y: 33 },
    { t: Date.parse("2020-03-03"), y: 123 },
    { t: Date.parse("2020-03-04"), y: 213 },
    { t: Date.parse("2020-03-05"), y: 303 },
    { t: Date.parse("2020-03-06"), y: 393 },
    { t: Date.parse("2020-03-07"), y: 483 },
    { t: Date.parse("2020-03-08"), y: 573 },
    { t: Date.parse("2020-03-09"), y: 663 },
  ]);

const regionDailyDeathsMapHBOnly = new Map()
  .set("S08000031", [
    { t: Date.parse("2020-03-02"), y: 5 },
    { t: Date.parse("2020-03-03"), y: 35 },
    { t: Date.parse("2020-03-04"), y: 65 },
    { t: Date.parse("2020-03-05"), y: 95 },
    { t: Date.parse("2020-03-06"), y: 125 },
    { t: Date.parse("2020-03-07"), y: 155 },
    { t: Date.parse("2020-03-08"), y: 185 },
    { t: Date.parse("2020-03-09"), y: 215 },
  ])
  .set("S08000022", [
    { t: Date.parse("2020-03-02"), y: 15 },
    { t: Date.parse("2020-03-03"), y: 45 },
    { t: Date.parse("2020-03-04"), y: 75 },
    { t: Date.parse("2020-03-05"), y: 105 },
    { t: Date.parse("2020-03-06"), y: 135 },
    { t: Date.parse("2020-03-07"), y: 165 },
    { t: Date.parse("2020-03-08"), y: 195 },
    { t: Date.parse("2020-03-09"), y: 225 },
  ])
  .set("S92000003", [
    { t: Date.parse("2020-03-02"), y: 45 },
    { t: Date.parse("2020-03-03"), y: 135 },
    { t: Date.parse("2020-03-04"), y: 225 },
    { t: Date.parse("2020-03-05"), y: 315 },
    { t: Date.parse("2020-03-06"), y: 405 },
    { t: Date.parse("2020-03-07"), y: 495 },
    { t: Date.parse("2020-03-08"), y: 585 },
    { t: Date.parse("2020-03-09"), y: 675 },
  ]);

const regionTotalCasesMapHBOnly = new Map()
  .set("S08000031", [
    { t: Date.parse("2020-03-02"), y: 2 },
    { t: Date.parse("2020-03-03"), y: 32 },
    { t: Date.parse("2020-03-04"), y: 62 },
    { t: Date.parse("2020-03-05"), y: 92 },
    { t: Date.parse("2020-03-06"), y: 122 },
    { t: Date.parse("2020-03-07"), y: 152 },
    { t: Date.parse("2020-03-08"), y: 182 },
    { t: Date.parse("2020-03-09"), y: 212 },
  ])
  .set("S08000022", [
    { t: Date.parse("2020-03-02"), y: 12 },
    { t: Date.parse("2020-03-03"), y: 42 },
    { t: Date.parse("2020-03-04"), y: 72 },
    { t: Date.parse("2020-03-05"), y: 102 },
    { t: Date.parse("2020-03-06"), y: 132 },
    { t: Date.parse("2020-03-07"), y: 162 },
    { t: Date.parse("2020-03-08"), y: 192 },
    { t: Date.parse("2020-03-09"), y: 222 },
  ])
  .set("S92000003", [
    { t: Date.parse("2020-03-02"), y: 36 },
    { t: Date.parse("2020-03-03"), y: 126 },
    { t: Date.parse("2020-03-04"), y: 216 },
    { t: Date.parse("2020-03-05"), y: 306 },
    { t: Date.parse("2020-03-06"), y: 396 },
    { t: Date.parse("2020-03-07"), y: 486 },
    { t: Date.parse("2020-03-08"), y: 576 },
    { t: Date.parse("2020-03-09"), y: 888 },
  ]);

const regionTotalDeathsMapHBOnly = new Map()
  .set("S08000031", [
    { t: Date.parse("2020-03-02"), y: 6 },
    { t: Date.parse("2020-03-03"), y: 36 },
    { t: Date.parse("2020-03-04"), y: 66 },
    { t: Date.parse("2020-03-05"), y: 96 },
    { t: Date.parse("2020-03-06"), y: 126 },
    { t: Date.parse("2020-03-07"), y: 156 },
    { t: Date.parse("2020-03-08"), y: 186 },
    { t: Date.parse("2020-03-09"), y: 216 },
  ])
  .set("S08000022", [
    { t: Date.parse("2020-03-02"), y: 16 },
    { t: Date.parse("2020-03-03"), y: 46 },
    { t: Date.parse("2020-03-04"), y: 76 },
    { t: Date.parse("2020-03-05"), y: 106 },
    { t: Date.parse("2020-03-06"), y: 136 },
    { t: Date.parse("2020-03-07"), y: 166 },
    { t: Date.parse("2020-03-08"), y: 196 },
    { t: Date.parse("2020-03-09"), y: 226 },
  ])
  .set("S92000003", [
    { t: Date.parse("2020-03-02"), y: 48 },
    { t: Date.parse("2020-03-03"), y: 138 },
    { t: Date.parse("2020-03-04"), y: 228 },
    { t: Date.parse("2020-03-05"), y: 318 },
    { t: Date.parse("2020-03-06"), y: 408 },
    { t: Date.parse("2020-03-07"), y: 498 },
    { t: Date.parse("2020-03-08"), y: 588 },
    { t: Date.parse("2020-03-09"), y: 678 },
  ]);

const regionPercentageTestsMap = new Map(regionPercentageTestsMapHBOnly).set(
  "S12000013",
  [
    { t: Date.parse("2020-03-02"), y: 2.1 },
    { t: Date.parse("2020-03-03"), y: 5.1 },
    { t: Date.parse("2020-03-04"), y: 8.1 },
    { t: Date.parse("2020-03-05"), y: 11.1 },
    { t: Date.parse("2020-03-06"), y: 14.1 },
    { t: Date.parse("2020-03-07"), y: 17.1 },
    { t: Date.parse("2020-03-08"), y: 20.1 },
    { t: Date.parse("2020-03-09"), y: 23.1 },
  ]
);

const regionDailyCasesMap = new Map(regionDailyCasesMapHBOnly).set(
  "S12000013",
  [
    { t: Date.parse("2020-03-02"), y: 21 },
    { t: Date.parse("2020-03-03"), y: 51 },
    { t: Date.parse("2020-03-04"), y: 81 },
    { t: Date.parse("2020-03-05"), y: 111 },
    { t: Date.parse("2020-03-06"), y: 141 },
    { t: Date.parse("2020-03-07"), y: 171 },
    { t: Date.parse("2020-03-08"), y: 201 },
    { t: Date.parse("2020-03-09"), y: 231 },
  ]
);

const regionDailyDeathsMap = new Map(regionDailyDeathsMapHBOnly).set(
  "S12000013",
  [
    { t: Date.parse("2020-03-02"), y: 25 },
    { t: Date.parse("2020-03-03"), y: 55 },
    { t: Date.parse("2020-03-04"), y: 85 },
    { t: Date.parse("2020-03-05"), y: 115 },
    { t: Date.parse("2020-03-06"), y: 145 },
    { t: Date.parse("2020-03-07"), y: 175 },
    { t: Date.parse("2020-03-08"), y: 205 },
    { t: Date.parse("2020-03-09"), y: 235 },
  ]
);

const regionTotalCasesMap = new Map(regionTotalCasesMapHBOnly).set(
  "S12000013",
  [
    { t: Date.parse("2020-03-02"), y: 22 },
    { t: Date.parse("2020-03-03"), y: 52 },
    { t: Date.parse("2020-03-04"), y: 82 },
    { t: Date.parse("2020-03-05"), y: 112 },
    { t: Date.parse("2020-03-06"), y: 142 },
    { t: Date.parse("2020-03-07"), y: 172 },
    { t: Date.parse("2020-03-08"), y: 202 },
    { t: Date.parse("2020-03-09"), y: 232 },
  ]
);

const regionTotalDeathsMap = new Map(regionTotalDeathsMapHBOnly).set(
  "S12000013",
  [
    { t: Date.parse("2020-03-02"), y: 26 },
    { t: Date.parse("2020-03-03"), y: 56 },
    { t: Date.parse("2020-03-04"), y: 86 },
    { t: Date.parse("2020-03-05"), y: 116 },
    { t: Date.parse("2020-03-06"), y: 146 },
    { t: Date.parse("2020-03-07"), y: 176 },
    { t: Date.parse("2020-03-08"), y: 206 },
    { t: Date.parse("2020-03-09"), y: 236 },
  ]
);

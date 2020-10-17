import React from "react";
import DataCharts, {
  parseNhsCsvData,
  getPopulationMap,
  calculatePopulationProportionMap,
} from "./DataCharts";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { readCsvData, createPlaceDateValuesMap } from "../Utils/CsvUtils";

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

const MAX_DATE_RANGE = { startDate: 0, endDate: 1 };

test("dataCharts renders default data input dataset is null", async () => {
  global.suppressConsoleErrorLogs();

  await act(async () => {
    render(<DataCharts maxDateRange={MAX_DATE_RANGE} />, container);
  });

  const canvas = container.querySelector(".chart-container canvas");
  expect(canvas).not.toBeNull();
});

test("dataCharts renders dynamic fetched data", async () => {
  await act(async () => {
    render(
      <DataCharts
        healthBoardDataset={healthBoardDataset}
        maxDateRange={MAX_DATE_RANGE}
      />,
      container
    );
  });

  const canvas = container.querySelector(".chart-container canvas");
  expect(canvas).not.toBeNull();
  // TODO need to figure out how to test chart.js content
});

test("parseNhsCsvData", () => {
  const expectedResult = {
    populationMap: new Map()
      .set("S08000031", 100000)
      .set("S08000022", 200000)
      .set("S12000013", 500000)
      .set("S92000003", 800000),
    regionPercentageCasesMap: new Map()
      .set("S08000031", [
        { t: Date.parse("2020-03-02"), y: (100 * 2) / (2 + 8) },
        { t: Date.parse("2020-03-03"), y: (100 * 32) / (32 + 38) },
        { t: Date.parse("2020-03-04"), y: (100 * 62) / (62 + 68) },
        { t: Date.parse("2020-03-05"), y: (100 * 92) / (92 + 98) },
        { t: Date.parse("2020-03-06"), y: (100 * 122) / (122 + 128) },
        {
          t: Date.parse("2020-03-07"),
          y: (100 * (152 - 2)) / (152 - 2 + 158 - 8),
        },
        {
          t: Date.parse("2020-03-08"),
          y: (100 * (182 - 32)) / (182 - 32 + 188 - 38),
        },
        {
          t: Date.parse("2020-03-09"),
          y: (100 * (212 - 62)) / (212 - 62 + 218 - 68),
        },
      ])
      .set("S08000022", [
        { t: Date.parse("2020-03-02"), y: (100 * 12) / (12 + 18) },
        { t: Date.parse("2020-03-03"), y: (100 * 42) / (42 + 48) },
        { t: Date.parse("2020-03-04"), y: (100 * 72) / (72 + 78) },
        { t: Date.parse("2020-03-05"), y: (100 * 102) / (102 + 108) },
        { t: Date.parse("2020-03-06"), y: (100 * 132) / (132 + 138) },
        {
          t: Date.parse("2020-03-07"),
          y: (100 * (162 - 12)) / (162 - 12 + 168 - 18),
        },
        {
          t: Date.parse("2020-03-08"),
          y: (100 * (192 - 42)) / (192 - 42 + 198 - 48),
        },
        {
          t: Date.parse("2020-03-09"),
          y: (100 * (222 - 72)) / (222 - 72 + 228 - 78),
        },
      ])
      .set("S12000013", [
        { t: Date.parse("2020-03-02"), y: (100 * 22) / (22 + 28) },
        { t: Date.parse("2020-03-03"), y: (100 * 52) / (52 + 58) },
        { t: Date.parse("2020-03-04"), y: (100 * 82) / (82 + 88) },
        { t: Date.parse("2020-03-05"), y: (100 * 112) / (112 + 118) },
        { t: Date.parse("2020-03-06"), y: (100 * 142) / (142 + 148) },
        {
          t: Date.parse("2020-03-07"),
          y: (100 * (172 - 22)) / (172 - 22 + 178 - 28),
        },
        {
          t: Date.parse("2020-03-08"),
          y: (100 * (202 - 52)) / (202 - 52 + 208 - 58),
        },
        {
          t: Date.parse("2020-03-09"),
          y: (100 * (232 - 82)) / (232 - 82 + 238 - 88),
        },
      ])
      .set("S92000003", [
        { t: Date.parse("2020-03-02"), y: (100 * 36) / (36 + 54) },
        { t: Date.parse("2020-03-03"), y: (100 * 126) / (126 + 144) },
        { t: Date.parse("2020-03-04"), y: (100 * 216) / (216 + 234) },
        { t: Date.parse("2020-03-05"), y: (100 * 306) / (306 + 324) },
        { t: Date.parse("2020-03-06"), y: (100 * 396) / (396 + 414) },
        {
          t: Date.parse("2020-03-07"),
          y: (100 * (486 - 36)) / (486 - 36 + 504 - 54),
        },
        {
          t: Date.parse("2020-03-08"),
          y: (100 * (576 - 126)) / (576 - 126 + 594 - 144),
        },
        {
          t: Date.parse("2020-03-09"),
          y: (100 * (888 - 216)) / (888 - 216 + 684 - 234),
        },
      ]),
    regionDailyCasesMap: new Map()
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
      .set("S12000013", [
        { t: Date.parse("2020-03-02"), y: 21 },
        { t: Date.parse("2020-03-03"), y: 51 },
        { t: Date.parse("2020-03-04"), y: 81 },
        { t: Date.parse("2020-03-05"), y: 111 },
        { t: Date.parse("2020-03-06"), y: 141 },
        { t: Date.parse("2020-03-07"), y: 171 },
        { t: Date.parse("2020-03-08"), y: 201 },
        { t: Date.parse("2020-03-09"), y: 231 },
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
      ]),
    regionDailyDeathsMap: new Map()
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
      .set("S12000013", [
        { t: Date.parse("2020-03-02"), y: 25 },
        { t: Date.parse("2020-03-03"), y: 55 },
        { t: Date.parse("2020-03-04"), y: 85 },
        { t: Date.parse("2020-03-05"), y: 115 },
        { t: Date.parse("2020-03-06"), y: 145 },
        { t: Date.parse("2020-03-07"), y: 175 },
        { t: Date.parse("2020-03-08"), y: 205 },
        { t: Date.parse("2020-03-09"), y: 235 },
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
      ]),
    regionTotalCasesMap: new Map()
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
      .set("S12000013", [
        { t: Date.parse("2020-03-02"), y: 22 },
        { t: Date.parse("2020-03-03"), y: 52 },
        { t: Date.parse("2020-03-04"), y: 82 },
        { t: Date.parse("2020-03-05"), y: 112 },
        { t: Date.parse("2020-03-06"), y: 142 },
        { t: Date.parse("2020-03-07"), y: 172 },
        { t: Date.parse("2020-03-08"), y: 202 },
        { t: Date.parse("2020-03-09"), y: 232 },
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
      ]),
    regionTotalDeathsMap: new Map()
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
      .set("S12000013", [
        { t: Date.parse("2020-03-02"), y: 26 },
        { t: Date.parse("2020-03-03"), y: 56 },
        { t: Date.parse("2020-03-04"), y: 86 },
        { t: Date.parse("2020-03-05"), y: 116 },
        { t: Date.parse("2020-03-06"), y: 146 },
        { t: Date.parse("2020-03-07"), y: 176 },
        { t: Date.parse("2020-03-08"), y: 206 },
        { t: Date.parse("2020-03-09"), y: 236 },
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
      ]),
  };

  expect(parseNhsCsvData(healthBoardDataset)).toStrictEqual(expectedResult);
});

test("getPopulationMap", () => {
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

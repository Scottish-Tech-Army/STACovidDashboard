import React from "react";
import RegionDataCharts, { parseNhsCsvData } from "./RegionDataCharts";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
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

const MAX_DATE_RANGE = {startDate: 0, endDate: 1}

test("dataCharts renders default data input dataset is null", async () => {
  global.suppressConsoleErrorLogs();

  await act(async () => {
    render(<RegionDataCharts maxDateRange={MAX_DATE_RANGE} />, container);
  });

  const canvas = container.querySelector(".chart-container canvas");
  expect(canvas).not.toBeNull();
});

test("dataCharts renders dynamic fetched data", async () => {
  await act(async () => {
    render(
      <RegionDataCharts
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
    populationProportionMap: new Map()
      .set("S08000031", 0.125)
      .set("S08000022", 0.25)
      .set("S12000013", 0.625),
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
        { t: Date.parse("2020-03-09"), y: 666 },
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

const nhsCsvData = `Date,HB,HBName,DailyPositive,CumulativePositive,CrudeRatePositive,CumulativePositivePercent,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,CumulativeNegative,CrudeRateNegative
20200302,S08000031,unknown,1,2,2,4,5,6,7,8,9
20200302,S08000022,unknown,11,12,6,14,15,16,17,18,19
20200302,S12000013,unknown,21,22,4.4,24,25,26,27,28,29
20200303,S08000031,unknown,31,32,32,34,35,36,37,38,39
20200303,S08000022,unknown,41,42,21,44,45,46,47,48,49
20200303,S12000013,unknown,51,52,10.4,54,55,56,57,58,59
20200304,S08000031,unknown,61,62,62,64,65,66,67,68,69
20200304,S08000022,unknown,71,72,36,74,75,76,77,78,79
20200304,S12000013,unknown,81,82,16.4,84,85,86,87,88,89
20200305,S08000031,unknown,91,92,92,94,95,96,97,98,99
20200305,S08000022,unknown,101,102,51,104,105,106,107,108,109
20200305,S12000013,unknown,111,112,22.4,114,115,116,117,118,119
20200306,S08000031,unknown,121,122,122,124,125,126,127,128,129
20200306,S08000022,unknown,131,132,66,134,135,136,137,138,139
20200306,S12000013,unknown,141,142,28.4,144,145,146,147,148,149
20200307,S08000031,unknown,151,152,152,154,155,156,157,158,159
20200307,S08000022,unknown,161,162,81,164,165,166,167,168,169
20200307,S12000013,unknown,171,172,34.4,174,175,176,177,178,179
20200308,S08000031,unknown,181,182,182,184,185,186,187,188,189
20200308,S08000022,unknown,191,192,96,194,195,196,197,198,199
20200308,S12000013,unknown,201,202,40.4,204,205,206,207,208,209
20200309,S08000031,unknown,211,212,212,214,215,216,217,218,219
20200309,S08000022,unknown,221,222,111,224,225,226,227,228,229
20200309,S12000013,unknown,231,232,46.4,234,235,236,237,238,239`;

const healthBoardDataset = readCsvData(nhsCsvData);

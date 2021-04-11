import React from "react";
import DataCharts from "./DataCharts";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { createChart, getSonificationSeriesTitle } from "./DataChartsModel";

jest.mock("./DataChartsModel");

var container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  fetch.resetMocks();
  createChart.mockReturnValue(null);
  getSonificationSeriesTitle.mockImplementation((chartType) => chartType);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("dataCharts renders default data input dataset is null", async () => {
  global.suppressConsoleErrorLogs();

  await act(async () => {
    render(<DataCharts />, container);
  });

  const canvas = container.querySelector(".chart-container canvas");
  expect(canvas).not.toBeNull();
});

test("dataCharts renders dynamic fetched data", async () => {
  await act(async () => {
    render(<DataCharts allData={testAllData} />, container);
  });

  const canvas = container.querySelector(".chart-container canvas");
  expect(canvas).not.toBeNull();
  // TODO need to figure out how to test chart.js content
});

const testAllData = {
  dates: [
    Date.parse("2020-03-02"),
    Date.parse("2020-03-03"),
    Date.parse("2020-03-04"),
    Date.parse("2020-03-05"),
    Date.parse("2020-03-06"),
    Date.parse("2020-03-07"),
    Date.parse("2020-03-08"),
    Date.parse("2020-03-09"),
  ],
  startDate: Date.parse("2020-03-02"),
  endDate: Date.parse("2020-03-09"),
  regions: {
    S08000031: {
      dailySeries: {
        dailyCases: [1, 31, 61, 91, 121, 151, 181, 211],
        dailyDeaths: [5, 35, 65, 95, 125, 155, 185, 215],
        totalCases: [2, 32, 62, 92, 122, 152, 182, 212],
        totalDeaths: [6, 36, 66, 96, 126, 156, 186, 216],
        percentPositiveTests: [0.1, 3.1, 6.1, 9.1, 12.1, 15.1, 18.1, 21.1],
      },
    },
    S08000022: {
      dailySeries: {
        dailyCases: [11, 41, 71, 101, 131, 161, 191, 221],
        dailyDeaths: [15, 45, 75, 105, 135, 165, 195, 225],
        totalCases: [12, 42, 72, 102, 132, 162, 192, 222],
        totalDeaths: [16, 46, 76, 106, 136, 166, 196, 226],
        percentPositiveTests: [1.1, 4.1, 7.1, 10.1, 13.1, 16.1, 19.1, 22.1],
      },
    },
    S12000013: {
      dailySeries: {
        dailyCases: [21, 51, 81, 111, 141, 171, 201, 231],
        dailyDeaths: [25, 55, 85, 115, 145, 175, 205, 235],
        totalCases: [22, 52, 82, 112, 142, 172, 202, 232],
        totalDeaths: [26, 56, 86, 116, 146, 176, 206, 236],
        percentPositiveTests: [2.1, 5.1, 8.1, 11.1, 14.1, 17.1, 20.1, 23.1],
      },
    },
    S92000003: {
      dailySeries: {
        dailyCases: [33, 123, 213, 303, 393, 483, 573, 663],
        dailyDeaths: [45, 135, 225, 315, 405, 495, 585, 675],
        totalCases: [36, 126, 216, 306, 396, 486, 576, 888],
        totalDeaths: [48, 138, 228, 318, 408, 498, 588, 678],
        percentPositiveTests: [3.3, 12.3, 21.3, 30.3, 39.3, 48.3, 57.3, 66.3],
      },
    },
  },
};

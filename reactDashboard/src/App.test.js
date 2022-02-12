import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import App from "./App";

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

test("default render", async () => {
  fetch.mockReject(new Error("fetch failed"));
  global.suppressConsoleErrorLogs();

  const app = () => container.querySelector(".App");

  await act(async () => {
    render(<App />, container);
  });
  expect(app().getAttribute("class")).not.toContain("darkmode");

});


const TOTALS_DATE = Date.parse("2021-01-21");

// prettier-ignore
const testAllData = {
  regions: {
    S12000013: {
      weeklyCases: 50,
      weeklyDeaths: 0,
      name: "Na h-Eileanan Siar",
      dailyCases: { date: TOTALS_DATE, value: 4 },
      dailyDeaths: { date: TOTALS_DATE, value: 0 },
      cumulativeCases: { date: TOTALS_DATE, value: 167 },
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
      dailyCases: { date: TOTALS_DATE, value: 282 },
      dailyDeaths: { date: TOTALS_DATE, value: 8 },
      cumulativeCases: { date: TOTALS_DATE, value: 31484 },
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
      dailyCases: { date: TOTALS_DATE, value: 182 },
      dailyDeaths: { date: TOTALS_DATE, value: 10 },
      cumulativeCases: { date: TOTALS_DATE, value: 23061 },
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
      weeklyCases: 13311,
      weeklyDeaths: 343,
      name: "Scotland",
      dailyCases: { date: TOTALS_DATE, value: 1636 },
      dailyDeaths: { date: TOTALS_DATE, value: 89 },
      cumulativeCases: { date: TOTALS_DATE, value: 168219 },
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

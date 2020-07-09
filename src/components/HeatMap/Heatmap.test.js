import React from "react";
import Heatmap, { parseCsvData, parseDiffCsvData } from "./Heatmap";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

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

const weeklyDeathsCsvData = `date,areaname,count
  w/c 2020-03-16,Orkney Islands,0
  w/c 2020-03-16,Glasgow City,1
  w/c 2020-03-16,Aberdeen City,1
  w/c 2020-03-23,Orkney Islands,0
  w/c 2020-03-23,Glasgow City,7
  w/c 2020-03-23,Aberdeen City,0
  w/c 2020-03-30,Orkney Islands,0
  w/c 2020-03-30,Glasgow City,46
  w/c 2020-03-30,Aberdeen City,2
  w/c 2020-04-06,Orkney Islands,2
  w/c 2020-04-06,Glasgow City,97
  w/c 2020-04-06,Aberdeen City,12`;

// These are cumulative values, the deltas are calculated
const dailyCasesCsvData = `date,areaname,count
2020-03-06,Greater Glasgow and Clyde,*
2020-03-06,Highland,1
2020-03-06,Grampian,1
2020-03-09,Greater Glasgow and Clyde,*
2020-03-09,Highland,300
2020-03-09,Grampian,-8
2020-03-08,Greater Glasgow and Clyde,*
2020-03-08,Highland,201
2020-03-08,Grampian,26
2020-03-07,Greater Glasgow and Clyde,*
2020-03-07,Highland,-1
2020-03-07,Grampian,-1`;

it("Heatmap renders no data when fetch fails, shows loadingComponent", async () => {
  fetch.mockReject(new Error("fetch failed"));
  // Suppress console error message
  spyOn(console, "error");

  await act(async () => {
    render(<Heatmap />, container);
  });

  expect(loadingComponent()).not.toBeNull();
  expect(table()).toBeNull();
});

it("Heatmap renders dynamic fetched data - council areas; deaths", async () => {
  fetch.mockResponse(weeklyDeathsCsvData);

  await act(async () => {
    render(<Heatmap valueType="deaths" areaType="council-areas" />, container);
  });

  expect(loadingComponent()).toBeNull();
  checkHeaderRow(
    headers(),
    "Council Areas",
    "Total Deaths",
    "Weekly Count≥ 0≥ 1≥ 5≥ 10≥ 100≥ 200 "
  );

  const dataRows = rows();
  expect(dataRows).toHaveLength(4);
  checkDateRangeRow(dataRows[0], "16 Mar 202012 Apr 2020");
  checkRow(dataRows[1], "Aberdeen City", "15", [1, 0, 1, 3]);
  checkRow(dataRows[2], "Glasgow City", "151", [1, 2, 3, 3]);
  checkRow(dataRows[3], "Orkney Islands", "2", [0, 0, 0, 1]);
});

it("Heatmap renders dynamic fetched data - health boards; deaths", async () => {
  fetch.mockResponse(weeklyDeathsCsvData);

  await act(async () => {
    render(<Heatmap valueType="deaths" areaType="health-boards" />, container);
  });

  expect(loadingComponent()).toBeNull();
  checkHeaderRow(
    headers(),
    "Health Boards",
    "Total Deaths",
    "Weekly Count≥ 0≥ 1≥ 5≥ 10≥ 100≥ 200 "
  );

  const dataRows = rows();
  expect(dataRows).toHaveLength(4);
  checkDateRangeRow(dataRows[0], "16 Mar 202012 Apr 2020");
  checkRow(dataRows[1], "Aberdeen City", "15", [1, 0, 1, 3]);
  checkRow(dataRows[2], "Glasgow City", "151", [1, 2, 3, 3]);
  checkRow(dataRows[3], "Orkney Islands", "2", [0, 0, 0, 1]);
});

it("Heatmap renders dynamic fetched data - health boards; cases", async () => {
  fetch.mockResponse(dailyCasesCsvData);

  await act(async () => {
    render(<Heatmap valueType="cases" areaType="health-boards" />, container);
  });

  expect(loadingComponent()).toBeNull();
  checkHeaderRow(
    headers(),
    "Health Boards",
    "Total Cases",
    "Daily Count≥ 0≥ 1≥ 5≥ 10≥ 100≥ 200 "
  );

  const dataRows = rows();
  expect(dataRows).toHaveLength(4);
  checkDateRangeRow(dataRows[0], "06 Mar 202009 Mar 2020");
  checkRow(dataRows[1], "Grampian", "-8", [1, 0, 3, 0]);
  checkRow(dataRows[2], "Greater Glasgow and Clyde", "0", [0, 0, 0, 0]);
  checkRow(dataRows[3], "Highland", "300", [1, 0, 5, 3]);
});

const loadingComponent = () => container.querySelector(".loading-component");
const table = () => container.querySelector(".heatmap table");
const headers = () => table().querySelector("thead tr");
const rows = () => table().querySelectorAll("tbody tr");

it("parseCsvData", () => {
  const expectedResult = {
    dates: ["2020-03-16", "2020-03-23", "2020-03-30", "2020-04-06"],
    regions: [
      {
        counts: [1, 0, 2, 12],
        name: "Aberdeen City",
        totalDeaths: 15,
      },
      {
        counts: [1, 7, 46, 97],
        name: "Glasgow City",
        totalDeaths: 151,
      },
      {
        counts: [0, 0, 0, 2],
        name: "Orkney Islands",
        totalDeaths: 2,
      },
    ],
  };

  expect(parseCsvData(weeklyDeathsCsvData)).toEqual(expectedResult);
});

it("parseDiffCsvData", () => {
  // Remember these are deltas of cumulative figures
  const expectedResult = {
    dates: ["2020-03-06", "2020-03-07", "2020-03-08", "2020-03-09"],
    regions: [
      {
        counts: [1, -2, 27, -34],
        name: "Grampian",
        totalDeaths: -8,
      },
      {
        counts: [0, 0, 0, 0],
        name: "Greater Glasgow and Clyde",
        totalDeaths: 0,
      },
      {
        counts: [1, -2, 202, 99],
        name: "Highland",
        totalDeaths: 300,
      },
    ],
  };

  expect(parseDiffCsvData(dailyCasesCsvData)).toEqual(expectedResult);
});

function checkHeaderRow(row, areaName, areaCount, heatLevels) {
  const headers = row.querySelectorAll("th");
  expect(headers).toHaveLength(3);
  expect(headers[0].textContent).toEqual(areaName);
  expect(headers[1].textContent).toEqual(areaCount);
  expect(headers[2].textContent).toEqual(heatLevels);
}

function checkDateRangeRow(row, dateRange) {
  const cells = row.querySelectorAll("td");
  expect(cells).toHaveLength(3);
  expect(cells[0].textContent).toEqual("");
  expect(cells[1].textContent).toEqual("");
  expect(cells[2].textContent).toEqual(dateRange);
}

function checkRow(row, areaName, areaCount, heatLevels) {
  const cells = row.querySelectorAll("td");
  expect(cells).toHaveLength(3);
  expect(cells[0].textContent).toEqual(areaName);
  expect(cells[1].textContent).toEqual(areaCount);
  checkHeatbar(cells[2], heatLevels);
}

function checkHeatbar(heatbar, heatLevels) {
  const svgs = heatbar.querySelectorAll("svg");
  expect(svgs).toHaveLength(1);
  const svg = svgs[0];
  const lines = heatbar.querySelectorAll("line");
  expect(lines).toHaveLength(heatLevels.length);

  var lastX = 0;
  lines.forEach((line, i) => {
    // Check the correct level class is set
    expect(line.getAttribute("class")).toBe("l-" + heatLevels[i]);
    // Check x value is increasing
    var currentX = Number(line.getAttribute("x1"));
    expect(currentX > lastX).toBeTruthy();
    lastX = currentX;
  });
}

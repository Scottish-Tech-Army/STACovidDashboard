import React from "react";
import Heatmap, { parseCsvData } from "./Heatmap";
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

const csvData = `date,areaname,count
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

it("Heatmap renders default data when fetch fails", async () => {
  fetch.mockReject(new Error("fetch failed"));
  // Suppress console error message
  spyOn(console, "error");

  await act(async () => {
    render(<Heatmap />, container);
  });

  checkHeaderRow(headers(), "Area", "Total deaths", "Cases over time");

  const dataRows = rows();
  expect(dataRows).toHaveLength(2);
  checkRow(dataRows[0], "Edinburgh", "234", [0, 1, 2, 3, 4, 5]);
  checkRow(dataRows[1], "Glasgow", "345", [3, 4, 5, 0, 1, 2]);
});

it("Heatmap renders dynamic fetched data", async () => {
  fetch.mockResponse(csvData);

  await act(async () => {
    render(<Heatmap />, container);
  });

  checkHeaderRow(headers(), "Area", "Total deaths", "Cases over time");

  const dataRows = rows();
  expect(dataRows).toHaveLength(3);
  checkRow(dataRows[0], "Aberdeen City", "15", [1, 0, 1, 3]);
  checkRow(dataRows[1], "Glasgow City", "151", [1, 2, 3, 3]);
  checkRow(dataRows[2], "Orkney Islands", "2", [0, 0, 0, 1]);
});

const table = () => container.querySelector(".heatmap table");
const headers = () => table().querySelector("thead tr");
const rows = () => table().querySelectorAll("tbody tr");

it("parseCsvData", () => {
  const expectedResult = {
    dates: [
      "w/c 2020-03-16",
      "w/c 2020-03-23",
      "w/c 2020-03-30",
      "w/c 2020-04-06",
    ],
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

  expect(parseCsvData(csvData)).toEqual(expectedResult);
});

function checkHeaderRow(row, areaName, areaCount, heatLevels) {
  const headers = row.querySelectorAll("th");
  expect(headers).toHaveLength(3);
  expect(headers[0].textContent).toEqual(areaName);
  expect(headers[1].textContent).toEqual(areaCount);
  expect(headers[2].textContent).toEqual(heatLevels);
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

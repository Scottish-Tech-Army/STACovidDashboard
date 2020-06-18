import React from "react";
import Heatmap from "./Heatmap";
import { shallow } from "enzyme";

it("Heatmap renders default data", () => {
  const container = shallow(<Heatmap dataset={testDataset} />);
  const table = container.find(".heatmap table");
  const headers = table.find("thead tr");
  checkHeaderRow(headers, "Area", "Total deaths", "Cases over time");

  const rows = table.find("tbody tr");
  expect(rows).toHaveLength(3);
});

// prettier-ignore
const testDataset = {
  dates: [
    "1-May", "2-May", "3-May", "4-May"
  ],
  regions: [
    {
      name: "Edinburgh",
      totalDeaths: "234",
      counts: [ 1, 5, 10, 100, ],
    },
    {
      name: "Glasgow",
      totalDeaths: "345",
      counts: [ 0, 1000, 5000, 10000, ],
    },
    {
      name: "Aberdeen",
      totalDeaths: "456",
      counts: [ 0, 0, 0, 0, ],
    },
  ],
};

it("Heatmap renders test data", () => {
  const container = shallow(<Heatmap dataset={testDataset} />);
  const table = container.find(".heatmap table");
  const headers = table.find("thead tr");
  checkHeaderRow(headers, "Area", "Total deaths", "Cases over time");

  const rows = table.find("tbody tr");
  expect(rows).toHaveLength(3);
  checkRow(rows.at(0), "Edinburgh", "234", [0, 0, 1, 2]);
  checkRow(rows.at(1), "Glasgow", "345", [0, 4, 5, 5]);
  checkRow(rows.at(2), "Aberdeen", "456", [0, 0, 0, 0]);
});

function checkHeaderRow(row, areaName, areaCount, heatLevels) {
  const headers = row.find("th");
  expect(headers).toHaveLength(3);
  expect(headers.at(0).text()).toEqual(areaName);
  expect(headers.at(1).text()).toEqual(areaCount);
  expect(headers.at(2).text()).toEqual(heatLevels);
}

function checkRow(row, areaName, areaCount, heatLevels) {
  const cells = row.find("td");
  expect(cells).toHaveLength(3);
  expect(cells.at(0).text()).toEqual(areaName);
  expect(cells.at(1).text()).toEqual(areaCount);
  checkHeatbar(cells.at(2), heatLevels);
}

function checkHeatbar(heatbar, heatLevels) {
  const svgs = heatbar.find("svg");
  expect(svgs).toHaveLength(1);
  const svg = svgs.at(0);
  const lines = heatbar.find("line");
  expect(lines).toHaveLength(heatLevels.length);

  var lastX = 0;
  lines.forEach((line, i) => {
    expect(line.hasClass("l-" + heatLevels[i])).toBeTruthy();
    // Check x value is increasing
    var currentX = Number(line.prop("x1"));
    expect(currentX > lastX).toBeTruthy();
    lastX = currentX;
  });
}

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

const emptyCsvData = `Date,HB,DailyPositive,CumulativePositive,CrudeRatePositive,CumulativePositivePercent,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,CumulativeNegative,CrudeRateNegative`;

const dailyHealthBoardCsvData = `Date,HB,DailyPositive,CumulativePositive,CrudeRatePositive,CumulativePositivePercent,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,CumulativeNegative,CrudeRateNegative
    20200306,S08000031,0,21,0,0,1,10,0,0,0
    20200306,S08000022,1,22,0,0,2,20,0,0,0
    20200306,S08000020,1,23,0,0,3,30,0,0,0
    20200309,S08000031,0,24,0,0,4,40,0,0,0
    20200309,S08000022,300,25,0,0,5,50,0,0,0
    20200309,S08000020,-8,26,0,0,6,60,0,0,0
    20200308,S08000031,0,27,0,0,7,70,0,0,0
    20200308,S08000022,201,28,0,0,8,80,0,0,0
    20200308,S08000020,26,29,0,0,9,90,0,0,0
    20200307,S08000031,0,0,0,0,0,0,0,0,0
    20200307,S08000022,-1,-21,0,0,-1,-10,0,0,0
    20200307,S08000020,-1,-22,0,0,-2,-20,0,0,0
    `;

const dailyCouncilAreaCsvData = `Date,CA,DailyPositive,CumulativePositive,CrudeRatePositive,CumulativePositivePercent,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,CumulativeNegative,CrudeRateNegative
    20200306,S12000013,0,21,0,0,1,10,0,0,0
    20200306,S12000035,1,22,0,0,2,20,0,0,0
    20200306,S12000019,1,23,0,0,3,30,0,0,0
    20200309,S12000013,0,24,0,0,4,40,0,0,0
    20200309,S12000035,300,25,0,0,5,50,0,0,0
    20200309,S12000019,-8,26,0,0,6,60,0,0,0
    20200308,S12000013,0,27,0,0,7,70,0,0,0
    20200308,S12000035,201,28,0,0,8,80,0,0,0
    20200308,S12000019,26,29,0,0,9,90,0,0,0
    20200307,S12000013,0,0,0,0,0,0,0,0,0
    20200307,S12000035,-1,-21,0,0,-1,-10,0,0,0
    20200307,S12000019,-1,-22,0,0,-2,-20,0,0,0
    `;

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

describe("Heatmap renders dynamic fetched data", () => {
  it("Council areas; deaths", async () => {
    fetch.mockResponse(dailyCouncilAreaCsvData);

    await act(async () => {
      render(
        <Heatmap valueType="deaths" areaType="council-areas" />,
        container
      );
    });

    expect(loadingComponent()).toBeNull();
    checkHeaderRow(
      headers(),
      "Council Areas",
      "Total Deaths",
      "Daily Count≥ 0≥ 1≥ 5≥ 10≥ 100≥ 200 "
    );

    const dataRows = rows();
    expect(dataRows).toHaveLength(4);
    checkDateRangeRow(dataRows[0], "150", "06 Mar 202009 Mar 2020");
    checkRow(dataRows[1], "Argyll & Bute", "50", [1, 0, 2, 2]);
    checkRow(dataRows[2], "Midlothian", "60", [1, 0, 2, 2]);
    checkRow(dataRows[3], "Na h-Eileanan Siar", "40", [1, 0, 2, 1]);
  });

  it("Health boards; deaths", async () => {
    fetch.mockResponse(dailyHealthBoardCsvData);

    await act(async () => {
      render(
        <Heatmap valueType="deaths" areaType="health-boards" />,
        container
      );
    });

    expect(loadingComponent()).toBeNull();
    checkHeaderRow(
      headers(),
      "Health Boards",
      "Total Deaths",
      "Daily Count≥ 0≥ 1≥ 5≥ 10≥ 100≥ 200 "
    );

    const dataRows = rows();
    expect(dataRows).toHaveLength(4);
    checkDateRangeRow(dataRows[0], "150", "06 Mar 202009 Mar 2020");
    checkRow(dataRows[1], "Grampian", "60", [1, 0, 2, 2]);
    checkRow(dataRows[2], "Greater Glasgow & Clyde", "40", [1, 0, 2, 1]);
    checkRow(dataRows[3], "Highland", "50", [1, 0, 2, 2]);
  });

  it("Health boards; cases", async () => {
    fetch.mockResponse(dailyHealthBoardCsvData);

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
    checkDateRangeRow(dataRows[0], "75", "06 Mar 202009 Mar 2020");
    checkRow(dataRows[1], "Grampian", "26", [1, 0, 3, 0]);
    checkRow(dataRows[2], "Greater Glasgow & Clyde", "24", [0, 0, 0, 0]);
    checkRow(dataRows[3], "Highland", "25", [1, 0, 5, 5]);
  });

  it("Council areas; cases", async () => {
    fetch.mockResponse(dailyCouncilAreaCsvData);

    await act(async () => {
      render(<Heatmap valueType="cases" areaType="council-areas" />, container);
    });

    expect(loadingComponent()).toBeNull();
    checkHeaderRow(
      headers(),
      "Council Areas",
      "Total Cases",
      "Daily Count≥ 0≥ 1≥ 5≥ 10≥ 100≥ 200 "
    );

    const dataRows = rows();
    expect(dataRows).toHaveLength(4);
    checkDateRangeRow(dataRows[0], "75", "06 Mar 202009 Mar 2020");
    checkRow(dataRows[1], "Argyll & Bute", "25", [1, 0, 5, 5]);
    checkRow(dataRows[2], "Midlothian", "26", [1, 0, 3, 0]);
    checkRow(dataRows[3], "Na h-Eileanan Siar", "24", [0, 0, 0, 0]);
  });
});

describe("Heatmap handles missing data", () => {
  it("Council areas; deaths", async () => {
    fetch.mockResponse(emptyCsvData);

    await act(async () => {
      render(
        <Heatmap valueType="deaths" areaType="council-areas" />,
        container
      );
    });

    expect(loadingComponent()).toBeNull();
    checkHeaderRow(
      headers(),
      "Council Areas",
      "Total Deaths",
      "Daily Count≥ 0≥ 1≥ 5≥ 10≥ 100≥ 200 "
    );

    const dataRows = rows();
    expect(dataRows).toHaveLength(1);
    checkDateRangeRow(dataRows[0], "", "Data not available");
  });

  it("Health boards; deaths", async () => {
    fetch.mockResponse(emptyCsvData);

    await act(async () => {
      render(
        <Heatmap valueType="deaths" areaType="health-boards" />,
        container
      );
    });

    expect(loadingComponent()).toBeNull();
    checkHeaderRow(
      headers(),
      "Health Boards",
      "Total Deaths",
      "Daily Count≥ 0≥ 1≥ 5≥ 10≥ 100≥ 200 "
    );

    const dataRows = rows();
    expect(dataRows).toHaveLength(1);
    checkDateRangeRow(dataRows[0], "", "Data not available");
  });

    it("Health boards; cases", async () => {
      fetch.mockResponse(emptyCsvData);

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
      expect(dataRows).toHaveLength(1);
      checkDateRangeRow(dataRows[0], "", "Data not available");
    });

      it("Council areas; cases", async () => {
        fetch.mockResponse(emptyCsvData);

        await act(async () => {
          render(<Heatmap valueType="cases" areaType="council-areas" />, container);
        });

        expect(loadingComponent()).toBeNull();
        checkHeaderRow(
          headers(),
          "Council Areas",
          "Total Cases",
          "Daily Count≥ 0≥ 1≥ 5≥ 10≥ 100≥ 200 "
        );

        const dataRows = rows();
        expect(dataRows).toHaveLength(1);
        checkDateRangeRow(dataRows[0], "", "Data not available");
      });
});

const loadingComponent = () => container.querySelector(".loading-component");
const table = () => container.querySelector(".heatmap table");
const headers = () => table().querySelector("thead tr");
const rows = () => table().querySelectorAll("tbody tr");

describe("parseCsvData", () => {
  it("council areas", () => {
    const expectedResult = {
      dates: [
        Date.parse("2020-03-06"),
        Date.parse("2020-03-07"),
        Date.parse("2020-03-08"),
        Date.parse("2020-03-09"),
      ],
      regions: [
        // In alphabetical order of area name
        {
          name: "Argyll & Bute",
          cases: [1, -1, 201, 300],
          deaths: [2, -1, 8, 5],
          totalCases: 25,
          totalDeaths: 50,
        },
        {
          name: "Midlothian",
          cases: [1, -1, 26, -8],
          deaths: [3, -2, 9, 6],
          totalCases: 26,
          totalDeaths: 60,
        },
        {
          name: "Na h-Eileanan Siar",
          cases: [0, 0, 0, 0],
          deaths: [1, 0, 7, 4],
          totalCases: 24,
          totalDeaths: 40,
        },
      ],
    };

    expect(parseCsvData(dailyCouncilAreaCsvData)).toEqual(expectedResult);
  });

  it("health boards", () => {
    const expectedResult = {
      dates: [
        Date.parse("2020-03-06"),
        Date.parse("2020-03-07"),
        Date.parse("2020-03-08"),
        Date.parse("2020-03-09"),
      ],
      regions: [
        // In alphabetical order of area name
        {
          name: "Grampian",
          cases: [1, -1, 26, -8],
          deaths: [3, -2, 9, 6],
          totalCases: 26,
          totalDeaths: 60,
        },
        {
          name: "Greater Glasgow & Clyde",
          cases: [0, 0, 0, 0],
          deaths: [1, 0, 7, 4],
          totalCases: 24,
          totalDeaths: 40,
        },
        {
          name: "Highland",
          cases: [1, -1, 201, 300],
          deaths: [2, -1, 8, 5],
          totalCases: 25,
          totalDeaths: 50,
        },
      ],
    };

    expect(parseCsvData(dailyHealthBoardCsvData)).toEqual(expectedResult);
  });
});

function checkHeaderRow(row, areaName, areaCount, heatLevels) {
  const headers = row.querySelectorAll("th");
  expect(headers).toHaveLength(3);
  expect(headers[0].textContent).toEqual(areaName);
  expect(headers[1].textContent).toEqual(areaCount);
  expect(headers[2].textContent).toEqual(heatLevels);
}

function checkDateRangeRow(row, total, dateRange) {
  const cells = row.querySelectorAll("td");
  expect(cells).toHaveLength(3);
  expect(cells[0].textContent).toEqual("");
  expect(cells[1].textContent).toEqual(total);
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

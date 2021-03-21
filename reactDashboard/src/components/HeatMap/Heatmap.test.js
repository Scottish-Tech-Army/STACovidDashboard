import React from "react";
import Heatmap, { createHeatbarLines } from "./Heatmap";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { FEATURE_CODE_SCOTLAND } from "../Utils/CsvUtils";

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

const emptyData = {};

const dailyHealthBoardWithScotlandData = {
  startDate: Date.parse("2020-03-01"),
  endDate: Date.parse("2020-03-09"),
  dates: [Date.parse("2020-03-01"), Date.parse("2020-03-08")],
  scotland: {
    featureCode: FEATURE_CODE_SCOTLAND,
    name: "Scotland",
    cases: [0, 108],
    deaths: [149, 149],
    totalCases: 63,
    totalDeaths: 140,
  },
  regions: [
    // In alphabetical order of area name
    {
      featureCode: "S08000020",
      name: "Grampian",
      cases: [0, 18],
      deaths: [1, 15],
      totalCases: 26,
      totalDeaths: 60,
    },
    {
      featureCode: "S08000031",
      name: "Greater Glasgow & Clyde",
      cases: [0, 0],
      deaths: [1, 11],
      totalCases: 24,
      totalDeaths: 40,
    },
    {
      featureCode: "S08000022",
      name: "Highland",
      cases: [0, 501],
      deaths: [1, 13],
      totalCases: 25,
      totalDeaths: 50,
    },
  ],
};
const dailyHealthBoardWithoutScotlandData = {
  startDate: Date.parse("2020-03-01"),
  endDate: Date.parse("2020-03-09"),
  dates: [Date.parse("2020-03-01"), Date.parse("2020-03-08")],
  scotland: {
    featureCode: FEATURE_CODE_SCOTLAND,
    name: "Scotland",
    cases: [0, 519],
    deaths: [3, 39],
    totalCases: 75,
    totalDeaths: 150,
  },
  regions: [
    // In alphabetical order of area name
    {
      featureCode: "S08000020",
      name: "Grampian",
      cases: [0, 18],
      deaths: [1, 15],
      totalCases: 26,
      totalDeaths: 60,
    },
    {
      featureCode: "S08000031",
      name: "Greater Glasgow & Clyde",
      cases: [0, 0],
      deaths: [1, 11],
      totalCases: 24,
      totalDeaths: 40,
    },
    {
      featureCode: "S08000022",
      name: "Highland",
      cases: [0, 501],
      deaths: [1, 13],
      totalCases: 25,
      totalDeaths: 50,
    },
  ],
};

const dailyCouncilAreaData = {
  startDate: Date.parse("2020-03-01"),
  endDate: Date.parse("2020-03-09"),
  dates: [Date.parse("2020-03-01"), Date.parse("2020-03-08")],
  scotland: {
    featureCode: FEATURE_CODE_SCOTLAND,
    name: "Scotland",
    cases: [0, 519],
    deaths: [3, 39],
    totalCases: 75,
    totalDeaths: 150,
  },
  regions: [
    // In alphabetical order of area name
    {
      featureCode: "S12000035",
      name: "Argyll & Bute",
      cases: [0, 501],
      deaths: [1, 13],
      totalCases: 25,
      totalDeaths: 50,
    },
    {
      featureCode: "S12000019",
      name: "Midlothian",
      cases: [0, 18],
      deaths: [1, 15],
      totalCases: 26,
      totalDeaths: 60,
    },
    {
      featureCode: "S12000013",
      name: "Na h-Eileanan Siar",
      cases: [0, 0],
      deaths: [1, 11],
      totalCases: 24,
      totalDeaths: 40,
    },
  ],
};

test("heatmap renders no data when fetch fails, shows loadingComponent", async () => {
  await act(async () => {
    render(
      <Heatmap
        parsedCouncilAreaDataset={null}
        parsedHealthBoardDataset={null}
      />,
      container
    );
  });

  expect(loadingComponent()).not.toBeNull();
  expect(table()).toBeNull();
});

describe("heatmap renders dynamic fetched data", () => {
  it("council areas; deaths", async () => {
    await act(async () => {
      render(
        <Heatmap
          parsedCouncilAreaDataset={dailyCouncilAreaData}
          parsedHealthBoardDataset={dailyHealthBoardWithScotlandData}
          valueType="deaths"
          areaType="council-areas"
        />,
        container
      );
    });

    expect(loadingComponent()).toBeNull();
    checkHeaderRow(
      "COUNCIL AREAS",
      "TOTAL DEATHS",
      "01 Mar 2020 - 09 Mar 2020"
    );

    const dataRows = rows();
    expect(dataRows).toHaveLength(4);

    // counts = 3, 39
    checkRow(dataRows[0], "Scotland", "150", [0, 3]);
    // counts = 1, 13
    checkRow(dataRows[1], "Argyll & Bute", "50", [0, 2]);
    // counts = 1, 15
    checkRow(dataRows[2], "Midlothian", "60", [0, 2]);
    // counts = 1, 11
    checkRow(dataRows[3], "Na h-Eileanan Siar", "40", [0, 2]);
  });

  it("health boards; deaths (with Scotland)", async () => {
    await act(async () => {
      render(
        <Heatmap
          parsedCouncilAreaDataset={dailyCouncilAreaData}
          parsedHealthBoardDataset={dailyHealthBoardWithScotlandData}
          valueType="deaths"
          areaType="health-boards"
        />,
        container
      );
    });

    expect(loadingComponent()).toBeNull();
    checkHeaderRow(
      "HEALTH BOARDS",
      "TOTAL DEATHS",
      "01 Mar 2020 - 09 Mar 2020"
    );

    const dataRows = rows();
    expect(dataRows).toHaveLength(4);
    // counts = 149, 149
    checkRow(dataRows[0], "Scotland", "140", [5]);
    // counts = 1, 15
    checkRow(dataRows[1], "Grampian", "60", [0, 2]);
    // counts = 1, 11
    checkRow(dataRows[2], "Greater Glasgow & Clyde", "40", [0, 2]);
    // counts = 1, 13
    checkRow(dataRows[3], "Highland", "50", [0, 2]);
  });

  it("health boards; deaths (without Scotland)", async () => {
    await act(async () => {
      render(
        <Heatmap
          parsedCouncilAreaDataset={dailyCouncilAreaData}
          parsedHealthBoardDataset={dailyHealthBoardWithoutScotlandData}
          valueType="deaths"
          areaType="health-boards"
        />,
        container
      );
    });

    expect(loadingComponent()).toBeNull();
    checkHeaderRow(
      "HEALTH BOARDS",
      "TOTAL DEATHS",
      "01 Mar 2020 - 09 Mar 2020"
    );

    const dataRows = rows();
    expect(dataRows).toHaveLength(4);
    // counts = 3, 39
    checkRow(dataRows[0], "Scotland", "150", [0, 3]);
    // counts = 1, 13
    checkRow(dataRows[1], "Grampian", "60", [0, 2]);
    // counts = 1, 11
    checkRow(dataRows[2], "Greater Glasgow & Clyde", "40", [0, 2]);
    // counts = 1, 13
    checkRow(dataRows[3], "Highland", "50", [0, 2]);
  });

  it("health boards; cases (with Scotland)", async () => {
    await act(async () => {
      render(
        <Heatmap
          parsedCouncilAreaDataset={dailyCouncilAreaData}
          parsedHealthBoardDataset={dailyHealthBoardWithScotlandData}
          valueType="cases"
          areaType="health-boards"
        />,
        container
      );
    });

    expect(loadingComponent()).toBeNull();
    checkHeaderRow("HEALTH BOARDS", "TOTAL CASES", "01 Mar 2020 - 09 Mar 2020");

    const dataRows = rows();
    expect(dataRows).toHaveLength(4);
    // counts = 0, 108
    checkRow(dataRows[0], "Scotland", "63", [0, 5]);
    // counts = 0, 18
    checkRow(dataRows[1], "Grampian", "26", [0, 2]);
    // counts = 0, 0
    checkRow(dataRows[2], "Greater Glasgow & Clyde", "24", [0]);
    // counts = 0, 501
    checkRow(dataRows[3], "Highland", "25", [0, 6]);
  });

  it("health boards; cases (without Scotland)", async () => {
    await act(async () => {
      render(
        <Heatmap
          parsedCouncilAreaDataset={dailyCouncilAreaData}
          parsedHealthBoardDataset={dailyHealthBoardWithoutScotlandData}
          valueType="cases"
          areaType="health-boards"
        />,
        container
      );
    });

    expect(loadingComponent()).toBeNull();
    checkHeaderRow("HEALTH BOARDS", "TOTAL CASES", "01 Mar 2020 - 09 Mar 2020");

    const dataRows = rows();
    expect(dataRows).toHaveLength(4);
    // counts = 0, 519
    checkRow(dataRows[0], "Scotland", "75", [0, 6]);
    // counts = 0, 18
    checkRow(dataRows[1], "Grampian", "26", [0, 2]);
    // counts = 0, 0
    checkRow(dataRows[2], "Greater Glasgow & Clyde", "24", [0]);
    // counts = 0, 501
    checkRow(dataRows[3], "Highland", "25", [0, 6]);
  });

  it("council areas; cases", async () => {
    await act(async () => {
      render(
        <Heatmap
          parsedCouncilAreaDataset={dailyCouncilAreaData}
          parsedHealthBoardDataset={dailyHealthBoardWithScotlandData}
          valueType="cases"
          areaType="council-areas"
        />,
        container
      );
    });

    expect(loadingComponent()).toBeNull();
    checkHeaderRow("COUNCIL AREAS", "TOTAL CASES", "01 Mar 2020 - 09 Mar 2020");

    const dataRows = rows();
    expect(dataRows).toHaveLength(4);
    // counts = 0, 519
    checkRow(dataRows[0], "Scotland", "75", [0, 6]);
    // counts = 0, 501
    checkRow(dataRows[1], "Argyll & Bute", "25", [0, 6]);
    // counts = 0, 18
    checkRow(dataRows[2], "Midlothian", "26", [0, 2]);
    // counts = 0, 0
    checkRow(dataRows[3], "Na h-Eileanan Siar", "24", [0]);
  });
});

describe("heatmap handles missing data", () => {
  it("council areas; deaths", async () => {
    await act(async () => {
      render(
        <Heatmap
          parsedCouncilAreaDataset={emptyData}
          parsedHealthBoardDataset={dailyHealthBoardWithScotlandData}
          valueType="deaths"
          areaType="council-areas"
        />,
        container
      );
    });

    expect(loadingComponent()).toBeNull();
    checkHeaderRow("COUNCIL AREAS", "TOTAL DEATHS", "Data not available");

    const dataRows = rows();
    expect(dataRows).toHaveLength(0);
  });

  it("health boards; deaths", async () => {
    await act(async () => {
      render(
        <Heatmap
          parsedCouncilAreaDataset={dailyCouncilAreaData}
          parsedHealthBoardDataset={emptyData}
          valueType="deaths"
          areaType="health-boards"
        />,
        container
      );
    });

    expect(loadingComponent()).toBeNull();
    checkHeaderRow("HEALTH BOARDS", "TOTAL DEATHS", "Data not available");

    const dataRows = rows();
    expect(dataRows).toHaveLength(0);
  });

  it("health boards; cases", async () => {
    await act(async () => {
      render(
        <Heatmap
          parsedCouncilAreaDataset={dailyCouncilAreaData}
          parsedHealthBoardDataset={emptyData}
          valueType="cases"
          areaType="health-boards"
        />,
        container
      );
    });

    expect(loadingComponent()).toBeNull();
    checkHeaderRow("HEALTH BOARDS", "TOTAL CASES", "Data not available");

    const dataRows = rows();
    expect(dataRows).toHaveLength(0);
  });

  it("council areas; cases", async () => {
    await act(async () => {
      render(
        <Heatmap
          parsedCouncilAreaDataset={emptyData}
          parsedHealthBoardDataset={dailyHealthBoardWithScotlandData}
          valueType="cases"
          areaType="council-areas"
        />,
        container
      );
    });

    expect(loadingComponent()).toBeNull();
    checkHeaderRow("COUNCIL AREAS", "TOTAL CASES", "Data not available");

    const dataRows = rows();
    expect(dataRows).toHaveLength(0);
  });
});

const loadingComponent = () => container.querySelector(".loading-component");
const table = () => container.querySelector(".heatmap table");
const headers = () => table().querySelectorAll("thead tr");
const rows = () => table().querySelectorAll("tbody tr");

describe("createHeatbarLines", () => {
  const TEST_DATES = new Array(48).fill(Date.parse("2020-03-06"));

  function mockCreateHeatbarLine(element, startIndex, width) {
    return { element: element, startIndex: startIndex, width: width };
  }
  it("empty array", () => {
    expect(
      createHeatbarLines([], mockCreateHeatbarLine, "place", TEST_DATES)
    ).toStrictEqual([]);
  });

  it("single element", () => {
    expect(
      createHeatbarLines([5], mockCreateHeatbarLine, "place", TEST_DATES)
    ).toStrictEqual([{ element: 5, startIndex: 0, width: 1 }]);
  });

  it("single wide element", () => {
    expect(
      createHeatbarLines(
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        mockCreateHeatbarLine,
        "place",
        TEST_DATES
      )
    ).toStrictEqual([{ element: 5, startIndex: 0, width: 10 }]);
  });

  it("multiple elements", () => {
    expect(
      createHeatbarLines(
        [5, 4, 5, 4, 5, 4, 5, 4, 5, 4],
        mockCreateHeatbarLine,
        "place",
        TEST_DATES
      )
    ).toStrictEqual([
      { element: 5, startIndex: 0, width: 1 },
      { element: 4, startIndex: 1, width: 1 },
      { element: 5, startIndex: 2, width: 1 },
      { element: 4, startIndex: 3, width: 1 },
      { element: 5, startIndex: 4, width: 1 },
      { element: 4, startIndex: 5, width: 1 },
      { element: 5, startIndex: 6, width: 1 },
      { element: 4, startIndex: 7, width: 1 },
      { element: 5, startIndex: 8, width: 1 },
      { element: 4, startIndex: 9, width: 1 },
    ]);
  });

  it("multiple wide elements", () => {
    expect(
      createHeatbarLines(
        // prettier-ignore
        [
          5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
          4, 4, 4, 4, 4, 4,
          5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
          4, 4, 4, 4, 4, 4,
          5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
          4, 4, 4, 4, 4, 4,
        ],
        mockCreateHeatbarLine,
        "place",
        TEST_DATES
      )
    ).toStrictEqual([
      { element: 5, startIndex: 0, width: 10 },
      { element: 4, startIndex: 10, width: 6 },
      { element: 5, startIndex: 16, width: 10 },
      { element: 4, startIndex: 26, width: 6 },
      { element: 5, startIndex: 32, width: 10 },
      { element: 4, startIndex: 42, width: 6 },
    ]);
  });
});

const HEAT_LEVELS_TEXT = "051020501005001000≥ 0≥ 5≥ 10≥ 20≥ 50≥ 100≥ 500≥ 1000";

function checkHeaderRow(areaName, areaCount, dateRange) {
  const cells = headers()[0].querySelectorAll("th");
  expect(cells).toHaveLength(3);
  expect(cells[0].textContent).toStrictEqual(areaName);
  expect(cells[1].textContent).toStrictEqual(areaCount);
  expect(cells[2].textContent).toStrictEqual(
    "WEEKLY COUNT" + dateRange + HEAT_LEVELS_TEXT
  );
}

function checkRow(row, areaName, areaCount, distinctHeatLevels) {
  const cells = row.querySelectorAll("td");
  expect(cells).toHaveLength(3);
  expect(cells[0].textContent).toStrictEqual(areaName);
  expect(cells[1].textContent).toStrictEqual(areaCount);
  checkHeatbar(cells[2], distinctHeatLevels);
}

function checkHeatbar(heatbar, distinctHeatLevels) {
  const svgs = heatbar.querySelectorAll("svg");
  expect(svgs).toHaveLength(1);
  const lines = heatbar.querySelectorAll("line");
  expect(lines).toHaveLength(distinctHeatLevels.length);

  var lastX = 0;
  lines.forEach((line, i) => {
    // Check the correct level class is set
    expect(line.getAttribute("class")).toBe("l-" + distinctHeatLevels[i]);
    // Check x value is increasing
    var currentX = Number(line.getAttribute("x1"));
    expect(currentX > lastX).toBe(true);
    lastX = currentX;
  });
}

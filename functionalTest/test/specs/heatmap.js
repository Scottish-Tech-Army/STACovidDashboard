import dashboard from "../pageobjects/dashboardPage";

// Heatbar column: thead - DAILY COUNT, subheading (date range) and heatmapScale aren't affected by the user clicking buttons
// subheading (date range) will be updated with new data coming in

describe("heatmap selection", () => {
  it("default view", () => {
    dashboard.open();

    checkHeatmapHealthBoardsBoundaries();
    checkHeatmapHealthBoardsCasesValues();
    checkHeatmapHealthBoardsCasesHeatbar();
    expect(dashboard.heatmapHeatbarValues).toHaveLength(15);
  });

  it("council areas cases", () => {
    dashboard.open();
    dashboard.selectDeathsButton.click();
    expect(dashboard.heatmapValueTypeTitle).toHaveText("TOTAL DEATHS");

    dashboard.selectCouncilAreasButton.click();
    dashboard.selectCasesButton.click();

    checkHeatmapCouncilAreasBoundaries();

    expect(dashboard.heatmapValueTypeTitle).toHaveText("TOTAL CASES");
    checkValueWithin(
      Number(dashboard.heatmapValueTypeCount.getText()),
      20000,
      200000
    );
    const heatmapValueTypeValues = dashboard.heatmapValueTypeValues;
    expect(heatmapValueTypeValues).toHaveLength(33);
    expect(heatmapValueTypeValues[0]).toHaveText("");
    checkValueWithin(Number(heatmapValueTypeValues[1].getText()), 1000, 10000);
    checkValueWithin(Number(heatmapValueTypeValues[32].getText()), 500, 10000);

    checkScotlandCasesHeatbar();

    // City of Edinburgh heatbar
    const expectedValues1 = [
      { l: 0, w: 5 },
      { l: 1, w: 3 },
      { l: 2, w: 2 },
      { l: 1, w: 2 },
      { l: 2, w: 1 },
    ];

    checkHeatbarValues(5, expectedValues1);

    // Orkney Islands
    const expectedValues2 = [
      { l: 0, w: 29 },
      { l: 1, w: 2 },
      { l: 0, w: 1 },
      { l: 1, w: 1 },
      { l: 0, w: 1 },
    ];

    checkHeatbarValues(23, expectedValues2);
  });

  it("health boards cases", () => {
    dashboard.open();
    dashboard.selectCouncilAreasButton.click();
    dashboard.selectDeathsButton.click();
    expect(dashboard.heatmapBoundariesTitle).toHaveText("COUNCIL AREAS");
    expect(dashboard.heatmapValueTypeTitle).toHaveText("TOTAL DEATHS");

    dashboard.selectHealthBoardsButton.click();
    dashboard.selectCasesButton.click();

    checkHeatmapHealthBoardsBoundaries();
    checkHeatmapHealthBoardsCasesValues();
    checkHeatmapHealthBoardsCasesHeatbar();
    expect(dashboard.heatmapHeatbarValues).toHaveLength(15);
  });

  it("health boards deaths", () => {
    dashboard.open();
    dashboard.selectCouncilAreasButton.click();
    expect(dashboard.heatmapBoundariesTitle).toHaveText("COUNCIL AREAS");

    dashboard.selectHealthBoardsButton.click();
    dashboard.selectDeathsButton.click();

    checkHeatmapHealthBoardsBoundaries();

    expect(dashboard.heatmapValueTypeTitle).toHaveText("TOTAL DEATHS");
    checkValueWithin(
      Number(dashboard.heatmapValueTypeCount.getText()),
      2000,
      10000
    );
    const heatmapValueTypeValues = dashboard.heatmapValueTypeValues;
    expect(heatmapValueTypeValues).toHaveLength(15);
    expect(heatmapValueTypeValues[0]).toHaveText("");
    checkValueWithin(Number(heatmapValueTypeValues[1].getText()), 50, 500);
    checkValueWithin(Number(heatmapValueTypeValues[14].getText()), 0, 50);

    checkScotlandDeathsHeatbar();

    // Greater Glasgow & Clyde heatbar
    const expectedValues2 = [
      { l: 0, w: 15 },
      { l: 2, w: 1 },
      { l: 0, w: 4 },
      { l: 1, w: 1 },
      { l: 2, w: 1 },
    ];

    checkHeatbarValues(7, expectedValues2);

    // Shetland heatbar
    const expectedValues3 = [
      { l: 0, w: 34 },
      { l: 1, w: 1 },
      { l: 0, w: 3 },
      { l: 2, w: 1 },
      { l: 0, w: 2 },
    ];

    checkHeatbarValues(12, expectedValues3);
  });

  it("council areas deaths", () => {
    dashboard.open();

    dashboard.selectCouncilAreasButton.click();
    dashboard.selectDeathsButton.click();

    checkHeatmapCouncilAreasBoundaries();

    expect(dashboard.heatmapValueTypeTitle).toHaveText("TOTAL DEATHS");
    checkValueWithin(
      Number(dashboard.heatmapValueTypeCount.getText()),
      2000,
      10000
    );
    const heatmapValueTypeValues = dashboard.heatmapValueTypeValues;
    expect(heatmapValueTypeValues).toHaveLength(33);
    expect(heatmapValueTypeValues[0]).toHaveText("");
    checkValueWithin(Number(heatmapValueTypeValues[1].getText()), 50, 500);
    checkValueWithin(Number(heatmapValueTypeValues[32].getText()), 50, 500);

    checkScotlandDeathsHeatbar();

    // City of Edinburgh heatbar
    const expectedValues1 = [
      { l: 0, w: 13 },
      { l: 1, w: 1 },
      { l: 0, w: 8 },
      { l: 1, w: 1 },
      { l: 0, w: 3 },
    ];

    checkHeatbarValues(5, expectedValues1);

    // Perth & Kinross
    const expectedValues2 = [
      { l: 0, w: 27 },
      { l: 1, w: 1 },
      { l: 0, w: 3 },
      { l: 1, w: 2 },
      { l: 0, w: 1 },
    ];

    checkHeatbarValues(24, expectedValues2);
  });

  function checkHeatmapHealthBoardsBoundaries() {
    expect(dashboard.heatmapBoundariesTitle).toHaveText("HEALTH BOARDS");
    expect(dashboard.heatmapBoundariesCount).toHaveText("14 Boards");
    const heatmapBoundariesValues = dashboard.heatmapBoundariesValues;
    expect(heatmapBoundariesValues).toHaveLength(15);
    expect(heatmapBoundariesValues[0]).toHaveText("Scotland");
    expect(heatmapBoundariesValues[1]).toHaveText("Ayrshire & Arran");
    expect(heatmapBoundariesValues[14]).toHaveText("Western Isles");
  }

  function checkHeatmapCouncilAreasBoundaries() {
    expect(dashboard.heatmapBoundariesTitle).toHaveText("COUNCIL AREAS");
    expect(dashboard.heatmapBoundariesCount).toHaveText("32 Areas");
    const heatmapBoundariesValues = dashboard.heatmapBoundariesValues;
    expect(heatmapBoundariesValues).toHaveLength(33);
    expect(heatmapBoundariesValues[0]).toHaveText("Scotland");
    expect(heatmapBoundariesValues[1]).toHaveText("Aberdeen City");
    expect(heatmapBoundariesValues[32]).toHaveText("West Lothian");
  }

  function checkHeatmapHealthBoardsCasesValues() {
    expect(dashboard.heatmapValueTypeTitle).toHaveText("TOTAL CASES");
    checkValueWithin(
      Number(dashboard.heatmapValueTypeCount.getText()),
      30000,
      200000
    );
    const heatmapValueTypeValues = dashboard.heatmapValueTypeValues;
    expect(heatmapValueTypeValues).toHaveLength(15);
    expect(heatmapValueTypeValues[0]).toHaveText("");
    checkValueWithin(Number(heatmapValueTypeValues[1].getText()), 1000, 10000);
    checkValueWithin(Number(heatmapValueTypeValues[14].getText()), 50, 1000);
  }

  function checkHeatmapHealthBoardsCasesHeatbar() {
    checkScotlandCasesHeatbar();

    // Greater Glasgow & Clyde heatbar
    const expectedValues2 = [
      { l: 0, w: 4 },
      { l: 1, w: 1 },
      { l: 0, w: 1 },
      { l: 1, w: 2 },
      { l: 0, w: 2 },
    ];

    checkHeatbarValues(7, expectedValues2);

    // Western Isles heatbar
    const expectedValues3 = [
      { l: 0, w: 27 },
      { l: 1, w: 1 },
      { l: 0, w: 2 },
      { l: 1, w: 2 },
      { l: 0, w: 2 },
    ];

    checkHeatbarValues(14, expectedValues3);
  }

  function checkScotlandCasesHeatbar() {
    const expectedValues = [
      { l: 1, w: 1 },
      { l: 0, w: 1 },
      { l: 2, w: 1 },
      { l: 1, w: 1 },
      { l: 2, w: 1 },
    ];

    checkHeatbarValues(0, expectedValues);
  }

  function checkScotlandDeathsHeatbar() {
    const expectedValues = [
      { l: 0, w: 13 },
      { l: 1, w: 1 },
      { l: 0, w: 1 },
      { l: 2, w: 1 },
      { l: 0, w: 1 },
    ];

    checkHeatbarValues(0, expectedValues);
  }

  function checkHeatbarValues(rowIndex, expectedValues) {
    const strokes = dashboard.heatbarLines(rowIndex);
    expectedValues.forEach((element, i) => {
      expect(strokes[i]).toHaveElementClass("l-" + element.l);
    });

    const calculatedDayWidth =
      Number(strokes[0].getAttribute("stroke-width")) / expectedValues[0].w;
    expectedValues.forEach((element, i) => {
      expect(Number(strokes[i].getAttribute("stroke-width"))).toBeCloseTo(
        calculatedDayWidth * expectedValues[i].w,
        4
      );
    });
  }
});

function checkValueWithin(value, lower, upper) {
  expect(value).toBeGreaterThanOrEqual(lower);
  expect(value).toBeLessThanOrEqual(upper);
}

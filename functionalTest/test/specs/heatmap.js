import dashboard from "../pageobjects/dashboardPage";

// Heatbar column: thead - DAILY COUNT, subheading (date range) and heatmapScale aren't affected by the user clicking buttons
// subheading (date range) will be updated with new data coming in

describe("heatmap selection", () => {
  xit("default view", () => {
    dashboard.open();

    checkHeatmapHealthBoardsBoundaries();
    checkHeatmapHealthBoardsCasesValues();
  });

  xit("council areas cases", () => {
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

    const heatmapHeatbarValues = dashboard.heatmapHeatbarValues;
    const heatmapHeatbarLineFirstRow = dashboard.heatmapHeatbarLineFirstRow;
    expect(heatmapHeatbarValues).toHaveLength(15);
    // Scotland total: check colour for heatmapHeatbarValues[0] - check number of cases for earliest date from data, determine what colour that should on the scale (function pseudocode at bottom of file), check against colour

    // FIRST ROW - NUMBER OF CASES
    let earliestDateCases;
    // TODO: create function to pull number of cases from data
    earliestDateCases = 1;

    // FIRST ROW - expect(COLOR OF FIRST LINE IN BAR).toBe(COLOR SHOWN FOR THAT NUMBER)
    expect(renderedColor(heatmapHeatbarLineFirstRow[0])).toBe(
      expectedColor(earliestDateCases)
    );

    // Scotland total: check colour for heatmapHeatbarValues[0] last <line> - check number of cases for latest date from data, determine what colour that should on the scale, check against colour of last <line> on bar
    // First row: check colour for heatmapHeatbarValues[1] first <line> - check number of cases for earliest date on data, determine what colour that should on the scale, check against colour of first <line> on bar
    // Last row: check colour for heatmapHeatbarValues[1] last <line> - check number of cases for latest date from data, determine what colour that should on the scale, check against colour of last <line> on bar
    // First row: checkColour for heatmapHeatbarValues[15] first <line> - check number of cases for earliest date on data, determine what colour that should on the scale, check against colour of first <line> on bar
    // Last row: checkColour for heatmapHeatbarValues[15] last <line> - check number of cases for latest date from data, determine what colour that should on the scale, check against colour of last <line> on bar
  });

  xit("health boards deaths", () => {
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
  });

  xit("council areas deaths", () => {
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
});

function checkValueWithin(value, lower, upper) {
  expect(value).toBeGreaterThanOrEqual(lower);
  expect(value).toBeLessThanOrEqual(upper);
}

function renderedColor(element) {
  return element.getCSSProperty("stroke").parsed.hex;
}

function expectedColor(cases) {
  if (cases === 0) {
    return "#e0e0e0";
  } else if (cases === 1) {
    return "#ffffb2";
  } else if (cases >= 2 && cases <= 4) {
    return "#fed976";
  } else if (cases >= 5 && cases <= 9) {
    return "#feb24c";
  } else if (cases >= 10 && cases <= 19) {
    return "#fd8d3c";
  } else if (cases >= 20 && cases <= 49) {
    return "#f03b20";
  } else if (cases >= 50 && cases <= 99) {
    return "#bd0026";
  } else if (cases >= 100) {
    return "#020202";
  }
}

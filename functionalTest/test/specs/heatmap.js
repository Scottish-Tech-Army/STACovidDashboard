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
    expect(heatmapHeatbarValues).toHaveLength(15);
    // Scotland total: check colour for heatmapHeatbarValues[0] first <line> - check number of cases for earliest date from data, determine what colour that should on the scale (function pseudocode at bottom of file), check against colour of first <line> on bar
    // checkExpectedColor(Scotland total on first date from data);
    // expect(heatmapValueTypeValues[0] first <line> colour).toBe(expectedColour);

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

// Colours:
// >=0 = #e0e0e0;
// >=1 = #ffffb2;
// >=2 = #fed976;
// >=5 = #feb24c;
// >=10 = #fd8d3c;
// >=20 = #f03b20;
// >=50 = #bd0026;
// >=100 = #020202;

// function checkExpectedColor(date.numberOfCases) {
//   if 0, expectedColour = #e0e0e0;
//   if 1, expectedColour = #ffffb2;
//   if 2, expectedColour = #fed976;
//   if 3-5, expectedColour = #feb24c;
//   if 6-10, expectedColour = #fd8d3c;
//   if 11-20, expectedColour = #f03b20;
//   if 21-50, expectedColour = #bd0026;
//   if >=100, expectedColour = #020202;
// }

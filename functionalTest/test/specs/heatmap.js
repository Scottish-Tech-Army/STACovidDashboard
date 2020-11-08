import dashboard from "../pageobjects/dashboardPage";

describe("heatmap selection", () => {
  it("default view", () => {
    dashboard.open();

    checkHeatmapHealthBoardsBoundaries();
    checkHeatmapHealthBoardsCasesValues();
  });

  it("council areas cases", () => {
    dashboard.open();
    dashboard.selectDeathsButton.click();
    expect(dashboard.heatmapValueTypeTitle).toHaveText("TOTAL DEATHS");

    dashboard.selectCouncilAreasButton.click();
    dashboard.selectCasesButton.click();

    checkHeatmapCouncilAreasBoundaries();

    expect(dashboard.heatmapValueTypeTitle).toHaveText("TOTAL CASES");
    const heatmapValueTypeValues = dashboard.heatmapValueTypeValues;
    expect(heatmapValueTypeValues).toHaveLength(33);
    checkValueWithin(Number(heatmapValueTypeValues[0].getText()), 20000, 200000);
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
  });

  it("health boards deaths", () => {
    dashboard.open();
    dashboard.selectCouncilAreasButton.click();
    expect(dashboard.heatmapBoundariesTitle).toHaveText("COUNCIL AREAS");

    dashboard.selectHealthBoardsButton.click();
    dashboard.selectDeathsButton.click();

    checkHeatmapHealthBoardsBoundaries();

    expect(dashboard.heatmapValueTypeTitle).toHaveText("TOTAL DEATHS");
    const heatmapValueTypeValues = dashboard.heatmapValueTypeValues;
    expect(heatmapValueTypeValues).toHaveLength(15);
    checkValueWithin(Number(heatmapValueTypeValues[0].getText()), 2000, 10000);
    checkValueWithin(Number(heatmapValueTypeValues[1].getText()), 50, 500);
    checkValueWithin(Number(heatmapValueTypeValues[14].getText()), 0, 50);
  });

  it("council areas deaths", () => {
    dashboard.open();

    dashboard.selectCouncilAreasButton.click();
    dashboard.selectDeathsButton.click();

    checkHeatmapCouncilAreasBoundaries();

    expect(dashboard.heatmapValueTypeTitle).toHaveText("TOTAL DEATHS");
    const heatmapValueTypeValues = dashboard.heatmapValueTypeValues;
    expect(heatmapValueTypeValues).toHaveLength(33);
    checkValueWithin(Number(heatmapValueTypeValues[0].getText()), 2000, 10000);
    checkValueWithin(Number(heatmapValueTypeValues[1].getText()), 50, 500);
    checkValueWithin(Number(heatmapValueTypeValues[32].getText()), 50, 500);
  });

  function checkHeatmapHealthBoardsBoundaries() {
    expect(dashboard.heatmapBoundariesTitle).toHaveText("HEALTH BOARDS");
    const heatmapBoundariesValues = dashboard.heatmapBoundariesValues;
    expect(heatmapBoundariesValues).toHaveLength(15);
    expect(heatmapBoundariesValues[0]).toHaveText("Scotland");
    expect(heatmapBoundariesValues[1]).toHaveText("Ayrshire & Arran");
    expect(heatmapBoundariesValues[14]).toHaveText("Western Isles");
  }

  function checkHeatmapCouncilAreasBoundaries() {
    expect(dashboard.heatmapBoundariesTitle).toHaveText("COUNCIL AREAS");
    const heatmapBoundariesValues = dashboard.heatmapBoundariesValues;
    expect(heatmapBoundariesValues).toHaveLength(33);
    expect(heatmapBoundariesValues[0]).toHaveText("Scotland");
    expect(heatmapBoundariesValues[1]).toHaveText("Aberdeen City");
    expect(heatmapBoundariesValues[32]).toHaveText("West Lothian");
  }

  function checkHeatmapHealthBoardsCasesValues() {
    expect(dashboard.heatmapValueTypeTitle).toHaveText("TOTAL CASES");
    const heatmapValueTypeValues = dashboard.heatmapValueTypeValues;
    expect(heatmapValueTypeValues).toHaveLength(15);
    checkValueWithin(Number(heatmapValueTypeValues[0].getText()), 30000, 200000);
    checkValueWithin(Number(heatmapValueTypeValues[1].getText()), 1000, 10000);
    checkValueWithin(Number(heatmapValueTypeValues[14].getText()), 50, 1000);
  }
});

function checkValueWithin(value, lower, upper) {
  expect(value).toBeGreaterThanOrEqual(lower);
  expect(value).toBeLessThanOrEqual(upper);
}

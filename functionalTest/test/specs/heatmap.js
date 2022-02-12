import dashboard from "../pageobjects/dashboardPage";

// Heatbar column: thead - DAILY COUNT, subheading (date range) and heatmapScale aren't affected by the user clicking buttons
// subheading (date range) will be updated with new data coming in

describe("heatmap selection", () => {
  it("default view", async () => {
    await dashboard.open();

    await checkHeatmapHealthBoardsBoundaries();
    await checkHeatmapHealthBoardsCasesValues();
    await checkHeatmapHealthBoardsCasesHeatbar();
    await expect(await dashboard.heatmapHeatbarValues).toHaveLength(15);
  });

  it("council areas cases", async () => {
    await dashboard.open();
    await dashboard.selectDeathsButton.click();
    await expect(dashboard.heatmapValueTypeTitle).toHaveText("TOTAL DEATHS");

    await dashboard.selectCouncilAreasButton.click();
    await dashboard.selectCasesButton.click();

    await checkHeatmapCouncilAreasBoundaries();

    await expect(dashboard.heatmapValueTypeTitle).toHaveText("TOTAL CASES");
    const heatmapValueTypeValues = await dashboard.heatmapValueTypeValues;
    await expect(heatmapValueTypeValues).toHaveLength(33);
    await checkValueWithin(
      Number(await heatmapValueTypeValues[0].getText()),
      20000,
      200000
    );
    await checkValueWithin(Number(await heatmapValueTypeValues[1].getText()), 1000, 10000);
    await checkValueWithin(Number(await heatmapValueTypeValues[32].getText()), 500, 10000);

    await checkScotlandCasesHeatbar();

    // City of Edinburgh heatbar
    const expectedValues1 = [
      { l: 0, w: 1 },
      { l: 2, w: 2 },
      { l: 4, w: 1 },
      { l: 5, w: 7 },
      { l: 4, w: 1 },
    ];

    await checkHeatbarValues(5, expectedValues1);

    // Scottish Borders
    const expectedValues2 = [
      { l: 0, w: 3 },
      { l: 3, w: 1 },
      { l: 4, w: 2 },
      { l: 3, w: 3 },
      { l: 2, w: 1 },
    ];

    await checkHeatbarValues(26, expectedValues2);
  });

  it("health boards cases", async () => {
    await dashboard.open();
    await dashboard.selectCouncilAreasButton.click();
    await dashboard.selectDeathsButton.click();
    await expect(dashboard.heatmapBoundariesTitle).toHaveText("COUNCIL AREAS");
    await expect(dashboard.heatmapValueTypeTitle).toHaveText("TOTAL DEATHS");

    await dashboard.selectHealthBoardsButton.click();
    await dashboard.selectCasesButton.click();

    await checkHeatmapHealthBoardsBoundaries();
    await checkHeatmapHealthBoardsCasesValues();
    await checkHeatmapHealthBoardsCasesHeatbar();
    await expect(await dashboard.heatmapHeatbarValues).toHaveLength(15);
  });

  it("health boards deaths", async () => {
    await dashboard.open();
    await dashboard.selectCouncilAreasButton.click();
    await expect(dashboard.heatmapBoundariesTitle).toHaveText("COUNCIL AREAS");

    await dashboard.selectHealthBoardsButton.click();
    await dashboard.selectDeathsButton.click();

    await checkHeatmapHealthBoardsBoundaries();

    await expect(dashboard.heatmapValueTypeTitle).toHaveText("TOTAL DEATHS");
    const heatmapValueTypeValues = await dashboard.heatmapValueTypeValues;
    await expect(heatmapValueTypeValues).toHaveLength(15);
    await checkValueWithin(Number(await heatmapValueTypeValues[0].getText()), 2000, 10000);
    await checkValueWithin(Number(await heatmapValueTypeValues[1].getText()), 50, 1000);
    await checkValueWithin(Number(await heatmapValueTypeValues[14].getText()), 0, 50);

    await checkScotlandDeathsHeatbar();

    // Greater Glasgow & Clyde heatbar
    const expectedValues2 = [
      { l: 0, w: 3 },
      { l: 2, w: 1 },
      { l: 4, w: 1 },
      { l: 5, w: 1 },
      { l: 4, w: 6 },
    ];

    await checkHeatbarValues(7, expectedValues2);

    // Shetland heatbar
    const expectedValues3 = [{ l: 0 }];

    await checkHeatbarValues(12, expectedValues3);
  });

  it("council areas deaths", async () => {
    await dashboard.open();

    await dashboard.selectCouncilAreasButton.click();
    await dashboard.selectDeathsButton.click();

    await checkHeatmapCouncilAreasBoundaries();

    await expect(dashboard.heatmapValueTypeTitle).toHaveText("TOTAL DEATHS");
    const heatmapValueTypeValues = await dashboard.heatmapValueTypeValues;
    await expect(heatmapValueTypeValues).toHaveLength(33);
    await checkValueWithin(Number(await heatmapValueTypeValues[0].getText()), 2000, 10000);
    await checkValueWithin(Number(await heatmapValueTypeValues[1].getText()), 50, 500);
    await checkValueWithin(Number(await heatmapValueTypeValues[32].getText()), 50, 500);

    await checkScotlandDeathsHeatbar();

    // City of Edinburgh heatbar
    const expectedValues1 = [
      { l: 0, w: 4 },
      { l: 2, w: 1 },
      { l: 3, w: 7 },
      { l: 1, w: 1 },
      { l: 0, w: 1 },
    ];

    await checkHeatbarValues(5, expectedValues1);

    // Perth & Kinross
    const expectedValues2 = [
      { l: 0, w: 5 },
      { l: 1, w: 2 },
      { l: 2, w: 1 },
      { l: 0, w: 1 },
      { l: 1, w: 2 },
    ];

    await checkHeatbarValues(24, expectedValues2);
  });

  async function checkHeatmapHealthBoardsBoundaries() {
    await expect(dashboard.heatmapBoundariesTitle).toHaveText("HEALTH BOARDS");
    const heatmapBoundariesValues = await dashboard.heatmapBoundariesValues;
    await expect(heatmapBoundariesValues).toHaveLength(15);
    await expect(heatmapBoundariesValues[0]).toHaveText("Scotland");
    await expect(heatmapBoundariesValues[1]).toHaveText("Ayrshire & Arran");
    await expect(heatmapBoundariesValues[14]).toHaveText("Western Isles");
  }

  async function checkHeatmapCouncilAreasBoundaries() {
    await expect(dashboard.heatmapBoundariesTitle).toHaveText("COUNCIL AREAS");
    const heatmapBoundariesValues = await dashboard.heatmapBoundariesValues;
    await expect(heatmapBoundariesValues).toHaveLength(33);
    await expect(heatmapBoundariesValues[0]).toHaveText("Scotland");
    await expect(heatmapBoundariesValues[1]).toHaveText("Aberdeen City");
    await expect(heatmapBoundariesValues[32]).toHaveText("West Lothian");
  }

  async function checkHeatmapHealthBoardsCasesValues() {
    await expect(dashboard.heatmapValueTypeTitle).toHaveText("TOTAL CASES");
    const heatmapValueTypeValues = await dashboard.heatmapValueTypeValues;
    await expect(heatmapValueTypeValues).toHaveLength(15);
    await checkValueWithin(
      Number(await heatmapValueTypeValues[0].getText()),
      30000,
      200000
    );
    await checkValueWithin(Number(await heatmapValueTypeValues[1].getText()), 1000, 20000);
    await checkValueWithin(Number(await heatmapValueTypeValues[14].getText()), 50, 1000);
  }

  async function checkHeatmapHealthBoardsCasesHeatbar() {
    await checkScotlandCasesHeatbar();

    // Greater Glasgow & Clyde heatbar
    const expectedValues2 = [
      { l: 0, w: 1 },
      { l: 3, w: 1 },
      { l: 4, w: 1 },
      { l: 5, w: 1 },
      { l: 6, w: 6 },
    ];

    await checkHeatbarValues(7, expectedValues2);

    // Western Isles heatbar
    const expectedValues3 = [
      { l: 0, w: 30 },
      { l: 3, w: 1 },
      { l: 2, w: 1 },
      { l: 1, w: 2 },
      { l: 0, w: 2 },
    ];

    await checkHeatbarValues(14, expectedValues3);
  }

  async function checkScotlandCasesHeatbar() {
    const expectedValues = [
      { l: 2, w: 1 },
      { l: 5, w: 2 },
      { l: 6, w: 1 },
      { l: 7, w: 7 },
      { l: 6, w: 1 },
    ];

    await checkHeatbarValues(0, expectedValues);
  }

  function checkScotlandDeathsHeatbar() {
    const expectedValues = [
      { l: 0, w: 2 },
      { l: 1, w: 1 },
      { l: 3, w: 1 },
      { l: 5, w: 8 },
      { l: 4, w: 1 },
    ];

    return checkHeatbarValues(0, expectedValues);
  }

  async function checkHeatbarValues(rowIndex, expectedValues) {
    const strokes = await dashboard.heatbarLines(rowIndex);
    await expectedValues.forEach((element, i) => {
      expect(strokes[i]).toHaveElementClass("l-" + element.l);
    });

    if (expectedValues.length === 1) {
      await expect(strokes).toHaveLength(1);
    } else {
      const calculatedDayWidth =
        Number(await strokes[0].getAttribute("stroke-width")) / expectedValues[0].w;
        for (let i=0; i<expectedValues.length; i++) {
          const element = expectedValues[i];
          expect(Number(await strokes[i].getAttribute("stroke-width"))).toBeCloseTo(
          calculatedDayWidth * expectedValues[i].w,
          4
        );
      };
    }
  }
});

async function checkValueWithin(value, lower, upper) {
  await expect(value).toBeGreaterThanOrEqual(lower);
  await expect(value).toBeLessThanOrEqual(upper);
}

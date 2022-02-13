import dashboard from "../pageobjects/dashboardPage";
import { checkChartTimespanSelection, elementClick } from "../utilities/utils";

describe("Covid-19 Dashboard", () => {
  it("should have correct title", async () => {
    await dashboard.open();
    let title = "Scottish COVID-19 Statistics";
    await expect(browser).toHaveTitle(title);
    await expect(dashboard.imgLogo).toBeDisplayed();
    await expect(dashboard.headingTitle).toHaveText("Scottish COVID-19 Statistics");
    await expect(dashboard.headlineBanner).toHaveTextContaining(
      "Regional Restrictions to help fight the pandemic"
    );
  });
});

describe("geoHeatMap Area Count", () => {
  it("geoHeatMap Area Check", async () => {
    await dashboard.open();
    await expect(dashboard.geoMapArea).toBeElementsArrayOfSize(14);

    await dashboard.selectCouncilAreasButton.click();
    await expect(dashboard.geoMapArea).toBeElementsArrayOfSize(32);

    await dashboard.selectHealthBoardsButton.click();
    await expect(dashboard.geoMapArea).toBeElementsArrayOfSize(14);
  });
});

describe("Verify Single Value Bar Visibility", () => {
  it("Single Value Bar Visibility", async () => {
    await dashboard.open();
    await expect(dashboard.dailyCases).toBeDisplayed();
    await expect(dashboard.totalCases).toBeDisplayed();
    await expect(dashboard.dailyDeaths).toBeDisplayed();
    await expect(dashboard.totalDeaths).toBeDisplayed();
    await expect(dashboard.fatalityCaseRatio).toBeDisplayed();
  });
});

describe("Analytical Chart with timeSpan", () => {
  it("Analytical charts-->Daily Cases", async () => {
    await dashboard.open();
    await selectChartType("Daily Cases");
    await checkChartTimespanSelection();
  });

  it("Analytical charts-->Total Cases", async () => {
    await dashboard.open();
    await selectChartType("Total Cases");
    await checkChartTimespanSelection();
  });

  it("Analytical charts-->Daily Deaths", async () => {
    await dashboard.open();
    await selectChartType("Daily Deaths");
    await checkChartTimespanSelection();
  });

  it("Analytical charts-->Total Deaths", async () => {
    await dashboard.open();
    await selectChartType("Total Deaths");
    await checkChartTimespanSelection();
  });

  async function selectChartType(chartTypeLabel) {
    await elementClick(await dashboard.chartDropdown);
    await elementClick(await dashboard.selectChartDropdownOption(chartTypeLabel));
  }
});

describe("Verify FACTS and NEWS Container", () => {
  it("FACTS Container", async () => {
    await dashboard.open();
    await expect(dashboard.factsContainer).toBeDisplayed();
  });
});

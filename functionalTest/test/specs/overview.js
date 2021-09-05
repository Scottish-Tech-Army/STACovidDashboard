import dashboard from "../pageobjects/dashboardPage";
import { checkChartTimespanSelection } from "../utilities/utils";

describe("Covid-19 Dashboard", () => {
  it("should have correct title", () => {
    dashboard.open();
    let title = "Scottish COVID-19 Statistics";
    expect(browser).toHaveTitle(title);
    expect(dashboard.imgLogo).toBeDisplayed();
    expect(dashboard.headingTitle).toHaveText("Scottish COVID-19 Statistics");
  });
});

describe("geoHeatMap Area Count", () => {
  it("geoHeatMap Area Check", () => {
    dashboard.open();
    expect(dashboard.geoMapArea).toBeElementsArrayOfSize(14);

    dashboard.selectCouncilAreasButton.click();
    expect(dashboard.geoMapArea).toBeElementsArrayOfSize(32);

    dashboard.selectHealthBoardsButton.click();
    expect(dashboard.geoMapArea).toBeElementsArrayOfSize(14);
  });
});

describe("Verify Single Value Bar Visibility", () => {
  it("Single Value Bar Visibility", () => {
    dashboard.open();
    expect(dashboard.dailyCases).toBeDisplayed();
    expect(dashboard.totalCases).toBeDisplayed();
    expect(dashboard.dailyDeaths).toBeDisplayed();
    expect(dashboard.totalDeaths).toBeDisplayed();
    expect(dashboard.fatalityCaseRatio).toBeDisplayed();
  });
});

describe("Analytical Chart with timeSpan", () => {
  it("Analytical charts-->Daily Cases", () => {
    dashboard.open();
    selectChartType("Daily Cases");
    checkChartTimespanSelection();
  });

  it("Analytical charts-->Total Cases", () => {
    dashboard.open();
    selectChartType("Total Cases");
    checkChartTimespanSelection();
  });

  it("Analytical charts-->Daily Deaths", () => {
    dashboard.open();
    selectChartType("Daily Deaths");
    checkChartTimespanSelection();
  });

  it("Analytical charts-->Total Deaths", () => {
    dashboard.open();
    selectChartType("Total Deaths");
    checkChartTimespanSelection();
  });

  it("Analytical charts-->% Tests Positive", () => {
    dashboard.open();
    selectChartType("% Tests Positive");
    checkChartTimespanSelection();
  });

  function selectChartType(chartTypeLabel) {
    dashboard.chartDropdown.click();
    dashboard.selectChartDropdownOption(chartTypeLabel).click();
  }
});

describe("Verify FACTS and NEWS Container", () => {
  it("FACTS Container", () => {
    dashboard.open();
    expect(dashboard.factsContainer).toBeDisplayed();
  });
});

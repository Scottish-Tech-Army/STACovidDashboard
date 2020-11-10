import dashboard from "../pageobjects/dashboardPage";
import reusable from "../utilities/reusableLibrary";

describe("Covid-19 Dashboard", () => {
  it("should have correct title", () => {
    dashboard.open();
    let title = "Scottish COVID-19 Statistics";
    expect(browser).toHaveTitle(title);
    expect(dashboard.imgLogo).toBeDisplayed();
    expect(dashboard.headingTitle).toHaveText("Scottish COVID-19 Statistics");
    expect(dashboard.headlineBanner).toHaveTextContaining(
      "Regional Restrictions to help fight the pandemic"
    );
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

describe("Analitycal Chart with timeSpan", () => {
  it("Analitycal charts-->Daily Cases", () => {
    dashboard.open();
    dashboard.chartDropdown.click();
    dashboard.selectChartDropdownOption("Daily Cases").click();
    reusable.sliderTrackResult();
  });

  it("Analitycal charts-->Total Cases", () => {
    dashboard.open();
    dashboard.chartDropdown.click();
    dashboard.selectChartDropdownOption("Total Cases").click();
    reusable.sliderTrackResult();
  });

  it("Analitycal charts-->Daily Deaths", () => {
    dashboard.open();
    dashboard.chartDropdown.click();
    dashboard.selectChartDropdownOption("Daily Deaths").click();
    reusable.sliderTrackResult();
  });

  it("Analitycal charts-->Total Deaths", () => {
    dashboard.open();
    dashboard.chartDropdown.click();
    dashboard.selectChartDropdownOption("Total Deaths").click();
    reusable.sliderTrackResult();
  });

  it("Analitycal charts-->% Tests Positive", () => {
    dashboard.open();
    dashboard.chartDropdown.click();
    dashboard.selectChartDropdownOption("% Tests Positive").click();
    reusable.sliderTrackResult();
  });
});

describe("Verify FACTS and NEWS Container", () => {
  it("FACTS Container", () => {
    dashboard.open();
    expect(dashboard.factsContainer).toBeDisplayed();
  });

  it("NEWS Container", () => {
    dashboard.open();
    expect(dashboard.newsContainer).toBeDisplayed();
    expect(dashboard.newsContainerGovLink).toHaveHrefContaining(
      "https://news.gov.scot/news"
    );
  });
});

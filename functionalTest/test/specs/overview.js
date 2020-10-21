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
  it("Health Board Area geoHeatMap-->Cases", () => {
    dashboard.open();
    dashboard.selectHealthBoardsButton.click();
    dashboard.selectCasesButton.click();
    expect(dashboard.geoMapHealthBoardArea).toBeElementsArrayOfSize(14);
  });

  it("Health Board Area geoHeatMap-->Deaths", () => {
    dashboard.open();
    dashboard.selectHealthBoardsButton.click();
    dashboard.selectDeathsButton.click();
    expect(dashboard.geoMapHealthBoardArea).toBeElementsArrayOfSize(14);
  });

  it("Council Area geoHeatMap-->Cases", () => {
    dashboard.open();
    dashboard.selectCouncilAreasButton.click();
    dashboard.selectCasesButton.click();
    expect(dashboard.geoMapHealthBoardArea).toBeElementsArrayOfSize(32);
  });

  it("Council Area geoHeatMap-->Deaths", () => {
    dashboard.open();
    dashboard.selectCouncilAreasButton.click();
    dashboard.selectDeathsButton.click();
    expect(dashboard.geoMapHealthBoardArea).toBeElementsArrayOfSize(32);
  });
});

describe("Verify Single Value Bar Visibility", () => {
  it("Single Value Bar Visibility", () => {
    dashboard.open();
    expect(dashboard.dailyCases).toBeDisplayed();
    expect(dashboard.totalCases).toBeDisplayed();
    expect(dashboard.dailyFatalities).toBeDisplayed();
    expect(dashboard.totalFatalities).toBeDisplayed();
    expect(dashboard.fatalityCaseRatio).toBeDisplayed();
  });
});

describe("Analitycal Chart with timeSpan", () => {
  it("Analitycal charts-->Daily Cases", () => {
    dashboard.open();
    dashboard.chartDropdown.click();
    dashboard.selectDropdownOpt("Daily Cases").click();
    reusable.sliderTrackResult();
  });

  it("Analitycal charts-->Total Cases", () => {
    dashboard.open();
    dashboard.chartDropdown.click();
    dashboard.selectDropdownOpt("Total Cases").click();
    reusable.sliderTrackResult();
  });

  it("Analitycal charts-->Daily Deaths", () => {
    dashboard.open();
    dashboard.chartDropdown.click();
    dashboard.selectDropdownOpt("Daily Deaths").click();
    reusable.sliderTrackResult();
  });

  it("Analitycal charts-->Total Deaths", () => {
    dashboard.open();
    dashboard.chartDropdown.click();
    dashboard.selectDropdownOpt("Total Deaths").click();
    reusable.sliderTrackResult();
  });

  it("Analitycal charts-->% Tests Positive", () => {
    dashboard.open();
    dashboard.chartDropdown.click();
    dashboard.selectDropdownOpt("% Tests Positive").click();
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

import dashboard from "../pageobjects/dashboardPage";
import regionalInsights from "../pageobjects/regionalPage";

const OVERVIEW_PAGE_TEXT = "DEATH/CASE RATIO";
const ABOUTUS_PAGE_TEXT = "Meet the team";
const ACCESSIBILITY_PAGE_TEXT = "Conformance Statement";
const DATASOURCES_PAGE_TEXT = "Data sources and attributions";

// React routing doesn't work well with S3 static websites using subdirectories as base urls
// This workaround avoid setup errors when starting with the regional page
function openRegionalPage() {
  dashboard.open();
  dashboard.navbarLinkRegionalInsights.click();
}

describe("page linking sitemap", () => {
  it("summary dashboard -> about us", () => {
    dashboard.open();
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    dashboard.sitemapLinkAboutUs.click();

    expect(dashboard.root).toHaveTextContaining(ABOUTUS_PAGE_TEXT);
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/about");
  });

  it("summary dashboard -> accessibility", () => {
    dashboard.open();
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    dashboard.sitemapLinkAccessibility.click();

    expect(dashboard.root).toHaveTextContaining(ACCESSIBILITY_PAGE_TEXT);
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/accessibility");
  });

  it("summary dashboard -> data sources", () => {
    dashboard.open();
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    dashboard.sitemapLinkDataSources.click();

    expect(dashboard.root).toHaveTextContaining(DATASOURCES_PAGE_TEXT);
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/data");
  });

  it("summary dashboard -> regional default", () => {
    dashboard.open();
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    dashboard.sitemapLinkRegionalInsights.click();

    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/regional");
  });

  it("regional default -> summary dashboard", () => {
    openRegionalPage();
    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");

    dashboard.sitemapLinkSummaryStatistics.click();

    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/");
  });
});

describe("page linking region choice", () => {
  function selectRegionFromDropdown(regionLabel, expectedUrl) {
    regionalInsights.selectedRegionButton.click();
    regionalInsights.regionDropdownMenuItem(regionLabel).click();

    expect(regionalInsights.selectedRegionButton).toHaveText(regionLabel);
    expect(browser.getUrl()).toBe(browser.config.baseUrl + expectedUrl);
  }

  it("regional default -> regional council area", () => {
    openRegionalPage();
    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");

    selectRegionFromDropdown("Glasgow City", "/regional/S12000049");
  });

  it("regional council area -> regional health board", () => {
    openRegionalPage();
    selectRegionFromDropdown("Glasgow City", "/regional/S12000049");
    selectRegionFromDropdown("Lothian", "/regional/S08000024");
  });

  it("regional health board -> regional default", () => {
    openRegionalPage();
    selectRegionFromDropdown("Lothian", "/regional/S08000024");
    selectRegionFromDropdown("Scotland", "/regional");
  });
});

describe("page linking navbar", () => {
  it("summary dashboard -> regional default", () => {
    dashboard.open();
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    dashboard.navbarLinkRegionalInsights.click();

    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/regional");
  });

  it("regional default -> summary dashboard", () => {
    openRegionalPage();
    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");

    dashboard.navbarLinkSummaryStatistics.click();

    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/");
  });

  it("regional default (click logo) -> summary dashboard", () => {
    openRegionalPage();
    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");

    dashboard.navbarLinkLogo.click();

    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/");
  });
});

describe("page routing history following links", () => {
  it("history handling", () => {
    // Create a history
    dashboard.open();
    dashboard.sitemapLinkAboutUs.click();
    dashboard.sitemapLinkRegionalInsights.click();
    regionalInsights.selectedRegionButton.click();
    regionalInsights.regionDropdownMenuItem("Lothian").click();
    regionalInsights.selectedRegionButton.click();
    regionalInsights.regionDropdownMenuItem("Glasgow City").click();
    dashboard.sitemapLinkSummaryStatistics.click();

    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    browser.back();
    expect(browser.getUrl()).toBe(
      browser.config.baseUrl + "/regional/S12000049"
    );
    expect(regionalInsights.selectedRegionButton).toHaveText("Glasgow City");

    browser.back();
    expect(browser.getUrl()).toBe(
      browser.config.baseUrl + "/regional/S08000024"
    );
    expect(regionalInsights.selectedRegionButton).toHaveText("Lothian");

    browser.back();
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/regional");
    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");

    browser.forward();
    expect(browser.getUrl()).toBe(
      browser.config.baseUrl + "/regional/S08000024"
    );
    expect(regionalInsights.selectedRegionButton).toHaveText("Lothian");

    browser.forward();
    expect(browser.getUrl()).toBe(
      browser.config.baseUrl + "/regional/S12000049"
    );
    expect(regionalInsights.selectedRegionButton).toHaveText("Glasgow City");

    browser.forward();
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
  });

  it("no more forward", () => {
    // Create a history
    dashboard.open();
    dashboard.sitemapLinkAboutUs.click();

    expect(dashboard.root).toHaveTextContaining(ABOUTUS_PAGE_TEXT);

    browser.back();
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    browser.forward();
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/about");
    expect(dashboard.root).toHaveTextContaining(ABOUTUS_PAGE_TEXT);

    browser.forward();
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/about");
    expect(dashboard.root).toHaveTextContaining(ABOUTUS_PAGE_TEXT);
  });
});

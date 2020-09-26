import dashboard from "../pageobjects/dashboardPage";
import regionalInsights from "../pageobjects/regionalPage";

const OVERVIEW_PAGE_TEXT =
  "We are currently in Phase 3 of the Scottish Government's COVID-19 Route Map.";
const ABOUTUS_PAGE_TEXT = "Meet the team";
const ACCESSIBILITY_PAGE_TEXT = "Conformance Statement";
const DATASOURCES_PAGE_TEXT = "Data sources and attributions";

describe("page routing", () => {
  it("summary dashboard", () => {
    browser.url("/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
  });

  it("about us page", () => {
    browser.url("/about");
    expect(dashboard.root).toHaveTextContaining(ABOUTUS_PAGE_TEXT);
  });

  it("accessibility page", () => {
    browser.url("/accessibility");
    expect(dashboard.root).toHaveTextContaining(ACCESSIBILITY_PAGE_TEXT);
  });

  it("data sources page", () => {
    browser.url("/data");
    expect(dashboard.root).toHaveTextContaining(DATASOURCES_PAGE_TEXT);
  });

  it("regional insights default", () => {
    browser.url("/regional");
    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");
  });

  it("regional insights health board", () => {
    browser.url("/regional/S08000024");
    expect(regionalInsights.selectedRegionButton).toHaveText("Lothian");
  });

  it("regional insights council area", () => {
    browser.url("/regional/S12000049");
    expect(regionalInsights.selectedRegionButton).toHaveText("Glasgow City");
  });

  it("unknown url -> summary dashboard", () => {
    browser.url("/unknown");
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
  });
});

describe("page linking sitemap", () => {
  it("summary dashboard -> about us", () => {
    browser.url("/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    dashboard.sitemapLinkAboutUs.click();

    expect(dashboard.root).toHaveTextContaining(ABOUTUS_PAGE_TEXT);
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/about");
  });

  it("summary dashboard -> accessibility", () => {
    browser.url("/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    dashboard.sitemapLinkAccessibility.click();

    expect(dashboard.root).toHaveTextContaining(ACCESSIBILITY_PAGE_TEXT);
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/accessibility");
  });

  it("summary dashboard -> data sources", () => {
    browser.url("/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    dashboard.sitemapLinkDataSources.click();

    expect(dashboard.root).toHaveTextContaining(DATASOURCES_PAGE_TEXT);
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/data");
  });

  it("summary dashboard -> regional default", () => {
    browser.url("/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    dashboard.sitemapLinkRegionalInsights.click();

    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/regional");
  });

  it("regional default -> summary dashboard", () => {
    browser.url("/regional");
    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");

    dashboard.sitemapLinkSummaryDashboard.click();

    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/");
  });
});

describe("page linking region choice", () => {
  it("regional default -> regional council area", () => {
    // Todo temporary
    browser.url("/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
    dashboard.sitemapLinkRegionalInsights.click();

    // Replace with
    // browser.url("/regional");
    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");

    regionalInsights.selectedRegionButton.click();
    regionalInsights.regionDropdownMenuItem("Glasgow City").click();

    expect(regionalInsights.selectedRegionButton).toHaveText("Glasgow City");
    expect(browser.getUrl()).toBe(
      browser.config.baseUrl + "/regional/S12000049"
    );
  });

  it("regional council area -> regional health board", () => {
    // Todo temporary
    browser.url("/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
    dashboard.sitemapLinkRegionalInsights.click();
    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");
    regionalInsights.selectedRegionButton.click();
    regionalInsights.regionDropdownMenuItem("Glasgow City").click();

    // Replace with
    // browser.url("/regional/S12000049");
    expect(regionalInsights.selectedRegionButton).toHaveText("Glasgow City");

    regionalInsights.selectedRegionButton.click();
    regionalInsights.regionDropdownMenuItem("Lothian").click();

    expect(regionalInsights.selectedRegionButton).toHaveText("Lothian");
    expect(browser.getUrl()).toBe(
      browser.config.baseUrl + "/regional/S08000024"
    );
  });

  it("regional health board -> regional default", () => {
    // Todo temporary
    browser.url("/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
    dashboard.sitemapLinkRegionalInsights.click();
    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");
    regionalInsights.selectedRegionButton.click();
    regionalInsights.regionDropdownMenuItem("Lothian").click();

    // Replace with
    // browser.url("/regional/S08000024");
    expect(regionalInsights.selectedRegionButton).toHaveText("Lothian");

    regionalInsights.selectedRegionButton.click();
    regionalInsights.regionDropdownMenuItem("Scotland").click();

    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/regional");
  });
});

describe("page linking navbar", () => {
  it("summary dashboard -> regional default", () => {
      browser.url("/");
      expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

      dashboard.navbarLinkRegionalInsights.click();

      expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");
      expect(browser.getUrl()).toBe(browser.config.baseUrl + "/regional");
  });

  it("regional default -> summary dashboard", () => {
      // Todo temporary
      browser.url("/");
      expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
      dashboard.sitemapLinkRegionalInsights.click();

      // Replace with
      // browser.url("/regional");
      expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");

      dashboard.navbarLinkSummaryDashboard.click();

      expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
      expect(browser.getUrl()).toBe(browser.config.baseUrl + "/");
  });

  it("regional default (click logo) -> summary dashboard", () => {
      // Todo temporary
      browser.url("/");
      expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
      dashboard.sitemapLinkRegionalInsights.click();

      // Replace with
      // browser.url("/regional");
      expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");

      dashboard.navbarLinkLogo.click();

      expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
      expect(browser.getUrl()).toBe(browser.config.baseUrl + "/");
  });
});

describe("page routing history", () => {
  it("history handling", () => {
    browser.url("/");
    browser.url("/about");
    browser.url("/regional");
    browser.url("/regional/S08000024");
    browser.url("/regional/S12000049");
    browser.url("/");

    browser.back();
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/regional/S12000049");
    expect(regionalInsights.selectedRegionButton).toHaveText("Glasgow City");

    browser.back();
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/regional/S08000024");
    expect(regionalInsights.selectedRegionButton).toHaveText("Lothian");

    browser.back();
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/regional");
    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");

    browser.forward();
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/regional/S08000024");
    expect(regionalInsights.selectedRegionButton).toHaveText("Lothian");

    browser.forward();
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/regional/S12000049");
    expect(regionalInsights.selectedRegionButton).toHaveText("Glasgow City");

    browser.forward();
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
  });

  it("no more forward", () => {
    browser.url("/");
    browser.url("/about");

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

  it("no more back", () => {
    browser.url("/");
    browser.url("/about");

    browser.back();
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    browser.back();
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
  });
});

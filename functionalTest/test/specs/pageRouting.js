import dashboard from "../pageobjects/dashboardPage";
import regionalInsights from "../pageobjects/regionalPage";

const OVERVIEW_PAGE_TEXT =
  "We are currently in Phase 3 of the Scottish Government's COVID-19 Route Map.";
const ABOUTUS_PAGE_TEXT = "Meet the team";
const ACCESSIBILITY_PAGE_TEXT = "Conformance Statement";
const DATASOURCES_PAGE_TEXT = "Data sources and attributions";

describe("page routing", () => {
  xit("summary dashboard", () => {
    browser.url("/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
  });

  xit("about us page", () => {
    browser.url("/about");
    expect(dashboard.root).toHaveTextContaining(ABOUTUS_PAGE_TEXT);
  });

  xit("accessibility page", () => {
    browser.url("/accessibility");
    expect(dashboard.root).toHaveTextContaining(ACCESSIBILITY_PAGE_TEXT);
  });

  xit("data sources page", () => {
    browser.url("/data");
    expect(dashboard.root).toHaveTextContaining(DATASOURCES_PAGE_TEXT);
  });

  xit("regional insights default", () => {
    browser.url("/regional");
    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");
  });

  xit("regional insights health board", () => {
    browser.url("/regional/S08000024");
    expect(regionalInsights.selectedRegionButton).toHaveText("Lothian");
  });

  xit("regional insights council area", () => {
    browser.url("/regional/S12000049");
    expect(regionalInsights.selectedRegionButton).toHaveText("Glasgow City");
  });

  xit("unknown url -> summary dashboard", () => {
    browser.url("/unknown");
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
  });

  xit("unknown regional url -> regional insights default", () => {
    browser.url("/regional/unknown");
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/regional");
    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");
  });
});

describe("page linking sitemap", () => {
  xit("summary dashboard -> about us", () => {
    browser.url("/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    dashboard.sitemapLinkAboutUs.click();

    expect(dashboard.root).toHaveTextContaining(ABOUTUS_PAGE_TEXT);
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/about");
  });

  xit("summary dashboard -> accessibility", () => {
    browser.url("/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    dashboard.sitemapLinkAccessibility.click();

    expect(dashboard.root).toHaveTextContaining(ACCESSIBILITY_PAGE_TEXT);
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/accessibility");
  });

  xit("summary dashboard -> data sources", () => {
    browser.url("/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    dashboard.sitemapLinkDataSources.click();

    expect(dashboard.root).toHaveTextContaining(DATASOURCES_PAGE_TEXT);
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/data");
  });

  xit("summary dashboard -> regional default", () => {
    browser.url("/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    dashboard.sitemapLinkRegionalInsights.click();

    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/regional");
  });

  xit("regional default -> summary dashboard", () => {
    browser.url("/regional");
    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");

    dashboard.sitemapLinkSummaryDashboard.click();

    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/");
  });
});

describe("page linking region choice", () => {
  xit("regional default -> regional council area", () => {
    browser.url("/regional");
    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");

    regionalInsights.selectedRegionButton.click();
    regionalInsights.regionDropdownMenuItem("Glasgow City").click();

    expect(regionalInsights.selectedRegionButton).toHaveText("Glasgow City");
    expect(browser.getUrl()).toBe(
      browser.config.baseUrl + "/regional/S12000049"
    );
  });

  xit("regional council area -> regional health board", () => {
    browser.url("/regional/S12000049");
    expect(regionalInsights.selectedRegionButton).toHaveText("Glasgow City");

    regionalInsights.selectedRegionButton.click();
    regionalInsights.regionDropdownMenuItem("Lothian").click();

    expect(regionalInsights.selectedRegionButton).toHaveText("Lothian");
    expect(browser.getUrl()).toBe(
      browser.config.baseUrl + "/regional/S08000024"
    );
  });

  xit("regional health board -> regional default", () => {
    browser.url("/regional/S08000024");
    expect(regionalInsights.selectedRegionButton).toHaveText("Lothian");

    regionalInsights.selectedRegionButton.click();
    regionalInsights.regionDropdownMenuItem("Scotland").click();

    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/regional");
  });
});

describe("page linking navbar", () => {
  xit("summary dashboard -> regional default", () => {
    browser.url("/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    dashboard.navbarLinkRegionalInsights.click();

    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/regional");
  });

  xit("regional default -> summary dashboard", () => {
    browser.url("/regional");
    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");

    dashboard.navbarLinkSummaryDashboard.click();

    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/");
  });

  xit("regional default (click logo) -> summary dashboard", () => {
    browser.url("/regional");
    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");

    dashboard.navbarLinkLogo.click();

    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/");
  });
});

describe("page routing history from urls", () => {
  xit("history handling", () => {
    // Create a history
    browser.url("/");
    browser.url("/about");
    browser.url("/regional");
    browser.url("/regional/S08000024");
    browser.url("/regional/S12000049");
    browser.url("/");

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

  xit("no more forward", () => {
    // Create a history
    browser.url("/");
    browser.url("/about");

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

describe("page routing history following links", () => {
  xit("history handling", () => {
    // Create a history
    browser.url("/");
    dashboard.sitemapLinkAboutUs.click();
    dashboard.sitemapLinkRegionalInsights.click();
    regionalInsights.selectedRegionButton.click();
    regionalInsights.regionDropdownMenuItem("Lothian").click();
    regionalInsights.selectedRegionButton.click();
    regionalInsights.regionDropdownMenuItem("Glasgow City").click();
    dashboard.sitemapLinkSummaryDashboard.click();

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

  xit("no more forward", () => {
    // Create a history
    browser.url("/");
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

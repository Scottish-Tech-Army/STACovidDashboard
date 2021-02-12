import dashboard from "../pageobjects/dashboardPage";
import regionalInsights from "../pageobjects/regionalPage";

const OVERVIEW_PAGE_TEXT = "DEATH/CASE RATIO";
const ABOUTUS_PAGE_TEXT = "Meet the team";
const ACCESSIBILITY_PAGE_TEXT = "Conformance Statement";
const DATASOURCES_PAGE_TEXT = "Data sources and attributions";

describe("page routing", () => {

  it("summary dashboard", () => {
    dashboard.open();
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
  });

  it("about us page", () => {
    browser.url(browser.options.baseUrl + "/about");
    expect(dashboard.root).toHaveTextContaining(ABOUTUS_PAGE_TEXT);
  });

  it("accessibility page", () => {
    browser.url(browser.options.baseUrl + "/accessibility");
    expect(dashboard.root).toHaveTextContaining(ACCESSIBILITY_PAGE_TEXT);
  });

  it("data sources page", () => {
    browser.url(browser.options.baseUrl + "/data");
    expect(dashboard.root).toHaveTextContaining(DATASOURCES_PAGE_TEXT);
  });

  it("regional insights default", () => {
    browser.url(browser.options.baseUrl + "/regional");
    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");
  });

  it("regional insights health board", () => {
    browser.url(browser.options.baseUrl + "/regional/S08000024");
    expect(regionalInsights.selectedRegionButton).toHaveText("Lothian");
  });

  it("regional insights council area", () => {
    browser.url(browser.options.baseUrl + "/regional/S12000049");
    expect(regionalInsights.selectedRegionButton).toHaveText("Glasgow City");
  });

  it("unknown url -> summary dashboard", () => {
    browser.url(browser.options.baseUrl + "/unknown");
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
  });

  it("unknown regional url -> regional insights default", () => {
    browser.url(browser.options.baseUrl + "/regional/unknown");
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/regional");
    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");
  });
});

describe("page routing history from urls", () => {
  it("history handling", () => {
    // Create a history
    dashboard.open();
    browser.url(browser.options.baseUrl + "/about");
    browser.url(browser.options.baseUrl + "/regional");
    browser.url(browser.options.baseUrl + "/regional/S08000024");
    browser.url(browser.options.baseUrl + "/regional/S12000049");
    dashboard.open();

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
    browser.url(browser.options.baseUrl + "/about");

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

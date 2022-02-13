import dashboard from "../pageobjects/dashboardPage";
import regionalInsights from "../pageobjects/regionalPage";

const OVERVIEW_PAGE_TEXT = "DEATH/CASE RATIO";
const ABOUTUS_PAGE_TEXT = "Meet the team";
const ACCESSIBILITY_PAGE_TEXT = "Conformance Statement";
const DATASOURCES_PAGE_TEXT = "Data sources and attributions";

describe("page routing", () => {

  it("summary dashboard", async () => {
    await dashboard.open();
    await expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
  });

  it("about us page", async () => {
    await browser.url(browser.options.baseUrl + "/about");
    await expect(dashboard.root).toHaveTextContaining(ABOUTUS_PAGE_TEXT);
  });

  it("accessibility page", async () => {
    await browser.url(browser.options.baseUrl + "/accessibility");
    await expect(dashboard.root).toHaveTextContaining(ACCESSIBILITY_PAGE_TEXT);
  });

  it("data sources page", async () => {
    await browser.url(browser.options.baseUrl + "/data");
    await expect(dashboard.root).toHaveTextContaining(DATASOURCES_PAGE_TEXT);
  });

  it("regional insights default", async () => {
    await browser.url(browser.options.baseUrl + "/regional");
    await expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");
  });

  it("regional insights health board", async () => {
    await browser.url(browser.options.baseUrl + "/regional/S08000024");
    await expect(regionalInsights.selectedRegionButton).toHaveText("Lothian");
  });

  it("regional insights council area", async () => {
    await browser.url(browser.options.baseUrl + "/regional/S12000049");
    await expect(regionalInsights.selectedRegionButton).toHaveText("Glasgow City");
  });

  it("unknown url -> summary dashboard", async () => {
    await browser.url(browser.options.baseUrl + "/unknown");
    await expect(await browser.getUrl()).toBe(browser.config.baseUrl + "/");
    await expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
  });

  it("unknown regional url -> regional insights default", async () => {
    await browser.url(browser.options.baseUrl + "/regional/unknown");
    await expect(await browser.getUrl()).toBe(browser.config.baseUrl + "/regional");
    await expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");
  });
});

describe("page routing history from urls", () => {
  it("history handling", async () => {
    // Create a history
    await dashboard.open();
    await browser.url(browser.options.baseUrl + "/about");
    await browser.url(browser.options.baseUrl + "/regional");
    await browser.url(browser.options.baseUrl + "/regional/S08000024");
    await browser.url(browser.options.baseUrl + "/regional/S12000049");
    await dashboard.open();

    await expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    await browser.back();
    await expect(await browser.getUrl()).toBe(
      browser.config.baseUrl + "/regional/S12000049"
    );
    await expect(regionalInsights.selectedRegionButton).toHaveText("Glasgow City");

    await browser.back();
    await expect(await browser.getUrl()).toBe(
      browser.config.baseUrl + "/regional/S08000024"
    );
    await expect(regionalInsights.selectedRegionButton).toHaveText("Lothian");

    await browser.back();
    await expect(await browser.getUrl()).toBe(browser.config.baseUrl + "/regional");
    await expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");

    await browser.forward();
    await expect(await browser.getUrl()).toBe(
      browser.config.baseUrl + "/regional/S08000024"
    );
    await expect(regionalInsights.selectedRegionButton).toHaveText("Lothian");

    await browser.forward();
    await expect(await browser.getUrl()).toBe(
      browser.config.baseUrl + "/regional/S12000049"
    );
    await expect(regionalInsights.selectedRegionButton).toHaveText("Glasgow City");

    await browser.forward();
    await expect(await browser.getUrl()).toBe(browser.config.baseUrl + "/");
    await expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
  });

  it("no more forward", async () => {
    // Create a history
    await dashboard.open();
    await browser.url(browser.options.baseUrl + "/about");

    await expect(dashboard.root).toHaveTextContaining(ABOUTUS_PAGE_TEXT);

    await browser.back();
    await expect(await browser.getUrl()).toBe(browser.config.baseUrl + "/");
    await expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    await browser.forward();
    await expect(await browser.getUrl()).toBe(browser.config.baseUrl + "/about");
    await expect(dashboard.root).toHaveTextContaining(ABOUTUS_PAGE_TEXT);

    await browser.forward();
    await expect(await browser.getUrl()).toBe(browser.config.baseUrl + "/about");
    await expect(dashboard.root).toHaveTextContaining(ABOUTUS_PAGE_TEXT);
  });
});

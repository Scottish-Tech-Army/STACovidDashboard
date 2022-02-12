import dashboard from "../pageobjects/dashboardPage";
import regionalInsights from "../pageobjects/regionalPage";
import { elementClick } from "../utilities/utils";

const OVERVIEW_PAGE_TEXT = "DEATH/CASE RATIO";
const ABOUTUS_PAGE_TEXT = "Meet the team";
const ACCESSIBILITY_PAGE_TEXT = "Conformance Statement";
const DATASOURCES_PAGE_TEXT = "Data sources and attributions";

// React routing doesn't work well with S3 static websites using subdirectories as base urls
// This workaround avoid setup errors when starting with the regional page
async function openRegionalPage() {
  await dashboard.open();
  await dashboard.navbarLinkRegionalInsights.click();
}

describe("page linking sitemap", () => {
  it("summary dashboard -> about us", async () => {
    await dashboard.open();
    await expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    await elementClick(await dashboard.sitemapLinkAboutUs);

    await expect(dashboard.root).toHaveTextContaining(ABOUTUS_PAGE_TEXT);
    await expect(await browser.getUrl()).toBe(browser.config.baseUrl + "/about");
  });

  it("summary dashboard -> accessibility", async () => {
    await dashboard.open();
    await expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    await elementClick(await dashboard.sitemapLinkAccessibility);

    await expect(dashboard.root).toHaveTextContaining(ACCESSIBILITY_PAGE_TEXT);
    await expect(await browser.getUrl()).toBe(browser.config.baseUrl + "/accessibility");
  });

  it("summary dashboard -> data sources", async () => {
    await dashboard.open();
    await expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    await elementClick(await dashboard.sitemapLinkDataSources);

    await expect(dashboard.root).toHaveTextContaining(DATASOURCES_PAGE_TEXT);
    await expect(await browser.getUrl()).toBe(browser.config.baseUrl + "/data");
  });

  it("summary dashboard -> regional default", async () => {
    await dashboard.open();
    await expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    await elementClick(await dashboard.sitemapLinkRegionalInsights);

    await expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");
    await expect(await browser.getUrl()).toBe(browser.config.baseUrl + "/regional");
  });

  it("regional default -> summary dashboard", async () => {
    await openRegionalPage();
    await expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");

    await elementClick(await dashboard.sitemapLinkSummaryStatistics);

    await expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
    await expect(await browser.getUrl()).toBe(browser.config.baseUrl + "/");
  });
});

describe("page linking region choice", () => {
  async function selectRegionFromDropdown(regionLabel, expectedUrl) {
    await regionalInsights.selectedRegionButton.click();
    await elementClick(await regionalInsights.regionDropdownMenuItem(regionLabel));

    await expect(regionalInsights.selectedRegionButton).toHaveText(regionLabel);
    await expect(await browser.getUrl()).toBe(browser.config.baseUrl + expectedUrl);
  }

  it("regional default -> regional council area", async () => {
    await openRegionalPage();
    await expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");

    await selectRegionFromDropdown("Glasgow City", "/regional/S12000049");
  });

  it("regional council area -> regional health board", async () => {
    await openRegionalPage();
    await selectRegionFromDropdown("Glasgow City", "/regional/S12000049");
    await selectRegionFromDropdown("Lothian", "/regional/S08000024");
  });

  it("regional health board -> regional default", async () => {
    await openRegionalPage();
    await selectRegionFromDropdown("Lothian", "/regional/S08000024");
    await selectRegionFromDropdown("Scotland", "/regional");
  });
});

describe("page linking navbar", () => {
  it("summary dashboard -> regional default", async () => {
    await dashboard.open();
    await expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    await elementClick(await dashboard.navbarLinkRegionalInsights);

    await expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");
    await expect(await browser.getUrl()).toBe(browser.config.baseUrl + "/regional");
  });

  it("regional default -> summary dashboard", async () => {
    await openRegionalPage();
    await expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");

    await elementClick(await dashboard.navbarLinkSummaryStatistics);

    await expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
    await expect(await browser.getUrl()).toBe(browser.config.baseUrl + "/");
  });

  it("regional default (click logo) -> summary dashboard", async () => {
    await openRegionalPage();
    await expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");

    await elementClick(await dashboard.navbarLinkLogo);

    await expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
    await expect(await browser.getUrl()).toBe(browser.config.baseUrl + "/");
  });
});

describe("page routing history following links", () => {
  it("history handling", async () => {
    // Create a history
    await dashboard.open();
    await elementClick(await dashboard.sitemapLinkAboutUs);
    await elementClick(await dashboard.sitemapLinkRegionalInsights);
    await elementClick(await regionalInsights.selectedRegionButton);
    await elementClick(await regionalInsights.regionDropdownMenuItem("Lothian"));
    await elementClick(await regionalInsights.selectedRegionButton);
    await elementClick(await regionalInsights.regionDropdownMenuItem("Glasgow City"));
    await elementClick(await dashboard.sitemapLinkSummaryStatistics);

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
    await elementClick(await dashboard.sitemapLinkAboutUs);

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

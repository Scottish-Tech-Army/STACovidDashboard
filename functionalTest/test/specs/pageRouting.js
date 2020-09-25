import dashboard from "../pageobjects/dashboardPage";
import regionalInsights from "../pageobjects/regionalPage";

const OVERVIEW_PAGE_TEXT =
  "We are currently in Phase 3 of the Scottish Government's COVID-19 Route Map.";
const ABOUTUS_PAGE_TEXT = "Meet the team";
const ACCESSIBILITY_PAGE_TEXT = "Conformance Statement";
const DATASOURCES_PAGE_TEXT = "Data sources and attributions";

describe("page routing", () => {
  it("summary dashboard", () => {
    browser.url("/index.html");
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

xdescribe("page linking sitemap", () => {
  it("summary dashboard -> about us", () => {
    browser.url("/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    $(".sitemap").$(".link=About Us").click();

    expect(dashboard.root).toHaveTextContaining(ABOUTUS_PAGE_TEXT);
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/about");
  });

  it("summary dashboard -> accessibility", () => {
    browser.url("/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    $(".sitemap").$(".link=Accessibility").click();

    expect(dashboard.root).toHaveTextContaining(ACCESSIBILITY_PAGE_TEXT);
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/accessibility");
  });

  it("summary dashboard -> data sources", () => {
    browser.url("/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    $(".sitemap").$(".link=Data Sources").click();

    expect(dashboard.root).toHaveTextContaining(DATASOURCES_PAGE_TEXT);
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/data");
  });

  it("summary dashboard -> regional default", () => {
    browser.url("/");
    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);

    $(".sitemap").$(".link=Regional Insights").click();

    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/regional");
  });

  it("regional default -> summary dashboard", () => {
    browser.url("/regional");
    expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");

    $(".sitemap").$(".link=Summary Dashboard").click();

    expect(dashboard.root).toHaveTextContaining(OVERVIEW_PAGE_TEXT);
    expect(browser.getUrl()).toBe(browser.config.baseUrl + "/");
  });
});

xdescribe("page linking region choice", () => {
  it("regional default -> regional council area", () => {
      browser.url("/regional");
      expect(regionalInsights.selectedRegionButton).toHaveText("Scotland");

      // TODO - Select Glasgow City
      //$(".sitemap").$(".link=Summary Dashboard").click();

      expect(regionalInsights.selectedRegionButton).toHaveText("Glasgow City");
      expect(browser.getUrl()).toBe(browser.config.baseUrl + "/regional/S12000049");
  });

  it("regional council area -> regional health board", () => {});

  it("regional health board -> regional default", () => {});
});

xdescribe("page linking navbar", () => {
  it("summary dashboard -> regional default", () => {});

  it("regional default -> summary dashboard", () => {});

  it("regional default (click logo) -> summary dashboard", () => {});
});

xdescribe("page routing history", () => {
  it("history handling", () => {
    browser.url("/");
    browser.url("/about");
    browser.url("/regional");
    browser.url("/regional/S08000024");
    browser.url("/regional/S12000049");
    browser.url("/");

    browser.clickBackButton();
    expect(browser.getUrl()).toBe("/regional/S12000049");

    browser.clickBackButton();
    expect(browser.getUrl()).toBe("/regional/S08000024");

    browser.clickBackButton();
    expect(browser.getUrl()).toBe("/regional");

    browser.clickForwardButton();
    expect(browser.getUrl()).toBe("/regional/S08000024");

    browser.clickForwardButton();
    expect(browser.getUrl()).toBe("/regional/S12000049");

    browser.clickForwardButton();
    expect(browser.getUrl()).toBe("/");
  });

  it("no more forward", () => {
    browser.url("/");
    browser.url("/about");

    browser.clickBackButton();
    expect(browser.getUrl()).toBe("/");

    browser.clickForwardButton();
    expect(browser.getUrl()).toBe("/about");
    expect(browser.getForwardButton()).toBeDisabled();

    browser.clickForwardButton();
    expect(browser.getUrl()).toBe("/about");
  });

  it("no more back", () => {
    browser.url("/");
    browser.url("/about");

    browser.clickBackButton();
    expect(browser.getUrl()).toBe("/");
    expect(browser.getBackButton()).toBeDisabled();

    browser.clickBackButton();
    expect(browser.getUrl()).toBe("/");
  });
});

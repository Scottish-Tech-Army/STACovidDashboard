import dashboard from "../pageobjects/dashboardPage";

describe("page routing", () => {
  it("summary dashboard", () => {
    dashboard.open();
    const page = browser.url("/");
    // console.log($('[class="current-phase col-12"] '));
    expect(dashboard.currentPhase).toHaveTextContaining(
      // expect(() => {
      //   return $('[class="current-phase col-12"] ');
      // }).toHaveTextContaining(
      "We are currently in Phase 3 of the Scottish Government's COVID-19 Route Map."
    );
  });

  it("about us page", () => {
    const page = browser.url("/about");

    expect($("h1")).toHaveTextContaining("About Us");
    // expect(browser).toHaveTextContaining("Meet the team");
  });

  it("accessibility page", () => {
    const page = browser.url("/accessibility");

    expect($("h1")).toHaveTextContaining("Conformance Statement");
  });

  it("regional insights default", () => {
    const page = browser.url("/regional");
    expect($("button.selected-region")).toHaveTextContaining("Scotland");
  });

  it("regional insights health board", () => {
    const page = browser.url("/regional/S08000024");
    expect($("button.selected-region")).toHaveTextContaining("Lothian");
  });

  it("regional insights council area", () => {
    const page = browser.url("/regional/S12000049");
    expect($("button.selected-region")).toHaveTextContaining("Glasgow City");
  });

  it("unknown url -> summary dashboard", () => {
    const page = browser.url("/unknown");
    expect(browser.getUrl()).toBe("/");
    expect(dashboard.currentPhase).toHaveTextContaining(
      // expect(() => {
      //   return $('[class="current-phase col-12"] ');
      // }).toHaveTextContaining(
      "We are currently in Phase 3 of the Scottish Government's COVID-19 Route Map."
    );
  });
});

describe("page linking sitemap", () => {
  it("summary dashboard -> about us", () => {
    dashboard.open();
    const page = browser.url("/");

    const link = $('div.sitemap div."entry link" text:"About Us"');
    click(link);

    expect($("h1")).toHaveTextContaining("About Us");
    expect(browser.getUrl()).toBe("/about");
  });

  it("summary dashboard -> accessibility", () => {});

  it("summary dashboard -> data sources", () => {});

  it("summary dashboard -> regional default", () => {});

  it("regional default -> summary dashboard", () => {});
});

describe("page linking region choice", () => {
  it("regional default -> regional council area", () => {});

  it("regional council area -> regional health board", () => {});

  it("regional health board -> regional default", () => {});
});

describe("page linking navbar", () => {
  it("summary dashboard -> regional default", () => {});

  it("regional default -> summary dashboard", () => {});

  it("regional default (click logo) -> summary dashboard", () => {});
});

describe("page routing history", () => {
  it("history handling", () => {
    const page = browser.url("/");
    const page = browser.url("/about");
    const page = browser.url("/regional");
    const page = browser.url("/regional/S08000024");
    const page = browser.url("/regional/S12000049");
    const page = browser.url("/");

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
    const page = browser.url("/");
    const page = browser.url("/about");

    browser.clickBackButton();
    expect(browser.getUrl()).toBe("/");

    browser.clickForwardButton();
    expect(browser.getUrl()).toBe("/about");
    expect(browser.getForwardButton()).toBeDisabled();

    browser.clickForwardButton();
    expect(browser.getUrl()).toBe("/about");
  });

  it("no more back", () => {
    const page = browser.url("/");
    const page = browser.url("/about");

    browser.clickBackButton();
    expect(browser.getUrl()).toBe("/");
    expect(browser.getBackButton()).toBeDisabled();

    browser.clickBackButton();
    expect(browser.getUrl()).toBe("/");
  });
});

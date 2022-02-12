import dashboard from "../pageobjects/dashboardPage";
import { elementClick } from "../utilities/utils";

describe("Regional Insights", () => {
  it("should have correct title", async () => {
    await dashboard.open();
    await elementClick(await dashboard.navbarLinkRegionalInsights);
    let title = "Scottish COVID-19 Statistics";
    await expect(browser).toHaveTitle(title);
    await expect(dashboard.imgLogo).toBeDisplayed();
    await expect(dashboard.headingTitle).toHaveText("Scottish COVID-19 Statistics");
    await expect(dashboard.headlineBanner).toHaveTextContaining(
      "Regional Restrictions to help fight the pandemic"
    );
  });
});

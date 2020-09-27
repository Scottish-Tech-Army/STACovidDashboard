/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
export default class Page {
  get root() {
    return $(".App");
  }

  get sitemapLinkAboutUs() {
    return $(".sitemap-container").$("a.link=About Us");
  }

  get sitemapLinkAccessibility() {
    return $(".sitemap-container").$("a.link=Accessibility");
  }

  get sitemapLinkDataSources() {
    return $(".sitemap-container").$("a.link=Data Sources");
  }

  get sitemapLinkRegionalInsights() {
    return $(".sitemap-container").$("a.link=Regional Insights");
  }

  get sitemapLinkSummaryDashboard() {
    return $(".sitemap-container").$("a.link=Summary Dashboard");
  }

  get navbarLinkRegionalInsights() {
    return $(".dashboard-navbar").$(".nav-link=Regional Insights");
  }

  get navbarLinkSummaryDashboard() {
    return $(".dashboard-navbar").$(".nav-link=Summary Dashboard");
  }

  get navbarLinkLogo() {
    return $(".dashboard-navbar").$("#logo");
  }

  open(path = "/index.html") {
    return browser.url(path);
  }
}

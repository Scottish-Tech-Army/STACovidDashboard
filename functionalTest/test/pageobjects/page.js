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

  get sitemapLinkSummaryStatistics() {
    return $(".sitemap-container").$("a.link=Summary Statistics");
  }

  get navbarLinkRegionalInsights() {
    return $(".dashboard-navbar").$(".nav-link=Regional Insights");
  }

  get navbarLinkSummaryStatistics() {
    return $(".dashboard-navbar").$(".nav-link=Summary Statistics");
  }

  get navbarLinkLogo() {
    return $(".dashboard-navbar").$("#logo");
  }

  open(path = browser.options.baseUrl) {
    return browser.url(path);
  }
}

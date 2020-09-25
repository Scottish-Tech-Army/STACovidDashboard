/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
export default class Page {
  get root() {
    return $(".App");
  }
  /**
   * Opens base URL using ('/')
   */
  open(path = "/index.html") {
    return browser.url(path);
  }
}

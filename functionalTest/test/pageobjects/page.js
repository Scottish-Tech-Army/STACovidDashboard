/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
export default class Page {
  /**
   * Opens base URL using ('/')
   */
  open() {
    return browser.url("/");
  }
}

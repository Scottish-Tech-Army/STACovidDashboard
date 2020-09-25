import Page from "./page";

/**
 * dashboard page containing specific selectors and methods for a page
 */
class DashboardPage extends Page {
  get imgLogo() {
    return $('img[id="logo"]');
  }
  get headingTitle() {
    return $('[class="heading heading-title"] ');
  }
  get currentPhase() {
    return $(".current-phase");
  }
  get healthBoard() {
    return $("#healthBoards");
  }
  get councilAreas() {
    return $("#councilAreas");
  }
  get cases() {
    return $("#cases");
  }
  get deaths() {
    return $("#deaths");
  }
  get dailyCases() {
    return $("#dailyCases");
  }
  get totalCases() {
    return $("#totalCases");
  }
  get dailyDeaths() {
    return $("#dailyDeaths");
  }
  get totalDeaths() {
    return $("#totalDeaths");
  }
  get percentageCases() {
    return $("#percentageCases");
  }
  /**
   * open base URL
   */
  open() {
    return super.open();
  }
}

export default new DashboardPage();

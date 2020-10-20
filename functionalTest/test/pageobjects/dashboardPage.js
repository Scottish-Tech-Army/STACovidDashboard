import Page from "./page";

/**
 * dashboard page containing specific selectors and methods for a page
 */
class DashboardPage extends Page {
  get imgLogo() {
    return $('img[id="logo"]');
  }
  get headingTitle() {
    return $(".navbar").$(".heading");
  }
  get currentPhase() {
    return $('[class="current-phase col-12"] ');
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
  get heatmapHeaderRow() {
    return $(".heatmap thead tr");
  }
  get heatmapBoundariesTitle() {
    return this.heatmapHeaderRow.$("th:nth-child(1) div:nth-child(1)");
  }
  get heatmapBoundariesCount() {
    return this.heatmapHeaderRow.$("th:nth-child(1) div.subheading");
  }
  get selectHealthBoardsButton() {
    return $(".heatmap-selector #healthBoards");
  }
  get selectCouncilAreasButton() {
    return $(".heatmap-selector #councilAreas");
  }
  get heatmapValueTypeTitle() {
    return this.heatmapHeaderRow.$("th:nth-child(2) div:nth-child(1)");
  }
  get heatmapValueTypeCount() {
    return this.heatmapHeaderRow.$("th:nth-child(2) div.subheading");
  }
  get selectCasesButton() {
    return $(".heatmap-selector #cases");
  }
  get selectDeathsButton() {
    return $(".heatmap-selector #deaths");
  }
  get heatmapBoundariesValues() {
    return $$(".heatmap tbody tr.area td:nth-child(1)");
  }
  get heatmapValueTypeValues() {
    return $$(".heatmap tbody tr.area td:nth-child(2)");
  }

  /**
   * open base URL
   */
  open() {
    return super.open();
  }
}

export default new DashboardPage();

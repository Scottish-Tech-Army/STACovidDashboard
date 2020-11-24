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
  get headlineBanner() {
    return $(".headline-banner");
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
    return this.heatmapHeaderRow.$("th:nth-child(1)");
  }
  get selectHealthBoardsButton() {
    return $(".heatmap-selector #healthBoards");
  }
  get selectCouncilAreasButton() {
    return $(".heatmap-selector #councilAreas");
  }
  get heatmapValueTypeTitle() {
    return this.heatmapHeaderRow.$("th:nth-child(2)");
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
  get heatmapHeatbarValues() {
    return $$(".heatmap tbody tr.area td:nth-child(3)");
  }
  heatbarLines(rowIndex) {
    return this.heatmapHeatbarValues[rowIndex].$(".heatbar").$$("line");
  }

  get geoMapArea() {
    return $$(" div.leaflet-pane > svg > g > path");
  }
  get singleValueBar() {
    return $(".overview-single-value-bar");
  }
  get dailyCases() {
    return this.singleValueBar.$("#dailyCases");
  }
  get totalCases() {
    return this.singleValueBar.$("#totalCases");
  }
  get dailyDeaths() {
    return this.singleValueBar.$("#dailyDeaths");
  }
  get totalDeaths() {
    return this.singleValueBar.$("#totalDeaths");
  }
  get fatalityCaseRatio() {
    return this.singleValueBar.$("#fatalityCaseRatio");
  }
  get chartDropdown() {
    return $("button.selected-chart");
  }
  selectChartDropdownOption(option) {
    return $(".chart-menu").$(".dropdown-item=" + option);
  }
  selectTimeSpan(time) {
    return $(".quick-select-dates button#" + time);
  }
  get sliderTrack() {
    return $("span.MuiSlider-track");
  }
  get fromDate() {
    return $$("span.MuiSlider-markLabel")[0];
  }
  get toDate() {
    return $$("span.MuiSlider-markLabel")[1];
  }
  get factsContainer() {
    return $(".facts-container");
  }
  get newsContainer() {
    return $("div.info-bar");
  }
  get newsContainerGovLink() {
    return $(".info-bar a.scot-gov-link");
  }
  /**
   * open base URL
   */
  open() {
    return super.open();
  }
}

export default new DashboardPage();

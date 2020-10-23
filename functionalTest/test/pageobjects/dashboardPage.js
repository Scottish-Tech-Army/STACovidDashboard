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
  get geoMapArea() {
    return $$(" div.leaflet-pane > svg > g > path");
  }
  get singleValueBar() {
    return $(".single-value-bar");
  }
  get dailyCases() {
    return $(".single-value-bar #dailyCases");
  }
  get totalCases() {
    return $(".single-value-bar #totalCases");
  }
  get dailyFatalities() {
    return $(".single-value-bar #dailyFatalities");
  }
  get totalFatalities() {
    return $(".single-value-bar #totalFatalities");
  }
  get fatalityCaseRatio() {
    return $(".single-value-bar #fatalityCaseRatio");
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
    return $('//*[@id="date-range-slider-position"]/span[7]');
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

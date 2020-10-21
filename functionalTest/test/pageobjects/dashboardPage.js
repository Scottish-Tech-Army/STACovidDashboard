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
    return $('[class="headline-banner col-12"] ');
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
  get geoMapHealthBoardArea() {
    return $$(
      "#map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-overlay-pane > svg > g > path"
    );
  }
  get geoMapCouncilArea() {
    return $$(
      "#map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-overlay-pane > svg > g > path"
    );
  }
  get singleValueBar() {
    return $(".single-value-bar");
  }
  get dailyCases() {
    return $("#dailyCases");
  }
  get totalCases() {
    return $("#totalCases");
  }
  get dailyFatalities() {
    return $("#dailyFatalities");
  }
  get totalFatalities() {
    return $("#totalFatalities");
  }
  get fatalityCaseRatio() {
    return $("#fatalityCaseRatio");
  }
  get chartDropdown() {
    return $("//div[@class='dropdown']/button");
  }
  selectDropdownOpt(option) {
    return $("//*/div/a[contains(text(),'" + option + "')]");
  }
  selectTimeSpan(time) {
    return $("//*[contains(text(),'" + time + "')]/ancestor::button");
  }
  get sliderTrack() {
    return $('//*[@id="date-range-slider-position"]/span[7]');
  }
  get factsContainer() {
    return $(".facts-container");
  }
  get newsContainer() {
    return $("div.d-flex.flex-row");
  }
  get newsContainerGovLink() {
    return $("div.message-container.d-flex.justify-content-end > span > a");
  }
  /**
   * open base URL
   */
  open() {
    return super.open();
  }
}

export default new DashboardPage();

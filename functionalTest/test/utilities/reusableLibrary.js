import dashboard from "../pageobjects/dashboardPage";

class reusableLibrary {
  sliderTrackResult() {
    dashboard.selectTimeSpan("ALL").click();
    expect(dashboard.sliderTrack).toHaveAttr("style", "left: 0%;");

    dashboard.selectTimeSpan("Last 3M").click();
    expect(dashboard.sliderTrack).toHaveAttr("style", "left: 60.6838%;");

    dashboard.selectTimeSpan("Last 1M").click();
    expect(dashboard.sliderTrack).toHaveAttr("style", "left: 87.1795%;");

    dashboard.selectTimeSpan("Last 2W").click();
    expect(dashboard.sliderTrack).toHaveAttr("style", "left: 94.0171%;");

    dashboard.selectTimeSpan("Last 1W").click();
    expect(dashboard.sliderTrack).toHaveAttr("style", "left: 97.0085%;");
  }
}
export default new reusableLibrary();

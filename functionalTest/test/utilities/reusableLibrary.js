import dashboard from "../pageobjects/dashboardPage";

class reusableLibrary {
  sliderTrackResult() {
    dashboard.selectTimeSpan("select-all").click();
    expect(dashboard.sliderTrack).toBeDisplayed();

    dashboard.selectTimeSpan("select-last-three-months").click();
    expect(dashboard.sliderTrack).toBeDisplayed();

    dashboard.selectTimeSpan("select-last-month").click();
    expect(dashboard.sliderTrack).toBeDisplayed();

    dashboard.selectTimeSpan("select-last-two-weeks").click();
    expect(dashboard.sliderTrack).toBeDisplayed();

    dashboard.selectTimeSpan("select-last-week").click();
    expect(dashboard.sliderTrack).toBeDisplayed();
  }
}
export default new reusableLibrary();

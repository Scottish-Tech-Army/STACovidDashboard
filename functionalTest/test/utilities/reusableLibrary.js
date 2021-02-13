import dashboard from "../pageobjects/dashboardPage";
import moment from "moment";

class reusableLibrary {
  sliderTrackResult() {
    var fromDate = dashboard.fromDate.getText();
    var toDate = dashboard.toDate.getText();

    const TIMESPAN_ALL = "select-all";
    const TIMESPAN_THREE_MONTHS = "select-last-three-months";
    const TIMESPAN_ONE_MONTH = "select-last-month";
    const TIMESPAN_TWO_WEEKS = "select-last-two-weeks";
    const TIMESPAN_ONE_WEEK = "select-last-week";

    const DATE_FORMAT = "DD MMM, YYYY";

    function calculateLeftButtonPercentage(fromDate, toDate, timespan) {
      let totalDays =
        moment(toDate, DATE_FORMAT).diff(
          moment(fromDate, DATE_FORMAT),
          "days"
        ) + 1;
      let expectedDays;
      switch (timespan) {
        case TIMESPAN_ALL:
          expectedDays = totalDays;
          break;
        case TIMESPAN_THREE_MONTHS:
          expectedDays = 365 / 4;
          break;
        case TIMESPAN_ONE_MONTH:
          expectedDays = 365 / 12;
          break;
        case TIMESPAN_TWO_WEEKS:
          expectedDays = 14;
          break;
        case TIMESPAN_ONE_WEEK:
          expectedDays = 7;
          break;
        default:
          throw new Error("timespan invalid: " + timespan);
      }
      const timePeriodPercentage = (100 * expectedDays) / totalDays;
      let leftPercent = 100 - timePeriodPercentage;
      return leftPercent;
    }

    function valueCheck(expectedValue) {
      var Style = dashboard.sliderTrack.getAttribute("style");
      var actualValue = retrieveLeftWidth(Style);
      let diff = Math.abs(expectedValue - actualValue);
      expect(diff).toBeLessThan(1);
    }

    function retrieveLeftWidth(inputStr) {
      let start = inputStr.indexOf("left:") + 5;
      let end = inputStr.indexOf("%", start);
      let returnValue = inputStr.substring(start, end).trim();
      return returnValue;
    }
    function checkSliderValue(timeSpan) {
      dashboard.selectTimeSpan(timeSpan).click();
      var expectedValue = calculateLeftButtonPercentage(
        fromDate,
        toDate,
        timeSpan
      );
      valueCheck(expectedValue);
    }

    checkSliderValue(TIMESPAN_ALL);
    checkSliderValue(TIMESPAN_THREE_MONTHS);
    checkSliderValue(TIMESPAN_ONE_MONTH);
    checkSliderValue(TIMESPAN_TWO_WEEKS);
    checkSliderValue(TIMESPAN_ONE_WEEK);
  }
}
export default new reusableLibrary();

import dashboard from "../pageobjects/dashboardPage";
import moment from "moment";

export function checkChartTimespanSelection() {
  const DATE_FORMAT = "DD MMM, YYYY";

  const fromDate = moment(dashboard.fromDate.getText(), DATE_FORMAT);
  const toDate = moment(dashboard.toDate.getText(), DATE_FORMAT);
  const totalDays = toDate.diff(fromDate, "days") + 1;

  const TIMESPAN_ALL = "select-all";
  const TIMESPAN_THREE_MONTHS = "select-last-three-months";
  const TIMESPAN_ONE_MONTH = "select-last-month";
  const TIMESPAN_TWO_WEEKS = "select-last-two-weeks";
  const TIMESPAN_ONE_WEEK = "select-last-week";

  const TIMESPAN_DAYS = {};
  TIMESPAN_DAYS[TIMESPAN_ALL] = totalDays;
  TIMESPAN_DAYS[TIMESPAN_THREE_MONTHS] = 365 / 4;
  TIMESPAN_DAYS[TIMESPAN_ONE_MONTH] = 365 / 12;
  TIMESPAN_DAYS[TIMESPAN_TWO_WEEKS] = 14;
  TIMESPAN_DAYS[TIMESPAN_ONE_WEEK] = 7;

  function calculateLeftButtonPercentage(timespan) {
    const timePeriodPercentage = (100 * TIMESPAN_DAYS[timespan]) / totalDays;
    return 100 - timePeriodPercentage;
  }

  function retrieveLeftWidth(inputStr) {
    const start = inputStr.indexOf("left:") + 5;
    const end = inputStr.indexOf("%", start);
    return inputStr.substring(start, end).trim();
  }

  function checkSliderValue(timeSpan) {
    dashboard.selectTimeSpan(timeSpan).click();

    const style = dashboard.sliderTrack.getAttribute("style");
    const actualLeftButtonPercentage = retrieveLeftWidth(style);
    const expectedLeftButtonPercentage = calculateLeftButtonPercentage(
      timeSpan
    );
    expect(
      Math.abs(expectedLeftButtonPercentage - actualLeftButtonPercentage)
    ).toBeLessThan(1);
  }

  checkSliderValue(TIMESPAN_ALL);
  checkSliderValue(TIMESPAN_THREE_MONTHS);
  checkSliderValue(TIMESPAN_ONE_MONTH);
  checkSliderValue(TIMESPAN_TWO_WEEKS);
  checkSliderValue(TIMESPAN_ONE_WEEK);
}

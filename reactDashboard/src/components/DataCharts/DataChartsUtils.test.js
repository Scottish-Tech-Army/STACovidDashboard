import {
  commonChartConfiguration,
  calculateDateRange,
} from "./DataChartsUtils";
import {
  ALL_DATES,
  LAST_WEEK,
  LAST_TWO_WEEKS,
  LAST_MONTH,
  LAST_THREE_MONTHS,
} from "../DataCharts/DataChartsConsts";

describe("commonChartConfiguration", () => {
  it("with date range", () => {
    const result = commonChartConfiguration("mockData", {
      startDate: 0,
      endDate: 1,
    });
    const expectedResult = { max: 1, min: 0 };
    expect(result.options.scales.xAxes[0].ticks).toStrictEqual(expectedResult);
  });
  it("without date range", () => {
    const result = commonChartConfiguration("mockData");
    expect(result.options.scales.xAxes[0].ticks).toBeUndefined();
  });
});

describe("calculateDateRange", () => {
  const TEST_DATE_RANGE = {
    startDate: Date.parse("2020-02-28"),
    endDate: Date.parse("2020-09-30"),
  };

  it("all dates", () => {
    const result = calculateDateRange(TEST_DATE_RANGE, ALL_DATES);
    expect(result).toStrictEqual(TEST_DATE_RANGE);
  });
  it("last week", () => {
    const result = calculateDateRange(TEST_DATE_RANGE, LAST_WEEK);
    const expectedResult = { startDate: Date.parse("2020-09-23"),
      endDate: Date.parse("2020-09-30"), };
    expect(result).toStrictEqual(expectedResult);
  });
  it("time period is null", () => {
    expect(() => calculateDateRange(TEST_DATE_RANGE, null)).toThrow(
      "timePeriod invalid: null"
    );
  });
  it("time period is unknown", () => {
    expect(() => calculateDateRange(TEST_DATE_RANGE, "unknown")).toThrow(
      "timePeriod invalid: unknown"
    );
  });
});

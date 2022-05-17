import {
  commonChartConfiguration,
  calculateDateRange,
  datasetConfiguration,
  getChartYMax,
  getMaxTicks,
} from "./DataChartsModel";
import {
  ALL_DATES,
  LAST_WEEK,
  LAST_TWO_WEEKS,
  LAST_MONTH,
  LAST_THREE_MONTHS,
} from "../DataCharts/DataChartsConsts";

const TEST_MAX_DATA_1 = [363, 101, 257, 771, 799, 297, 118];
const TEST_MAX_DATA_2 = [4056, 256, 235, 367, 2478, 163, 842];

const END_DATE = Date.parse("2020-01-07");

describe("commonChartConfiguration", () => {
  const mockData = [
    datasetConfiguration("testLabel", TEST_MAX_DATA_1, "#767676"),
  ];

  const testDates = [
    Date.parse("2020-01-01"),
    Date.parse("2020-01-02"),
    Date.parse("2020-01-03"),
    Date.parse("2020-01-04"),
  ];
  const smallMockData = [
    datasetConfiguration("testLabel", [1, 0, 0, 1], "#767676"),
  ];

  it("with date range", () => {
    const result = commonChartConfiguration(
      testDates,
      END_DATE,
      mockData,
      false,
      { startDate: 0, endDate: 1 }
    );
    expect(result.options.scales.x.min).toBe(0);
    expect(result.options.scales.x.max).toBe(1);
  });

  it("without date range", () => {
    const result = commonChartConfiguration(
      testDates,
      END_DATE,
      mockData,
      false
    );
    expect(result.options.scales.x.min).toBeUndefined();
    expect(result.options.scales.x.max).toBeUndefined();
  });

  it("annotations with dataset", () => {
    const result = commonChartConfiguration(
      testDates,
      END_DATE,
      mockData,
      false
    );
    expect(result.options.plugins.annotation).toBeDefined();
  });

  it("annotations without dataset", () => {
    const result = commonChartConfiguration(testDates, END_DATE, [], false);
    expect(result.options.plugins.annotation).toBeUndefined();
  });

  it("key date annotations", () => {
    const result = commonChartConfiguration(
      mockData,
      END_DATE,
      mockData,
      false
    );
    const annotations = result.options.plugins.annotation.annotations;
    expect(annotations.line0.value).toStrictEqual(Date.parse("2020-03-24"));
    expect(annotations.line0.label.yAdjust).toBe(0);
    expect(annotations.line0.label.content).toBe("LOCKDOWN");

    expect(annotations.line1.value).toStrictEqual(Date.parse("2020-05-29"));
    expect(annotations.line1.label.yAdjust).toBe(20);
    expect(annotations.line1.label.content).toBe("PHASE 1");
  });

  it("uncertain date annotations", () => {
    const result = commonChartConfiguration(
      mockData,
      END_DATE,
      mockData,
      false,
      {
        startDate: Date.parse("2020-01-01"),
        endDate: Date.parse("2020-01-07"),
      }
    );
    const annotations = result.options.plugins.annotation.annotations;
    expect(annotations.endBox3.xMin).toStrictEqual(Date.parse("2020-01-04"));
    expect(annotations.endBox3.xMax).toStrictEqual(Date.parse("2020-01-07"));
  });

  it("darkmode true", () => {
    const result = commonChartConfiguration(
      testDates,
      END_DATE,
      mockData,
      true
    );
    expect(result.options.scales.y.grid.color).toBe("#121212");
    expect(result.options.scales.x.ticks.color).toBe("#f2f2f2");
    expect(result.options.scales.y.ticks.color).toBe("#f2f2f2");
    expect(result.options.plugins.legend.labels.color).toBe("#f2f2f2");
    expect(
      result.options.plugins.annotation.annotations.line1.borderColor
    ).toBe("#f2f2f2");
    expect(
      result.options.plugins.annotation.annotations.line1.label.backgroundColor
    ).toBe("#c1def1");
  });
  it("darkmode false", () => {
    const result = commonChartConfiguration(
      testDates,
      END_DATE,
      mockData,
      false
    );
    expect(result.options.scales.y.grid.color).toBe("#cccccc");
    expect(result.options.scales.x.ticks.color).toBe("#767676");
    expect(result.options.scales.y.ticks.color).toBe("#767676");
    expect(result.options.plugins.legend.labels.color).toBe("#767676");
    expect(
      result.options.plugins.annotation.annotations.line1.borderColor
    ).toBe("rgba(0,0,0,0.25)");
    expect(
      result.options.plugins.annotation.annotations.line1.label.backgroundColor
    ).toBe("#007EB9");
  });

  it("receive maxTicks less than 20", () => {
    const result = commonChartConfiguration(
      testDates,
      Date.parse("2020-01-04"),
      smallMockData
    );
    expect(result.options.scales.y.ticks.maxTicksLimit).toBe(2);
  });

  it("receive maxTicks more than 20", () => {
    const result = commonChartConfiguration(testDates, END_DATE, mockData);
    expect(result.options.scales.y.ticks.maxTicksLimit).toBe(20);
  });
});

describe("calculateDateRange", () => {
  const TEST_DATE_RANGE = {
    startDate: Date.parse("2020-02-28"),
    endDate: Date.parse("2020-09-30"),
  };
  const EMPTY_DATE_RANGE = {
    startDate: 0,
    endDate: 1,
  };

  it("all dates", () => {
    const result = calculateDateRange(TEST_DATE_RANGE, ALL_DATES);
    expect(result).toStrictEqual(TEST_DATE_RANGE);
  });

  it("last week", () => {
    const result = calculateDateRange(TEST_DATE_RANGE, LAST_WEEK);
    const expectedResult = {
      startDate: Date.parse("2020-09-23"),
      endDate: Date.parse("2020-09-30"),
    };
    expect(result).toStrictEqual(expectedResult);
  });

  it("last two weeks", () => {
    const result = calculateDateRange(TEST_DATE_RANGE, LAST_TWO_WEEKS);
    const expectedResult = {
      startDate: Date.parse("2020-09-16"),
      endDate: Date.parse("2020-09-30"),
    };
    expect(result).toStrictEqual(expectedResult);
  });

  it("last month", () => {
    const result = calculateDateRange(TEST_DATE_RANGE, LAST_MONTH);
    const expectedResult = {
      startDate: Date.parse("2020-08-30"),
      endDate: Date.parse("2020-09-30"),
    };
    expect(result).toStrictEqual(expectedResult);
  });

  it("last three months", () => {
    const result = calculateDateRange(TEST_DATE_RANGE, LAST_THREE_MONTHS);
    const expectedResult = {
      startDate: Date.parse("2020-06-30"),
      endDate: Date.parse("2020-09-30"),
    };
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

  it("last week with short date range", () => {
    const result = calculateDateRange(EMPTY_DATE_RANGE, LAST_WEEK);
    expect(result).toStrictEqual(EMPTY_DATE_RANGE);
  });
});

describe("getChartYMax", () => {
  const TEST_EMPTY_DATASET = [{ data: [] }];
  const TEST_SINGLE_DATASET = [{ data: TEST_MAX_DATA_1 }];
  const TEST_DOUBLE_DATASET = [
    { data: TEST_MAX_DATA_1 },
    { data: TEST_MAX_DATA_2 },
  ];

  it("datasets empty", () => {
    expect(getChartYMax([])).toBe(0);
  });

  it("datasets null", () => {
    expect(getChartYMax(null)).toBe(0);
  });

  it("datasets undefined", () => {
    expect(getChartYMax(undefined)).toBe(0);
  });

  it("normal datasets", () => {
    expect(getChartYMax(TEST_SINGLE_DATASET)).toBe(799);
    expect(getChartYMax(TEST_DOUBLE_DATASET)).toBe(4056);
  });

  it("dataset without data points", () => {
    expect(getChartYMax(TEST_EMPTY_DATASET)).toBe(0);
  });
});

describe("getMaxTicks", () => {
  it("return expected results", () => {
    expect(getMaxTicks(null)).toBe(1);
    expect(getMaxTicks()).toBe(1);
    expect(getMaxTicks(0)).toBe(1);
    expect(getMaxTicks(1)).toBe(2);
    expect(getMaxTicks(5)).toBe(6);
    expect(getMaxTicks(20)).toBe(20);
    expect(getMaxTicks(1000000)).toBe(20);
  });
});

import { commonChartConfiguration, calculateDateRange } from "./DataChartsUtils";

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

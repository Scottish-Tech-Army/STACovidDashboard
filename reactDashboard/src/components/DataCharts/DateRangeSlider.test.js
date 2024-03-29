import React from "react";
import DateRangeSlider, { getMarks } from "./DateRangeSlider";
import { render } from "@testing-library/react";

const maxDateRange = {
  startDate: Date.parse("2020-02-28"),
  endDate: Date.parse("2020-03-09"),
};
const dateRange = {
  startDate: Date.parse("2020-03-06"),
  endDate: Date.parse("2020-03-06"),
};

describe("getMarks", () => {
  it("normalRange", () => {
    const expectedResult = [
      {
        value: Date.parse("2020-02-28"),
        label: "28 Feb, 2020",
      },
      {
        value: Date.parse("2020-04-02"),
        label: "02 Apr, 2020",
      },
    ];
    expect(
      getMarks({
        startDate: Date.parse("2020-02-28"),
        endDate: Date.parse("2020-04-02"),
      })
    ).toStrictEqual(expectedResult);
  });

  it("firstOfMonth", () => {
    const expectedResult = [
      {
        value: Date.parse("2020-02-01"),
        label: "01 Feb, 2020",
      },
      {
        value: Date.parse("2020-06-01"),
        label: "01 Jun, 2020",
      },
    ];
    expect(
      getMarks({
        startDate: Date.parse("2020-02-01"),
        endDate: Date.parse("2020-06-01"),
      })
    ).toStrictEqual(expectedResult);
  });

  it("defaultValues", () => {
    const expectedResult = [];
    expect(
      getMarks({
        startDate: 0,
        endDate: 0,
      })
    ).toStrictEqual(expectedResult);
  });

  describe("check maximum date ranges", () => {
    const minimumDateValue = () =>
      document
        .querySelector(".MuiSlider-root .MuiSlider-thumb")
        .getAttribute("aria-valuemin");

    const maximumDateValue = () =>
      document
        .querySelector(".MuiSlider-root .MuiSlider-thumb")
        .getAttribute("aria-valuemax");

    it("check values", async () => {
      render(
        <DateRangeSlider maxDateRange={maxDateRange} dateRange={dateRange} />
      );

      expect(minimumDateValue()).toStrictEqual(
        String(Date.parse("2020-02-28"))
      );
      expect(maximumDateValue()).toStrictEqual(
        String(Date.parse("2020-03-09"))
      );
    });
  });
});

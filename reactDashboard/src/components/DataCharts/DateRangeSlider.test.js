import React from "react";
import { act } from "react-dom/test-utils";
import DateRangeSlider, { getMarks } from "./DateRangeSlider";
import { createRoot } from "react-dom/client";

var container = null;
var root = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  fetch.resetMocks();
});

afterEach(() => {
  // cleanup on exiting
  root.unmount(container);
  container.remove();
  container = null;
});

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
      container
        .querySelector(".MuiSlider-root .MuiSlider-thumb")
        .getAttribute("aria-valuemin");

    const maximumDateValue = () =>
      container
        .querySelector(".MuiSlider-root .MuiSlider-thumb")
        .getAttribute("aria-valuemax");

    it("check values", async () => {
      await act(async () => {
        root.render(
          <DateRangeSlider maxDateRange={maxDateRange} dateRange={dateRange} />
        );
      });
      expect(minimumDateValue()).toStrictEqual(
        String(Date.parse("2020-02-28"))
      );
      expect(maximumDateValue()).toStrictEqual(
        String(Date.parse("2020-03-09"))
      );
    });
  });
});

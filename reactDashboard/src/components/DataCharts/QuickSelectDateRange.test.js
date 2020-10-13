/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkStoredValue"] }] */

import React from "react";
import QuickSelectDateRange from "./QuickSelectDateRange";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { ALL_DATES } from "./DataChartsConsts";

var storedDateRange = ALL_DATES;
const setDateRange = (value) => (storedDateRange = value);

var container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

function click(button) {
  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

function checkStoredValue(expectedDateRange) {
  expect(storedDateRange).toStrictEqual(expectedDateRange);
}

const allDatesButton = () => container.querySelector("#select-all");
const lastThreeMonthsButton = () =>
  container.querySelector("#select-last-three-months");
const lastMonthButton = () => container.querySelector("#select-last-month");
const lastTwoWeeksButton = () =>
  container.querySelector("#select-last-two-weeks");
const lastWeekButton = () => container.querySelector("#select-last-week");

describe("selectDateRange", () => {
  const TEST_DATE_RANGE = {
    startDate: Date.parse("2020-02-28"),
    endDate: Date.parse("2020-09-30"),
  };

  const EMPTY_DATE_RANGE = {
    startDate: 0,
    endDate: 1,
  };

  it("happy path dates", () => {
    act(() => {
      render(
        <QuickSelectDateRange
          setDateRange={setDateRange}
          maxDateRange={TEST_DATE_RANGE}
        />,
        container
      );
    });

    click(allDatesButton());
    checkStoredValue(TEST_DATE_RANGE);

    click(lastThreeMonthsButton());
    checkStoredValue({
      startDate: Date.parse("2020-06-30"),
      endDate: Date.parse("2020-09-30"),
    });

    click(lastMonthButton());
    checkStoredValue({
      startDate: Date.parse("2020-08-30"),
      endDate: Date.parse("2020-09-30"),
    });

    click(lastTwoWeeksButton());
    checkStoredValue({
      startDate: Date.parse("2020-09-16"),
      endDate: Date.parse("2020-09-30"),
    });

    click(lastWeekButton());
    checkStoredValue({
      startDate: Date.parse("2020-09-23"),
      endDate: Date.parse("2020-09-30"),
    });
  });

  it("preloaded dates", () => {
    act(() => {
      render(
        <QuickSelectDateRange
          setDateRange={setDateRange}
          maxDateRange={EMPTY_DATE_RANGE}
        />,
        container
      );
    });

    click(allDatesButton());
    checkStoredValue(EMPTY_DATE_RANGE);

    click(lastWeekButton());
    checkStoredValue(EMPTY_DATE_RANGE);
  });

  it("missing dates", () => {
    global.suppressConsoleErrorLogs();
    expect(() => {
      render(
        <QuickSelectDateRange
          setDateRange={setDateRange}
        />,
        container
      );
    }).toThrow("missing maxDateRange");
  });

});

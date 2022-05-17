/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkStoredValue"] }] */

import React from "react";
import QuickSelectDateRange from "./QuickSelectDateRange";
import { renderWithUser } from "../../ReactTestUtils";
import { render } from "@testing-library/react";

const setDateRange = jest.fn();

const allDatesButton = () => document.querySelector("#select-all");
const lastThreeMonthsButton = () =>
  document.querySelector("#select-last-three-months");
const lastMonthButton = () => document.querySelector("#select-last-month");
const lastTwoWeeksButton = () =>
  document.querySelector("#select-last-two-weeks");
const lastWeekButton = () => document.querySelector("#select-last-week");

describe("selectDateRange", () => {
  const TEST_DATE_RANGE = {
    startDate: Date.parse("2020-02-28"),
    endDate: Date.parse("2020-09-30"),
  };

  const EMPTY_DATE_RANGE = {
    startDate: 0,
    endDate: 1,
  };

  it("happy path dates", async () => {
    const { user } = renderWithUser(
      <QuickSelectDateRange
        setDateRange={setDateRange}
        maxDateRange={TEST_DATE_RANGE}
      />
    );

    await user.click(allDatesButton());
    expect(setDateRange).toHaveBeenLastCalledWith(TEST_DATE_RANGE);

    await user.click(lastThreeMonthsButton());
    expect(setDateRange).toHaveBeenLastCalledWith({
      startDate: Date.parse("2020-06-30"),
      endDate: Date.parse("2020-09-30"),
    });

    await user.click(lastMonthButton());
    expect(setDateRange).toHaveBeenLastCalledWith({
      startDate: Date.parse("2020-08-30"),
      endDate: Date.parse("2020-09-30"),
    });

    await user.click(lastTwoWeeksButton());
    expect(setDateRange).toHaveBeenLastCalledWith({
      startDate: Date.parse("2020-09-16"),
      endDate: Date.parse("2020-09-30"),
    });

    await user.click(lastWeekButton());
    expect(setDateRange).toHaveBeenLastCalledWith({
      startDate: Date.parse("2020-09-23"),
      endDate: Date.parse("2020-09-30"),
    });
  });

  it("preloaded dates", async () => {
    const { user } = renderWithUser(
      <QuickSelectDateRange
        setDateRange={setDateRange}
        maxDateRange={EMPTY_DATE_RANGE}
      />
    );

    await user.click(allDatesButton());
    expect(setDateRange).toHaveBeenLastCalledWith(EMPTY_DATE_RANGE);

    await user.click(lastWeekButton());
    expect(setDateRange).toHaveBeenLastCalledWith(EMPTY_DATE_RANGE);
  });

  it("missing dates", () => {
    global.suppressConsoleErrorLogs();
    expect(() =>
      render(<QuickSelectDateRange setDateRange={setDateRange} />)
    ).toThrow("missing maxDateRange");
  });
});

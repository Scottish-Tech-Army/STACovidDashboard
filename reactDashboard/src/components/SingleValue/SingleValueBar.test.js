/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkSingleValue"] }] */

import React from "react";
import SingleValueBar from "./SingleValueBar";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import MockDate from "mockdate";

const TODAY = "2020-10-17";
const TOMORROW = "2020-10-18";

const DATE_TODAY = Date.parse(TODAY);
const DATE_TOMORROW = Date.parse(TOMORROW);

var container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  fetch.resetMocks();
  MockDate.set(DATE_TODAY);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  MockDate.reset();
});

test("singleValueBar renders default data when dataset is null", async () => {
  await act(async () => {
    render(<SingleValueBar />, container);
  });

  checkSingleValue("dailyCases", "Not available", "Not available");
  checkSingleValue(
    "totalCases",
    "Not available",
    "reported since 28 February, 2020"
  );
  checkSingleValue("dailyDeaths", "Not available", "Not available");
  checkSingleValue(
    "totalDeaths",
    "Not available",
    "reported since 28 February, 2020"
  );
  checkSingleValue("fatalityCaseRatio", "Not available");
});

test("singleValueBar renders dynamic fetched data for today", async () => {
  await act(async () => {
    render(
      <SingleValueBar
        dailyCases={{ date: DATE_TODAY, value: 1167 }}
        dailyDeaths={{ date: DATE_TODAY, value: 15 }}
        totalCases={{ date: DATE_TODAY, value: 46399 }}
        totalDeaths={{ date: DATE_TODAY, value: 2609 }}
        fatalityCaseRatio="5.6%"
      />,
      container
    );
  });

  checkSingleValue("dailyCases", "1,167", "reported today");
  checkSingleValue("totalCases", "46,399", "reported since 28 February, 2020");
  checkSingleValue("dailyDeaths", "15", "reported today");
  checkSingleValue("totalDeaths", "2,609", "reported since 28 February, 2020");
  checkSingleValue("fatalityCaseRatio", "5.6%");
});

test("singleValueBar renders dynamic fetched data for yesterday", async () => {
  MockDate.set(DATE_TOMORROW);

  await act(async () => {
    render(
      <SingleValueBar
        dailyCases={{ date: DATE_TODAY, value: 1167 }}
        dailyDeaths={{ date: DATE_TODAY, value: 15 }}
        totalCases={{ date: DATE_TODAY, value: 46399 }}
        totalDeaths={{ date: DATE_TODAY, value: 2609 }}
        fatalityCaseRatio="5.6%"
      />,
      container
    );
  });

  checkSingleValue("dailyCases", "1,167", "reported yesterday");
  checkSingleValue("totalCases", "46,399", "reported since 28 February, 2020");
  checkSingleValue("dailyDeaths", "15", "reported yesterday");
  checkSingleValue("totalDeaths", "2,609", "reported since 28 February, 2020");
  checkSingleValue("fatalityCaseRatio", "5.6%");
});

function checkSingleValue(
  singleValueId,
  expectedValue,
  expectedSubtitle = null
) {
  const singleValueElement = container.querySelector("#" + singleValueId);
  const subtitle = singleValueElement.querySelector(".subtitle");
  const value = singleValueElement.querySelector(".single-value-number");
  expect(subtitle.textContent).toBe(
    expectedSubtitle == null ? "" : expectedSubtitle
  );
  expect(value.textContent).toBe(expectedValue);
}

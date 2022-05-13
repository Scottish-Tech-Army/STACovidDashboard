/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkSingleValue", "expectNormalScotlandValues", "expectValuesUnavailable"] }] */

import React from "react";
import RegionSingleValueBar from "./RegionSingleValueBar";
import { act } from "react-dom/test-utils";
import { FEATURE_CODE_SCOTLAND } from "../Utils/CsvUtils";
import MockDate from "mockdate";
import { createRoot } from "react-dom/client";

const DATE_TODAY = "2020-10-17";

var container = null;
var root = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  fetch.resetMocks();
  MockDate.set(DATE_TODAY);
});

afterEach(() => {
  // cleanup on exiting
  root.unmount(container);
  container.remove();
  container = null;
  MockDate.reset();
  jest.resetAllMocks();
});

describe("single value bar rendering", () => {
  it("scotland available", () => {
    act(() => {
      root.render(
        <RegionSingleValueBar
          allData={testAllData}
          regionCode={FEATURE_CODE_SCOTLAND}
        />
      );
    });

    expectNormalScotlandValues();
  });

  it("region available", () => {
    act(() => {
      root.render(
        <RegionSingleValueBar allData={testAllData} regionCode="S08000017" />
      );
    });

    checkSingleValue("dailyCases", "4", "reported today");
    checkSingleValue("weeklyCases", "501", "last 7 days");
    checkSingleValue("totalCases", "305", "reported since 28 February, 2020");
    checkSingleValue("dailyDeaths", "0", "reported today");
    checkSingleValue("weeklyDeaths", "34", "last 7 days");
    checkSingleValue("totalDeaths", "40", "reported since 28 February, 2020");
  });

  it("scotland unavailable", () => {
    act(() => {
      root.render(
        <RegionSingleValueBar
          allData={{ regions: {} }}
          regionCode={FEATURE_CODE_SCOTLAND}
        />
      );
    });

    expectValuesUnavailable();

    act(() => {
      root.render(
        <RegionSingleValueBar allData={{}} regionCode={FEATURE_CODE_SCOTLAND} />
      );
    });

    expectValuesUnavailable();

    act(() => {
      root.render(<RegionSingleValueBar regionCode={FEATURE_CODE_SCOTLAND} />);
    });

    expectValuesUnavailable();
  });

  it("region unavailable", () => {
    act(() => {
      root.render(
        <RegionSingleValueBar
          allData={{ regions: {} }}
          regionCode="S08000017"
        />
      );
    });

    expectValuesUnavailable();
  });
});

describe("regionCode", () => {
  it("missing should default to Scotland", () => {
    act(() => {
      root.render(<RegionSingleValueBar allData={testAllData} />);
    });

    expectNormalScotlandValues();
  });

  it("null should default to Scotland", () => {
    act(() => {
      root.render(
        <RegionSingleValueBar allData={testAllData} regionCode={null} />
      );
    });

    expectNormalScotlandValues();
  });

  it("unknown should throw error", () => {
    global.suppressConsoleErrorLogs();

    expect(() => {
      act(() => {
        root.render(
          <RegionSingleValueBar allData={testAllData} regionCode="unknown" />
        );
      });
    }).toThrow("Unrecognised regionCode: unknown");
  });
});

function expectNormalScotlandValues() {
  checkSingleValue("dailyCases", "7", "reported today");
  checkSingleValue("weeklyCases", "1,572", "last 7 days");
  checkSingleValue("totalCases", "19,126", "reported since 28 February, 2020");
  checkSingleValue("dailyDeaths", "3", "reported today");
  checkSingleValue("weeklyDeaths", "86", "last 7 days");
  checkSingleValue("totalDeaths", "2,491", "reported since 28 February, 2020");
}

function expectValuesUnavailable() {
  checkSingleValue("dailyCases", "Not available", "Not available");
  checkSingleValue("weeklyCases", "Not available", "last 7 days");
  checkSingleValue(
    "totalCases",
    "Not available",
    "reported since 28 February, 2020"
  );
  checkSingleValue("dailyDeaths", "Not available", "Not available");
  checkSingleValue("weeklyDeaths", "Not available", "last 7 days");
  checkSingleValue(
    "totalDeaths",
    "Not available",
    "reported since 28 February, 2020"
  );
}

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

const testDate = Date.parse(DATE_TODAY);

const testAllData = {
  regions: {
    S12000006: {
      dailyCases: { date: testDate, value: 1 },
      cumulativeCases: { date: testDate, value: 311 },
      cumulativeDeaths: { date: testDate, value: 40 },
      dailyDeaths: { date: testDate, value: 2 },
      weeklyCases: 150,
      weeklyDeaths: 37,
    },
    S08000017: {
      dailyCases: { date: testDate, value: 4 },
      cumulativeCases: { date: testDate, value: 305 },
      cumulativeDeaths: { date: testDate, value: 40 },
      dailyDeaths: { date: testDate, value: 0 },
      weeklyCases: 501,
      weeklyDeaths: 34,
    },
    S92000003: {
      dailyCases: { date: testDate, value: 7 },
      cumulativeCases: { date: testDate, value: 19126 },
      cumulativeDeaths: { date: testDate, value: 2491 },
      dailyDeaths: { date: testDate, value: 3 },
      weeklyCases: 1572,
      weeklyDeaths: 86,
    },
  },
};

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import {
  playAudio,
  isAudioPlaying,
  addPlayStateChangeListener,
  deletePlayStateChangeListener,
} from "../Utils/Sonification";
import SonificationPlayButton from "./SonificationPlayButton";
import { DAILY_CASES, TOTAL_DEATHS } from "../DataCharts/DataChartsConsts";
import { FEATURE_CODE_SCOTLAND } from "../Utils/CsvUtils";

var container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

jest.mock("../Utils/Sonification", () => {
  var storedIsAudioPlaying = false;
  var storedListener = null;

  return {
    playAudio: jest.fn((allData) => {
      storedIsAudioPlaying = !storedIsAudioPlaying && allData;
      if (storedListener) {
        storedListener();
      }
    }),
    isAudioPlaying: jest.fn(() => {
      return storedIsAudioPlaying;
    }),
    addPlayStateChangeListener: jest.fn((listener) => {
      storedListener = listener;
    }),
    deletePlayStateChangeListener: jest.fn(() => {
      storedListener = null;
    }),
  };
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  jest.clearAllMocks();
});

const dateRange = {
  startDate: Date.parse("2020-03-03"),
  endDate: Date.parse("2020-03-07"),
};

const playButton = () => container.querySelector(".sonification-play-button");

function click() {
  playButton().dispatchEvent(new MouseEvent("click", { bubbles: true }));
}

test("default play/stop behaviour", async () => {
  await act(async () => {
    render(
      <SonificationPlayButton
        allData={testAllData}
        chartType={TOTAL_DEATHS}
        regionCode="S12000013"
        dateRange={dateRange}
      />,
      container
    );
  });

  expect(addPlayStateChangeListener).toHaveBeenCalledTimes(1);
  expect(deletePlayStateChangeListener).toHaveBeenCalledTimes(0);
  expect(playButton().getAttribute("aria-label")).toBe(
    "Listen to audio representation of total deaths for Na h-Eileanan Siar"
  );
  expect(playAudio).toHaveBeenCalledTimes(0);
  expect(isAudioPlaying).toHaveBeenCalledTimes(0);

  // Click play
  await act(async () => {
    click();
    render(
      <SonificationPlayButton
        allData={testAllData}
        chartType={TOTAL_DEATHS}
        regionCode="S12000013"
        dateRange={dateRange}
      />,
      container
    );
  });

  expect(playAudio).toHaveBeenCalledTimes(1);
  expect(playAudio).toHaveBeenLastCalledWith(
    testAllData,
    TOTAL_DEATHS,
    "S12000013",
    dateRange
  );
  // Check callback action
  expect(isAudioPlaying).toHaveBeenCalledTimes(1);
  expect(playButton().getAttribute("aria-label")).toBe("Stop listening");

  // Click stop
  await act(async () => {
    click();
    render(
      <SonificationPlayButton
        allData={testAllData}
        chartType={TOTAL_DEATHS}
        regionCode="S12000013"
        dateRange={dateRange}
      />,
      container
    );
  });

  expect(playAudio).toHaveBeenCalledTimes(2);
  expect(playAudio).toHaveBeenLastCalledWith(
    testAllData,
    TOTAL_DEATHS,
    "S12000013",
    dateRange
  );
  // Check callback action
  expect(isAudioPlaying).toHaveBeenCalledTimes(2);
  expect(playButton().getAttribute("aria-label")).toBe(
    "Listen to audio representation of total deaths for Na h-Eileanan Siar"
  );
});

test("minimum input play/stop behaviour", async () => {
  await act(async () => {
    render(<SonificationPlayButton allData={testAllData} />, container);
  });

  expect(addPlayStateChangeListener).toHaveBeenCalledTimes(1);
  expect(playButton().getAttribute("aria-label")).toBe(
    "Listen to audio representation of daily cases for Scotland"
  );
  expect(playAudio).toHaveBeenCalledTimes(0);
  expect(isAudioPlaying).toHaveBeenCalledTimes(0);

  // Click play
  await act(async () => {
    click();
    render(<SonificationPlayButton allData={testAllData} />, container);
  });

  expect(playAudio).toHaveBeenCalledTimes(1);
  expect(playAudio).toHaveBeenLastCalledWith(
    testAllData,
    DAILY_CASES,
    FEATURE_CODE_SCOTLAND,
    null
  );
  // Check callback action
  expect(isAudioPlaying).toHaveBeenCalledTimes(1);
  expect(playButton().getAttribute("aria-label")).toBe("Stop listening");

  // Click stop
  await act(async () => {
    click();
    render(<SonificationPlayButton allData={testAllData} />, container);
  });

  expect(playAudio).toHaveBeenCalledTimes(2);
  expect(playAudio).toHaveBeenLastCalledWith(
    testAllData,
    DAILY_CASES,
    FEATURE_CODE_SCOTLAND,
    null
  );
  // Check callback action
  expect(isAudioPlaying).toHaveBeenCalledTimes(2);
  expect(playButton().getAttribute("aria-label")).toBe(
    "Listen to audio representation of daily cases for Scotland"
  );
});

test("empty input play behaviour", async () => {
  await act(async () => {
    render(<SonificationPlayButton />, container);
  });

  // Click play
  await act(async () => {
    click();
    render(<SonificationPlayButton />, container);
  });

  expect(playAudio).toHaveBeenCalledTimes(1);
  expect(playAudio).toHaveBeenLastCalledWith(
    null,
    DAILY_CASES,
    FEATURE_CODE_SCOTLAND,
    null
  );
  expect(playButton().getAttribute("aria-label")).toBe(
    "Listen to audio representation of daily cases for Scotland"
  );
});

const testAllData = {
  dates: [
    Date.parse("2020-03-02"),
    Date.parse("2020-03-03"),
    Date.parse("2020-03-04"),
    Date.parse("2020-03-05"),
    Date.parse("2020-03-06"),
    Date.parse("2020-03-07"),
    Date.parse("2020-03-08"),
    Date.parse("2020-03-09"),
  ],
  startDate: Date.parse("2020-03-02"),
  endDate: Date.parse("2020-03-09"),
  regions: {
    S08000031: {
      dailySeries: {
        dailyCases: [1, 31, 61, 91, 121, 151, 181, 211],
        dailyDeaths: [5, 35, 65, 95, 125, 155, 185, 215],
        totalCases: [2, 32, 62, 92, 122, 152, 182, 212],
        totalDeaths: [6, 36, 66, 96, 126, 156, 186, 216],
      },
    },
    S08000022: {
      dailySeries: {
        dailyCases: [11, 41, 71, 101, 131, 161, 191, 221],
        dailyDeaths: [15, 45, 75, 105, 135, 165, 195, 225],
        totalCases: [12, 42, 72, 102, 132, 162, 192, 222],
        totalDeaths: [16, 46, 76, 106, 136, 166, 196, 226],
      },
    },
    S12000013: {
      dailySeries: {
        dailyCases: [21, 51, 81, 111, 141, 171, 201, 231],
        dailyDeaths: [25, 55, 85, 115, 145, 175, 205, 235],
        totalCases: [22, 52, 82, 112, 142, 172, 202, 232],
        totalDeaths: [10000, 1, 2, 3, 4, 51, 99999, 299936],
      },
    },
    S92000003: {
      dailySeries: {
        dailyCases: [33, 123, 213, 303, 393, 483, 573, 663],
        dailyDeaths: [45, 135, 225, 315, 405, 495, 585, 675],
        totalCases: [36, 126, 216, 306, 396, 486, 576, 888],
        totalDeaths: [48, 138, 228, 318, 408, 498, 588, 678],
      },
    },
  },
};

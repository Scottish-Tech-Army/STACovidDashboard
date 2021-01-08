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
    playAudio: jest.fn(() => {
      storedIsAudioPlaying = !storedIsAudioPlaying;
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

const seriesData = [
  { t: Date.parse("2020-03-06"), y: 1 },
  { t: Date.parse("2020-03-07"), y: 2 },
  { t: Date.parse("2020-03-08"), y: 3 },
  { t: Date.parse("2020-03-09"), y: 4 },
  { t: Date.parse("2020-03-10"), y: 51 },
];

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
        seriesData={seriesData}
        seriesTitle="dataset title"
        regionCode="S12000013"
        dateRange={dateRange}
      />,
      container
    );
  });

  expect(addPlayStateChangeListener).toHaveBeenCalledTimes(1);
  expect(deletePlayStateChangeListener).toHaveBeenCalledTimes(0);
  expect(playButton().getAttribute("aria-label")).toBe(
    "Listen to audio representation of dataset title for Na h-Eileanan Siar"
  );
  expect(playAudio).toHaveBeenCalledTimes(0);
  expect(isAudioPlaying).toHaveBeenCalledTimes(0);

  // Click play
  await act(async () => {
    click();
    render(
      <SonificationPlayButton
        seriesData={seriesData}
        seriesTitle="dataset title"
        regionCode="S12000013"
        dateRange={dateRange}
      />,
      container
    );
  });

  expect(playAudio).toHaveBeenCalledTimes(1);
  expect(playAudio).toHaveBeenLastCalledWith(
    "dataset title",
    seriesData,
    dateRange,
    "Nahelen an sheer"
  );
  // Check callback action
  expect(isAudioPlaying).toHaveBeenCalledTimes(1);
  expect(playButton().getAttribute("aria-label")).toBe("Stop listening");

  // Click stop
  await act(async () => {
    click();
    render(
      <SonificationPlayButton
        seriesData={seriesData}
        seriesTitle="dataset title"
        regionCode="S12000013"
        dateRange={dateRange}
      />,
      container
    );
  });

  expect(playAudio).toHaveBeenCalledTimes(2);
  expect(playAudio).toHaveBeenLastCalledWith(
    "dataset title",
    seriesData,
    dateRange,
    "Nahelen an sheer"
  );
  // Check callback action
  expect(isAudioPlaying).toHaveBeenCalledTimes(2);
  expect(playButton().getAttribute("aria-label")).toBe(
    "Listen to audio representation of dataset title for Na h-Eileanan Siar"
  );
});

test("minimum input play/stop behaviour", async () => {
  await act(async () => {
    render(<SonificationPlayButton seriesData={seriesData} />, container);
  });

  expect(addPlayStateChangeListener).toHaveBeenCalledTimes(1);
  expect(deletePlayStateChangeListener).toHaveBeenCalledTimes(0);
  expect(playButton().getAttribute("aria-label")).toBe(
    "Listen to audio representation of no data for Scotland"
  );
  expect(playAudio).toHaveBeenCalledTimes(0);
  expect(isAudioPlaying).toHaveBeenCalledTimes(0);

  // Click play
  await act(async () => {
    click();
    render(<SonificationPlayButton seriesData={seriesData} />, container);
  });

  expect(playAudio).toHaveBeenCalledTimes(1);
  expect(playAudio).toHaveBeenLastCalledWith(
    "No data",
    seriesData,
    null,
    "Scotland"
  );
  // Check callback action
  expect(isAudioPlaying).toHaveBeenCalledTimes(1);
  expect(playButton().getAttribute("aria-label")).toBe("Stop listening");

  // Click stop
  await act(async () => {
    click();
    render(<SonificationPlayButton seriesData={seriesData} />, container);
  });

  expect(playAudio).toHaveBeenCalledTimes(2);
  expect(playAudio).toHaveBeenLastCalledWith(
    "No data",
    seriesData,
    null,
    "Scotland"
  );
  // Check callback action
  expect(isAudioPlaying).toHaveBeenCalledTimes(2);
  expect(playButton().getAttribute("aria-label")).toBe(
    "Listen to audio representation of no data for Scotland"
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

  expect(playAudio).toHaveBeenCalledTimes(0);
  expect(playButton().getAttribute("aria-label")).toBe(
    "Listen to audio representation of no data for Scotland"
  );

  // Empty seriesData
  await act(async () => {
    render(<SonificationPlayButton seriesData={[]} />, container);
  });

  // Click play
  await act(async () => {
    click();
    render(<SonificationPlayButton seriesData={[]} />, container);
  });

  expect(playAudio).toHaveBeenCalledTimes(0);
  expect(playButton().getAttribute("aria-label")).toBe(
    "Listen to audio representation of no data for Scotland"
  );
});

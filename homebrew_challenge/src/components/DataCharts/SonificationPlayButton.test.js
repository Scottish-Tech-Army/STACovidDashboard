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

const seriesData = [1, 2, 3, 4, 51];
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
      />,
      container
    );
  });

  expect(addPlayStateChangeListener).toHaveBeenCalledTimes(1);
  expect(deletePlayStateChangeListener).toHaveBeenCalledTimes(0);
  expect(playButton().title).toBe(
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
      />,
      container
    );
  });

  expect(playAudio).toHaveBeenCalledTimes(1);
  expect(playAudio).toHaveBeenLastCalledWith(
    "dataset title",
    seriesData,
    "Nahelen an sheer"
  );
  // Check callback action
  expect(isAudioPlaying).toHaveBeenCalledTimes(1);
  expect(playButton().title).toBe("Stop listening");

  // Click stop
  await act(async () => {
    click();
    render(
      <SonificationPlayButton
        seriesData={seriesData}
        seriesTitle="dataset title"
        regionCode="S12000013"
      />,
      container
    );
  });

  expect(playAudio).toHaveBeenCalledTimes(2);
  expect(playAudio).toHaveBeenLastCalledWith(
    "dataset title",
    seriesData,
    "Nahelen an sheer"
  );
  // Check callback action
  expect(isAudioPlaying).toHaveBeenCalledTimes(2);
  expect(playButton().title).toBe(
    "Listen to audio representation of dataset title for Na h-Eileanan Siar"
  );
});

test("minimum input play/stop behaviour", async () => {
  await act(async () => {
    render(<SonificationPlayButton seriesData={seriesData} />, container);
  });

  expect(addPlayStateChangeListener).toHaveBeenCalledTimes(1);
  expect(deletePlayStateChangeListener).toHaveBeenCalledTimes(0);
  expect(playButton().title).toBe(
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
  expect(playAudio).toHaveBeenLastCalledWith("No data", seriesData, "Scotland");
  // Check callback action
  expect(isAudioPlaying).toHaveBeenCalledTimes(1);
  expect(playButton().title).toBe("Stop listening");

  // Click stop
  await act(async () => {
    click();
    render(<SonificationPlayButton seriesData={seriesData} />, container);
  });

  expect(playAudio).toHaveBeenCalledTimes(2);
  expect(playAudio).toHaveBeenLastCalledWith("No data", seriesData, "Scotland");
  // Check callback action
  expect(isAudioPlaying).toHaveBeenCalledTimes(2);
  expect(playButton().title).toBe(
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
  expect(playButton().title).toBe(
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
  expect(playButton().title).toBe(
    "Listen to audio representation of no data for Scotland"
  );
});

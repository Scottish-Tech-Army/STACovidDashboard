import { AudioContext } from "standardized-audio-context";
import { format } from "date-fns";
import {
  getDataSeriesRange,
  getSonificationSeriesTitle,
} from "../DataCharts/DataChartsModel";
import { getPhoneticPlaceNameByFeatureCode } from "../Utils/CsvUtils";

const A4_FREQUENCY = 220;
// C4 to G#6 inclusive
const NO_OF_TONES = 33;

var sonificationPlaying = false;
var sonificationToneOscillator = null;
const playStateChangeListeners = [];
var utterance = null;

// Calculate an array of 12-TET tones on chromatic scale from given base frequency and array length
// https://en.wikipedia.org/wiki/Equal_temperament
function generate12TETTones() {
  var tones = [A4_FREQUENCY];
  for (let i = 0; i < NO_OF_TONES + 2; i++) {
    tones.push(tones[tones.length - 1] * 1.059463);
  }
  // Drop A4 to B4
  return tones.slice(3).map((v) => Math.round(v));
}

// 12-TET scale from C4 to G#6
const TONES = generate12TETTones();
const MIN_TONE = TONES[0];
const MAX_TONE = TONES[TONES.length - 1];

function convertDataToFrequencies(seriesData, maxDataValue) {
  const binSize = maxDataValue / (TONES.length - 1);
  return seriesData.map((value) => TONES[Math.ceil(value / binSize)]);
}

// Pick the nearest halfcycle time after the minimumDuration (when the waveform is at a 0 point)
function getToneDuration(minimumDuration, frequency) {
  const halfCycleDuration = 0.5 / frequency;
  const requiredhalfCycles = Math.ceil(minimumDuration / halfCycleDuration);
  return requiredhalfCycles * halfCycleDuration;
}

function waitForSpeech(message) {
  if (!sonificationPlaying) {
    console.log("sonification not playing");
    return;
  }
  return new Promise((resolve, reject) => {
    utterance = new SpeechSynthesisUtterance(message);
    utterance.onerror = (event) => {
      console.error("web speech error");
      console.error(event);
      utterance = null;
    };
    utterance.onend = () => {
      utterance = null;
      resolve();
    };
    window.speechSynthesis.speak(utterance);
  });
}

function waitForTone(audioCtx, frequency) {
  if (!sonificationPlaying) {
    return;
  }
  return new Promise((resolve, reject) => {
    var oscillator = audioCtx.createOscillator();
    oscillator.onended = resolve;
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + getToneDuration(0.5, frequency));
    if (audioCtx.state === "suspended") {
      audioCtx.resume().then(() => {
        console.log("resumed");
      });
    }
  });
}

function webspeechAvailable() {
  return (
    window.speechSynthesis && window.speechSynthesis.getVoices().length > 0
  );
}

// On Firefox this occasionally fails the first time, so call it now
webspeechAvailable();

function playDataIntroduction(
  audioCtx,
  seriesTitle,
  maxDataValue,
  dateRange,
  place
) {
  if (webspeechAvailable()) {
    const startDate =
      dateRange == null
        ? "28th February"
        : format(dateRange.startDate, "do MMMM");
    const endDate =
      dateRange == null ? "Yesterday" : format(dateRange.endDate, "do MMMM");

    return new Promise((resolve, reject) => {
      waitForSpeech(seriesTitle + " for " + place + ". Minimum value 0. ")
        .then(() => waitForTone(audioCtx, MIN_TONE))
        .then(() => waitForSpeech("Maximum value " + maxDataValue + "."))
        .then(() => waitForTone(audioCtx, MAX_TONE))
        .then(() =>
          waitForSpeech(
            "From " +
              startDate +
              " until " +
              endDate +
              ". Each tone represents one day."
          )
        )
        .then(resolve);
    });
  } else {
    console.warn(
      "web speech API not available - skipping dataset introduction"
    );
  }
}

function playDataTones(audioCtx, seriesData, maxDataValue) {
  const frequencies = convertDataToFrequencies(seriesData, maxDataValue);
  sonificationToneOscillator = audioCtx.createOscillator();
  // Clean up on ended
  sonificationToneOscillator.onended = () => {
    sonificationToneOscillator = null;
    setPlaying(false);
  };

  for (let i = 0; i < frequencies.length; i++) {
    const frequency = frequencies[i];
    const startTime = audioCtx.currentTime + i / 5;
    const stopTime = startTime + getToneDuration(0.1, frequency);
    sonificationToneOscillator.frequency.setValueAtTime(frequency, startTime);
    sonificationToneOscillator.frequency.setValueAtTime(0, stopTime);
  }
  sonificationToneOscillator.connect(audioCtx.destination);
  sonificationToneOscillator.start();
  sonificationToneOscillator.stop(
    audioCtx.currentTime + frequencies.length / 5
  );
}

// Exported for unit tests
export function calculateMaxDataValue(seriesData = null) {
  if (seriesData === null || seriesData.length === 0) {
    return 100;
  }
  var maximum = seriesData.reduce((acc, current) => Math.max(acc, current), 0);

  if (maximum === 0) {
    return 100;
  }

  // Up to 100, go up to nearest X*10^N
  // Above 100, go up to nearest XY*10^N (eg 1123 rounds up to 1200 instead of 2000)
  const lookahead = maximum <= 100 ? 10 : 100;

  var order = 1;
  while (order * lookahead < maximum) {
    order *= 10;
  }
  var value = Math.ceil(maximum / order);
  return Math.round(value * order);
}

/**
 * Play sonification of supplied dataset if audio is not currently playing.
 * If audio is already playing, stop the currently playing audio and return.
 */
export function playAudio(
  allData = null,
  chartType = null,
  regionCode = null,
  dateRange = null
) {
  if (sonificationPlaying) {
    stopAudio();
    return;
  }
  if (!allData || !chartType || !regionCode) {
    return;
  }

  setPlaying(true);
  const truncatedSeriesData = getDataSeriesRange(allData, chartType, regionCode, dateRange);
  const maxDataValue = calculateMaxDataValue(truncatedSeriesData);

  const audioCtx = new AudioContext();
  playDataIntroduction(
    audioCtx,
    getSonificationSeriesTitle(chartType),
    maxDataValue,
    dateRange,
    getPhoneticPlaceNameByFeatureCode(regionCode)
  ).then(() => {
    if (sonificationPlaying) {
      playDataTones(audioCtx, truncatedSeriesData, maxDataValue);
    }
  });
}

/**
 * Return true iff audio is currently playing.
 *
 * @return {boolean} true iff audio is currently playing.
 */
export function isAudioPlaying() {
  return sonificationPlaying;
}

function setPlaying(isPlaying) {
  sonificationPlaying = isPlaying;
  notifyPlayStateChangeListeners();
}

/**
 * If audio is playing, stop the currently playing audio and return.
 */
export function stopAudio() {
  if (sonificationToneOscillator != null) {
    sonificationToneOscillator.onended = undefined;
    sonificationToneOscillator.stop(
      sonificationToneOscillator.context.currentTime
    );
    sonificationToneOscillator = null;
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  setPlaying(false);
}

export function addPlayStateChangeListener(onPlayStateChange) {
  playStateChangeListeners.push(onPlayStateChange);
}

export function deletePlayStateChangeListener(onPlayStateChange) {
  while (playStateChangeListeners.indexOf(onPlayStateChange) !== -1) {
    playStateChangeListeners.splice(
      playStateChangeListeners.indexOf(onPlayStateChange),
      1
    );
  }
}

export function notifyPlayStateChangeListeners() {
  playStateChangeListeners.forEach((item) => {
    item();
  });
}

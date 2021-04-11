import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp, faVolumeMute } from "@fortawesome/free-solid-svg-icons";
import "./DataCharts.css";
import "../../common.css";
import {
  FEATURE_CODE_SCOTLAND,
  getPlaceNameByFeatureCode,
} from "../Utils/CsvUtils";
import { DAILY_CASES } from "../DataCharts/DataChartsConsts";
import {
  playAudio,
  isAudioPlaying,
  addPlayStateChangeListener,
  deletePlayStateChangeListener,
} from "../Utils/Sonification";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Tooltip as ReactBootstrapTooltip } from "react-bootstrap";
import "../ToolTips/ToolTip.css";
import { getSonificationSeriesTitle } from "./DataChartsModel";

const SonificationPlayButton = ({
  allData = null,
  chartType = DAILY_CASES,
  regionCode = FEATURE_CODE_SCOTLAND,
  dateRange = null,
  darkmode,
}) => {
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    const listener = () => setAudioPlaying(isAudioPlaying());
    addPlayStateChangeListener(listener);

    return function cleanup() {
      deletePlayStateChangeListener(listener);
    };
  }, []);

  function createTitle() {
    return audioPlaying
      ? "Stop listening"
      : "Listen to audio representation of " +
          getSonificationSeriesTitle(chartType).toLowerCase() +
          " for " +
          getPlaceNameByFeatureCode(regionCode);
  }

  return (
    <OverlayTrigger
      overlay={
        <ReactBootstrapTooltip id="tooltip">
          {createTitle()}
        </ReactBootstrapTooltip>
      }
    >
      <button
        type="button"
        className="sonification-play-button"
        onClick={() => playAudio(allData, chartType, regionCode, dateRange)}
        aria-label={createTitle()}
      >
        <FontAwesomeIcon
          icon={audioPlaying ? faVolumeMute : faVolumeUp}
          size="2x"
          color={darkmode ? "#f2f2f2" : "#6c6c6c"}
        />
        <span>{audioPlaying ? "Stop" : "Listen"}</span>
      </button>
    </OverlayTrigger>
  );
};

export default SonificationPlayButton;

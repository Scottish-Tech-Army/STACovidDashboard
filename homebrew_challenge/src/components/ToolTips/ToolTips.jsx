import React from 'react';
import GeoHeatMap from '../GeoHeatMap/GeoHeatMap';
import ReactToolTip from 'react-tooltip';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

const ToolTips = () => {
    return (
        <span id="icon">
        <FontAwesomeIcon
          icon={faQuestionCircle}
          size="3x"
          color="#319bd5"
        />
      </span>
        <a data-tip data-for='GeoHeatMap'>
        </a>
        <ReactToolTip id='GeoHeatMap' type='success'>
            <span>Geo Heat Map showing cases in each region.</span>
        </ReactToolTip>
    );
};

export default ToolTips;
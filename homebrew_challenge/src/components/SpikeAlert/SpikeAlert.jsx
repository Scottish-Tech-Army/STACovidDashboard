import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import "./SpikeAlert.css";

const SpikeAlert = () => {

  return (
    <div className="alert-bar">
      <span id="icon-alert">
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          size="3x"
          color="#e30613"
        />
      </span>
      <span id="message">
        Over the last 24 hours there has been a spike in infections in the Greater Glasgow and Clyde Health Board region. Please follow the latest government advice available at
        <a
          className="advice-link"
          target="_blank"
          href="https://www.gov.scot/coronavirus-covid-19/"
          rel="noopener noreferrer"
        >
          www.gov.scot/coronavirus-covid-19
        </a>
        .
      </span>
    </div>
  );

};

export default SpikeAlert;

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import "./InfoBar.css";
import { rssFeed } from "../Utils/rssFeedUtils";

const InfoBar = () => {

  const [covidNews, setCovidNews] = useState(null);

  useEffect(() => {
    setCovidNews(rssFeed);
  }, []);

  return (
    <div className="info-bar">
      <span id="icon">
        <FontAwesomeIcon
          icon={faInfoCircle}
          size="3x"
          color="#319bd5"
        />
      </span>
      <span id="message">
        Provisional dates for the relaxation of travel restrictions,
        restarting of the hospitality industry and reopening of
        hairdressers are among further route map measures announced
        today (Wednesday 24, June) by First Minister Nicola Sturgeon.
        For more information visit
        <a
          className="route-map-link link"
          target="_blank"
          href="https://www.gov.scot/news/further-route-map-detail-announced/"
          rel="noopener noreferrer"
        >
          www.gov.scot/news/further-route-map-detail-announced
        </a>
        .
      </span>
    </div>
  );
};

export default InfoBar;

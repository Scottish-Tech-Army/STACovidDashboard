import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import "./InfoBar.css";
import { rssFeed } from "../Utils/RssFeedUtils";

const InfoBar = () => {

  const [covidNews, setCovidNews] = useState(null);

  useEffect(() => {
    setCovidNews(rssFeed);
  }, []);

  console.log(covidNews);

  let newsTitleDescription = "no news yet";
  if (covidNews !== null) {
    newsTitleDescription = `${covidNews.title} - ${covidNews.description}`;
  };

  let newsLink = "no link yet";
  if (covidNews !== null) {
    newsLink = covidNews.link;
  };

  return (
    <div className="info-bar">
      <span id="icon">
        <FontAwesomeIcon
          icon={faInfoCircle}
          size="3x"
          color="#319bd5"
        />
      </span>
      <span>
        <p id="message">The latest Coronavirus news from news.gov.scot </p>
        <p>{newsTitleDescription}...
          <a
          target="_blank"
          href={newsLink}
          rel="noopener noreferrer"
          >
          Read More
          </a>
        </p>
      </span>
    </div>
  );
};

export default InfoBar;

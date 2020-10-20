import React, { useState, useEffect } from "react";
import { getLatestFiveNewsItems } from "../Utils/RssFeedUtils";
import "./InfoBar.css";

const InfoBar = () => {
  const [covidNews, setCovidNews] = useState(null);
  const rssFeedUrl = "data/newsScotGovRss.xml";

  useEffect(() => {
    fetch(rssFeedUrl, {
      method: "GET",
    })
      .then((res) => res.text())
      .then((rssFeed) => {
        setCovidNews(getLatestFiveNewsItems(rssFeed));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const covidNewsItems =
    covidNews === null || covidNews.length === 0 ? (
      <>
        <p className="news-item news-item-title">NO NEWS AVAILABLE</p>
        <p className="news-item">
          Oops, something went wrong. Please check back again later.
        </p>
      </>
    ) : (
      covidNews.map((item, index) => {
        return (
          <li key={index} className="news-item">
            <a
              className="news-item-link link"
              target="_blank"
              href={item.link}
              rel="noopener noreferrer"
            >
              {item.title.toUpperCase()}
            </a>
            {" - "}
            {item.description}
            <span className="timestamp">
              {" | "}
              {item.timestamp}
            </span>
          </li>
        );
      })
    );

  return (
    <div className="info-bar d-flex flex-column">
      <div className="d-flex flex-row">
        <div className="icon-container">
          <img
            className="more-info-icon"
            src="./assets/more_info.png"
            alt="Latest Covid-19 news from Scottish Government"
          />
        </div>
        <div className="news-items-block justify-content-start">
          <ul className="list-items">{covidNewsItems}</ul>
        </div>
      </div>
      <div className="message-container d-flex justify-content-end">
        <span className="message">
          ...more from{" "}
          <a
            className="link scot-gov-link"
            target="_blank"
            href="https://news.gov.scot/news"
            rel="noopener noreferrer"
          >
            news.gov.scot
          </a>
        </span>
      </div>
    </div>
  );
};

export default InfoBar;

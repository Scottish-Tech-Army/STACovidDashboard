import React, { useState, useEffect } from "react";
import { getLatestFiveNewsItems } from "../Utils/RssFeedUtils";
import "./InfoBar.css";

const InfoBar = () => {
  const [covidNews, setCovidNews] = useState(null);
  const rssFeedUrl = "data/newsScotGovRss.xml";

  useEffect(() => {
    fetch(rssFeedUrl, {
      method: "GET"
    })
      .then(res => res.text())
      .then(rssFeed => {
        setCovidNews(getLatestFiveNewsItems(rssFeed));
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const covidNewsItems =
    covidNews === null || covidNews.length === 0 ? (
      <li className="news-item">No news available, please check back later</li>
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
              {item.title}
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
    <div className="info-bar">
      <span>
        <img className="more-info-icon" src="./assets/more_info.png" alt="" />
      </span>
      <span className="news-items-block">
        <ul>{covidNewsItems}</ul>
        <span className="message" id="msg">
          ...more news from{" "}
          <a
            className="link message"
            target="_blank"
            href="https://news.gov.scot/news"
            rel="noopener noreferrer"
          >
            news.gov.scot
          </a>
        </span>
      </span>
    </div>
  );
};

export default InfoBar;

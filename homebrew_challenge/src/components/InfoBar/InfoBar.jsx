import React, { useState, useEffect } from 'react';
import { getLatestNewsItem } from "../Utils/RssFeedUtils";

const InfoBar = () => {

  const [covidNews, setCovidNews] = useState(null);
  const rssFeedUrl = "data/newsScotGovRss.xml";
  useEffect(() => {
    fetch(rssFeedUrl, {
      method: "GET",
    })
      .then((res) => res.text())
      .then((rssFeed) => {
        setCovidNews(getLatestNewsItem(rssFeed));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="info-bar">
      <span id="icon">
        <img className="more-info-icon" src="./assets/more_info.png" alt=""/>
      </span>
      <span>
        <p className="message">
          The latest news from
            <a className="scot-gov-link link"
                target="_blank"
                href="https://news.gov.scot/news"
                rel="noopener noreferrer">
                news.gov.scot
            </a>
        </p>
        <p className="news-item">
          <a
             className="news-item-link"
             target="_blank"
             href={covidNews? covidNews.link : "#"}
             rel="noopener noreferrer"
          >
            {covidNews? covidNews.title : "no news yet"}
          </a>
          {" - "}
          {covidNews? covidNews.description : "no news yet"}
          {" | "}
          {covidNews? covidNews.timestamp : "no news yet"}
        </p>
      </span>
    </div>
  );
};

export default InfoBar;

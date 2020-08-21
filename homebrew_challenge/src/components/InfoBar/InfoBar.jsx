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

  try {
    const covidNewsItems = covidNews.map((item, index) => {
      console.log(item.title);
      return (
        <p key={index} className="news-item">
          <a
             className="news-item-link"
             target="_blank"
             href={item? item.link : "#"}
             rel="noopener noreferrer"
          >
            {item? item.title : "no news yet"}
          </a>
          {" - "}
          {item? item.description : "no news yet"}
          {" | "}
          {item? item.timestamp : "no news yet"}
        </p>
      );
    });
  } catch (error) {
    return <>Loading...</>;
  }

  return (
    <div className="info-bar">
      <span id="icon">
        <img className="more-info-icon" src="./assets/more_info.png" alt="" />
      </span>
      <span>
        <p className="message">
          The latest news from
          <a
            className="scot-gov-link link"
            target="_blank"
            href="https://news.gov.scot/news"
            rel="noopener noreferrer"
          >
            news.gov.scot
          </a>
        </p>
        {covidNewsItems}
      </span>
    </div>
  );
};

export default InfoBar;

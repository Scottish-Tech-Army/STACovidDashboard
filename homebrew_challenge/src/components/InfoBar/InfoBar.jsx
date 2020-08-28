import React, { useState, useEffect } from "react";
import { getLatestFiveNewsItems } from "../Utils/RssFeedUtils";
import "./InfoBar.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
      <>
        <p className="news-item-title">NO NEWS AVAILABLE</p>
        <p className="news-item">Oops, something went wrong. Please check back again later.</p>
      </>
    ) : (
      covidNews.map((item, index) => {
        return (
          <li key={index}>
            <a
              className="link"
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
    <Container fluid className="info-bar">
      <Row>
        <Col md={1}>
          <img className="more-info-icon" src="./assets/more_info.png" alt="" />
        </Col>
        <Col md={11} className="news-items-block">
        <ul className="list-items">{covidNewsItems}</ul>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-end">
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
        </Col>
      </Row>
    </Container>
  );
};

export default InfoBar;

import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AboutUs from "./pages/AboutUs";
import DataSources from "./pages/DataSources";
import Overview from "./pages/Overview";
import Regional from "./pages/Regional";
import {
  PAGE_ABOUT_US,
  PAGE_DATA_SOURCES,
  PAGE_OVERVIEW,
  PAGE_REGIONAL,
} from "./pages/PageConsts";
import TagManager from "react-gtm-module";
import { readCsvData, fetchAndStore } from "./components/Utils/CsvUtils";

const tagManagerArgs = {
  gtmId: "GTM-5LKHW33",
};

TagManager.initialize(tagManagerArgs);

const App = () => {
  const PAGE_ANALYTICS_DASHBOARD = "analyticsDashboard";

  const [currentPage, setCurrentPage] = useState(PAGE_REGIONAL);

  const [healthBoardDataset, setHealthBoardDataset] = useState(null);
  const [councilAreaDataset, setCouncilAreaDataset] = useState(null);
  const [
    currentTotalsHealthBoardDataset,
    setCurrentTotalsHealthBoardDataset,
  ] = useState(null);
  const [
    currentTotalsCouncilAreaDataset,
    setCurrentTotalsCouncilAreaDataset,
  ] = useState(null);

  // Load and parse datasets
  useEffect(() => {
    if (null === councilAreaDataset) {
      fetchAndStore(
        "dailyCouncilAreas.csv",
        setCouncilAreaDataset,
        readCsvData
      );
    }
  }, [councilAreaDataset]);

  useEffect(() => {
    if (null === healthBoardDataset) {
      fetchAndStore(
        "dailyHealthBoards.csv",
        setHealthBoardDataset,
        readCsvData
      );
    }
  }, [healthBoardDataset]);

  useEffect(() => {
    if (null === currentTotalsCouncilAreaDataset) {
      fetchAndStore(
        "currentTotalsCouncilAreas.csv",
        setCurrentTotalsCouncilAreaDataset,
        readCsvData
      );
    }
  }, [currentTotalsCouncilAreaDataset]);

  useEffect(() => {
    if (null === currentTotalsHealthBoardDataset) {
      fetchAndStore(
        "currentTotalsHealthBoards.csv",
        setCurrentTotalsHealthBoardDataset,
        readCsvData
      );
    }
  }, [currentTotalsHealthBoardDataset]);

  function sitemapEntry(key, text) {
    return (
      <div className="entry" onClick={() => setCurrentPage(key)}>
        {text}
      </div>
    );
  }

  function pageAnalyticsDashboard() {
    // const analyticsUrl = "http://127.0.0.1:7136/";
    const analyticsUrl = "https://sta-homebrew.shinyapps.io/analysis/";

    return (
      <iframe
        id="analytics-frame"
        src={analyticsUrl}
        style={{ border: "none", width: "100%", height: "850px" }}
        frameborder="0"
        title="COVID-19 Analytics"
      ></iframe>
    );
  }

  return (
    <div className="App">
      <header>
        <Container fluid className="header">
          <Row id="page-title" className="pt-3">
            <Col>
              <h1 className="header-title">
                <img
                  id="logo"
                  src="STALogo.png"
                  alt="Scottish Tech Army Logo"
                />
                COVID-19 Dashboard for Scotland
              </h1>
            </Col>
          </Row>
        </Container>
      </header>

      {currentPage === PAGE_OVERVIEW ? (
        <Overview
          councilAreaDataset={councilAreaDataset}
          healthBoardDataset={healthBoardDataset}
          currentTotalsHealthBoardDataset={currentTotalsHealthBoardDataset}
        />
      ) : (
        <></>
      )}
      {currentPage === PAGE_REGIONAL ? (
        <Regional
          councilAreaDataset={councilAreaDataset}
          healthBoardDataset={healthBoardDataset}
          currentTotalsHealthBoardDataset={currentTotalsHealthBoardDataset}
          currentTotalsCouncilAreaDataset={currentTotalsCouncilAreaDataset}
        />
      ) : (
        <></>
      )}
      {currentPage === PAGE_ANALYTICS_DASHBOARD ? (
        pageAnalyticsDashboard()
      ) : (
        <></>
      )}
      {currentPage === PAGE_DATA_SOURCES ? <DataSources /> : <></>}
      {currentPage === PAGE_ABOUT_US ? <AboutUs /> : <></>}

      <footer>
        <Container className="text-center font-small pt-4">
          <Row className="align-items-center">
            <Col xs={12} md={4} className="p-3 d-flex justify-content-around">
              <a
                href="https://www.gov.scot/collections/coronavirus-covid-19-guidance/"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                See the latest Scottish Government Covid-19 guidance
              </a>
            </Col>
            <Col xs={12} md={4} className="p-2 d-flex justify-content-around">
              <a
                href="https://www.scottishtecharmy.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="STABanner.png"
                  alt="Scottish Tech Army"
                  width="270"
                  height="50"
                />
              </a>
            </Col>
            <Col xs={12} md={4} className="p-3 d-flex justify-content-around">
              <a
                href="https://www.nhsinform.scot/illnesses-and-conditions/infections-and-poisoning/coronavirus-covid-19"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                For Covid-19 health information visit NHS Inform
              </a>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <div className="sitemap p-2">
                <div className="title">Sitemap</div>
                {sitemapEntry(PAGE_OVERVIEW, "Public Dashboard")}
                {sitemapEntry(PAGE_REGIONAL, "Regional Dashboard")}
                {sitemapEntry(PAGE_ANALYTICS_DASHBOARD, "Analytics Dashboard")}
                {sitemapEntry(
                  PAGE_DATA_SOURCES,
                  "Data sources and attribution"
                )}
                {sitemapEntry(PAGE_ABOUT_US, "About us")}
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="footer-copyright py-3">
                Unless otherwise stated, this webpage contains public sector
                information licensed under{" "}
                <a
                  href="http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                  target="_blank"
                  rel="noopener noreferrer licence"
                  className="link"
                >
                  the Open Government Licence 3.0.
                </a>
                <br />© 2020 Copyright:&nbsp;
                <a
                  href="https://www.scottishtecharmy.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  ScottishTechArmy.org
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default App;

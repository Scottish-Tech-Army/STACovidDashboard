import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AboutUs from "./pages/AboutUs";
import Accessibility from "./pages/Accessibility";
import DataSources from "./pages/DataSources";
import Overview from "./pages/Overview";
import Regional from "./pages/Regional";
import {
  PAGE_ABOUT_US,
  PAGE_ACCESSIBILITY,
  PAGE_DATA_SOURCES,
  PAGE_OVERVIEW,
  PAGE_REGIONAL,
} from "./pages/PageConsts";
import Footer from "./components/Footer/Footer";
import TagManager from "react-gtm-module";
import { readCsvData, fetchAndStore } from "./components/Utils/CsvUtils";

const tagManagerArgs = {
  gtmId: "GTM-5LKHW33",
};

TagManager.initialize(tagManagerArgs);

const App = () => {
  const [currentPage, setCurrentPage] = useState(PAGE_OVERVIEW);

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
      {currentPage === PAGE_ACCESSIBILITY ? <Accessibility /> : <></>}
      {currentPage === PAGE_DATA_SOURCES ? <DataSources /> : <></>}
      {currentPage === PAGE_ABOUT_US ? <AboutUs /> : <></>}
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default App;

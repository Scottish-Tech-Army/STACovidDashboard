import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
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
import { stopAudio } from "./components/Utils/Sonification";

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

  function pageTitle() {
    if (currentPage === PAGE_OVERVIEW) {
      return "SUMMARY DASHBOARD";
    } else if (currentPage === PAGE_REGIONAL) {
      return "REGIONAL INSIGHTS";
    } else if (currentPage === PAGE_ABOUT_US) {
      return "ABOUT US";
    } else if (currentPage === PAGE_ACCESSIBILITY) {
      return "ACCESSIBILITY STATEMENT";
    } else if (currentPage === PAGE_DATA_SOURCES) {
      return "DATA SOURCES";
    } else return "";
  }

  function scrollToTop(page) {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
    });
  }

  // Stop audio on page change
  useEffect(() => {
    stopAudio();
  }, [currentPage]);

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
        <div className="heading-container">
          <div className="heading">
            <img
              onClick={() => setCurrentPage(PAGE_OVERVIEW)}
              id="logo"
              src="STALogo.png"
              alt="Scottish Tech Army Logo"
            />
          </div>
          <div className="heading heading-title">
            <h1>Scottish COVID-19 Statistics</h1>
            <h2>{pageTitle()}</h2>
          </div>
        </div>
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
      <Footer setCurrentPage={scrollToTop} />
    </div>
  );
};

export default App;

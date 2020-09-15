import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
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
import DashboardNavbar from "./components/DashboardNavbar/DashboardNavbar";

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
        <DashboardNavbar
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
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

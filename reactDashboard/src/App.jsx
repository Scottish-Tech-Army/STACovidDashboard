import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AboutUs from "./pages/AboutUs";
import Accessibility from "./pages/Accessibility";
import DataSources from "./pages/DataSources";
import Overview from "./pages/Overview";
import Regional from "./pages/Regional";
import {
  URL_ABOUT_US,
  URL_ACCESSIBILITY,
  URL_DATA_SOURCES,
  URL_OVERVIEW,
  URL_REGIONAL,
} from "./pages/PageConsts";
import Footer from "./components/Footer/Footer";
import TagManager from "react-gtm-module";
import {
  readCsvData,
  fetchAndStore,
  calculatePopulationProportionMap,
  getPopulationMap,
  createPlaceDateValuesMap,
} from "./components/Utils/CsvUtils";
import { stopAudio } from "./components/Utils/Sonification";
import DashboardNavbar from "./components/DashboardNavbar/DashboardNavbar";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from "react-router-dom";

const tagManagerArgs = {
  gtmId: "GTM-5LKHW33",
};

TagManager.initialize(tagManagerArgs);

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <></>;
};

const StopAudio = () => {
  const { location } = useLocation();

  // Stop audio on page change
  useEffect(() => {
    stopAudio();
  }, [location]);

  return <></>;
};

const App = () => {
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
  const [populationMap, setPopulationMap] = useState(new Map());
  const [populationProportionMap, setPopulationProportionMap] = useState(
    new Map()
  );
  const [darkmode, setDarkmode] = useState(false);

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

  useEffect(() => {
    if (healthBoardDataset != null) {
      const populationMap = getPopulationMap(
        createPlaceDateValuesMap(healthBoardDataset)
      );
      setPopulationMap(
        (existingMap) => new Map([...existingMap, ...populationMap])
      );
    }
  }, [healthBoardDataset]);

  useEffect(() => {
    if (councilAreaDataset != null) {
      const populationMap = getPopulationMap(
        createPlaceDateValuesMap(councilAreaDataset)
      );
      setPopulationMap(
        (existingMap) => new Map([...existingMap, ...populationMap])
      );
    }
  }, [councilAreaDataset]);

  useEffect(() => {
    setPopulationProportionMap(calculatePopulationProportionMap(populationMap));
  }, [populationMap]);

  return (
    <div className={darkmode ? "App darkmode" : "App"}>
      <Router basename={process.env.PUBLIC_URL}>
        <ScrollToTop />
        <StopAudio />

        <header>
          <DashboardNavbar darkmode={darkmode} setDarkmode={setDarkmode} />
        </header>
        <Switch>
          <Route exact path={URL_OVERVIEW}>
            <Overview
              councilAreaDataset={councilAreaDataset}
              healthBoardDataset={healthBoardDataset}
              currentTotalsHealthBoardDataset={currentTotalsHealthBoardDataset}
              populationProportionMap={populationProportionMap}
              darkmode={darkmode}
            />
          </Route>
          <Route path={URL_REGIONAL}>
            <Regional
              councilAreaDataset={councilAreaDataset}
              healthBoardDataset={healthBoardDataset}
              currentTotalsHealthBoardDataset={currentTotalsHealthBoardDataset}
              currentTotalsCouncilAreaDataset={currentTotalsCouncilAreaDataset}
              populationProportionMap={populationProportionMap}
              darkmode={darkmode}
            />
          </Route>
          <Route path={URL_ACCESSIBILITY}>
            <Accessibility />
          </Route>
          <Route path={URL_DATA_SOURCES}>
            <DataSources />
          </Route>
          <Route path={URL_ABOUT_US}>
            <AboutUs />
          </Route>
          <Route path="*">{() => <Redirect to="/" />}</Route>
        </Switch>
        <Footer />
      </Router>
    </div>
  );
};
export default App;

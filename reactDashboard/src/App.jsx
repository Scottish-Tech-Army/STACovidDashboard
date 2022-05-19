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
import { stopAudio } from "./components/Utils/Sonification";
import DashboardNavbar from "./components/DashboardNavbar/DashboardNavbar";
import {
  BrowserRouter as Router,
  Route,
  useLocation,
  Routes,
  Navigate,
} from "react-router-dom";
import useDarkMode from "use-dark-mode";

const tagManagerArgs = { gtmId: "GTM-5LKHW33" };

// eslint-disable-next-line jest/require-hook
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
  const [allData, setAllData] = useState(null);
  const darkmode = useDarkMode(false, { classNameDark: "darkmode" });

  useEffect(() => {
    if (null === allData) {
      fetch(process.env.PUBLIC_URL + "/data/phsData.json", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((jsonData) => {
          setAllData(jsonData);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [allData]);

  return (
    <div className="App">
      <Router basename={process.env.PUBLIC_URL}>
        <ScrollToTop />
        <StopAudio />
        <header>
          <h1 className="visually-hidden">Scottish COVID-19 Statistics</h1>
          <DashboardNavbar darkmode={darkmode} />
        </header>
        <Routes>
          <Route
            path={URL_OVERVIEW}
            element={<Overview allData={allData} darkmode={darkmode.value} />}
          />
          <Route
            path={`${URL_REGIONAL}`}
            element={<Regional allData={allData} darkmode={darkmode.value} />}
          />
          <Route
            path={`${URL_REGIONAL}/:regionCode`}
            element={<Regional allData={allData} darkmode={darkmode.value} />}
          />
          <Route path={URL_ACCESSIBILITY} element={<Accessibility />} />
          <Route path={URL_DATA_SOURCES} element={<DataSources />} />
          <Route path={URL_ABOUT_US} element={<AboutUs />} />
          <Route path="*" element={<Navigate to="/" />}/>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};
export default App;

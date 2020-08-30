import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SingleValueBar from "./components/SingleValue/SingleValueBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import HeatmapDataSelector from "./components/HeatmapDataSelector/HeatmapDataSelector";
import Heatmap from "./components/HeatMap/Heatmap";
import GeoHeatMap from "./components/GeoHeatMap/GeoHeatMap";
import DataChartsSelector from "./components/DataCharts/DataChartsSelector";
import DataCharts from "./components/DataCharts/DataCharts";
import InfoBar from "./components/InfoBar/InfoBar";
import RouteMapRules from "./components/RouteMapRules/RouteMapRules";
import Footer from "./components/Footer/Footer";

import { PERCENTAGE_CASES } from "./components/DataCharts/DataChartsConsts";
import {
  AREATYPE_HEALTH_BOARDS,
  VALUETYPE_CASES,
} from "./components/HeatmapDataSelector/HeatmapConsts";
import {
  PAGE_PUBLIC_DASHBOARD,
  PAGE_ANALYTICS_DASHBOARD,
  PAGE_DATA_SOURCES,
  PAGE_ABOUT_US,
} from "./PageConsts";
import TagManager from "react-gtm-module";
import { readCsvData, fetchAndStore } from "./components/Utils/CsvUtils";

const tagManagerArgs = {
  gtmId: "GTM-5LKHW33",
};

TagManager.initialize(tagManagerArgs);

const App = () => {

  const [areaType, setAreaType] = useState(AREATYPE_HEALTH_BOARDS);
  const [valueType, setValueType] = useState(VALUETYPE_CASES);
  const [chartType, setChartType] = useState(PERCENTAGE_CASES);
  const [zoomDataCharts, setZoomDataCharts] = useState(false);
  const [zoomGeoMap, setZoomGeoMap] = useState(false);

  const [currentPage, setCurrentPage] = useState(PAGE_PUBLIC_DASHBOARD);

  const [healthBoardDataset, setHealthBoardDataset] = useState(null);
  const [councilAreaDataset, setCouncilAreaDataset] = useState(null);

  const zoomableCharts = useRef();
  const zoomableMap = useRef();

  function toggleFullscreen(element, setter) {
    var elem = element.current || document.documentElement;
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
      setter(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      setter(false);
    }
  }

  useEffect(() => {
    function setFullscreenMode(fullscreenEnabled) {
      if (!fullscreenEnabled) {
        setZoomDataCharts(false);
        setZoomGeoMap(false);
      }
    }

    // Monitor changes to fullscreen
    document.addEventListener(
      "fullscreenchange",
      () => setFullscreenMode(document.fullscreen),
      false
    );
    document.addEventListener(
      "mozfullscreenchange",
      () => setFullscreenMode(document.mozFullScreen),
      false
    );
    document.addEventListener(
      "webkitfullscreenchange",
      () => setFullscreenMode(document.webkitIsFullScreen),
      false
    );
    document.addEventListener(
      "msfullscreenchange",
      () => setFullscreenMode(document.msFullscreenElement),
      false
    );
  }, []);

  // Load and parse datasets
  useEffect(() => {
    const councilAreaCsv = "dailyCouncilAreas.csv";

    if (null === councilAreaDataset) {
      fetchAndStore(councilAreaCsv, setCouncilAreaDataset, readCsvData);
    }
  }, [councilAreaDataset]);

  useEffect(() => {
    const healthBoardCsv = "dailyHealthBoards.csv";

    if (null === healthBoardDataset) {
      fetchAndStore(healthBoardCsv, setHealthBoardDataset, readCsvData);
    }
  }, [healthBoardDataset]);

  function pagePublicDashboard() {
    return (
      <>
        <header>
          <Container fluid className="header">
            <Row className="pt-3 justify-content-center align-items-center">
              <Col>
                <RouteMapRules />
              </Col>
            </Row>
          </Container>
        </header>

        <Container fluid>
          <Row className="pt-3">
            <Col>
              <SingleValueBar />
            </Col>
          </Row>
          <Row>
            <Col>
              <hr className="full-width-hr" />
            </Col>
          </Row>
          <Row className="widgets-block">
            <Col
              xs={12}
              md={12}
              ref={zoomableMap}
              className={zoomGeoMap ? "full-screen" : ""}
            >
              <Row>
                <Col>
                  <HeatmapDataSelector
                    areaType={areaType}
                    valueType={valueType}
                    setAreaType={setAreaType}
                    setValueType={setValueType}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <hr className="underHeatmapSelector" />
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={zoomGeoMap ? 12 : 4}>
                  <GeoHeatMap
                    councilAreaDataset={councilAreaDataset}
                    healthBoardDataset={healthBoardDataset}
                    areaType={areaType}
                    valueType={valueType}
                    toggleFullscreen={() =>
                      toggleFullscreen(zoomableMap, setZoomGeoMap)
                    }
                    fullscreenEnabled={zoomGeoMap}
                  />
                </Col>
                <Col className="d-block d-md-none">
                  <hr className="underHeatmapSelector" />
                </Col>
                <Col xs={zoomGeoMap ? 0 : 12} md={zoomGeoMap ? 0 : 8}>
                  {zoomGeoMap ? (
                    <></>
                  ) : (
                    <Heatmap
                      councilAreaDataset={councilAreaDataset}
                      healthBoardDataset={healthBoardDataset}
                      areaType={areaType}
                      valueType={valueType}
                    />
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <hr className="full-width-hr" />
            </Col>
          </Row>
          <Row ref={zoomableCharts} className="fullscreen-charts">
            <Col xs={12} md={3} lg={2}>
              <DataChartsSelector
                chartType={chartType}
                setChartType={setChartType}
              />
            </Col>
            <Col xs={12} md={9} lg={10}>
              <DataCharts
                chartType={chartType}
                healthBoardDataset={healthBoardDataset}
                fullscreenEnabled={zoomDataCharts}
                toggleFullscreen={() =>
                  toggleFullscreen(zoomableCharts, setZoomDataCharts)
                }
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <hr className="full-width-hr" />
            </Col>
          </Row>
          <Row className="d-none d-sm-flex justify-content-center align-items-center">
            <Col>
              <InfoBar />
            </Col>
          </Row>
          <Row className="d-none d-sm-flex">
            <Col>
              <hr className="full-width-hr" />
            </Col>
          </Row>
        </Container>
      </>
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

  function pageDataSources() {
    return (
      <div className="data-sources">
        <h2>Data sources and attributions</h2>
        <ul>
          <li>
            Routemap information:
            <a
              href={
                "https://www.gov.scot/publications/coronavirus-covid-19-what-you-can-and-cannot-do/pages/overview/"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="link "
            >
              https://www.gov.scot/publications/coronavirus-covid-19-what-you-can-and-cannot-do/pages/overview/
            </a>
          </li>
          <li>
            Management Data:{" "}
            <a
              href={
                "https://statistics.gov.scot/data/coronavirus-covid-19-management-information"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="link "
            >
              https://statistics.gov.scot/data/coronavirus-covid-19-management-information
            </a>
          </li>
          <li>
            Health Board Shapefile:{" "}
            <a
              href={
                "https://data.gov.uk/dataset/27d0fe5f-79bb-4116-aec9-a8e565ff756a/nhs-health-boards"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="link "
            >
              https://data.gov.uk/dataset/27d0fe5f-79bb-4116-aec9-a8e565ff756a/nhs-health-boards
            </a>
          </li>
          <li>
            Intermediate Deaths:{" "}
            <a
              href={
                "https://www.nrscotland.gov.uk/statistics-and-data/statistics/statistics-by-theme/vital-events/general-publications/weekly-and-monthly-data-on-births-and-deaths/deaths-involving-coronavirus-covid-19-in-scotland/archive"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="link "
            >
              https://www.nrscotland.gov.uk/statistics-and-data/statistics/statistics-by-theme/vital-events/general-publications/weekly-and-monthly-data-on-births-and-deaths/deaths-involving-coronavirus-covid-19-in-scotland/archive
            </a>
          </li>
          <li>
            Intermediate Zone Shapefile:{" "}
            <a
              href={
                "https://data.gov.uk/dataset/133d4983-c57d-4ded-bc59-390c962ea280/intermediate-zone-boundaries-2011"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="link "
            >
              https://data.gov.uk/dataset/133d4983-c57d-4ded-bc59-390c962ea280/intermediate-zone-boundaries-2011
            </a>
          </li>
          <li>
            Explanation of the IZ coded zones:{" "}
            <a
              href={
                "https://www2.gov.scot/Topics/Statistics/sns/SNSRef/DZresponseplan"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="link "
            >
              https://www2.gov.scot/Topics/Statistics/sns/SNSRef/DZresponseplan
            </a>
          </li>
          <li>
            Cardiovascular Prescriptions:{" "}
            <a
              href={"https://scotland.shinyapps.io/phs-covid-wider-impact/"}
              target="_blank"
              rel="noopener noreferrer"
              className="link "
            >
              https://scotland.shinyapps.io/phs-covid-wider-impact/
            </a>
          </li>
        </ul>
      </div>
    );
  }

  function pageAboutUs() {

    const teamMembers = [
      {
        "name": "Rhi Batstone",
        "linkedinRef": "https://www.linkedin.com/in/rhiannon-batstone-076191120"
      },
      {
        "name": "Ric Clark",
        "linkedinRef": "https://www.linkedin.com/in/richard--clark"
      },
      {
        "name": "Eirini Komninou",
        "linkedinRef": "https://www.linkedin.com/in/eirinikomninou"
      },
      {
        "name": "Adam Daniel Hidvegi",
        "linkedinRef": "https://www.linkedin.com/in/adam-daniel-hidvegi"
      },
      {
        "name": "Rob Armitage",
        "linkedinRef": "https://www.linkedin.com/in/rob-armitage"
      },
      {
        "name": "Becky Still",
        "linkedinRef": "https://www.linkedin.com/in/rebeccastill1"
      },
      {
        "name": "Bhagyashri Dhadage",
        "linkedinRef": "https://www.linkedin.com/in/bhagyashri-dhadage-1b1278b1"
      },
      {
        "name": "Andrew Rendle",
        "linkedinRef": "https://www.linkedin.com/in/andrew-rendle-578546"
      },
      {
        "name": "Donal Stewart",
        "linkedinRef": "https://www.linkedin.com/in/donalstewart"
      },
      {
        "name": "Allan Stevenson",
        "linkedinRef": "https://www.linkedin.com/in/alstev"
      },
      {
        "name": "Gabriela Satrovskaja",
        "linkedinRef": "https://www.linkedin.com/in/gabriela-satrovskaja"
      },
      {
        "name": "Euan Robertson",
        "linkedinRef": "https://www.linkedin.com/in/euan-robertson-5845582"
      },
      {
        "name": "Luke Pritchard-Woollett",
        "linkedinRef": "https://www.linkedin.com/in/lukepritchardwoollett"
      },
      {
        "name": "Cristina Perez",
        "linkedinRef": "https://www.linkedin.com/in/cristina-perez-11229846"
      },
      {
        "name": "Colin Lyman",
        "linkedinRef": "https://www.linkedin.com/in/colin-lyman"
      },
      {
        "name": "Jonathan Lau",
        "linkedinRef": "https://www.linkedin.com/in/jonathancylau"
      },
      {
        "name": "Craig Climie",
        "linkedinRef": "https://www.linkedin.com/in/craig-climie"
      }
    ];

    const sortedTeamMembers = teamMembers.sort((a, b) => a.name.localeCompare(b.name)).map((data, index) => {
      return(
        <li key={index}>
          <a
            href={data.linkedinRef}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            {data.name}
          </a>
        </li>
      )
    });

    return (
      <div fluid="true" className="about-us">
        <hr/>
        <h1>About us</h1>
        <p className="px-5">This dashboard has been developed by members of the Scottish Tech Army to improve awareness of the impacts of Covid-19.</p>
        <h2>The Scottish Tech Army</h2>
        <p className="px-5">Founded by Edinburgh based entrepreneurs, Alistair Forbes and Peter Jaco, the Scottish Tech Army Limited is a not for profit company that is building a volunteer Covid-19 technical response team that will work to help the Scottish Government, local authorities and other organisations across the country with rapid technical development projects to address current Covid-19 related challenges and post pandemic economic recovery. </p>
        <h2>Meet the team</h2>
        <p className="px-5">The Covid-19 dashboard for Scotland was created by the following STA volunteers: </p>
          <Container className="team-members">
            <Row>
              <Col>
                {sortedTeamMembers.slice(0, sortedTeamMembers.length/2+1)}
              </Col>
              <Col>
                {sortedTeamMembers.slice(sortedTeamMembers.length/2+1, sortedTeamMembers.length)}
              </Col>
            </Row>
          </Container>
        <hr/>
      </div>
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
      {currentPage === PAGE_PUBLIC_DASHBOARD ? pagePublicDashboard() : <></>}
      {currentPage === PAGE_ANALYTICS_DASHBOARD ? (
        pageAnalyticsDashboard()
      ) : (
        <></>
      )}
      {currentPage === PAGE_DATA_SOURCES ? pageDataSources() : <></>}
      {currentPage === PAGE_ABOUT_US ? pageAboutUs() : <></>}
      <Footer
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default App;

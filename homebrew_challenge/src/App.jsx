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
import TimeLine from "./components/TimeLine/TimeLine";
import DataChartsSelector from "./components/DataCharts/DataChartsSelector";
import DataCharts from "./components/DataCharts/DataCharts";
import InfoBar from "./components/InfoBar/InfoBar";
import RouteMapRules from "./components/RouteMapRules/RouteMapRules";

import { PERCENTAGE_CASES } from "./components/DataCharts/DataChartsConsts";
import {
  AREATYPE_HEALTH_BOARDS,
  VALUETYPE_DEATHS,
} from "./components/HeatmapDataSelector/HeatmapConsts";

const App = () => {
  const [areaType, setAreaType] = useState(AREATYPE_HEALTH_BOARDS);
  const [valueType, setValueType] = useState(VALUETYPE_DEATHS);
  const [chartType, setChartType] = useState(PERCENTAGE_CASES);
  const [zoomDataCharts, setZoomDataCharts] = useState(false);
  const [zoomGeoMap, setZoomGeoMap] = useState(false);

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
                Covid-19 Dashboard
              </h1>
            </Col>
          </Row>
          <Row className="pt-3 d-none d-sm-flex justify-content-center align-items-center">
            <Col>
              <InfoBar/>
            </Col>
          </Row>
          <Row className="pt-3 d-none d-sm-flex justify-content-center align-items-center">
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
        <Row className="widgets_block">
          <Col
            xs={12}
            md={8}
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
              <Col xs={zoomGeoMap ? 0 : 12} md={zoomGeoMap ? 0 : 6}>
                {zoomGeoMap ? (
                  <></>
                ) : (
                  <Heatmap areaType={areaType} valueType={valueType} />
                )}
              </Col>
              <Col className="d-block d-md-none">
                <hr className="underHeatmapSelector" />
              </Col>
              <Col xs={12} md={zoomGeoMap ? 12 : 6}>
                <GeoHeatMap
                  areaType={areaType}
                  valueType={valueType}
                  toggleFullscreen={() =>
                    toggleFullscreen(zoomableMap, setZoomGeoMap)
                  }
                  fullscreenEnabled={zoomGeoMap}
                />
              </Col>
            </Row>
            <Row>
              <Col className="d-block d-md-none">
                <hr className="underHeatmapSelector" />
              </Col>
            </Row>
          </Col>
          <Col
            xs={12}
            md={4}
            ref={zoomableCharts}
            className={zoomDataCharts ? "full-screen" : ""}
          >
            <Row>
              <Col>
                <DataChartsSelector
                  chartType={chartType}
                  setChartType={setChartType}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <hr className="underHeatmapSelector" />
              </Col>
            </Row>
            <Row>
              <Col>
                <DataCharts
                  chartType={chartType}
                  fullscreenEnabled={zoomDataCharts}
                  toggleFullscreen={() =>
                    toggleFullscreen(zoomableCharts, setZoomDataCharts)
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <hr className="underHeatmapSelector" />
              </Col>
            </Row>
            <Row>
              <Col>{zoomDataCharts ? <></> : <TimeLine />}</Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <hr className="full-width-hr" />
          </Col>
        </Row>
      </Container>

      <footer>
        <Container className="text-center font-small blue pt-4">
          <Row className="align-items-center">
            <Col xs={12} md={3}>
              Unless otherwise stated, this webpage contains public sector information licensed under
              <a
                href="http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                target="_blank"
                rel="noopener noreferrer licence"
                className=" scot-gov-link link"
              >
              the Open Government Licence 3.0.
              </a>
            </Col>
            <Col xs={12} md={3}>
              <a
                href="https://www.gov.scot/collections/coronavirus-covid-19-guidance/"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                <img
                  src="ScottishGovernmentLogo.svg"
                  alt="Scottish Government guidance"
                  width="270"
                  height="50"
                />
              </a>
            </Col>
            <Col xs={12} md={3}>
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
            <Col xs={12} md={3}>
              <a
                href="https://www.nhsinform.scot/illnesses-and-conditions/infections-and-poisoning/coronavirus-covid-19"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                <img
                  src="NHSInformLogo.png"
                  alt="NHS Inform"
                  width="180"
                  height="83"
                />
              </a>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="footer-copyright py-3">
                © 2020 Copyright:&nbsp;
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

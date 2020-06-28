import React, { useState, useRef } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
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
import Button from "react-bootstrap/Button";

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

  const zoomableCharts = useRef();

  function toggleFullscreen() {
    var elem = zoomableCharts.current || document.documentElement;
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
    }
  }

  return (
    <div className="App">
      <header>
        <Container fluid className="header">
          <Row id="page-title">
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
          <Row
            fluid
            className="pt-3 d-none d-sm-flex justify-content-center align-items-center info-bar"
          >
            <Col>
              <div className="info-bar">
                <span id="icon">
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    size="3x"
                    color="#319bd5"
                  />
                </span>
                <span id="message">
                  Provisional dates for the relaxation of travel restrictions,
                  restarting of the hospitality industry and reopening of
                  hairdressers are among further route map measures announced
                  today (Wednesday 24, June) by First Minister Nicola Sturgeon.
                  For more information visit
                  <a
                    className="route-map-link"
                    target="_blank"
                    href="https://www.gov.scot/news/further-route-map-detail-announced/"
                    rel="noopener noreferrer"
                  >
                    www.gov.scot/news/further-route-map-detail-announced
                  </a>
                  .
                </span>
              </div>
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
          <Col xs={12} md={8}>
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
              <Col xs={12} md={6}>
                <Heatmap areaType={areaType} valueType={valueType} />
              </Col>
              <Col xs={12} md={6}>
                <GeoHeatMap areaType={areaType} valueType={valueType} />
              </Col>
            </Row>
          </Col>
          <Col xs={12} md={4}>
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
                <DataCharts chartType={chartType} />
              </Col>
            </Row>
            <Row>
              <Col>
                <TimeLine />
              </Col>
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
          <Row>
            <Col>
              <a
                href="https://www.gov.scot/collections/coronavirus-covid-19-guidance/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Scottish Government guidance
              </a>
            </Col>
            <Col>
              <a
                href="https://www.nhsinform.scot/illnesses-and-conditions/infections-and-poisoning/coronavirus-covid-19"
                target="_blank"
                rel="noopener noreferrer"
              >
                NHS inform
              </a>
            </Col>
            <Col>
              <a
                href="https://www.scottishtecharmy.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="final_logo.PNG"
                  alt="Scottish Tech Army"
                  width="270"
                  height="50"
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

import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import PercentTestsChart from "./components/PercentTestsChart/PercentTestsChart";
import SingleValueBar from "./components/SingleValue/SingleValueBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import HeatmapDataSelector from "./components/HeatmapDataSelector/HeatmapDataSelector";
import Heatmap from "./components/HeatMap/Heatmap";
import GeoHeatMap from "./components/GeoHeatMap/GeoHeatMap";
import TotalCasesChart from './components/TotalCasesChart/TotalCasesChart';

import {
  AREATYPE_HEALTH_BOARDS,
  VALUETYPE_DEATHS,
} from "./components/HeatmapDataSelector/HeatmapConsts";

const App = () => {
  const [areaType, setAreaType] = useState(AREATYPE_HEALTH_BOARDS);
  const [valueType, setValueType] = useState(VALUETYPE_DEATHS);

  return (
    <div className="App">
      <Container fluid>
        <Row>
          <Col id="logo">
            <img id="logo" src="STALogo.png" alt="Scottish Tech Army Logo" />
          </Col>
          <Col className="text-center">
            <h1>Covid-19 Dashboard</h1>
          </Col>
        </Row>
      </Container>

      <Container
        fluid
        className="pt-3 d-none d-sm-flex justify-content-center align-items-center"
      >
        <span id="icon">
          <FontAwesomeIcon icon={faInfoCircle} size="3x" color="#319bd5" />
        </span>
        <span id="message">
          Provisional dates for the relaxation of travel restrictions,
          restarting of the hospitality industry and reopening of hairdressers
          are among further route map measures announced today (Wednesday 24,
          June) by First Minister Nicola Sturgeon. For more information visit
          <a href="https://www.gov.scot/news/further-route-map-detail-announced/">
            https://www.gov.scot/news/further-route-map-detail-announced/
          </a>
          .
        </span>
      </Container>

      <SingleValueBar />

      <Container fluid className="widgets_block">
        <Row>
          <Col xs={12} md={8}>
            <HeatmapDataSelector
              areaType={areaType}
              valueType={valueType}
              setAreaType={setAreaType}
              setValueType={setValueType}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={8}>
            <hr className="underHeatmapSelector" />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={4}>
            <Heatmap areaType={areaType} valueType={valueType} />
          </Col>
          <Col xs={12} md={4}>
            <GeoHeatMap areaType={areaType} valueType={valueType} />
          </Col>
          <Col xs={12} md={4}>
            <TotalCasesChart />
          </Col>
        </Row>
      </Container>

      <hr />

      <footer className="page-footer font-small blue pt-4">
        <Container fluid className="text-center text-md-left">
          <Row style={{ margin: "0 0 20px 20px" }}>
            <img src="final_logo.png" alt="" width="270" height="50" />
          </Row>

          <Row style={{ margin: "0 0 20px 20px" }}>
            <ul className="list-inline">
              <li className="list-inline-item" style={{ marginRight: "200px" }}>
                <a href="https://www.gov.scot/collections/coronavirus-covid-19-guidance/" target="_blank">
                  Scottish Government guidance
                </a>
              </li>
              <li className="list-inline-item" style={{ marginRight: "200px" }}>
                <a href="https://www.nhsinform.scot/illnesses-and-conditions/infections-and-poisoning/coronavirus-covid-19" target="_blank">
                  NHS inform
                </a>
              </li>
              <li className="list-inline-item" style={{ marginRight: "200px" }}>
                <a href="https://www.scottishtecharmy.org/" target="_blank">STA pages</a>
              </li>
            </ul>
          </Row>

          <div className="footer-copyright text-center py-3">
            © 2020 Copyright:
            <a href="https://www.scottishtecharmy.org/" target="_blank">ScottishTechArmy.org</a>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default App;

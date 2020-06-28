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
import FullScreen from "react-full-screen";
import { PERCENTAGE_CASES } from "./components/DataCharts/DataChartsConsts";
import {
  AREATYPE_HEALTH_BOARDS,
  VALUETYPE_DEATHS,
} from "./components/HeatmapDataSelector/HeatmapConsts";

const App0 = () => {

  const fullScreenRef = useRef(null);
  const [fullScreenMode, setfullScreenMode]= useState(false);

  const fullScreenToggler = () => {
    setfullScreenMode(!fullScreenMode);
  }

  return (
    <div className="App">

    <FullScreen enabled={fullScreenMode}>
      <div className="main-page" >
      Go Full Screen
        <button onClick={fullScreenToggler}>
           FullScreen Mode
        </button>
      </div>
    </FullScreen>

      <hr />

      <footer className="page-footer font-small blue pt-4">
        <Container fluid className="text-center text-md-left">
          <Row style={{ margin: "0 0 20px 20px" }}>
            <img src="final_logo.png" alt="" width="270" height="50" />
          </Row>

          <Row style={{ margin: "0 0 20px 20px" }}>
            <ul className="list-inline">
              <li className="list-inline-item" style={{ marginRight: "200px" }}>
                <a
                  href="https://www.gov.scot/collections/coronavirus-covid-19-guidance/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Scottish Government guidance
                </a>
              </li>
              <li className="list-inline-item" style={{ marginRight: "200px" }}>
                <a
                  href="https://www.nhsinform.scot/illnesses-and-conditions/infections-and-poisoning/coronavirus-covid-19"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NHS inform
                </a>
              </li>
              <li className="list-inline-item" style={{ marginRight: "200px" }}>
                <a
                  href="https://www.scottishtecharmy.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  STA pages
                </a>
              </li>
            </ul>
          </Row>

          <div className="footer-copyright text-center py-3">
            © 2020 Copyright:
            <a
              href="https://www.scottishtecharmy.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              ScottishTechArmy.org
            </a>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default App0;

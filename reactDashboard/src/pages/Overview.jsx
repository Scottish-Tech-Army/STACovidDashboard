import React, { useState, useRef, useEffect } from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SingleValueBar from "../components/SingleValue/SingleValueBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import HeatmapDataSelector from "../components/HeatmapDataSelector/HeatmapDataSelector";
import Heatmap from "../components/HeatMap/Heatmap";
import GeoHeatMap from "../components/GeoHeatMap/GeoHeatMap";
import DataCharts from "../components/DataCharts/DataCharts";
import InfoBar from "../components/InfoBar/InfoBar";
import Facts from "../components/Facts/Facts";
import RouteMapRules from "../components/RouteMapRules/RouteMapRules";
import {
  AREATYPE_HEALTH_BOARDS,
  VALUETYPE_CASES,
} from "../components/HeatmapDataSelector/HeatmapConsts";

const Overview = ({
  councilAreaDataset,
  healthBoardDataset,
  currentTotalsHealthBoardDataset,
}) => {
  const [areaType, setAreaType] = useState(AREATYPE_HEALTH_BOARDS);
  const [valueType, setValueType] = useState(VALUETYPE_CASES);
  const [zoomGeoMap, setZoomGeoMap] = useState(false);

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
    <>
      <Container fluid>
        <Row className="justify-content-center align-items-center route-map-rules">
          <Col>
            <RouteMapRules />
          </Col>
        </Row>
      </Container>
      <Container fluid>
        <Row>
          <Col>
            <hr className="full-width-hr" />
          </Col>
        </Row>
        <Row>
          <Col>
            <SingleValueBar
              currentTotalsHealthBoardDataset={currentTotalsHealthBoardDataset}
            />
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
              <Col xs={12} lg={zoomGeoMap ? 12 : 4}>
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
              <Col className="d-block d-lg-none">
                <hr className="underHeatmapSelector" />
              </Col>
              <Col
                xs={zoomGeoMap ? 0 : 12}
                lg={zoomGeoMap ? 0 : 8}
                className="heatmap-container"
              >
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
        <Row className="data-charts-container">
          <Col xs={12}>
            <DataCharts healthBoardDataset={healthBoardDataset} />
          </Col>
        </Row>
        <Row>
          <Col>
            <hr className="full-width-hr" />
          </Col>
        </Row>
        <Row className="d-none d-sm-flex justify-content-center align-items-center">
          <Col>
            <Facts />
          </Col>
        </Row>
        <Row className="d-none d-sm-flex">
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
        <Row className="d-none d-sm-flex">
          <Col className="footnote-container">
            <h6>Understanding the dates:</h6>
            <p>
              There may be some minor fluctuations in the daily number of cases
              due to laboratory reporting delays for specimen dates and
              additional information becoming available, in which case the data
              is revised in a future next update.{" "}
              <a
                href="https://www.opendata.nhs.scot/dataset/covid-19-in-scotland"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                Click here for further information relating to the accuracy and
                completeness of the Public Health Scotland Covid-19 dataset.
              </a>
            </p>
            <ul>
              <li>
                Reported Dates: Since the time taken to test samples and report
                the results varies, new cases reported on a daily basis in the
                headline summary figures above may be distributed across a range
                of Specimen Dates.
              </li>
              <li>
                Specimen Dates: The specimen date is the date the sample was
                collected from the patient. The specimen date is used in the
                map, heatmap table and chart components within the STA Summary
                Dashboard Page to show the number of test samples taken and %
                positive samples for each day. This is the date most suited for
                surveillance to show trends of COVID-19 over a period of time.
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Overview;

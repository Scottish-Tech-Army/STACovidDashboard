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
import Facts from "../components/Facts/Facts";
import DataDefinitions from "../components/DataDefinitions/DataDefinitions";
import RouteMapRules from "../components/RouteMapRules/RouteMapRules";
import {
  AREATYPE_HEALTH_BOARDS,
  VALUETYPE_CASES,
} from "../components/HeatmapDataSelector/HeatmapConsts";

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

const Overview = ({ allData, darkmode }) => {
  const [areaType, setAreaType] = useState(AREATYPE_HEALTH_BOARDS);
  const [valueType, setValueType] = useState(VALUETYPE_CASES);
  const [zoomGeoMap, setZoomGeoMap] = useState(false);

  const zoomableMap = useRef();

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
            <SingleValueBar allData={allData} />
          </Col>
        </Row>
        <Row>
          <Col>
            <hr className="full-width-hr" />
          </Col>
        </Row>
        <Row>
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
            <Row className="heatmaps-row">
              <Col className="geo-map-column" xs={12} lg={zoomGeoMap ? 12 : 4}>
                <GeoHeatMap
                  allData={allData}
                  areaType={areaType}
                  valueType={valueType}
                  toggleFullscreen={() =>
                    toggleFullscreen(zoomableMap, setZoomGeoMap)
                  }
                  fullscreenEnabled={zoomGeoMap}
                  darkmode={darkmode}
                />
              </Col>
              <Col className="responsive-divider">
                <hr className="full-width-hr" />
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
                    allData={allData}
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
            <DataCharts allData={allData} darkmode={darkmode} />
          </Col>
        </Row>
        <Row>
          <Col>
            <hr className="full-width-hr" />
            <DataDefinitions />
            <hr className="full-width-hr d-none d-sm-flex" />
          </Col>
        </Row>
        <Row className="d-none d-sm-flex justify-content-center align-items-center">
          <Col>
            <Facts />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Overview;

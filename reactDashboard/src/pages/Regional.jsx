import React, { useEffect } from "react";
import "../App.css";
import RegionSingleValueBar from "../components/SingleValue/RegionSingleValueBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RegionGeoMap from "../components/GeoHeatMap/RegionGeoMap";
import DataCharts from "../components/DataCharts/DataCharts";
import DataDefinitions from "../components/DataDefinitions/DataDefinitions";
import RegionDropdown from "../components/RegionDropdown/RegionDropdown";
import {
  FEATURE_CODE_SCOTLAND,
  FEATURE_CODE_MAP,
  getPlaceNameByFeatureCode,
} from "../components/Utils/CsvUtils";
import { stopAudio } from "../components/Utils/Sonification";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import RouteMapRules from "../components/RouteMapRules/RouteMapRules";
import { URL_REGIONAL } from "./PageConsts";

// Exported for unit tests
export function getCheckedRegionCode(
  initialRegionCode = FEATURE_CODE_SCOTLAND
) {
  return FEATURE_CODE_MAP.hasOwnProperty(initialRegionCode)
    ? initialRegionCode
    : FEATURE_CODE_SCOTLAND;
}

// Exported for unit tests
export function getCanonicalUrl(regionCode) {
  return (
    URL_REGIONAL +
    (regionCode === FEATURE_CODE_SCOTLAND ? "" : "/" + regionCode)
  );
}

const Regional = ({ allData, darkmode }) => {
  const location = useLocation();
  const urlParams = useParams();
  const navigate = useNavigate();

  const regionCode = getCheckedRegionCode(urlParams.regionCode);

  // Change URL if regionCode changes
  const setRegionCode = (newRegionCode) => navigate(getCanonicalUrl(newRegionCode));

  // Redirect if on unrecognised URL
  useEffect(() => {
    const newUrl = getCanonicalUrl(regionCode);
    if (location.pathname !== newUrl) {
      navigate(newUrl);
    }
  }, [regionCode, navigate, urlParams]);

  // Stop audio on chart, region or location change
  useEffect(() => {
    stopAudio();
  }, [regionCode, location]);

  const placeName = getPlaceNameByFeatureCode(regionCode);

  return (
    <>
      <Container fluid>
        <Row className="justify-content-center align-items-center route-map-rules">
          <Col>
            <RouteMapRules />
          </Col>
        </Row>
      </Container>
      <Container fluid className="regional-page">
        <Row>
          <Col>
            <hr aria-hidden={true} className="full-width-hr" />
          </Col>
        </Row>
        <Row className="region-page-top-row">
          <Col aria-hidden={true} className="geo-map-column" xs={12} lg={4}>
            <RegionGeoMap
              regionCode={regionCode}
              setRegionCode={setRegionCode}
              darkmode={darkmode}
            />
          </Col>
          <Col className="region-tiles-column" xs={12} lg={8}>
            <hr aria-hidden={true} className="full-width-hr" />
            <h2 className="visually-hidden">Select region</h2>
            <RegionDropdown
              regionCode={regionCode}
              setRegionCode={setRegionCode}
            />
            <hr aria-hidden={true} className="full-width-hr" />
            <h2 className="visually-hidden">{`Headline statistics for ${placeName}`}</h2>
            <RegionSingleValueBar regionCode={regionCode} allData={allData} />
          </Col>
        </Row>
        <Row>
          <Col>
            <hr aria-hidden={true} className="full-width-hr" />
          </Col>
        </Row>
        <Row className="data-charts-container">
          <Col xs={12}>
            <h2 className="visually-hidden">
              {`Time series statistics for ${placeName}`}
            </h2>
            <DataCharts
              regionCode={regionCode}
              allData={allData}
              darkmode={darkmode}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <hr aria-hidden={true} className="full-width-hr" />
            <DataDefinitions />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Regional;

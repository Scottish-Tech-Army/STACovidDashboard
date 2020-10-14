import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import RegionSingleValueBar from "../components/SingleValue/RegionSingleValueBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RegionGeoMap from "../components/GeoHeatMap/RegionGeoMap";
import RegionDataCharts from "../components/DataCharts/RegionDataCharts";
import RegionDropdown from "../components/RegionDropdown/RegionDropdown";
import {
  FEATURE_CODE_SCOTLAND,
  FEATURE_CODE_MAP,
} from "../components/Utils/CsvUtils";
import { stopAudio } from "../components/Utils/Sonification";
import { useLocation, useHistory, useRouteMatch } from "react-router-dom";

// Exported for unit tests
export function getRegionCodeFromUrl(location) {
  const initialRegionCode = location.pathname.split("/").pop();
  if (FEATURE_CODE_MAP[initialRegionCode] !== undefined) {
    return initialRegionCode;
  }
  return FEATURE_CODE_SCOTLAND;
}

// Exported for unit tests
export function getCanonicalUrl(baseUrl, regionCode) {
  return (
    baseUrl + (regionCode === FEATURE_CODE_SCOTLAND ? "" : "/" + regionCode)
  );
}

const Regional = ({
  councilAreaDataset,
  healthBoardDataset,
  currentTotalsHealthBoardDataset,
  currentTotalsCouncilAreaDataset,
}) => {
  const match = useRouteMatch();
  const location = useLocation();
  const [regionCode, setRegionCode] = useState(getRegionCodeFromUrl(location));
  const history = useHistory();

  const currentRegionCode = useRef(regionCode);
  const currentLocation = useRef(match.url);

  // These two effects handle the browser url and the region code selection in sync.
  // Either location or regionCode may be changed by user action, so the currentRegionCode
  // and currentLocation refs are used to distinguish a change by user action, or internally
  // here to keep the location and regionCode in sync.
  //
  // It is complicated by handling the canonicalisation of URLs
  // eg .../regional/unknown is redirected to .../regional

  useEffect(() => {
    if (currentRegionCode.current !== regionCode) {
      currentRegionCode.current = regionCode;
      // Region code has changed: update URL
      const newUrl = getCanonicalUrl(match.url, regionCode);
      if (currentLocation.current !== newUrl) {
        currentLocation.current = newUrl;
        history.push(newUrl);
      }
    }
  }, [regionCode, history, match]);

  useEffect(() => {
    function setCanonicalLocation(newRegionCode) {
      currentLocation.current = getCanonicalUrl(match.url, newRegionCode);
      if (location.pathname !== currentLocation.current) {
        history.push(currentLocation.current);
      }
    }

    if (currentLocation.current !== location.pathname) {
      // URL has changed: update regionCode
      currentRegionCode.current = getRegionCodeFromUrl(location);
      setRegionCode(currentRegionCode.current);
      setCanonicalLocation(currentRegionCode.current);
    }
  }, [location, history, match]);

  // Stop audio on chart, region or location change
  useEffect(() => {
    stopAudio();
  }, [regionCode, location]);

  return (
    <Container fluid className="regional-page">
      <Row className="d-none d-lg-block">
        <Col>
          <hr className="full-width-hr" />
        </Col>
      </Row>
      <Row>
        <Col xs={12} lg={4}>
          <RegionGeoMap
            councilAreaDataset={councilAreaDataset}
            healthBoardDataset={healthBoardDataset}
            regionCode={regionCode}
            setRegionCode={setRegionCode}
          />
        </Col>
        <Col xs={12} lg={8}>
          <hr className="d-flex d-md-none full-width-hr" />
          <strong>Select region (or select on map):</strong>

          <RegionDropdown
            regionCode={regionCode}
            setRegionCode={setRegionCode}
          />
          <hr className="full-width-hr" />
          <RegionSingleValueBar
            regionCode={regionCode}
            councilAreaDataset={councilAreaDataset}
            healthBoardDataset={healthBoardDataset}
            currentTotalsHealthBoardDataset={currentTotalsHealthBoardDataset}
            currentTotalsCouncilAreaDataset={currentTotalsCouncilAreaDataset}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <hr className="full-width-hr" />
        </Col>
      </Row>
      <Row className="data-charts-container">
        <Col xs={12}>
          <RegionDataCharts
            regionCode={regionCode}
            councilAreaDataset={councilAreaDataset}
            healthBoardDataset={healthBoardDataset}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Regional;

import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import RegionSingleValueBar from "../components/SingleValue/RegionSingleValueBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RegionGeoMap from "../components/GeoHeatMap/RegionGeoMap";
import DataCharts from "../components/DataCharts/DataCharts";
import RegionDropdown from "../components/RegionDropdown/RegionDropdown";
import {
  FEATURE_CODE_SCOTLAND,
  FEATURE_CODE_MAP,
} from "../components/Utils/CsvUtils";
import { stopAudio } from "../components/Utils/Sonification";
import { useLocation, useHistory, useRouteMatch } from "react-router-dom";
import RouteMapRules from "../components/RouteMapRules/RouteMapRules";

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
    <>
      <Container fluid>
        <Row className="justify-content-center align-items-center route-map-rules">
          <Col>
            <RouteMapRules />
          </Col>
        </Row>
      </Container>
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
          <DataCharts
            regionCode={regionCode}
            councilAreaDataset={councilAreaDataset}
            healthBoardDataset={healthBoardDataset}
            showPercentageTests={false}
          />
        </Col>
      </Row>
      <Row className="d-none d-sm-flex">
        <Col>
          <hr className="full-width-hr" />
        </Col>
      </Row>
      <Row className="d-none d-sm-flex">
        <Col className="footnote-container">
        <h6 className="footnote-heading">Understanding the dates:</h6>
        <p>

            There may be some minor fluctuations in the daily number of
            cases due to laboratory reporting delays for specimen dates
            and additional information becoming available, in which case
            the data is revised in a future next update.{" "}
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

                <span className="defined-term">Reported Dates</span>: Since the time taken to test samples and report
                the results varies, new cases reported on a daily basis in the
                headline summary figures above may be distributed across a
                range of Specimen Dates.

            </li>
            <li>

                <span className="defined-term">Specimen Dates</span>: The specimen date is the date the sample was
                collected from the patient. The specimen date is used in the
                chart component within the STA Regional Insights
                Dashboard Page to show the number of test samples taken. This is the date most suited
                for surveillance to show trends of COVID-19 over a period of
                time.

            </li>
          </ul>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default Regional;

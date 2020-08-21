import React from "react";
import "./RouteMapRules.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const RouteMapRules = () => {
  return (
    <Container fluid className="route-map-rules">
      <Row>
        <Col xs="12" className="current-phase mb-2">
          <h3>
            We are currently in <span className="current-phase-number">Phase 3</span> of the Scottish Government's <a className="routemap-link" href="https://www.gov.scot/coronavirus-covid-19/" target="_blank">COVID-19 Routemap</a>.
          </h3>
        </Col>
      </Row>
    </Container>
  );
};

export default RouteMapRules;

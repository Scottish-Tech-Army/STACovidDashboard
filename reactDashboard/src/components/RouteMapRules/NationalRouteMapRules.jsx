import React from "react";
import "./RouteMapRules.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const NationalRouteMapRules = () => {
  return (
    <Container fluid className="d-flex flex-column">
      <Row>
        <Col xs="12" className="current-phase">
          <h2>
            We are currently in {" "}
            <span className="current-phase-number">Phase 3</span> of the
            Scottish Government's{" "}
            <a
              className="link"
              id="link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.gov.scot/coronavirus-covid-19/"
            >
              COVID-19 Route Map
            </a>
            .
          </h2>
        </Col>
      </Row>
    </Container>
  );
};

export default NationalRouteMapRules;

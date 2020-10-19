import React from "react";
import "./RouteMapRules.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const RegionalRouteMapRules = () => {
  return (
    <Container fluid className="d-flex flex-column">
      <Row>
        <Col xs="12" className="current-phase">
          <h2>
            There are a number of Regional restrictions to help fight the
            pandemic. See the{" "}
            <a
              className="link"
              id="link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.gov.scot/publications/coronavirus-covid-19-local-measures/"
            >
              latest Scottish Government guidance
            </a>
            .
          </h2>
        </Col>
      </Row>
    </Container>
  );
};

export default RegionalRouteMapRules;

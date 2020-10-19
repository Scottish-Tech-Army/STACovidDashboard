import React from "react";
import "./RouteMapRules.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const RouteMapRules = ({ bannerPt1, bannerPt2, bannerPt3, bannerPt4, url }) => {
  return (
    <Container fluid className="d-flex flex-column">
      <Row>
        <Col xs="12" className="current-phase">
          <h2>
            {bannerPt1}
            <span className="current-phase-number">{bannerPt2}</span>{" "}
            {bannerPt3}
            <a
              className="link"
              id="link"
              target="_blank"
              rel="noopener noreferrer"
              href={url}
            >
              {bannerPt4}
            </a>
            .
          </h2>
        </Col>
      </Row>
    </Container>
  );
};

export default RouteMapRules;

import React from "react";
import "./RouteMapRules.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ToolTip from "../ToolTips/ToolTip";

const RouteMapRules = () => {
  return (
    <Container fluid className="route-map-rules">
      <Row>
        <Col xs="12" className="current-phase mb-2">
          <ToolTip tooltip="The description of the phases is summary rather than comprehensive: it will not include every aspect of the restrictions that is of concern." />
          <h3>
            We are currently in Phase 3 of the Scottish Government's COVID-19
            Routemap.
          </h3>
        </Col>
      </Row>
    </Container>
  );
};

export default RouteMapRules;

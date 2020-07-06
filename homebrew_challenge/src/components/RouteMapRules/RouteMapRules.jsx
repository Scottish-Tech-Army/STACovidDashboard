import React from 'react';
import './RouteMapRules.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const RouteMapRules = () => {
  return (
    <Container fluid className="route-map-rules">
    <Row>
      <Col md="2">
        <Row>Lockdown</Row>
        <Row>Phase 1</Row>
        <Row>Phase 2</Row>
        <Row>Phase 3</Row>
        <Row>Phase 4</Row>
      </Col>
      <Col>
        <Row md="10">
          <Col>protections in place</Col>
          <Col>working or running a business</Col>
          <Col>seeing family and friends</Col>
          <Col>shopping, drinking and eating out</Col>
        </Row>
      </Col>
    </Row>
    </Container>
  );
};

export default RouteMapRules;

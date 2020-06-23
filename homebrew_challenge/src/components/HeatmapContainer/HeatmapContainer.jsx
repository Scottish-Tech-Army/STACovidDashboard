import Heatmap from "../HeatMap/Heatmap";
import React, { useState } from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GeoHeatMap from "../GeoHeatMap/GeoHeatMap";

import {
  AREATYPE_COUNCIL_AREAS,
  AREATYPE_HEALTH_BOARDS,
  VALUETYPE_CASES,
  VALUETYPE_DEATHS,
} from "./HeatmapConsts";

function HeatmapContainer() {
  const [areaType, setAreaType] = useState(AREATYPE_HEALTH_BOARDS);
  const [valueType, setValueType] = useState(VALUETYPE_DEATHS);

  return (
      <Container fluid>
      <Row>
        <Col><ToggleButtonGroup
          name="areaType"
          type="radio"
          value={areaType}
          onChange={(val) => setAreaType(val)}
        >
          <ToggleButton value={AREATYPE_COUNCIL_AREAS}>
            Council areas
          </ToggleButton>
          <ToggleButton value={AREATYPE_HEALTH_BOARDS}>
            Health boards
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          name="valueType"
          type="radio"
          value={valueType}
          onChange={(val) => setValueType(val)}
        >
          <ToggleButton value={VALUETYPE_CASES}>Cases</ToggleButton>
          <ToggleButton value={VALUETYPE_DEATHS}>Deaths</ToggleButton>
        </ToggleButtonGroup></Col>
      </Row>
      <Row>
      <Col xs={6} md={4}><Heatmap areaType={areaType} valueType={valueType} /></Col>
      <Col xs={12} md={8}><GeoHeatMap areaType={areaType} valueType={valueType} /></Col>
      </Row>
</Container>
  );
}

export default HeatmapContainer;

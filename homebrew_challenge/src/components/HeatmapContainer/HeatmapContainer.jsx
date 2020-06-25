import Heatmap from "../HeatMap/Heatmap";
import React, { useState } from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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

  // Council areas with cases is a disallowed combination
  const casesText =
    "Cases" +
    (AREATYPE_COUNCIL_AREAS === areaType ? " [Data not available]" : "");
  const councilAreasText =
    "Council areas" +
    (VALUETYPE_CASES === valueType ? " [Data not available]" : "");

  return (
    <Container fluid id="datasetSelectionButtons">
      <Row>
        <Col>
          <ToggleButtonGroup
            name="areaType"
            type="radio"
            value={areaType}
            onChange={(val) => setAreaType(val)}
          >
            <ToggleButton id="healthBoards" value={AREATYPE_HEALTH_BOARDS}>
              Health boards
            </ToggleButton>
            <ToggleButton
              id="councilAreas"
              value={AREATYPE_COUNCIL_AREAS}
              disabled={VALUETYPE_CASES === valueType}
            >
              {councilAreasText}
            </ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            name="valueType"
            type="radio"
            value={valueType}
            onChange={(val) => setValueType(val)}
          >
            <ToggleButton id="deaths" value={VALUETYPE_DEATHS}>
              Deaths
            </ToggleButton>
            <ToggleButton
              id="cases"
              value={VALUETYPE_CASES}
              disabled={AREATYPE_COUNCIL_AREAS === areaType}
            >
              {casesText}
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
      </Row>
      <Row>
    {/*  <div class="col">widget 1</div>
      <div class="col">widget 2</div> */}
        <Col xs={6} md={4}>
          <Heatmap areaType={areaType} valueType={valueType} />
        </Col>
        <Col xs={12} md={8}>
          <GeoHeatMap areaType={areaType} valueType={valueType} />
        </Col>
      </Row>
    </Container>
  );
}

export default HeatmapContainer;

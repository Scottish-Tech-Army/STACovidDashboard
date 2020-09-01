import React from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./HeatmapDataSelector.css";
import "../../common.css";

import {
  AREATYPE_COUNCIL_AREAS,
  AREATYPE_HEALTH_BOARDS,
  VALUETYPE_CASES,
  VALUETYPE_DEATHS,
} from "./HeatmapConsts";

function HeatmapDataSelector({
  areaType,
  setAreaType,
  valueType,
  setValueType,
}) {
  if (
    areaType !== AREATYPE_COUNCIL_AREAS &&
    areaType !== AREATYPE_HEALTH_BOARDS
  ) {
    throw new Error("Unrecognised areaType: " + areaType);
  }
  if (valueType !== VALUETYPE_CASES && valueType !== VALUETYPE_DEATHS) {
    throw new Error("Unrecognised valueType: " + valueType);
  }
  if (setAreaType === null || setAreaType === undefined) {
    throw new Error("Unrecognised setAreaType: " + setAreaType);
  }
  if (setValueType === null || setValueType === undefined) {
    throw new Error("Unrecognised setValueType: " + setValueType);
  }

  return (
    <Container className="heatmap-selector">
      <Row className="selector-container">
        <Col className="selector-group" xs={12} md={6}>
          <ToggleButtonGroup
            className="toggle-button-group"
            name="areaType"
            type="radio"
            value={areaType}
            onChange={(val) => setAreaType(val)}
          >
            <ToggleButton id="healthBoards" value={AREATYPE_HEALTH_BOARDS}>
              Health Boards
            </ToggleButton>
            <ToggleButton id="councilAreas" value={AREATYPE_COUNCIL_AREAS}>
              Council Areas
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
        <Col className="selector-group" xs={12} md={6}>
          <ToggleButtonGroup
            className="toggle-button-group"
            name="valueType"
            type="radio"
            value={valueType}
            onChange={(val) => setValueType(val)}
          >
            <ToggleButton id="cases" value={VALUETYPE_CASES}>
              Cases
            </ToggleButton>
            <ToggleButton id="deaths" value={VALUETYPE_DEATHS}>
              Deaths
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default HeatmapDataSelector;

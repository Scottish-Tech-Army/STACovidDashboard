import React from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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

  // Council areas with cases is a disallowed combination
  if (areaType === AREATYPE_COUNCIL_AREAS && valueType === VALUETYPE_CASES) {
    throw new Error("Invalid combination: " + areaType + " and " + valueType);
  }

  const casesText =
    "Cases" +
    (AREATYPE_COUNCIL_AREAS === areaType ? " [Data not available]" : "");
  const councilAreasText =
    "Council areas" +
    (VALUETYPE_CASES === valueType ? " [Data not available]" : "");

  return (
    <Container fluid className="justify-content-between align-items-center">
<Row className="justify-content-between align-items-stretch">
      <Col>
        <span class="align-middle">
          <strong>View data by</strong>
        </span>
      </Col>
      <Col className="h-100">
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
      </Col>
      <Col className="h-100 align-self-stretch">
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
    </Container>
  );
}

export default HeatmapDataSelector;

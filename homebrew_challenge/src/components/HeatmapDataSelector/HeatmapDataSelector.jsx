import React from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./HeatmapDataSelector.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearchPlus } from "@fortawesome/free-solid-svg-icons";
import { faSearchMinus } from "@fortawesome/free-solid-svg-icons";

import {
  AREATYPE_COUNCIL_AREAS,
  AREATYPE_HEALTH_BOARDS,
  VALUETYPE_CASES,
  VALUETYPE_DEATHS
} from "./HeatmapConsts";

function HeatmapDataSelector({
  areaType,
  setAreaType,
  valueType,
  setValueType,
  toggleFullScreen,
  fullScreenModeMap
}) {
  console.log(toggleFullScreen)
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
    "Total Cases" +
    (AREATYPE_COUNCIL_AREAS === areaType ? " [Data not available]" : "");
  const councilAreasText =
    "Council Areas" +
    (VALUETYPE_CASES === valueType ? " [Data not available]" : "");

  return (
    <Container fluid>
      <Row>
        <Col>
          <span className="align-middle">
            <strong>View data by:</strong>
          </span>

          <ToggleButtonGroup
            className="toggle-button-group"
            name="areaType"
            type="radio"
            value={areaType}
            onChange={val => setAreaType(val)}
          >
            <ToggleButton id="healthBoards" value={AREATYPE_HEALTH_BOARDS}>
              Health Boards
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
            className="toggle-button-group"
            name="valueType"
            type="radio"
            value={valueType}
            onChange={val => setValueType(val)}
          >
            <ToggleButton id="deaths" value={VALUETYPE_DEATHS}>
              Total Deaths
            </ToggleButton>
            <ToggleButton
              id="cases"
              value={VALUETYPE_CASES}
              disabled={AREATYPE_COUNCIL_AREAS === areaType}
            >
              {casesText}
            </ToggleButton>
          </ToggleButtonGroup>
          <span id="icon">
            <FontAwesomeIcon
              icon={!fullScreenModeMap? faSearchPlus : faSearchMinus}
              size="2x"
              color="#319bd5"
              onClick = {() => toggleFullScreen()}/>
          </span>
        </Col>
      </Row>
    </Container>
  );
}

export default HeatmapDataSelector;

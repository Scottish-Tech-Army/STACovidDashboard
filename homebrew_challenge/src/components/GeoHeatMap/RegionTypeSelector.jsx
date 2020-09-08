import React from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import "../../common.css";
import {
  AREATYPE_COUNCIL_AREAS,
  AREATYPE_HEALTH_BOARDS,
} from "../HeatmapDataSelector/HeatmapConsts";

function RegionTypeSelector({ areaType, setAreaType }) {
  if (
    areaType !== AREATYPE_COUNCIL_AREAS &&
    areaType !== AREATYPE_HEALTH_BOARDS
  ) {
    throw new Error("Unrecognised areaType: " + areaType);
  }
  if (setAreaType === null || setAreaType === undefined) {
    throw new Error("Unrecognised setAreaType: " + setAreaType);
  }
  return (
    <fieldset>
      <legend>Select Boundaries:</legend>
    <ToggleButtonGroup
      className="toggle-button-group"
      name="areaType"
      type="radio"
      value={areaType}
      vertical
      onChange={setAreaType}
    >
      <ToggleButton id="healthBoards" value={AREATYPE_HEALTH_BOARDS}>
        Health Boards
      </ToggleButton>
      <ToggleButton id="councilAreas" value={AREATYPE_COUNCIL_AREAS}>
        Council Areas
      </ToggleButton>
    </ToggleButtonGroup>
    </fieldset>
  );
}

export default RegionTypeSelector;

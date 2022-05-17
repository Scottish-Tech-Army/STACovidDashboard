import React from "react";
import "./RegionDropdown.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "react-bootstrap/Dropdown";
import {
  FEATURE_CODE_SCOTLAND,
  FEATURE_CODE_HEALTH_BOARDS,
  FEATURE_CODE_COUNCIL_AREAS,
  getPlaceNameByFeatureCode,
} from "../Utils/CsvUtils";
import "../../common.css";

const RegionDropdown = ({
  regionCode = FEATURE_CODE_SCOTLAND,
  setRegionCode,
}) => {
  function isValidRegionCode() {
    return (
      regionCode !== null &&
      (FEATURE_CODE_SCOTLAND === regionCode ||
        FEATURE_CODE_HEALTH_BOARDS.includes(regionCode) ||
        FEATURE_CODE_COUNCIL_AREAS.includes(regionCode))
    );
  }

  if (!isValidRegionCode()) {
    throw new Error("Unrecognised regionCode: " + regionCode);
  }
  if (setRegionCode === null || setRegionCode === undefined) {
    throw new Error("Unrecognised setRegionCode: " + setRegionCode);
  }

  return (
    <div className="region-selector-row">
      <strong aria-hidden={true} className="region-selector-label">
        Select region (or select on map):
      </strong>
      <Dropdown onSelect={(eventKey) => setRegionCode(eventKey)}>
        <Dropdown.Toggle variant="primary" className="selected-region">
          {regionCode == null
            ? "Select a region"
            : getPlaceNameByFeatureCode(regionCode)}
        </Dropdown.Toggle>
        <Dropdown.Menu className="region-menu">
          <Dropdown.Item
            key={FEATURE_CODE_SCOTLAND}
            eventKey={FEATURE_CODE_SCOTLAND}
          >
            {getPlaceNameByFeatureCode(FEATURE_CODE_SCOTLAND)}
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Header>Health Boards</Dropdown.Header>
          {FEATURE_CODE_HEALTH_BOARDS.map((featureCode) => (
            <Dropdown.Item key={featureCode} eventKey={featureCode}>
              {getPlaceNameByFeatureCode(featureCode)}
            </Dropdown.Item>
          ))}
          <Dropdown.Divider />
          <Dropdown.Header>Council Areas</Dropdown.Header>
          {FEATURE_CODE_COUNCIL_AREAS.map((featureCode) => (
            <Dropdown.Item key={featureCode} eventKey={featureCode}>
              {getPlaceNameByFeatureCode(featureCode)}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default RegionDropdown;

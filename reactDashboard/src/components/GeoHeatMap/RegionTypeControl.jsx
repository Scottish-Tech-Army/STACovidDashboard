import React from "react";
import "../../common.css";
import {
  AREATYPE_COUNCIL_AREAS,
  AREATYPE_HEALTH_BOARDS,
} from "../HeatmapDataSelector/HeatmapConsts";
import { createControlComponent } from "@react-leaflet/core";
import L, { DomUtil, DomEvent } from "leaflet";
import "./GeoHeatMap.css";

function domCreateWithAttributes(tagName, className, container, attributes) {
  let element = DomUtil.create(tagName, className, container);
  if (attributes) {
    Object.keys(attributes).forEach((key) =>
      element.setAttribute(key, attributes[key])
    );
  }
  return element;
}

// Brittle implementation as it is difficult to get the React and Leaflet DOMs to play nice together
// as of react-leaflet v4. The implementation in react-leaflet-control no longer works. This 
// implementation depends on a change to areatype causing a recreation of the region type control
// with the correct button selected.

export function RegionTypeControl({ areaType, setAreaType, ...props }) {
  function createRegionTypeSelector() {
    const regionTypeControl = L.control(props);

    regionTypeControl.onAdd = function () {
      const outerDiv = DomUtil.create("div");
      DomEvent.disableClickPropagation(outerDiv);

      const fieldset = domCreateWithAttributes("fieldset", undefined, outerDiv);
      const legend = domCreateWithAttributes(
        "legend",
        "boundaries-legend",
        fieldset
      );
      const groupDiv = domCreateWithAttributes(
        "div",
        "toggle-button-group btn-group-vertical",
        fieldset,
        { role: "group" }
      );
      const hbInput = domCreateWithAttributes("input", "btn-check", groupDiv, {
        name: "areaType",
        type: "radio",
        autocomplete: "off",
        id: "healthBoards",
        value: AREATYPE_HEALTH_BOARDS,
      });
      const hbLabel = domCreateWithAttributes(
        "label",
        "btn btn-primary",
        groupDiv,
        { tabindex: "0", for: "healthBoards" }
      );
      const caInput = domCreateWithAttributes("input", "btn-check", groupDiv, {
        name: "areaType",
        type: "radio",
        autocomplete: "off",
        id: "councilAreas",
        value: AREATYPE_COUNCIL_AREAS,
      });
      const caLabel = domCreateWithAttributes(
        "label",
        "btn btn-primary",
        groupDiv,
        { tabindex: "0", for: "councilAreas" }
      );

      legend.innerHTML = "Select Boundaries:";
      hbLabel.innerHTML = "Health Boards";
      caLabel.innerHTML = "Council Areas";

      (areaType === AREATYPE_HEALTH_BOARDS ? hbInput : caInput).checked = true;

      DomEvent.on(hbInput, {
        click: () => setAreaType(AREATYPE_HEALTH_BOARDS),
      });
      DomEvent.on(caInput, {
        click: () => setAreaType(AREATYPE_COUNCIL_AREAS),
      });

      return outerDiv;
    };

    return regionTypeControl;
  }

  const RegionTypeSelector = createControlComponent(createRegionTypeSelector);

  return <RegionTypeSelector />;
}

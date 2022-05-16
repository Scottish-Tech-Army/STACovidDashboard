import React, { useState, useEffect, useRef } from "react";
import "./GeoHeatMap.css";
import L from "leaflet";
import { GeoJSON, MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import {
  AREATYPE_COUNCIL_AREAS,
  AREATYPE_HEALTH_BOARDS,
} from "../HeatmapDataSelector/HeatmapConsts";
import {
  getPlaceNameByFeatureCode,
  FEATURE_CODE_COUNCIL_AREAS,
  FEATURE_CODE_HEALTH_BOARDS,
  FEATURE_CODE_SCOTLAND,
} from "../Utils/CsvUtils";
/*
  geoJSONHealthBoards data from
  https://www.spatialdata.gov.scot/geonetwork/srv/eng/catalog.search;#/metadata/f12c3826-4b4b-40e6-bf4f-77b9ed01dc14
  geoJSONCouncilAreas data the district_borough_unitary_region dataset from
  https://osdatahub.os.uk/downloads/open/BoundaryLine

  Both were converted to WGS84 and simplified to 0.5% of original detail and converted to GEOJson using mapshaper.org
  Additionally, the non Scotland features of the council areas data were removed.
*/
import healthBoardBoundaries from "./geoJSONHealthBoards.json";
import councilAreaBoundaries from "./geoJSONCouncilAreas.json";
import { RegionTypeControl } from "./RegionTypeControl";
import {
  featureCodeForFeature,
  MAP_TILES_URL,
  DARK_MAP_TILES_URL,
  ATTRIBUTION,
  SCOTLAND_BOUNDS,
  SCOTLAND_MAX_BOUNDS,
} from "./GeoUtils";

export default function RegionGeoMap({
  regionCode = FEATURE_CODE_SCOTLAND,
  setRegionCode = null,
  darkmode,
}) {
  const [areaType, setAreaType] = useState(AREATYPE_HEALTH_BOARDS);

  const mapRef = useRef();

  useEffect(() => {
    if (FEATURE_CODE_SCOTLAND === regionCode) {
      // Do nothing
    } else if (FEATURE_CODE_COUNCIL_AREAS.includes(regionCode)) {
      setAreaType(AREATYPE_COUNCIL_AREAS);
    } else if (FEATURE_CODE_HEALTH_BOARDS.includes(regionCode)) {
      setAreaType(AREATYPE_HEALTH_BOARDS);
    } else {
      console.log("Region not found: " + regionCode);
    }
  }, [regionCode, setAreaType]);

  return (
    <div className="geo-map">
      <MapContainer
        ref={mapRef}
        id="regionmap"
        bounds={SCOTLAND_BOUNDS}
        maxBounds={SCOTLAND_MAX_BOUNDS}
        maxZoom={10}
        minZoom={6}
        dragging={!L.Browser.mobile}
        tap={!L.Browser.mobile}
        zoomControl={false}
        scrollWheelZoom={false}
      >
        <TileLayer
          key={darkmode}
          url={darkmode ? DARK_MAP_TILES_URL : MAP_TILES_URL}
          attribution={ATTRIBUTION}
        />
        <RegionBoundaryLayer
          key={areaType}
          regionBoundaries={
            AREATYPE_COUNCIL_AREAS === areaType
              ? councilAreaBoundaries
              : healthBoardBoundaries
          }
          darkmode={darkmode}
          regionCode={regionCode}
          setRegionCode={setRegionCode}
        />
        <ZoomControl position="topright" />
        <RegionTypeControl
          position="topleft"
          areaType={areaType}
          setAreaType={setAreaType}
        />
      </MapContainer>
    </div>
  );
}

function RegionBoundaryLayer({
  regionBoundaries,
  darkmode,
  regionCode,
  setRegionCode,
}) {
  const handleRegionTooltip = ({ target, latlng }) => {
    const featureCode = featureCodeForFeature(target.feature);
    const content =
      "<p class='region-popup'><strong>" +
      getPlaceNameByFeatureCode(featureCode) +
      "</strong></p>";
    target.bindTooltip(content).openTooltip(latlng);
  };

  const selectRegion = ({ target }) => {
    const featureCode = featureCodeForFeature(target.feature);
    setRegionCode((existing) =>
      featureCode === existing ? FEATURE_CODE_SCOTLAND : featureCode
    );
  };

  const SELECTED_COLOUR = "red";
  const UNSELECTED_COLOUR = "black";
  const BORDER_COLOUR = "black";
  const DARK_SELECTED_COLOUR = "#c1def1";
  const DARK_BORDER_COLOUR = "white";

  function getRegionStyle(featureCode) {
    const selectedColour = darkmode ? DARK_SELECTED_COLOUR : SELECTED_COLOUR;

    return {
      color: darkmode ? DARK_BORDER_COLOUR : BORDER_COLOUR,
      fillColor:
        featureCode === regionCode ? selectedColour : UNSELECTED_COLOUR,
      opacity: 0.5,
      fillOpacity: featureCode === regionCode ? 0.5 : 0,
      weight: 1,
    };
  }

  return (
    <GeoJSON
      data={regionBoundaries}
      style={(feature) => getRegionStyle(featureCodeForFeature(feature))}
      onEachFeature={(_feature, layer) => {
        layer.on({
          mouseover: handleRegionTooltip,
          click: selectRegion,
        });
      }}
    ></GeoJSON>
  );
}

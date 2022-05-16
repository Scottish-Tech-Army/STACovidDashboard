import React, { useEffect, useRef, useState } from "react";
import "./GeoHeatMap.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  GeoJSON,
  MapContainer,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import { createControlComponent } from "@react-leaflet/core";
import {
  AREATYPE_COUNCIL_AREAS,
  VALUETYPE_DEATHS,
} from "../HeatmapDataSelector/HeatmapConsts";
import FullscreenControl from "./FullscreenControl";
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
import { format } from "date-fns";
import {
  featureCodeForFeature,
  MAP_TILES_URL,
  DARK_MAP_TILES_URL,
  SCOTLAND_BOUNDS,
  SCOTLAND_MAX_BOUNDS,
  ATTRIBUTION,
} from "./GeoUtils";

const HEAT_LEVELS_DEATHS = [0, 1, 2, 5, 10, 20, 50, 100];
const HEAT_LEVELS_CASES = [0, 1, 5, 10, 20, 50, 100, 250];

const HEAT_COLOURS = [
  "#e0e0e0",
  "#ffffb2",
  "#fed976",
  "#feb24c",
  "#fd8d3c",
  "#f03b20",
  "#bd0026",
  "#020202",
];

export default function GeoHeatMap({
  allData = null,
  valueType = VALUETYPE_DEATHS,
  areaType = AREATYPE_COUNCIL_AREAS,
  toggleFullscreen,
  fullscreenEnabled = false,
  darkmode,
}) {
  const mapRef = useRef();
  const [popupRegion, setPopupRegion] = useState();

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.closePopup();
    }
    setPopupRegion(undefined);
  }, [valueType, areaType, darkmode]);

  return (
    <div
      aria-hidden={true}
      className={fullscreenEnabled ? "full-screen-geo-map" : "geo-map"}
    >
      <MapContainer
        ref={mapRef}
        id="map"
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
        {allData ? (
          <RegionBoundaryLayer
            key={areaType}
            allData={allData}
            valueType={valueType}
            regionBoundaries={
              AREATYPE_COUNCIL_AREAS === areaType
                ? councilAreaBoundaries
                : healthBoardBoundaries
            }
            darkmode={darkmode}
            setPopupRegion={setPopupRegion}
          />
        ) : null}
        <Legend key={valueType} position="topleft" valueType={valueType} />
        <ZoomControl position="topright" />
        <FullscreenControl
          toggleFullscreen={toggleFullscreen}
          fullscreenEnabled={fullscreenEnabled}
        />
        {popupRegion && (
          <ActiveRegionPopup
            {...popupRegion}
            valueType={valueType}
            allData={allData}
          />
        )}
      </MapContainer>
    </div>
  );
}

function RegionBoundaryLayer({
  allData = null,
  valueType = VALUETYPE_DEATHS,
  regionBoundaries,
  darkmode,
  setPopupRegion,
}) {
  const handleRegionPopup = ({ target, latlng }) => {
    if (allData === null) {
      return;
    }
    const featureCode = featureCodeForFeature(target.feature);
    setPopupRegion({ featureCode, latlng });
  };

  function getHeatLevel(count) {
    const heatLevels =
      VALUETYPE_DEATHS === valueType ? HEAT_LEVELS_DEATHS : HEAT_LEVELS_CASES;

    var i;
    for (i = heatLevels.length - 1; i >= 0; i--) {
      if (heatLevels[i] <= count) {
        return i;
      }
    }
    return 0;
  }

  const BORDER_COLOUR = "black";
  const DARK_BORDER_COLOUR = "white";

  function getRegionStyle(featureCode) {
    const regionData = allData.regions[featureCode];
    var count = 0;
    if (regionData) {
      count =
        VALUETYPE_DEATHS === valueType
          ? regionData.weeklyDeaths
          : regionData.weeklyCases;
    }

    return {
      color: darkmode ? DARK_BORDER_COLOUR : BORDER_COLOUR,
      fillColor: HEAT_COLOURS[getHeatLevel(count)],
      opacity: 0.5,
      fillOpacity: 0.5,
      weight: 1,
    };
  }

  return (
    <GeoJSON
      data={regionBoundaries}
      style={(feature) => getRegionStyle(featureCodeForFeature(feature))}
      onEachFeature={(_feature, layer) => {
        layer.on({
          mouseover: handleRegionPopup,
          click: handleRegionPopup,
        });
      }}
    />
  );
}

function createLegend({ valueType, ...props }) {
  function getRangeText(grades, i) {
    const start = grades[i];
    if (grades.length <= i + 1) {
      // Last range
      return start + "+";
    }
    const end = grades[i + 1] - 1;
    if (end === start) {
      // Single value range
      return start;
    }
    return start + "&ndash;" + end;
  }

  const legend = L.control(props);

  legend.onAdd = function () {
    const div = L.DomUtil.create("div", "info legend");
    div.innerHTML += `<div class='legend-title'>REGION ${valueType.toUpperCase()}<br/>(last 7 days)</div>`;

    // loop through our density intervals and generate a label with a colored square for each interval
    const grades =
      VALUETYPE_DEATHS === valueType ? HEAT_LEVELS_DEATHS : HEAT_LEVELS_CASES;
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += `<div class="legend-line"><i style="background:${
        HEAT_COLOURS[i]
      }"></i> ${getRangeText(grades, i)}</div>`;
    }

    return div;
  };

  return legend;
}

const Legend = createControlComponent(createLegend);

const ActiveRegionPopup = ({ featureCode, valueType, latlng, allData }) => {
  const regionData = allData.regions[featureCode];
  const count =
    valueType === VALUETYPE_DEATHS
      ? regionData.weeklyDeaths
      : regionData.weeklyCases;

  return (
    <Popup closeButton={false} position={latlng}>
      <div class="region-popup">
        <div>{regionData.name.toUpperCase()}</div>
        <div class="map-date-range">
          {`${format(allData.currentWeekStartDate, "dd MMM")} - ${format(
            allData.endDate,
            "dd MMM"
          )}`}
        </div>
        <div class="map-cases-count">
          {`${valueType === VALUETYPE_DEATHS ? "Deaths" : "Cases"}: ${count}`}
        </div>
      </div>
    </Popup>
  );
};

import React, { useState, useEffect } from "react";
import "./GeoHeatMap.css";
import "leaflet/dist/leaflet.css";
import { Map as LeafletMap, Circle, TileLayer, Popup } from "react-leaflet";
import { HEALTH_BOARD_LOCATIONS, COUNCIL_AREA_LOCATIONS } from "./Locations";
import {
  AREATYPE_COUNCIL_AREAS,
  VALUETYPE_DEATHS,
} from "../HeatmapDataSelector/HeatmapConsts";
import {
  readCsvData,
  createPlaceDateValueMap,
  fetchAndStore,
} from "../Utils/CsvUtils";
import FullscreenControl from "./FullscreenControl";

function parseCsvData(csvData) {
  function getLatestValue(dateValueMap) {
    const lastDate = [...dateValueMap.keys()].sort().pop();
    return dateValueMap.get(lastDate);
  }

  var lines = readCsvData(csvData);

  const { placeDateValueMap } = createPlaceDateValueMap(lines);

  const regions = new Map();

  placeDateValueMap.forEach((dateValueMap, areaname) => {
    regions.set(areaname, getLatestValue(dateValueMap));
  });
  return regions;
}

const GeoHeatMap = ({
  valueType = VALUETYPE_DEATHS,
  areaType = AREATYPE_COUNCIL_AREAS,
  toggleFullscreen,
  fullscreenEnabled = false,
}) => {
  const [totalCasesByHealthBoard, setTotalCasesByHealthBoard] = useState(null);
  const [totalDeathsByHealthBoard, setTotalDeathsByHealthBoard] = useState(
    null
  );
  const [totalDeathsByCouncilArea, setTotalDeathsByCouncilArea] = useState(
    null
  );

  const calculateRadius = (totalCases) => {
    return Math.sqrt(totalCases) * 500;
  };

  useEffect(() => {
    const totalCasesByHealthBoardCsv = "totalHealthBoardsCases.csv";
    const totalDeathsByCouncilAreaCsv = "annualCouncilAreasDeaths.csv";
    const totalDeathsByHealthBoardCsv = "annualHealthBoardsDeaths.csv";

    if (VALUETYPE_DEATHS === valueType) {
      if (AREATYPE_COUNCIL_AREAS === areaType) {
        if (null === totalDeathsByCouncilArea) {
          fetchAndStore(
            totalDeathsByCouncilAreaCsv,
            setTotalDeathsByCouncilArea,
            parseCsvData
          );
        }
      } else {
        // AREATYPE_HEALTH_BOARDS == areaType
        if (null === totalDeathsByHealthBoard) {
          fetchAndStore(
            totalDeathsByHealthBoardCsv,
            setTotalDeathsByHealthBoard,
            parseCsvData
          );
        }
      }
    } else {
      // VALUETYPE_CASES === valueType
      if (AREATYPE_COUNCIL_AREAS === areaType) {
        // We don't have a dataset for this case
      } else {
        // AREATYPE_HEALTH_BOARDS == areaType
        if (null === totalCasesByHealthBoard) {
          fetchAndStore(
            totalCasesByHealthBoardCsv,
            setTotalCasesByHealthBoard,
            parseCsvData
          );
        }
      }
    }
  }, [
    areaType,
    valueType,
    totalCasesByHealthBoard,
    totalDeathsByCouncilArea,
    totalDeathsByHealthBoard,
  ]);

  const regionCircles = () => {
    var dataset = null;
    var locations = null;
    if (AREATYPE_COUNCIL_AREAS === areaType) {
      locations = COUNCIL_AREA_LOCATIONS;

      if (VALUETYPE_DEATHS === valueType) {
        dataset = totalDeathsByCouncilArea;
      } else {
        // VALUETYPE_CASES === valueType
        // No dataset here
      }
    } else {
      // AREATYPE_HEALTH_BOARDS == areaType
      locations = HEALTH_BOARD_LOCATIONS;

      if (VALUETYPE_DEATHS === valueType) {
        dataset = totalDeathsByHealthBoard;
      } else {
        // VALUETYPE_CASES === valueType
        dataset = totalCasesByHealthBoard;
      }
    }

    if (dataset === null || locations === null) {
      return <></>;
    }

    const popupUnit =
      VALUETYPE_DEATHS === valueType ? "Total Deaths" : "Total Cases";

    return locations.map(({ area, lat, lng }) => {
      if (dataset.has(area)) {
        const value = dataset.get(area);
        const colour = value === 0 ? "green" : "red";

        return (
          <Circle
            key={area}
            center={[lat, lng]}
            fillColor={colour}
            color={colour}
            fillOpacity={0.5}
            radius={calculateRadius(value)}
          >
            <Popup key={area}>{area + " - " + popupUnit + ": " + value}</Popup>
          </Circle>
        );
      } else {
        console.error("Can't find " + area);
        return <></>;
      }
    });
  };
  /*    zoomDelta={false}
        doubleClickZoom={false}
        dragging={false}
        trackResize={false}
        touchZoom={false}
        scrollWheelZoom={false}
*/

  const tilesStadiaAlidadeSmooth =
    "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png";

  return (
    <div className={fullscreenEnabled ? "full-screen geo-map" : "geo-map"}>
      <LeafletMap
        center={[56.5814, -4.0545]}
        id="map"
        zoom={6.4}
        zoomSnap={0.1}
        maxZoom={20}
      >
        <TileLayer
          url={tilesStadiaAlidadeSmooth}
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        />
        {regionCircles()}
        <FullscreenControl
          toggleFullscreen={toggleFullscreen}
          fullscreenEnabled={fullscreenEnabled}
        />
      </LeafletMap>
    </div>
  );
};

export default GeoHeatMap;

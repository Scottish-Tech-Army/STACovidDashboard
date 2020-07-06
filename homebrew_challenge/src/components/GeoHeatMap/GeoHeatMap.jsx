import React, { useState, useEffect } from "react";
import "./GeoHeatMap.css";
import "leaflet/dist/leaflet.css";
import {
  Map as LeafletMap,
  Circle,
  TileLayer,
  Popup,
  GeoJSON,
} from "react-leaflet";
import { HEALTH_BOARD_LOCATIONS, COUNCIL_AREA_LOCATIONS } from "./Locations";
import {
  AREATYPE_COUNCIL_AREAS,
  AREATYPE_HEALTH_BOARDS,
  VALUETYPE_DEATHS,
} from "../HeatmapDataSelector/HeatmapConsts";
import {
  readCsvData,
  createPlaceDateValueMap,
  fetchAndStore,
} from "../Utils/CsvUtils";
import FullscreenControl from "./FullscreenControl";
import healthBoardBoundaries from "./geoJSONHealthBoards.json";
import councilAreaBoundaries from "./geoJSONCouncilAreas.json";

/*
  geoJSONHealthBoards data from
  https://www.spatialdata.gov.scot/geonetwork/srv/eng/catalog.search;#/metadata/f12c3826-4b4b-40e6-bf4f-77b9ed01dc14
  geoJSONCouncilAreas data the district_borough_unitary_region dataset from
  https://osdatahub.os.uk/downloads/open/BoundaryLine

  Both were converted to WGS84 and simplified to 0.5% of original detail and converted to GEOJson using mapshaper.org
  Additionally, the non Scotland features of the council areas data were removed.
*/

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

  const deathsHeatLevels = [0, 1, 10, 100, 200, 500];
  const casesHeatLevels = [0, 1, 10, 100, 1000, 3000];

  function getHeatLevel(count) {
    const heatLevels =
      VALUETYPE_DEATHS === valueType ? deathsHeatLevels : casesHeatLevels;

    var i;
    for (i = heatLevels.length - 1; i >= 0; i--) {
      if (heatLevels[i] <= count) {
        return i;
      }
    }
    return 0;
  }

  const heatcolours = [
    "#e0e0e0",
    "#fef0d9",
    "#fdcc8a",
    "#fc8d59",
    "#e34a33",
    "#b30000",
  ];

  function getDataset() {
    if (AREATYPE_COUNCIL_AREAS === areaType) {
      if (VALUETYPE_DEATHS === valueType) {
        return totalDeathsByCouncilArea;
      }
      // VALUETYPE_CASES === valueType
      // No dataset here
      throw new Error("Dataset not available");
    }
    if (VALUETYPE_DEATHS === valueType) {
      return totalDeathsByHealthBoard;
    }
    // VALUETYPE_CASES === valueType
    return totalCasesByHealthBoard;
  }

  function getRegionColour(regionName) {
    console.log(regionName);
    const dataset = getDataset();
    if (!dataset) {
      return "red";
    }

    const value = dataset.get(regionName);
    return heatcolours[getHeatLevel(value)];
  }

  function getRegionName(feature) {
    if (AREATYPE_COUNCIL_AREAS === areaType) {
      return feature.properties.NAME;
    }
    return feature.properties.HBName;
  }

  const INVISIBLE_LAYER_STYLE = {
    opacity: 0,
    fillOpacity: 0,
  };

  function getRegionStyle(feature, featureAreaType) {
    if (areaType !== featureAreaType) {
      return INVISIBLE_LAYER_STYLE;
    }

    return {
      color: getRegionColour(getRegionName(feature)),
      opacity: 0.65,
      fillOpacity: 0.5,
      weight: 1,
    };
  }
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

        <GeoJSON
          data={councilAreaBoundaries}
          style={(feature) => getRegionStyle(feature, AREATYPE_COUNCIL_AREAS)}
          onEachFeature={(feature, layer) => {
            console.log("Binding popup");
            layer.bindPopup("council area test");
          }}
        ></GeoJSON>
        <GeoJSON
          data={healthBoardBoundaries}
          style={(feature) => getRegionStyle(feature, AREATYPE_HEALTH_BOARDS)}
          onEachFeature={(feature, layer) => {
            console.log("Binding popup");
            layer.bindPopup("health board test");
          }}
        ></GeoJSON>

        <FullscreenControl
          toggleFullscreen={toggleFullscreen}
          fullscreenEnabled={fullscreenEnabled}
        />
      </LeafletMap>
    </div>
  );
};
//<Popup key={area}>{area + " - " + popupUnit + ": " + value}</Popup>
export default GeoHeatMap;

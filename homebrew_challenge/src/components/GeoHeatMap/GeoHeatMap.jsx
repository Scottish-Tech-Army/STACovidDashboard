import React, { useState, useEffect, useRef } from "react";
import "./GeoHeatMap.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
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

const deathsHeatLevels = [0, 1, 10, 100, 200, 500];
const casesHeatLevels = [0, 1, 10, 100, 1000, 3000];

const heatcolours = [
  "#e0e0e0",
  "#fef0d9",
  "#fdcc8a",
  "#fc8d59",
  "#e34a33",
  "#b30000",
];

/*
 Getting Leaflet and React to play nice when the underlying datasets are changing (there are 3 datasets and 2 region
 boundary types) was challenging. Straightforward react-leaflet wasn't enough. The code below uses react-leaflet
 components for the static parts of the map, and drops to pure Leaflet for dynamic components - the legend, the geoJSON
 layers and their associated styles and popups.

 There is a cascade of useEffect blocks to handle user selection of dataset, and lazy loading of those datasets. The
 dependences of the useEffect blocks should clarify what gets triggered when.
*/

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
  const [councilAreaBoundariesLayer, setCouncilAreaBoundariesLayer] = useState(
    null
  );
  const [healthBoardBoundariesLayer, setHealthBoardBoundariesLayer] = useState(
    null
  );

  const [currentBoundariesLayer, setCurrentBoundariesLayer] = useState(null);
  const [currentHeatLevels, _setCurrentHeatLevels] = useState(null);
  const [currentDataset, _setCurrentDataset] = useState(null);

  const mapRef = useRef();
  const legendRef = useRef(null);
  const currentDatasetRef = useRef(null);
  const currentHeatLevelsRef = useRef(null);

  // Need both state (to trigger useEffect) and ref (to be called from event handlers created in those useEffects)
  function setCurrentHeatLevels(value) {
    currentHeatLevelsRef.current = value;
    _setCurrentHeatLevels(value);
  }

  // Need both state (to trigger useEffect) and ref (to be called from event handlers created in those useEffects)
  function setCurrentDataset(value) {
    currentDatasetRef.current = value;
    _setCurrentDataset(value);
  }

  // Load and parse datasets (lazy initialisation)
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

  // Set current dataset and heatlevels
  useEffect(() => {
    if (VALUETYPE_DEATHS === valueType) {
      setCurrentHeatLevels(deathsHeatLevels);
      if (AREATYPE_COUNCIL_AREAS === areaType) {
        setCurrentDataset(totalDeathsByCouncilArea);
      } else {
        // AREATYPE_HEALTH_BOARDS == areaType
        setCurrentDataset(totalDeathsByHealthBoard);
      }
    } else {
      setCurrentHeatLevels(casesHeatLevels);
      if (AREATYPE_COUNCIL_AREAS === areaType) {
        // No dataset available
        setCurrentDataset(null);
      } else {
        // AREATYPE_HEALTH_BOARDS == areaType
        setCurrentDataset(totalCasesByHealthBoard);
      }
    }
  }, [
    valueType,
    areaType,
    totalDeathsByHealthBoard,
    totalCasesByHealthBoard,
    totalDeathsByCouncilArea,
  ]);

  // Setup map boundaries layer
  useEffect(() => {
    const INVISIBLE_LAYER_STYLE = {
      opacity: 0,
      fillOpacity: 0,
    };

    const handleRegionClick = (e) => {
      const map = mapRef.current.leafletElement;
      const layer = e.target;
      const regionName = layer.feature.properties.RegionName;
      var value = currentDatasetRef.current.get(regionName);
      if (value === undefined) {
          value = 0;
      }

      L.popup()
        .setLatLng(e.latlng)
        .setContent(
          "<p class='region-popup'><strong>" +
            regionName +
            "</strong><br />Count: " +
            value +
            "</p>"
        )
        .openOn(map);
    };

    const regionLayerOptions = {
      style: INVISIBLE_LAYER_STYLE,
      onEachFeature: (feature, layer) => {
        layer.on({
          click: handleRegionClick,
        });
      },
    };

    // Restrict the panning
    if (mapRef.current && mapRef.current.leafletElement) {
        const map = mapRef.current.leafletElement;
        map.setMaxBounds(map.getBounds());
    }

    setCouncilAreaBoundariesLayer(
      L.geoJSON(councilAreaBoundaries, regionLayerOptions)
    );
    setHealthBoardBoundariesLayer(
      L.geoJSON(healthBoardBoundaries, regionLayerOptions)
    );
  }, []);

  // Update active map boundaries layer
  useEffect(() => {
    if (mapRef.current && mapRef.current.leafletElement) {
      const map = mapRef.current.leafletElement;
      if (AREATYPE_COUNCIL_AREAS === areaType) {
        if (healthBoardBoundariesLayer) {
          healthBoardBoundariesLayer.removeFrom(map);
        }
        if (councilAreaBoundariesLayer) {
          councilAreaBoundariesLayer.addTo(map);
        }
        setCurrentBoundariesLayer(councilAreaBoundariesLayer);
      } else {
        if (councilAreaBoundariesLayer) {
          councilAreaBoundariesLayer.removeFrom(map);
        }
        if (healthBoardBoundariesLayer) {
          healthBoardBoundariesLayer.addTo(map);
        }
        setCurrentBoundariesLayer(healthBoardBoundariesLayer);
      }
    }
  }, [areaType, councilAreaBoundariesLayer, healthBoardBoundariesLayer]);

  // Update counts to use to style map boundaries layer
  useEffect(() => {
    function getHeatLevel(count) {
      const heatLevels = currentHeatLevels;
      var i;
      for (i = heatLevels.length - 1; i >= 0; i--) {
        if (heatLevels[i] <= count) {
          return i;
        }
      }
      return 0;
    }

    function getRegionColour(count) {
      return heatcolours[getHeatLevel(count)];
    }

    function getRegionStyle(regionName) {
      var count = currentDataset.get(regionName);
      if (count === undefined) {
          count = 0;
      }

      return {
        color: getRegionColour(count),
        opacity: 0.65,
        fillOpacity: 0.5,
        weight: 1,
      };
    }

    if (mapRef.current && mapRef.current.leafletElement) {
      mapRef.current.leafletElement.closePopup();
    }

    if (currentBoundariesLayer && currentDataset) {
      currentBoundariesLayer.setStyle((feature) =>
        getRegionStyle(feature.properties.RegionName)
      );
    }
  }, [currentBoundariesLayer, currentHeatLevels, currentDataset]);

  // Create legend
  useEffect(() => {
    if (mapRef.current && mapRef.current.leafletElement) {
      const map = mapRef.current.leafletElement;
      if (!legendRef.current) {
        legendRef.current = L.control({ position: "bottomright" });

        legendRef.current.onAdd = function (map) {
          const div = L.DomUtil.create("div", "info legend");
          const grades = currentHeatLevelsRef.current;
          div.innerHTML += "<div class='legend-title'>Region Counts</div>";
          // loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
              '<i style="background:' +
              heatcolours[i] +
              '"></i> ' +
              grades[i] +
              (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
          }

          return div;
        };
      } else {
        legendRef.current.remove();
      }
      legendRef.current.addTo(map);
    }
  }, [currentHeatLevels]);

  const tilesStadiaAlidadeSmooth =
    "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png";

  return (
    <div className={fullscreenEnabled ? "full-screen geo-map" : "geo-map"}>
      <LeafletMap
        ref={mapRef}
        center={[55.5814, -4.0545]}
        id="map"
        zoom={6.1}
        zoomSnap={0.1}
        maxZoom={10}
        minZoom={6}
      >
        <TileLayer
          url={tilesStadiaAlidadeSmooth}
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        />
        <FullscreenControl
          toggleFullscreen={toggleFullscreen}
          fullscreenEnabled={fullscreenEnabled}
        />
      </LeafletMap>
    </div>
  );
};
/*
 LeafletMap options to lock down the user interaction
    zoomDelta={false}
    doubleClickZoom={false}
    dragging={false}
    trackResize={false}
    touchZoom={false}
    scrollWheelZoom={false}
*/

export default GeoHeatMap;

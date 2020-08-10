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
  createPlaceDateValuesMap,
  fetchAndStore,
  getPlaceNameByFeatureCode,
} from "../Utils/CsvUtils";
import FullscreenControl from "./FullscreenControl";
import healthBoardBoundaries from "./geoJSONHealthBoards.json";
import councilAreaBoundaries from "./geoJSONCouncilAreas.json";
import moment from "moment";

/*
  geoJSONHealthBoards data from
  https://www.spatialdata.gov.scot/geonetwork/srv/eng/catalog.search;#/metadata/f12c3826-4b4b-40e6-bf4f-77b9ed01dc14
  geoJSONCouncilAreas data the district_borough_unitary_region dataset from
  https://osdatahub.os.uk/downloads/open/BoundaryLine

  Both were converted to WGS84 and simplified to 0.5% of original detail and converted to GEOJson using mapshaper.org
  Additionally, the non Scotland features of the council areas data were removed.
*/

export function parse7DayWindowCsvData(csvData) {
  var lines = readCsvData(csvData);
  const { placeDateValuesMap } = createPlaceDateValuesMap(lines);

  const regions = new Map();
  placeDateValuesMap.forEach((dateValuesMap, featureCode) => {
    const dates = [...dateValuesMap.keys()].sort();
    const endDate = dates[dates.length - 1];
    const startDate = moment.utc(endDate).subtract(6, "days").valueOf();
    const filteredDates = dates.filter((date) => date >= startDate);
    let totalCases = 0;
    let totalDeaths = 0;
    filteredDates.forEach((date) => {
      const { cases, deaths } = dateValuesMap.get(date);
      totalCases += cases;
      totalDeaths += deaths;
    });
    regions.set(featureCode, {
      cases: totalCases,
      deaths: totalDeaths,
      fromDate: filteredDates[0],
      name: getPlaceNameByFeatureCode(featureCode),
      toDate: endDate,
    });
  });
  return regions;
}

const deathsHeatLevels = [0, 1, 2, 5, 10, 20];
const casesHeatLevels = [0, 1, 5, 10, 20, 50];
const scotlandBounds = [
  [54.6, -7.5],
  [61.0, -0.4],
];
const scotlandMaxBounds = [
  [52.0, -10.0],
  [63.5, 2.0],
];

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
  const [healthBoardDataset, setHealthBoardDataset] = useState(null);
  const [councilAreaDataset, setCouncilAreaDataset] = useState(null);
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
  const currentValueTypeRef = useRef(valueType);

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
    const councilAreaCsv = "dailyCouncilAreas.csv";
    const healthBoardCsv = "dailyHealthBoards.csv";

    if (AREATYPE_COUNCIL_AREAS === areaType) {
      if (null === councilAreaDataset) {
        fetchAndStore(
          councilAreaCsv,
          setCouncilAreaDataset,
          parse7DayWindowCsvData
        );
      }
    } else {
      // AREATYPE_HEALTH_BOARDS == areaType
      if (null === healthBoardDataset) {
        fetchAndStore(
          healthBoardCsv,
          setHealthBoardDataset,
          parse7DayWindowCsvData
        );
      }
    }
  }, [areaType, healthBoardDataset, councilAreaDataset]);

  // Set current heatlevels
  useEffect(() => {
    currentValueTypeRef.current = valueType;
    setCurrentHeatLevels(
      VALUETYPE_DEATHS === valueType ? deathsHeatLevels : casesHeatLevels
    );
  }, [valueType]);

  // Set current dataset
  useEffect(() => {
    setCurrentDataset(
      AREATYPE_COUNCIL_AREAS === areaType
        ? councilAreaDataset
        : healthBoardDataset
    );
  }, [areaType, healthBoardDataset, councilAreaDataset]);

  // Setup map boundaries layer
  useEffect(() => {
    const INVISIBLE_LAYER_STYLE = {
      opacity: 0,
      fillOpacity: 0,
    };

    const handleRegionClick = (e) => {
      const map = mapRef.current.leafletElement;
      const layer = e.target;
      const featureCode = featureCodeForFeature(layer.feature);
      const regionData = currentDatasetRef.current.get(featureCode);
      var content =
        "<p class='region-popup'><strong>" +
        regionData.name +
        "</strong><br />Not available</p>";

      const count =
        currentValueTypeRef.current === VALUETYPE_DEATHS
          ? regionData.deaths
          : regionData.cases;

      if (regionData) {
        content =
          "<p class='region-popup'><strong>" +
          regionData.name +
          "</strong><br />Count: " +
          count +
          "<br />(" +
          moment(regionData.fromDate).format("DD MMM") +
          " - " +
          moment(regionData.toDate).format("DD MMM") +
          ")</p>";
      }

      L.popup().setLatLng(e.latlng).setContent(content).openOn(map);
    };

    const regionLayerOptions = {
      style: INVISIBLE_LAYER_STYLE,
      onEachFeature: (feature, layer) => {
        layer.on({
          click: handleRegionClick,
        });
      },
    };

    setCouncilAreaBoundariesLayer(
      L.geoJSON(councilAreaBoundaries, regionLayerOptions)
    );
    setHealthBoardBoundariesLayer(
      L.geoJSON(healthBoardBoundaries, regionLayerOptions)
    );
  }, []);

  // Fit bounds and restrict the panning
  useEffect(() => {
    // There is a known issue in leaflet where map sizing is not updated on all container size events.
    // This causes fitBounds() to fit to an incorrectly sized map. The workaround is to observe document resize
    // events if available or trigger a recalculation of the map size after a delay. Ugly, but currently necessary
    // https://github.com/Leaflet/Leaflet/issues/4835
    if (window.ResizeObserver) {
      const ro = new window.ResizeObserver((entries, observer) => {
        if (mapRef.current && mapRef.current.leafletElement) {
          const map = mapRef.current.leafletElement;
          map.invalidateSize();
          map.setMaxBounds(scotlandMaxBounds);
          map.fitBounds(scotlandBounds, { maxZoom: 10, animate: false });
        }
      });
      ro.observe(document.body);
    } else {
      // ResizeObserver not available - fall back on delayed bounds setting
      setTimeout(function () {
        console.log("ResizeObserver not available");
        if (mapRef.current && mapRef.current.leafletElement) {
          const map = mapRef.current.leafletElement;
          map.invalidateSize();
          map.setMaxBounds(scotlandMaxBounds);
          map.fitBounds(scotlandBounds, { maxZoom: 10, animate: false });
        }
      }, 3000);
    }
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

    function getRegionStyle(featureCode) {
      const regionData = currentDataset.get(featureCode);
      var count = 0;
      if (regionData) {
        count =
          VALUETYPE_DEATHS === valueType ? regionData.deaths : regionData.cases;
      }

      return {
        color: "black",
        fillColor: getRegionColour(count),
        opacity: 0.5,
        fillOpacity: 0.5,
        weight: 1,
      };
    }

    if (mapRef.current && mapRef.current.leafletElement) {
      mapRef.current.leafletElement.closePopup();
    }

    if (currentBoundariesLayer && currentDataset) {
      currentBoundariesLayer.setStyle((feature) =>
        getRegionStyle(featureCodeForFeature(feature))
      );
    }
  }, [valueType, currentBoundariesLayer, currentHeatLevels, currentDataset]);

  // Create legend
  useEffect(() => {
    if (mapRef.current && mapRef.current.leafletElement) {
      const map = mapRef.current.leafletElement;
      if (!legendRef.current) {
        legendRef.current = L.control({ position: "bottomright" });

        legendRef.current.onAdd = function (map) {
          const div = L.DomUtil.create("div", "info legend");
          const grades = currentHeatLevelsRef.current;
          div.innerHTML +=
            "<div class='legend-title'>Region Counts<br/>(last 7 days)</div>";
          // loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
              '<div class="legend-line"><i style="background:' +
              heatcolours[i] +
              '"></i> ' +
              grades[i] +
              (grades[i + 1] ? "&ndash;" + grades[i + 1] : "+") +
              "</div>";
          }

          return div;
        };
      } else {
        legendRef.current.remove();
      }
      legendRef.current.addTo(map);
    }
  }, [currentHeatLevels]);

  function featureCodeForFeature(feature) {
    var featureCode = feature.properties.HBCode;
    if (featureCode === undefined) {
      featureCode = feature.properties.CODE;
    }
    return featureCode;
  }

  const tilesStadiaAlidadeSmooth =
    "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png";

  return (
    <div className={fullscreenEnabled ? "full-screen geo-map" : "geo-map"}>
      <LeafletMap
        ref={mapRef}
        id="map"
        maxZoom={10}
        minZoom={6}
        dragging={!L.Browser.mobile}
        tap={!L.Browser.mobile}
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

export default GeoHeatMap;

import React, { useState, useEffect, useRef } from "react";
import "./GeoHeatMap.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Map as LeafletMap, TileLayer, ZoomControl } from "react-leaflet";
import {
  AREATYPE_COUNCIL_AREAS,
  VALUETYPE_DEATHS,
} from "../HeatmapDataSelector/HeatmapConsts";
import { parse7DayWindowCsvData } from "../Utils/CsvUtils";
import FullscreenControl from "./FullscreenControl";
import healthBoardBoundaries from "./geoJSONHealthBoards.json";
import councilAreaBoundaries from "./geoJSONCouncilAreas.json";
import moment from "moment";
import {
  setScotlandDefaultBounds,
  featureCodeForFeature,
  MAP_TILES_URL,
} from "./GeoUtils";

/*
  geoJSONHealthBoards data from
  https://www.spatialdata.gov.scot/geonetwork/srv/eng/catalog.search;#/metadata/f12c3826-4b4b-40e6-bf4f-77b9ed01dc14
  geoJSONCouncilAreas data the district_borough_unitary_region dataset from
  https://osdatahub.os.uk/downloads/open/BoundaryLine

  Both were converted to WGS84 and simplified to 0.5% of original detail and converted to GEOJson using mapshaper.org
  Additionally, the non Scotland features of the council areas data were removed.
*/

const deathsHeatLevels = [0, 1, 2, 5, 10, 20, 50, 100];
const casesHeatLevels = [0, 1, 5, 10, 20, 50, 100, 250];

const heatcolours = [
  "#e0e0e0",
  "#ffffb2",
  "#fed976",
  "#feb24c",
  "#fd8d3c",
  "#f03b20",
  "#bd0026",
  "#020202",
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
  councilAreaDataset,
  healthBoardDataset,
  valueType = VALUETYPE_DEATHS,
  areaType = AREATYPE_COUNCIL_AREAS,
  toggleFullscreen,
  fullscreenEnabled = false,
  setAreaType,
  setValueType,
}) => {
  const [healthBoard7DayDataset, setHealthBoard7DayDataset] = useState(null);
  const [councilArea7DayDataset, setCouncilArea7DayDataset] = useState(null);
  const [councilAreaBoundariesLayer, setCouncilAreaBoundariesLayer] = useState(
    null
  );
  const [healthBoardBoundariesLayer, setHealthBoardBoundariesLayer] = useState(
    null
  );

  const [currentBoundariesLayer, setCurrentBoundariesLayer] = useState(null);
  const [currentHeatLevels, _setCurrentHeatLevels] = useState(null);
  const [current7DayDataset, _setCurrent7DayDataset] = useState(null);

  const mapRef = useRef();
  const legendRef = useRef(null);
  const current7DayDatasetRef = useRef(null);
  const currentHeatLevelsRef = useRef(null);
  const currentValueTypeRef = useRef(valueType);

  // Need both state (to trigger useEffect) and ref (to be called from event handlers created in those useEffects)
  function setCurrentHeatLevels(value) {
    currentHeatLevelsRef.current = value;
    _setCurrentHeatLevels(value);
  }

  // Need both state (to trigger useEffect) and ref (to be called from event handlers created in those useEffects)
  function setCurrent7DayDataset(value) {
    current7DayDatasetRef.current = value;
    _setCurrent7DayDataset(value);
  }

  // Parse datasets
  useEffect(() => {
    if (null !== councilAreaDataset && undefined !== councilAreaDataset) {
      setCouncilArea7DayDataset(parse7DayWindowCsvData(councilAreaDataset));
    }
  }, [councilAreaDataset]);

  useEffect(() => {
    if (null !== healthBoardDataset && undefined !== healthBoardDataset) {
      setHealthBoard7DayDataset(parse7DayWindowCsvData(healthBoardDataset));
    }
  }, [healthBoardDataset]);

  // Set current heatlevels
  useEffect(() => {
    currentValueTypeRef.current = valueType;
    setCurrentHeatLevels(
      VALUETYPE_DEATHS === valueType ? deathsHeatLevels : casesHeatLevels
    );
  }, [valueType]);

  // Set current dataset
  useEffect(() => {
    setCurrent7DayDataset(
      AREATYPE_COUNCIL_AREAS === areaType
        ? councilArea7DayDataset
        : healthBoard7DayDataset
    );
  }, [areaType, healthBoard7DayDataset, councilArea7DayDataset]);

  // Setup map boundaries layer
  useEffect(() => {
    const INVISIBLE_LAYER_STYLE = {
      opacity: 0,
      fillOpacity: 0,
    };

    const handleRegionPopup = (e) => {
      if (current7DayDatasetRef.current === null) {
        return;
      }
      const map = mapRef.current.leafletElement;
      const layer = e.target;
      const featureCode = featureCodeForFeature(layer.feature);
      const regionData = current7DayDatasetRef.current.get(featureCode);
      var content =
        "<p class='region-popup'><strong>" +
        regionData.name +
        "</strong><br />Not available</p>";

      function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      }

      const count =
        currentValueTypeRef.current === VALUETYPE_DEATHS
          ? regionData.deaths
          : regionData.cases;

      if (regionData) {
        content =
          "<div class='region-popup'><div><strong>" +
          regionData.name.toUpperCase() +
          "</strong></div><div class='map-date-range'>" +
          moment(regionData.fromDate).format("DD MMM") +
          " - " +
          moment(regionData.toDate).format("DD MMM") +
          "</div> <br /><strong>" +
          toTitleCase(currentValueTypeRef.current) +
          ": </strong>" +
          count +
          "</div>";
      }

      L.popup({ closeButton: false })
        .setLatLng(e.latlng)
        .setContent(content)
        .openOn(map);
    };

    const regionLayerOptions = {
      style: INVISIBLE_LAYER_STYLE,
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: handleRegionPopup,
          click: handleRegionPopup,
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
    if (mapRef.current && mapRef.current.leafletElement) {
      setScotlandDefaultBounds(mapRef.current.leafletElement);
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
      const regionData = current7DayDataset.get(featureCode);
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

    if (currentBoundariesLayer && current7DayDataset) {
      currentBoundariesLayer.setStyle((feature) =>
        getRegionStyle(featureCodeForFeature(feature))
      );
    }
  }, [
    valueType,
    currentBoundariesLayer,
    currentHeatLevels,
    current7DayDataset,
  ]);

  // Create legend
  useEffect(() => {
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

    if (mapRef.current && mapRef.current.leafletElement) {
      const map = mapRef.current.leafletElement;
      if (!legendRef.current) {
        legendRef.current = L.control({ position: "topleft" });

        legendRef.current.onAdd = function (map) {
          const div = L.DomUtil.create("div", "info legend");
          const grades = currentHeatLevelsRef.current;
          div.innerHTML +=
            "<div class='legend-title'>REGION " +
            currentValueTypeRef.current.toUpperCase() +
            "<br/>(last 7 days)</div>";
          // loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
              '<div class="legend-line"><i style="background:' +
              heatcolours[i] +
              '"></i> ' +
              getRangeText(grades, i) +
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

  const classNameIncDarkmode = `darkmode-ignore + ${
    fullscreenEnabled ? "full-screen-geo-map" : "geo-map"
  }`;

  return (
    <div className={classNameIncDarkmode}>
      <LeafletMap
        ref={mapRef}
        id="map"
        maxZoom={10}
        minZoom={6}
        dragging={!L.Browser.mobile}
        tap={!L.Browser.mobile}
        zoomControl={false}
      >
        <TileLayer
          url={MAP_TILES_URL}
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        />
        <ZoomControl position="topright" />
        <FullscreenControl
          toggleFullscreen={toggleFullscreen}
          fullscreenEnabled={fullscreenEnabled}
        />
      </LeafletMap>
    </div>
  );
};

export default GeoHeatMap;

import React, { useState, useEffect, useRef } from "react";
import "./GeoHeatMap.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Map as LeafletMap, TileLayer, ZoomControl } from "react-leaflet";
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
import moment from "moment";
import {
  setScotlandDefaultBounds,
  featureCodeForFeature,
  MAP_TILES_URL,
  DARK_MAP_TILES_URL,
} from "./GeoUtils";

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

export default function GeoHeatMap({
  sevenDayDataset,
  valueType = VALUETYPE_DEATHS,
  areaType = AREATYPE_COUNCIL_AREAS,
  toggleFullscreen,
  fullscreenEnabled = false,
  setAreaType,
  setValueType,
  darkmode,
}) {
  const [councilAreaBoundariesLayer, setCouncilAreaBoundariesLayer] = useState(
    null
  );
  const [healthBoardBoundariesLayer, setHealthBoardBoundariesLayer] = useState(
    null
  );

  const [currentBoundariesLayer, setCurrentBoundariesLayer] = useState(null);
  const [currentHeatLevels, _setCurrentHeatLevels] = useState(null);

  const mapRef = useRef();
  const legendRef = useRef(null);
  const currentHeatLevelsRef = useRef(null);
  const currentValueTypeRef = useRef(valueType);

  // Need both state (to trigger useEffect) and ref (to be called from event handlers created in those useEffects)
  function setCurrentHeatLevels(value) {
    currentHeatLevelsRef.current = value;
    _setCurrentHeatLevels(value);
  }

  // Set current heatlevels
  useEffect(() => {
    currentValueTypeRef.current = valueType;
    setCurrentHeatLevels(
      VALUETYPE_DEATHS === valueType ? deathsHeatLevels : casesHeatLevels
    );
  }, [valueType]);

  // Setup map boundaries layer
  useEffect(() => {
    const INVISIBLE_LAYER_STYLE = {
      opacity: 0,
      fillOpacity: 0,
    };

    const handleRegionPopup = (e) => {
      if (sevenDayDataset === null) {
        return;
      }
      const map = mapRef.current.leafletElement;
      const layer = e.target;
      const featureCode = featureCodeForFeature(layer.feature);
      const regionData = sevenDayDataset.get(featureCode);
      var content =
        "<p class='region-popup'>" +
        regionData.name +
        "<br />Not available</p>";

      function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      }

      const count =
        currentValueTypeRef.current === VALUETYPE_DEATHS
          ? regionData.weeklyDeaths
          : regionData.weeklyCases;

      if (regionData) {
        content =
          "<div class='region-popup'><div>" +
          regionData.name.toUpperCase() +
          "</div><div class='map-date-range'>" +
          moment(regionData.fromDate).format("DD MMM") +
          " - " +
          moment(regionData.toDate).format("DD MMM") +
          "</div> <div class='map-cases-count'>" +
          toTitleCase(currentValueTypeRef.current) +
          ": " +
          count +
          "</div></div>";
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

    const BORDER_COLOUR = "black";
    const DARK_BORDER_COLOUR = "white";

    function getRegionStyle(featureCode) {
      const regionData = sevenDayDataset.get(featureCode);
      var count = 0;
      if (regionData) {
        count =
          VALUETYPE_DEATHS === valueType
            ? regionData.weeklyDeaths
            : regionData.weeklyCases;
      }

      return {
        color: darkmode ? DARK_BORDER_COLOUR : BORDER_COLOUR,
        fillColor: getRegionColour(count),
        opacity: 0.5,
        fillOpacity: 0.5,
        weight: 1,
      };
    }

    if (mapRef.current && mapRef.current.leafletElement) {
      mapRef.current.leafletElement.closePopup();
    }

    if (currentBoundariesLayer && sevenDayDataset) {
      currentBoundariesLayer.setStyle((feature) =>
        getRegionStyle(featureCodeForFeature(feature))
      );
    }
  }, [
    valueType,
    currentBoundariesLayer,
    currentHeatLevels,
    sevenDayDataset,
    darkmode,
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

  return (
    <div className={fullscreenEnabled ? "full-screen-geo-map" : "geo-map"}>
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
          url={darkmode ? DARK_MAP_TILES_URL : MAP_TILES_URL}
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
}

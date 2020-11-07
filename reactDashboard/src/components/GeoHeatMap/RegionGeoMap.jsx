import React, { useState, useEffect, useRef } from "react";
import "./GeoHeatMap.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Map as LeafletMap,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
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
import healthBoardBoundaries from "./geoJSONHealthBoards.json";
import councilAreaBoundaries from "./geoJSONCouncilAreas.json";
import Control from "react-leaflet-control";
import RegionTypeSelector from "./RegionTypeSelector";
import {
  setScotlandDefaultBounds,
  featureCodeForFeature,
  MAP_TILES_URL,
  DARK_MAP_TILES_URL,
} from "./GeoUtils";

/*
  geoJSONHealthBoards data from
  https://www.spatialdata.gov.scot/geonetwork/srv/eng/catalog.search;#/metadata/f12c3826-4b4b-40e6-bf4f-77b9ed01dc14
  geoJSONCouncilAreas data the district_borough_unitary_region dataset from
  https://osdatahub.os.uk/downloads/open/BoundaryLine

  Both were converted to WGS84 and simplified to 0.5% of original detail and converted to GEOJson using mapshaper.org
  Additionally, the non Scotland features of the council areas data were removed.
*/

const RegionGeoMap = ({
  councilAreaDataset,
  healthBoardDataset,
  regionCode = FEATURE_CODE_SCOTLAND,
  setRegionCode = null,
  darkmode,
}) => {
  const [councilAreaBoundariesLayer, setCouncilAreaBoundariesLayer] = useState(
    null
  );
  const [healthBoardBoundariesLayer, setHealthBoardBoundariesLayer] = useState(
    null
  );

  const [currentBoundariesLayer, setCurrentBoundariesLayer] = useState(null);
  const [areaType, setAreaType] = useState(AREATYPE_HEALTH_BOARDS);

  const mapRef = useRef();

  // Setup map boundaries layer
  useEffect(() => {
    const INVISIBLE_LAYER_STYLE = {
      opacity: 0,
      fillOpacity: 0,
    };

    const handleRegionPopup = (e) => {
      const layer = e.target;
      const featureCode = featureCodeForFeature(layer.feature);
      const content =
        "<p class='region-popup'><strong>" +
        getPlaceNameByFeatureCode(featureCode) +
        "</strong></p>";
      layer.bindTooltip(content).openTooltip(e.latlng);
    };

    const selectRegion = (e) => {
      const layer = e.target;
      const featureCode = featureCodeForFeature(layer.feature);
      setRegionCode((existing) =>
        featureCode === existing ? FEATURE_CODE_SCOTLAND : featureCode
      );
    };

    const regionLayerOptions = {
      style: INVISIBLE_LAYER_STYLE,
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: handleRegionPopup,
          click: selectRegion,
        });
      },
    };

    setCouncilAreaBoundariesLayer(
      L.geoJSON(councilAreaBoundaries, regionLayerOptions)
    );
    setHealthBoardBoundariesLayer(
      L.geoJSON(healthBoardBoundaries, regionLayerOptions)
    );
  }, [setRegionCode]);

  // Fit bounds and restrict the panning
  useEffect(() => {
    if (mapRef.current && mapRef.current.leafletElement) {
      setScotlandDefaultBounds(mapRef.current.leafletElement);
    }
  }, []);

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
    const SELECTED_COLOUR = "red";
    const UNSELECTED_COLOUR = "#000000";
    const BORDER_COLOUR = "#000000";
    const DARK_SELECTED_COLOUR = "#c1def1";
    const DARK_BORDER_COLOUR = "#ffffff";

    function getRegionStyle(featureCode) {
      return {
        color: darkmode ? DARK_BORDER_COLOUR : BORDER_COLOUR,
        fillColor:
          featureCode === regionCode
            ? darkmode
              ? DARK_SELECTED_COLOUR
              : SELECTED_COLOUR
            : UNSELECTED_COLOUR,
        opacity: 0.5,
        fillOpacity: featureCode === regionCode ? 0.5 : 0,
        weight: 1,
      };
    }

    if (mapRef.current && mapRef.current.leafletElement) {
      mapRef.current.leafletElement.closePopup();
    }

    if (currentBoundariesLayer) {
      currentBoundariesLayer.setStyle((feature) =>
        getRegionStyle(featureCodeForFeature(feature))
      );
    }
  }, [regionCode, currentBoundariesLayer, darkmode]);

  return (
    <div className="geo-map">
      <LeafletMap
        ref={mapRef}
        id="regionmap"
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
        <Control position="topleft">
          <RegionTypeSelector areaType={areaType} setAreaType={setAreaType} />
        </Control>
      </LeafletMap>
    </div>
  );
};

export default RegionGeoMap;

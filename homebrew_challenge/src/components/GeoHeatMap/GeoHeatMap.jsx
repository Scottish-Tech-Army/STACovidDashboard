import React, { useState, useEffect } from "react";
import { format, subDays, subYears } from "date-fns";
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
    const queryTotalCasesByHealthBoard =
      `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dim: <http://purl.org/linked-data/sdmx/2009/dimension#>
    PREFIX qb: <http://purl.org/linked-data/cube#>
    SELECT ?date ?areaname ?count
    WHERE {
      VALUES (?value) {
        ( <http://statistics.gov.scot/def/concept/variable/testing-cumulative-people-tested-for-covid-19-positive> )
       }
       VALUES (?perioduri ?date) {` +
      getDaysDateValueClause() +
      `}
      ?obs qb:dataSet <http://statistics.gov.scot/data/coronavirus-covid-19-management-information> .
      ?obs <http://statistics.gov.scot/def/measure-properties/count> ?count .
      ?obs <http://statistics.gov.scot/def/dimension/variable> ?value .
        ?areauri <http://publishmydata.com/def/ontology/foi/memberOf> <http://statistics.gov.scot/def/foi/collection/health-boards> .
      ?obs dim:refArea ?areauri .
      ?areauri rdfs:label ?areaname.
      ?obs dim:refPeriod ?perioduri .
    }`;

    function getDaysDateValueClause() {
      const today = Date.now();
      const yesterday = subDays(Date.now(), 1);
      const dayBefore = subDays(Date.now(), 2);

      const singleLine = (date) => {
        const dateString = format(date, "yyyy-MM-dd");
        return (
          "( <http://reference.data.gov.uk/id/day/" +
          dateString +
          '> "' +
          dateString +
          '" )'
        );
      };
      return (
        singleLine(today) +
        singleLine(yesterday) +
        singleLine(yesterday) +
        singleLine(dayBefore)
      );
    }

    const queryTotalDeathsByCouncilArea =
      `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX dim: <http://purl.org/linked-data/sdmx/2009/dimension#>    SELECT ?date ?areaname ?count
        WHERE {
          VALUES (?perioduri ?date) {` +
      getYearsDateValueClause() +
      `}
        ?obs <http://purl.org/linked-data/cube#dataSet> <http://statistics.gov.scot/data/deaths-involving-coronavirus-covid-19> .
        ?obs <http://statistics.gov.scot/def/dimension/sex> <http://statistics.gov.scot/def/concept/sex/all>.
        ?obs <http://statistics.gov.scot/def/dimension/age> <http://statistics.gov.scot/def/concept/age/all>.
        ?obs <http://statistics.gov.scot/def/dimension/causeofdeath> <http://statistics.gov.scot/def/concept/causeofdeath/covid-19-related>.
        ?obs <http://statistics.gov.scot/def/dimension/locationofdeath> <http://statistics.gov.scot/def/concept/locationofdeath/all>.
        ?obs <http://statistics.gov.scot/def/measure-properties/count> ?count .
        ?obs dim:refArea ?areauri .
        ?obs dim:refPeriod ?perioduri .
        ?areauri <http://publishmydata.com/def/ontology/foi/memberOf> <http://statistics.gov.scot/def/foi/collection/council-areas> .
        ?areauri rdfs:label ?areaname
        }`;

    function getYearsDateValueClause() {
      const thisYear = Date.now();
      const lastYear = subYears(Date.now(), 1);
      const singleLine = (date) => {
        const dateString = format(date, "yyyy");
        return (
          "( <http://reference.data.gov.uk/id/year/" +
          dateString +
          '> "' +
          dateString +
          '" )'
        );
      };
      return singleLine(thisYear) + singleLine(lastYear);
    }

    const queryTotalDeathsByHealthBoard =
      `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dim: <http://purl.org/linked-data/sdmx/2009/dimension#>    SELECT ?date ?areaname ?count
    WHERE {
      VALUES (?perioduri ?date) {` +
      getDateValueClause() +
      `}
    ?obs <http://purl.org/linked-data/cube#dataSet> <http://statistics.gov.scot/data/deaths-involving-coronavirus-covid-19> .
    ?obs <http://statistics.gov.scot/def/dimension/sex> <http://statistics.gov.scot/def/concept/sex/all>.
    ?obs <http://statistics.gov.scot/def/dimension/age> <http://statistics.gov.scot/def/concept/age/all>.
    ?obs <http://statistics.gov.scot/def/dimension/causeofdeath> <http://statistics.gov.scot/def/concept/causeofdeath/covid-19-related>.
    ?obs <http://statistics.gov.scot/def/dimension/locationofdeath> <http://statistics.gov.scot/def/concept/locationofdeath/all>.
    ?obs <http://statistics.gov.scot/def/measure-properties/count> ?count .
    ?obs dim:refArea ?areauri .
    ?obs dim:refPeriod ?perioduri .
    ?areauri <http://publishmydata.com/def/ontology/foi/memberOf> <http://statistics.gov.scot/def/foi/collection/health-boards> .
    ?areauri rdfs:label ?areaname
    }`;

    function getDateValueClause() {
      const thisYear = Date.now();
      const lastYear = subYears(Date.now(), 1);
      const singleLine = (date) => {
        const dateString = format(date, "yyyy");
        return (
          "( <http://reference.data.gov.uk/id/year/" +
          dateString +
          '> "' +
          dateString +
          '" )'
        );
      };
      return singleLine(thisYear) + singleLine(lastYear);
    }

    if (VALUETYPE_DEATHS === valueType) {
      if (AREATYPE_COUNCIL_AREAS === areaType) {
        if (null === totalDeathsByCouncilArea) {
          fetchAndStore(
            queryTotalDeathsByCouncilArea,
            setTotalDeathsByCouncilArea,
            parseCsvData
          );
        }
      } else {
        // AREATYPE_HEALTH_BOARDS == areaType
        if (null === totalDeathsByHealthBoard) {
          fetchAndStore(
            queryTotalDeathsByHealthBoard,
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
            queryTotalCasesByHealthBoard,
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
  //const tilesStadiaAlidadeSmoothDark = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';

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

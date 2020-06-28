import React, { useState, useEffect } from "react";
import "./Heatmap.css";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import {
  AREATYPE_COUNCIL_AREAS,
  VALUETYPE_DEATHS,
} from "../HeatmapDataSelector/HeatmapConsts";
import {
  readCsvData,
  createPlaceDateValueMap,
  fetchAndStore,
} from "../Utils/CsvUtils";
import Table from "react-bootstrap/Table";

const queryDeathsByCouncilArea = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dim: <http://purl.org/linked-data/sdmx/2009/dimension#>

SELECT ?date ?areaname ?count WHERE {
?obs <http://purl.org/linked-data/cube#dataSet> <http://statistics.gov.scot/data/deaths-involving-coronavirus-covid-19> .
?obs <http://statistics.gov.scot/def/dimension/sex> <http://statistics.gov.scot/def/concept/sex/all>.
?obs <http://statistics.gov.scot/def/dimension/age> <http://statistics.gov.scot/def/concept/age/all>.
?obs <http://statistics.gov.scot/def/dimension/causeofdeath> <http://statistics.gov.scot/def/concept/causeofdeath/covid-19-related>.
?obs <http://statistics.gov.scot/def/measure-properties/count> ?count .
?obs <http://statistics.gov.scot/def/dimension/locationofdeath> <http://statistics.gov.scot/def/concept/locationofdeath/all>.
?obs dim:refArea ?areauri .
?obs dim:refPeriod ?perioduri .
?areauri <http://publishmydata.com/def/ontology/foi/memberOf> <http://statistics.gov.scot/def/foi/collection/council-areas> .
?areauri rdfs:label ?areaname.
?perioduri rdfs:label ?date
FILTER regex(?date, "^w")
}`;

const queryDeathsByHealthBoard = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dim: <http://purl.org/linked-data/sdmx/2009/dimension#>

SELECT ?date ?areaname ?count WHERE {
?obs <http://purl.org/linked-data/cube#dataSet> <http://statistics.gov.scot/data/deaths-involving-coronavirus-covid-19> .
?obs <http://statistics.gov.scot/def/dimension/sex> <http://statistics.gov.scot/def/concept/sex/all>.
?obs <http://statistics.gov.scot/def/dimension/age> <http://statistics.gov.scot/def/concept/age/all>.
?obs <http://statistics.gov.scot/def/dimension/locationofdeath> <http://statistics.gov.scot/def/concept/locationofdeath/all>.
?obs <http://statistics.gov.scot/def/dimension/causeofdeath> <http://statistics.gov.scot/def/concept/causeofdeath/covid-19-related>.
?obs <http://statistics.gov.scot/def/measure-properties/count> ?count .
?obs dim:refArea ?areauri .
?areauri <http://publishmydata.com/def/ontology/foi/memberOf> <http://statistics.gov.scot/def/foi/collection/health-boards> .
?areauri rdfs:label ?areaname.
?obs dim:refPeriod ?perioduri .
?perioduri rdfs:label ?date
FILTER regex(?date, "^w")
}`;

const queryCasesByHealthBoard = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dim: <http://purl.org/linked-data/sdmx/2009/dimension#>
PREFIX qb: <http://purl.org/linked-data/cube#>

SELECT ?date ?areaname ?count WHERE {
?obs qb:dataSet <http://statistics.gov.scot/data/coronavirus-covid-19-management-information> .
?obs <http://statistics.gov.scot/def/measure-properties/count> ?count .
?obs <http://statistics.gov.scot/def/dimension/variable> <http://statistics.gov.scot/def/concept/variable/testing-cumulative-people-tested-for-covid-19-positive> .
?obs dim:refArea ?areauri .
?areauri <http://publishmydata.com/def/ontology/foi/memberOf> <http://statistics.gov.scot/def/foi/collection/health-boards> .
?areauri rdfs:label ?areaname.
?obs dim:refPeriod ?perioduri .
?perioduri rdfs:label ?date
}`;

// Exported for tests
export function parseCsvData(csvData) {
  var lines = readCsvData(csvData);

  const { dates, placeDateValueMap } = createPlaceDateValueMap(lines);

  const regions = [];
  placeDateValueMap.forEach((dateValueMap, place) => {
    const values = [];
    var total = 0;
    dates.forEach((date) => {
      const value = dateValueMap.get(date);
      values.push(value);
      total += value;
    });
    regions.push({ name: place, totalDeaths: total, counts: values });
  });

  return { dates: dates, regions: regions };
}

// Exported for tests
// Extract diffs of cumulative data
export function parseDiffCsvData(csvData) {
  var lines = readCsvData(csvData);

  const { dates, placeDateValueMap } = createPlaceDateValueMap(lines);

  const placeDateValueDiffMap = new Map();
  placeDateValueMap.forEach((dateValueMap, place) => {
    const dateValueDiffMap = new Map();
    var previousValue = 0;
    const sortedDateValueMap = new Map([...dateValueMap].sort());
    sortedDateValueMap.forEach((value, date) => {
      dateValueDiffMap.set(date, value - previousValue);
      previousValue = value;
    });
    placeDateValueDiffMap.set(place, dateValueDiffMap);
  });

  const regions = [];
  placeDateValueDiffMap.forEach((dateValueMap, place) => {
    const values = [];
    var total = 0;
    dates.forEach((date) => {
      const value = dateValueMap.get(date);
      values.push(value);
      total += value;
    });
    regions.push({ name: place, totalDeaths: total, counts: values });
  });
  return { dates: dates, regions: regions };
}

function Heatmap({
  valueType = VALUETYPE_DEATHS,
  areaType = AREATYPE_COUNCIL_AREAS,
}) {
  // Remember to update the css classes if level count changes
  const heatLevels = [0, 1, 5, 10, 100, 200];

  const [councilAreasDeathsDataset, setCouncilAreasDeathsDataset] = useState(
    null
  );
  const [healthBoardsDeathsDataset, setHealthBoardsDeathsDataset] = useState(
    null
  );
  const [healthBoardsCasesDataset, setHealthBoardsCasesDataset] = useState(
    null
  );

  function createHeatbar(elements) {
    const width = 200;
    const height = 20;
    const viewBox = "0 0 " + width + " " + height;
    const count = elements.length;
    const elementWidth = width / count;
    const offset = elementWidth / 2;

    function createHeatbarline(element, index) {
      const x = offset + elementWidth * index;
      return (
        <line
          key={index}
          className={"l-" + element}
          x1={x}
          y1="0"
          x2={x}
          y2="100%"
          strokeWidth={elementWidth}
        ></line>
      );
    }

    return (
      <svg
        viewBox={viewBox}
        preserveAspectRatio="none"
        height="100%"
        width="100%"
      >
        {elements.map(createHeatbarline)}
      </svg>
    );
  }

  function getHeatLevel(count) {
    var i;
    for (i = heatLevels.length - 1; i >= 0; i--) {
      if (heatLevels[i] <= count) {
        return i;
      }
    }
    return 0;
  }

  function createRegionTableline({ name, totalDeaths, counts }, index) {
    return (
      <tr className="area" key={index}>
        <td>{name}</td>
        <td>{totalDeaths}</td>
        <td className="heatbarCell">
          <div className="heatbarLine">
            {createHeatbar(counts.map(getHeatLevel))}
          </div>
        </td>
      </tr>
    );
  }

  useEffect(() => {
    if (VALUETYPE_DEATHS === valueType) {
      if (AREATYPE_COUNCIL_AREAS === areaType) {
        if (null === councilAreasDeathsDataset) {
          fetchAndStore(
            queryDeathsByCouncilArea,
            setCouncilAreasDeathsDataset,
            parseCsvData
          );
        }
      } else {
        // AREATYPE_HEALTH_BOARDS == areaType
        if (null === healthBoardsDeathsDataset) {
          fetchAndStore(
            queryDeathsByHealthBoard,
            setHealthBoardsDeathsDataset,
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
        if (null === healthBoardsCasesDataset) {
          fetchAndStore(
            queryCasesByHealthBoard,
            setHealthBoardsCasesDataset,
            parseDiffCsvData
          );
        }
      }
    }
  }, [
    valueType,
    areaType,
    councilAreasDeathsDataset,
    healthBoardsDeathsDataset,
    healthBoardsCasesDataset,
  ]);

  function getDataSet() {
    if (VALUETYPE_DEATHS === valueType) {
      if (AREATYPE_COUNCIL_AREAS === areaType) {
        return councilAreasDeathsDataset;
      } else {
        // AREATYPE_HEALTH_BOARDS == areaType
        return healthBoardsDeathsDataset;
      }
    } else {
      // VALUETYPE_CASES === valueType
      if (AREATYPE_COUNCIL_AREAS === areaType) {
        return null;
      } else {
        // AREATYPE_HEALTH_BOARDS == areaType
        return healthBoardsCasesDataset;
      }
    }
  }

  function renderTableBody() {
    const dataset = getDataSet();
    if (dataset !== null) {
      return dataset.regions.map(createRegionTableline);
    }
    return null;
  }

  function areaTitle() {
    return AREATYPE_COUNCIL_AREAS === areaType
      ? "Council Areas"
      : "Health Boards";
  }

  function valueTitle() {
    return VALUETYPE_DEATHS === valueType ? "Total Deaths" : "Total Cases";
  }

  function timeRangeTitle() {
    return VALUETYPE_DEATHS === valueType ? "Weekly Count" : "Daily Count";
  }

  if (getDataSet() === null) {
    return <LoadingComponent />;
  }

  function heatbarScale() {
    return (
      <div className="heatmapScale">
        {heatLevels.map((value, index) => {
          return (
            <span key={index} className={"l-" + index}>
              &ge;&nbsp;{value}
            </span>
          );
        })}{" "}
      </div>
    );
  }

  return (
    <div className="heatmap">
      <Table size="sm">
        <thead>
          <tr>
            <th>{areaTitle()}</th>
            <th>{valueTitle()}</th>
            <th>
              {timeRangeTitle()}
              <br />
              {heatbarScale()}
            </th>
          </tr>
        </thead>
        <tbody>{renderTableBody()}</tbody>
      </Table>
    </div>
  );
}

export default Heatmap;

import React, { useState, useEffect } from "react";
import "./Heatmap.css";
import {
  AREATYPE_COUNCIL_AREAS,
  VALUETYPE_DEATHS,
} from "../HeatmapContainer/HeatmapConsts";

/*const defaultDataset = {
  dates: ["1-May", "2-May", "3-May", "4-May", "5-May", "6-May"],
  regions: [
    {
      name: "Edinburgh",
      totalDeaths: "234",
      counts: [-10, 1, 5, 10, 100, 200],
    },
    {
      name: "Glasgow",
      totalDeaths: "345",
      counts: [10, 100, 200, 0, 1, 5],
    },
  ],
};*/

const queryUrl = "http://statistics.gov.scot/sparql.csv";

const queryDeathsByCouncilArea = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dim: <http://purl.org/linked-data/sdmx/2009/dimension#>

SELECT ?date ?areaname ?count WHERE {
?obs <http://purl.org/linked-data/cube#dataSet> <http://statistics.gov.scot/data/deaths-involving-coronavirus-covid-19> .
?obs <http://statistics.gov.scot/def/dimension/sex> <http://statistics.gov.scot/def/concept/sex/all>.
?obs <http://statistics.gov.scot/def/dimension/age> <http://statistics.gov.scot/def/concept/age/all>.
?obs <http://statistics.gov.scot/def/dimension/causeOfDeath> <http://statistics.gov.scot/def/concept/cause-of-death/covid-19-related>.
?obs <http://statistics.gov.scot/def/measure-properties/count> ?count .
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
?obs <http://statistics.gov.scot/def/dimension/causeOfDeath> <http://statistics.gov.scot/def/concept/cause-of-death/covid-19-related>.
?obs <http://statistics.gov.scot/def/measure-properties/count> ?count .
?obs dim:refArea ?areauri .
?obs dim:refPeriod ?perioduri .
?areauri <http://publishmydata.com/def/ontology/foi/memberOf> <http://statistics.gov.scot/def/foi/collection/health-boards> .
?areauri rdfs:label ?areaname.
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

function createPlaceDateValueMap(lines) {
  const placeDateValueMap = new Map();
  const dateSet = new Set();

  lines.forEach(([date, place, count], i) => {
    if (!placeDateValueMap.has(place)) {
      placeDateValueMap.set(place, new Map());
    }
    var dateValueMap = placeDateValueMap.get(place);
    dateValueMap.set(date, count === "*" ? 0 : Number(count));
    dateSet.add(date);
  });

  const sortedPlaceDateValueMap = new Map([...placeDateValueMap].sort());
  const dates = [...dateSet].sort();
  return { dates: dates, placeDateValueMap: sortedPlaceDateValueMap };
}

export function readCsvData(csvData) {
  var allTextLines = csvData.split(/\r\n|\n/);
  var lines = [];

  allTextLines.forEach((line) => {
    if (line.length > 0) {
      lines.push(line.split(",").map((s) => s.trim()));
    }
  });
  lines.shift();
  return lines;
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

function Heatmap({ valueType = VALUETYPE_DEATHS, areaType = AREATYPE_COUNCIL_AREAS }) {
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

  function createHeatbar(width, height, elements) {
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
      <svg width={width} height={height}>
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
        <td>{createHeatbar(500, 20, counts.map(getHeatLevel))}</td>
      </tr>
    );
  }

  useEffect(() => {
    function fetchAndStore(query, setDataset, processCsvData) {
      const form = new FormData();
      form.append("query", query);
      fetch(queryUrl, {
        method: "POST",
        body: form,
      })
        .then((res) => res.text())
        .then((csvData) => {
          setDataset(processCsvData(csvData));
        })
        .catch((error) => {
          console.error(error);
        });
    }

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
}, [valueType, areaType, councilAreasDeathsDataset, healthBoardsDeathsDataset, healthBoardsCasesDataset]);

  function renderTableBody() {
    var dataset = null;
    if (VALUETYPE_DEATHS === valueType) {
      if (AREATYPE_COUNCIL_AREAS === areaType) {
        dataset = councilAreasDeathsDataset;
      } else {
        // AREATYPE_HEALTH_BOARDS == areaType
        dataset = healthBoardsDeathsDataset;
      }
    } else {
      // VALUETYPE_CASES === valueType
      if (AREATYPE_COUNCIL_AREAS === areaType) {
      } else {
        // AREATYPE_HEALTH_BOARDS == areaType
        dataset = healthBoardsCasesDataset;
      }
    }
    if (dataset !== null) {
      return dataset.regions.map(createRegionTableline);
    }
    return <></>;
  }

  function areaTitle() {
      return (AREATYPE_COUNCIL_AREAS === areaType) ? "Council Areas" : "Health Boards";
  }

  function valueTitle() {
      return (VALUETYPE_DEATHS === valueType) ? "Total deaths" : "Total cases";
  }

  function timeRangeTitle() {
      return (VALUETYPE_DEATHS === valueType) ? "Weekly count" : "Daily count";
  }

  return (
    <div className="heatmap">
      <table>
        <thead>
          <tr>
            <th>{areaTitle()}</th>
            <th>{valueTitle()}</th>
            <th>{timeRangeTitle()}</th>
          </tr>
        </thead>
        <tbody>{renderTableBody()}</tbody>
      </table>
    </div>
  );
}

export default Heatmap;

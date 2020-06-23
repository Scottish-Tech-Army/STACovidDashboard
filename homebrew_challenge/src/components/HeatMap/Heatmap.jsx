import React, { useState, useEffect } from "react";
import "./Heatmap.css";

const defaultDataset = {
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
};

const queryUrl = "http://statistics.gov.scot/sparql.csv";

const query = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
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

// Exported for tests
export function parseCsvData(csvData) {
  var allTextLines = csvData.split(/\r\n|\n/);
  var lines = [];

  allTextLines.forEach((line) => {
    if (line.length > 0) {
      lines.push(line.split(",").map((s) => s.trim()));
    }
  });
  lines.shift();

  const valueMap = new Map();
  const dateSet = new Set();

  lines.forEach(([date, place, count], i) => {
    if (!valueMap.has(place)) {
      valueMap.set(place, new Map());
    }
    var dateMap = valueMap.get(place);
    dateMap.set(date, Number(count));
    dateSet.add(date);
  });

  const sortedValueMap = new Map([...valueMap].sort());
  const dates = [...dateSet].sort();
  const regions = [];
  sortedValueMap.forEach((dateMap, place) => {
    const values = [];
    var total = 0;
    dates.forEach((date) => {
      const value = dateMap.get(date);
      values.push(value);
      total += value;
    });
    regions.push({ name: place, totalDeaths: total, counts: values });
  });

  return { dates: dates, regions: regions };
}

function Heatmap() {
  // Remember to update the css classes if level count changes
  const heatLevels = [0, 1, 5, 10, 100, 200];

  const [dataset, setDataset] = useState(defaultDataset);

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
    const form = new FormData();
    form.append("query", query);
    fetch(queryUrl, {
      method: "POST",
      body: form,
    })
      .then((res) => res.text())
      .then((csvData) => {
        setDataset(parseCsvData(csvData));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="heatmap">
      <table>
        <thead>
          <tr>
            <th>Area</th>
            <th>Total deaths</th>
            <th>Cases over time</th>
          </tr>
        </thead>
        <tbody>{dataset.regions.map(createRegionTableline)}</tbody>
      </table>
    </div>
  );
}

export default Heatmap;

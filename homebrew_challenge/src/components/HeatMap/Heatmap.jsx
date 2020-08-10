import React, { useState, useEffect } from "react";
import "./Heatmap.css";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
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
import { format } from "date-fns";
import Table from "react-bootstrap/Table";

const councilAreaCsv = "dailyCouncilAreas.csv";
const healthBoardCsv = "dailyHealthBoards.csv";

// Exported for tests
export function parseCsvData(csvData) {
  var lines = readCsvData(csvData);

  const { dates, placeDateValuesMap } = createPlaceDateValuesMap(lines);

  var regions = [];
  placeDateValuesMap.forEach((dateValuesMap, featureCode) => {
    const allCases = [];
    const allDeaths = [];
    var totalDeaths = 0;
    dates.forEach((date) => {
      const { cases, deaths, cumulativeDeaths } = dateValuesMap.get(date);
      allCases.push(cases);
      allDeaths.push(deaths);
      totalDeaths = cumulativeDeaths;
    });
    regions.push({
      name: getPlaceNameByFeatureCode(featureCode),
      totalDeaths: totalDeaths,
      cases: allCases,
      deaths: allDeaths,
    });
  });
  regions = regions.sort((a, b) => (a.name < b.name ? -1 : 1));
  return { dates: dates, regions: regions };
}

function Heatmap({
  valueType = VALUETYPE_DEATHS,
  areaType = AREATYPE_COUNCIL_AREAS,
}) {
  // Remember to update the css classes if level count changes
  const heatLevels = [0, 1, 5, 10, 100, 200];

  const [councilAreasDataset, setCouncilAreasDataset] = useState(null);
  const [healthBoardsDataset, setHealthBoardsDataset] = useState(null);

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

  function createRegionTableline({ name, totalDeaths, cases, deaths }, index) {
    const counts = VALUETYPE_DEATHS === valueType ? deaths : cases;
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
    if (AREATYPE_COUNCIL_AREAS === areaType) {
      if (null === councilAreasDataset) {
        fetchAndStore(councilAreaCsv, setCouncilAreasDataset, parseCsvData);
      }
    } else {
      // AREATYPE_HEALTH_BOARDS == areaType
      if (null === healthBoardsDataset) {
        fetchAndStore(healthBoardCsv, setHealthBoardsDataset, parseCsvData);
      }
    }
  }, [areaType, councilAreasDataset, healthBoardsDataset]);

  function getDataSet() {
    if (AREATYPE_COUNCIL_AREAS === areaType) {
      return councilAreasDataset;
    } else {
      // AREATYPE_HEALTH_BOARDS == areaType
      return healthBoardsDataset;
    }
  }

  function dateRangeTableCell() {
    function formatDate(date) {
      return format(date, "dd MMM yyyy");
    }
    const dataset = getDataSet();
    const dates = dataset["dates"];
    let startDate = dates[0];
    let endDate = dates[dates.length - 1];

    if (!startDate || !endDate) {
      return <td className="flex-container">Data not available</td>;
    }

    return (
      <td className="flex-container">
        <div>{formatDate(startDate)}</div>
        <div>{formatDate(endDate)}</div>
      </td>
    );
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
              Daily Count
              <br />
              {heatbarScale()}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            {dateRangeTableCell()}
          </tr>
          {renderTableBody()}
        </tbody>
      </Table>
    </div>
  );
}

export default Heatmap;

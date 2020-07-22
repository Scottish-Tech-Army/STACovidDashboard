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
import { format, addDays } from "date-fns";
import Table from "react-bootstrap/Table";

const deathsByCouncilAreaCsv = "weeklyCouncilAreasDeaths.csv";
const deathsByHealthBoardCsv = "weeklyHealthBoardsDeaths.csv";
const casesByHealthBoardCsv = "dailyHealthBoardsCases.csv";

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
            deathsByCouncilAreaCsv,
            setCouncilAreasDeathsDataset,
            parseCsvData
          );
        }
      } else {
        // AREATYPE_HEALTH_BOARDS == areaType
        if (null === healthBoardsDeathsDataset) {
          fetchAndStore(
            deathsByHealthBoardCsv,
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
            casesByHealthBoardCsv,
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

  function dateRangeTableCell() {
    function formatDate(date) {
      return format(date, "dd MMM yyyy");
    }
    const dataset = getDataSet();
    const dates = dataset["dates"];
    let startDate = dates[0];
    let endDate = dates[dates.length - 1];

    if (!startDate || !endDate) {
        return (
          <td className="flex-container">
            Data not available
          </td>
        );
    }

    // add 6 days to date to get last day of the w/c... date
    if (VALUETYPE_DEATHS === valueType) {
      endDate = addDays(endDate, 6);
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

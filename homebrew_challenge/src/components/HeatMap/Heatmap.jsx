import React, { useState, useEffect } from "react";
import "./Heatmap.css";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import {
  AREATYPE_COUNCIL_AREAS,
  VALUETYPE_DEATHS,
} from "../HeatmapDataSelector/HeatmapConsts";
import {
  createPlaceDateValuesMap,
  getPlaceNameByFeatureCode,
} from "../Utils/CsvUtils";
import { format } from "date-fns";
import Table from "react-bootstrap/Table";

// Exported for tests
export function parseCsvData(csvData) {
  const { dates, placeDateValuesMap } = createPlaceDateValuesMap(csvData);

  var regions = [];
  placeDateValuesMap.forEach((dateValuesMap, featureCode) => {
    const allCases = [];
    const allDeaths = [];
    var totalCases = 0;
    var totalDeaths = 0;
    dates.forEach((date) => {
      const {
        cases,
        deaths,
        cumulativeCases,
        cumulativeDeaths,
      } = dateValuesMap.get(date);
      allCases.push(cases);
      allDeaths.push(deaths);
      // Only using the last of each of the cumulative values
      totalCases = cumulativeCases;
      totalDeaths = cumulativeDeaths;
    });
    regions.push({
      name: getPlaceNameByFeatureCode(featureCode),
      totalDeaths: totalDeaths,
      totalCases: totalCases,
      cases: allCases,
      deaths: allDeaths,
    });
  });
  regions = regions.sort((a, b) => (a.name < b.name ? -1 : 1));
  return { dates: dates, regions: regions };
}

export function createHeatbarLines(elements, createHeatbarLine, region, dates) {
  function formatDate(date) {
    return format(date, "dd MMM");
  }

  const result = [];
  var i = 0;
  while (i < elements.length) {
    const startElement = elements[i];
    var width = 1;
    for (width = 1; i + width < elements.length; width++) {
      if (startElement !== elements[i + width]) {
        break;
      }
    }
    const dateString =
      width === 1
        ? formatDate(dates[i])
        : formatDate(dates[i]) + " - " + formatDate(dates[i + width - 1]);

    result.push(
      createHeatbarLine(startElement, i, width, region + "\n" + dateString)
    );
    i += width;
  }

  return result;
}

function Heatmap({
  councilAreaDataset,
  healthBoardDataset,
  valueType = VALUETYPE_DEATHS,
  areaType = AREATYPE_COUNCIL_AREAS,
}) {
  // Remember to update the css classes if level count changes
  const heatLevels = [0, 1, 5, 10, 100, 200];

  const [parsedHealthBoardDataset, setParsedHealthBoardDataset] = useState(
    null
  );
  const [parsedCouncilAreaDataset, setParsedCouncilAreaDataset] = useState(
    null
  );

  function createHeatbar(elements, region, dates) {
    const width = 300;
    const height = 15;
    const viewBox = "0 0 " + width + " " + height;
    const count = elements.length;
    const elementWidth = width / count;

    function createHeatbarLine(element, startIndex, width, titleText) {
      const x = elementWidth * (startIndex + width / 2);
      return (
        <line
          key={startIndex}
          className={"l-" + element}
          x1={x}
          y1="0"
          x2={x}
          y2="100%"
          strokeWidth={elementWidth * width}
        >
          <title>{titleText}</title>
        </line>
      );
    }

    return (
      <svg className="heatbar" viewBox={viewBox} preserveAspectRatio="none">
        {createHeatbarLines(elements, createHeatbarLine, region, dates)}
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

  function createRegionTableline(
    { name, totalDeaths, totalCases, cases, deaths },
    index,
    dates
  ) {
    const counts = VALUETYPE_DEATHS === valueType ? deaths : cases;
    const total = VALUETYPE_DEATHS === valueType ? totalDeaths : totalCases;
    return (
      <tr className="area" key={index}>
        <td>{name}</td>
        <td>{total}</td>
        <td className="heatbarCell">
          <div className="heatbarLine">
            {createHeatbar(counts.map(getHeatLevel), name, dates)}
          </div>
        </td>
      </tr>
    );
  }

  // Parse datasets
  useEffect(() => {
    if (null !== councilAreaDataset && null === parsedCouncilAreaDataset) {
      setParsedCouncilAreaDataset(parseCsvData(councilAreaDataset));
    }
    if (null !== healthBoardDataset && null === parsedHealthBoardDataset) {
      setParsedHealthBoardDataset(parseCsvData(healthBoardDataset));
    }
  }, [
    healthBoardDataset,
    councilAreaDataset,
    parsedHealthBoardDataset,
    parsedCouncilAreaDataset,
  ]);

  function getDataSet() {
    if (AREATYPE_COUNCIL_AREAS === areaType) {
      return parsedCouncilAreaDataset;
    } else {
      // AREATYPE_HEALTH_BOARDS == areaType
      return parsedHealthBoardDataset;
    }
  }

  function totalCountTableCell() {
    const dataset = getDataSet();
    if (dataset !== null) {
      const total = dataset.regions.reduce(
        (acc, { totalDeaths, totalCases }) =>
          acc + (VALUETYPE_DEATHS === valueType ? totalDeaths : totalCases),
        0
      );
      if (total > 0) {
        return <th>{total}</th>;
      }
    }
    return <th></th>;
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
      return <th className="flex-container">Data not available</th>;
    }

    return (
      <th className="flex-container">
        <div>{formatDate(startDate)}</div>
        <div>{formatDate(endDate)}</div>
      </th>
    );
  }

  function renderTableBody() {
    const dataset = getDataSet();
    if (dataset !== null) {
      return dataset.regions.map((region, i) =>
        createRegionTableline(region, i, dataset.dates)
      );
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
            <span key={"small" + index} className={"smallscale l-" + index}>
              {value}
            </span>
        );
      })}
      {heatLevels.map((value, index) => {
        return (
            <span key={"large" + index} className={"largescale l-" + index}>
              &ge;&nbsp;{value}
            </span>
        );
      })}
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
          <tr>
            <th></th>
            {totalCountTableCell()}
            {dateRangeTableCell()}
          </tr>
        </thead>
        <tbody>{renderTableBody()}</tbody>
      </Table>
    </div>
  );
}

export default Heatmap;

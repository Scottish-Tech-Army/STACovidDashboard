import React, { useState, useEffect } from "react";
import "./Heatmap.css";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  AREATYPE_COUNCIL_AREAS,
  VALUETYPE_DEATHS,
} from "../HeatmapDataSelector/HeatmapConsts";
import {
  createPlaceDateValuesMap,
  getPlaceNameByFeatureCode,
  FEATURE_CODE_SCOTLAND,
} from "../Utils/CsvUtils";
import { format } from "date-fns";
import Table from "react-bootstrap/Table";

// Exported for tests
export function parseCsvData(csvData) {
  const { dates, placeDateValuesMap } = createPlaceDateValuesMap(csvData);

  var regions = [];
  var scotland = null;
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
    const region = {
      featureCode: featureCode,
      name: getPlaceNameByFeatureCode(featureCode),
      totalDeaths: totalDeaths,
      totalCases: totalCases,
      cases: allCases,
      deaths: allDeaths,
    };
    if (featureCode === FEATURE_CODE_SCOTLAND) {
      scotland = region;
    } else {
      regions.push(region);
    }
  });
  regions = regions.sort((a, b) => (a.name < b.name ? -1 : 1));

  if (scotland == null) {
    scotland = getScotlandRegion(regions);
  }
  return { dates: dates, scotland: scotland, regions: regions };
}

// Exported for tests
export function getScotlandRegion(regions) {
  var result = regions.find(
    ({ featureCode }) => featureCode === FEATURE_CODE_SCOTLAND
  );
  if (result !== undefined) {
    return result;
  }
  // Calculate Scotland region
  const dayCount = regions[0] ? regions[0].cases.length : 0;

  result = {
    featureCode: FEATURE_CODE_SCOTLAND,
    name: getPlaceNameByFeatureCode(FEATURE_CODE_SCOTLAND),
    totalDeaths: 0,
    totalCases: 0,
    cases: Array(dayCount).fill(0),
    deaths: Array(dayCount).fill(0),
  };

  regions.forEach(({ totalDeaths, totalCases, cases, deaths }) => {
    result.totalDeaths += totalDeaths;
    result.totalCases += totalCases;
    for (let i = 0; i < dayCount; i++) {
      result.cases[i] += cases[i];
      result.deaths[i] += deaths[i];
    }
  });
  return result;
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
  const heatLevels = [0, 1, 2, 5, 10, 20, 50, 100];

  const [parsedHealthBoardDataset, setParsedHealthBoardDataset] = useState(
    null
  );
  const [parsedCouncilAreaDataset, setParsedCouncilAreaDataset] = useState(
    null
  );

  function createHeatbar(elements, region, dates) {
    const width = 20;
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
    { featureCode, name, totalDeaths, totalCases, cases, deaths },
    index,
    dates
  ) {
    const counts = VALUETYPE_DEATHS === valueType ? deaths : cases;
    const total = VALUETYPE_DEATHS === valueType ? totalDeaths : totalCases;
    return (
      <tr  className={featureCode === FEATURE_CODE_SCOTLAND ? "scotland-total area": "area"} key={index}>
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

  function dateRangeText() {
    function formatDate(date) {
      return format(date, "dd MMM yyyy");
    }

    const dataset = getDataSet();
    const dates = dataset["dates"];
    let startDate = dates[0];
    let endDate = dates[dates.length - 1];

    if (!startDate || !endDate) {
      return "Data not available";
    }

    return formatDate(startDate) + " - " + formatDate(endDate);
  }

  function renderTableBody() {
    const dataset = getDataSet();
    if (dataset === null) {
      return [];
    }
    if (dataset.regions.length === 0) {
      return [];
    }
    const result = dataset.regions.map((region, i) =>
      createRegionTableline(region, i + 1, dataset.dates)
    );

    result.unshift(createRegionTableline(dataset.scotland, 0, dataset.dates));
    return result;
  }

  function areaTitle() {
    return AREATYPE_COUNCIL_AREAS === areaType
      ? "COUNCIL AREAS"
      : "HEALTH BOARDS";
  }

  function valueTitle() {
    return VALUETYPE_DEATHS === valueType ? "TOTAL DEATHS" : "TOTAL CASES";
  }

  function heatbarScale() {
    return (
      <Container fluid className="heatmapScale">
      <Row>
        {heatLevels.map((value, index) => {
          return (
            <Col key={"small" + index} className={"smallscale l-" + index}>
              {value}
            </Col>
          );
        })}
        {heatLevels.map((value, index) => {
          return (
            <Col key={"large" + index} className={"largescale l-" + index}>
              &ge;&nbsp;{value}
            </Col>
          );
        })}
        </Row>
      </Container>
    );
  }

  if (getDataSet() === null) {
    return <LoadingComponent />;
  }

  return (
    <div className="heatmap">
      <Table size="sm">
        <thead>
          <tr>
            <th className="heatmap-table-heading">
              {areaTitle()}
            </th>
            <th className="heatmap-table-heading">
              {valueTitle()}
            </th>
            <th className="heatmap-table-heading">
              <div>DAILY COUNT</div>
              <div className="subheading">{dateRangeText()}</div>
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

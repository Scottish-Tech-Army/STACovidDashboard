import React from "react";
import "./Heatmap.css";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import {
  AREATYPE_COUNCIL_AREAS,
  VALUETYPE_DEATHS,
} from "../HeatmapDataSelector/HeatmapConsts";
import { FEATURE_CODE_SCOTLAND } from "../Utils/CsvUtils";
import { format } from "date-fns";
import Table from "react-bootstrap/Table";

export function createHeatbarLines(elements, createHeatbarLine, region, dates) {
  function formatDate(date) {
    return format(date, "dd MMM");
  }

  const result = [];
  var startDateIndex = 0;
  while (startDateIndex < elements.length) {
    const startElement = elements[startDateIndex];
    let weekCount;
    for (
      weekCount = 1;
      startDateIndex + weekCount < elements.length;
      weekCount++
    ) {
      if (startElement !== elements[startDateIndex + weekCount]) {
        break;
      }
    }
    const dateString =
      weekCount === 1
        ? formatDate(dates[startDateIndex])
        : formatDate(dates[startDateIndex]) +
          " - " +
          formatDate(dates[startDateIndex + weekCount - 1]);

    result.push(
      createHeatbarLine(
        startElement,
        startDateIndex,
        weekCount,
        region + "\n" + dateString
      )
    );
    startDateIndex += weekCount;
  }

  return result;
}

export default function Heatmap({
  parsedHealthBoardDataset = null,
  parsedCouncilAreaDataset = null,
  valueType = VALUETYPE_DEATHS,
  areaType = AREATYPE_COUNCIL_AREAS,
}) {
  // Remember to update the css classes if level count changes
  const heatLevels = [0, 5, 10, 20, 50, 100, 500, 1000];

  function createHeatbar(elements, region, dates) {
    const width = 20;
    const height = 15;
    const viewBox = "0 0 " + width + " " + height;
    const count = elements.length;
    const elementWidth = width / count;

    function createHeatbarLine(element, startDateIndex, weekCount, titleText) {
      const x = elementWidth * (startDateIndex + weekCount / 2);
      return (
        <line
          key={startDateIndex}
          className={"l-" + element}
          x1={x}
          y1="0"
          x2={x}
          y2="100%"
          strokeWidth={elementWidth * weekCount}
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
      <tr
        className={
          featureCode === FEATURE_CODE_SCOTLAND ? "scotland-total area" : "area"
        }
        key={index}
      >
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
    if (!dataset.startDate || !dataset.endDate) {
      return "Data not available";
    }

    return formatDate(dataset.startDate) + " - " + formatDate(dataset.endDate);
  }

  function renderTableBody() {
    const dataset = getDataSet();
    if (dataset === null) {
      return [];
    }
    if (!dataset.regions || dataset.regions.length === 0) {
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
  if (getDataSet() === null) {
    return <LoadingComponent />;
  }

  return (
    <div className="heatmap">
      <Table size="sm">
        <thead>
          <tr>
            <th>{areaTitle()}</th>
            <th>{valueTitle()}</th>
            <th>
              <div>WEEKLY COUNT</div>
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

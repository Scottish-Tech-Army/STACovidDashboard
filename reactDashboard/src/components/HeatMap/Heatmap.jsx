import React from "react";
import "./Heatmap.css";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import {
  AREATYPE_COUNCIL_AREAS,
  VALUETYPE_DEATHS,
} from "../HeatmapDataSelector/HeatmapConsts";
import {
  FEATURE_CODE_SCOTLAND,
  FEATURE_CODE_COUNCIL_AREAS,
  FEATURE_CODE_HEALTH_BOARDS,
} from "../Utils/CsvUtils";
import { format } from "date-fns";
import Table from "react-bootstrap/Table";

const SIX_DAYS_IN_MILLIS = 6 * 24 * 3600 * 1000;

export function createHeatbarLines(
  elements,
  createHeatbarLine,
  region,
  weekStartDates
) {
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
      formatDate(weekStartDates[startDateIndex]) +
      " - " +
      formatDate(
        weekStartDates[startDateIndex + weekCount - 1] + SIX_DAYS_IN_MILLIS
      );

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
  allData = null,
  valueType = VALUETYPE_DEATHS,
  areaType = AREATYPE_COUNCIL_AREAS,
}) {
  // Remember to update the css classes if level count changes
  const heatLevels = [0, 5, 10, 20, 50, 100, 500, 1000];

  function createHeatbar(elements, region, weekStartDates) {
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
        {createHeatbarLines(
          elements,
          createHeatbarLine,
          region,
          weekStartDates
        )}
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
    featureCode,
    name,
    totalCases,
    totalDeaths,
    { cases, deaths },
    index,
    weekStartDates
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
            {createHeatbar(counts.map(getHeatLevel), name, weekStartDates)}
          </div>
        </td>
      </tr>
    );
  }

  function dateRangeText() {
    function formatDate(date) {
      return format(date, "dd MMM yyyy");
    }
    if (!allData) {
      return "Data not available";
    }

    if (!allData.startDate || !allData.endDate) {
      return "Data not available";
    }

    return formatDate(allData.startDate) + " - " + formatDate(allData.endDate);
  }

  function renderTableBody() {
    if (allData === null) {
      return [];
    }
    if (!allData.regions || allData.regions.length === 0) {
      return [];
    }

    const regionFeatureCodes =
      AREATYPE_COUNCIL_AREAS === areaType
        ? FEATURE_CODE_COUNCIL_AREAS
        : FEATURE_CODE_HEALTH_BOARDS;
    const featureCodes = [FEATURE_CODE_SCOTLAND, ...regionFeatureCodes];

    const result = featureCodes
      .map((region, i) => {
        const regionData = allData.regions[region];
        return (
          regionData ?
          createRegionTableline(
            region,
            regionData.name,
            regionData.cumulativeCases.value,
            regionData.cumulativeDeaths.value,
            regionData.weeklySeries,
            i + 1,
            allData.weekStartDates
        ) : null
        );
      })
      .filter(Boolean);

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
  if (allData === null) {
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

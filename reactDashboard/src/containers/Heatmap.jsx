import React, { useState, useEffect } from "react";
import {
  createPlaceDateValuesMap,
  getPlaceNameByFeatureCode,
  FEATURE_CODE_SCOTLAND,
} from "../components/Utils/CsvUtils";
import Heatmap from "../components/HeatMap/Heatmap";

function aggregateWeeks(dates, placeDateValuesMap) {
  const startDate = dates[0];
  const endDate = dates[dates.length - 1];
  const millisInWeek = 7 * 24 * 3600 * 1000;

  const weeklyDates = [];
  let currentDate = startDate;
  while (currentDate < endDate) {
    weeklyDates.push(currentDate);
    currentDate = currentDate + millisInWeek;
  }
  const weeklyPlaceDateValuesMap = new Map();
  placeDateValuesMap.forEach((dateValueMap, place) => {
    const weeklyDateValueMap = new Map();
    weeklyPlaceDateValuesMap.set(place, weeklyDateValueMap);

    weeklyDates.forEach((weekStart) => {
      const weekEnd = weekStart + millisInWeek;

      let total = {
        cases: 0,
        deaths: 0,
        cumulativeCases: 0,
        cumulativeDeaths: 0,
      };
      weeklyDateValueMap.set(weekStart, total);
      dates.forEach((date) => {
        if (date >= weekStart && date < weekEnd) {
          const current = dateValueMap.get(date);
          total.cases += current.cases;
          total.deaths += current.deaths;
          total.cumulativeCases = current.cumulativeCases;
          total.cumulativeDeaths = current.cumulativeDeaths;
        }
      });
    });
  });
  return { weeklyDates, weeklyPlaceDateValuesMap };
}

// Exported for tests
export function parseCsvData(csvData) {
  const { dates, placeDateValuesMap } = createPlaceDateValuesMap(csvData);

  const { weeklyDates, weeklyPlaceDateValuesMap } = aggregateWeeks(
    dates,
    placeDateValuesMap
  );

  var regions = [];
  var scotland = null;
  weeklyPlaceDateValuesMap.forEach((dateValuesMap, featureCode) => {
    const allCases = [];
    const allDeaths = [];
    var totalCases = 0;
    var totalDeaths = 0;
    weeklyDates.forEach((date) => {
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
  return {
    startDate: dates[0],
    endDate: dates[dates.length - 1],
    dates: weeklyDates,
    scotland: scotland,
    regions: regions,
  };
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
  const weekCount = regions[0] ? regions[0].cases.length : 0;

  result = {
    featureCode: FEATURE_CODE_SCOTLAND,
    name: getPlaceNameByFeatureCode(FEATURE_CODE_SCOTLAND),
    totalDeaths: 0,
    totalCases: 0,
    cases: Array(weekCount).fill(0),
    deaths: Array(weekCount).fill(0),
  };

  regions.forEach(({ totalDeaths, totalCases, cases, deaths }) => {
    result.totalDeaths += totalDeaths;
    result.totalCases += totalCases;
    for (let i = 0; i < weekCount; i++) {
      result.cases[i] += cases[i];
      result.deaths[i] += deaths[i];
    }
  });
  return result;
}

export default function HeatmapContainer({
  councilAreaDataset,
  healthBoardDataset,
  valueType,
  areaType,
}) {
  const [parsedHealthBoardDataset, setParsedHealthBoardDataset] = useState();
  const [parsedCouncilAreaDataset, setParsedCouncilAreaDataset] = useState();

  // Parse datasets
  useEffect(() => {
    if (councilAreaDataset !== null && councilAreaDataset !== undefined) {
      setParsedCouncilAreaDataset(parseCsvData(councilAreaDataset));
    }
  }, [councilAreaDataset]);

  useEffect(() => {
    if (healthBoardDataset !== null && healthBoardDataset !== undefined) {
      setParsedHealthBoardDataset(parseCsvData(healthBoardDataset));
    }
  }, [healthBoardDataset]);

  return (
    <Heatmap
      parsedHealthBoardDataset={parsedHealthBoardDataset}
      parsedCouncilAreaDataset={parsedCouncilAreaDataset}
      valueType={valueType}
      areaType={areaType}
    />
  );
}

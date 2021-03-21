import React, { useEffect, useState } from "react";
import { parse7DayWindowCsvData } from "../components/Utils/CsvUtils";
import moment from "moment";
import RegionSingleValueBar from "../components/SingleValue/RegionSingleValueBar";
import deepmerge from "deepmerge";

function getPlaceStats(
  dateString,
  dailyCases,
  cumulativeCases,
  dailyDeaths,
  cumulativeDeaths
) {
  const date = moment.utc(dateString).valueOf();

  return {
    dailyCases: { date: date, value: Number(dailyCases) },
    dailyDeaths: { date: date, value: Number(dailyDeaths) },
    cumulativeCases: { date: date, value: Number(cumulativeCases) },
    cumulativeDeaths: { date: date, value: Number(cumulativeDeaths) },
  };
}

// Exported for tests
export function parseNhsHBCsvData(lines) {
  const placeStatsMap = {};

  lines.forEach(
    (
      [
        dateString,
        place,
        v1,
        v4,
        dailyCases,
        cumulativeCases,
        v2,
        dailyDeaths,
        cumulativeDeaths,
      ],
      i
    ) => {
      placeStatsMap[place] = getPlaceStats(
        dateString,
        dailyCases,
        cumulativeCases,
        dailyDeaths,
        cumulativeDeaths
      );
    }
  );
  return placeStatsMap;
}

// Exported for tests
export function parseNhsCACsvData(lines) {
  const placeStatsMap = {};

  lines.forEach(
    (
      [
        dateString,
        place,
        v1,
        dailyCases,
        cumulativeCases,
        v2,
        dailyDeaths,
        cumulativeDeaths,
      ],
      i
    ) => {
      placeStatsMap[place] = getPlaceStats(
        dateString,
        dailyCases,
        cumulativeCases,
        dailyDeaths,
        cumulativeDeaths
      );
    }
  );
  return placeStatsMap;
}

export default function RegionalSingleValueBarContainer({
  currentTotalsHealthBoardDataset = null,
  currentTotalsCouncilAreaDataset = null,
  councilAreaDataset = null,
  healthBoardDataset = null,
  regionCode = null,
}) {
  const [placeStatsMap, setPlaceStatsMap] = useState({});

  useEffect(() => {
    if (currentTotalsHealthBoardDataset !== null) {
      setPlaceStatsMap((existingMap) =>
        deepmerge(
          existingMap,
          parseNhsHBCsvData(currentTotalsHealthBoardDataset)
        )
      );
    }
  }, [currentTotalsHealthBoardDataset]);

  useEffect(() => {
    if (currentTotalsCouncilAreaDataset !== null) {
      setPlaceStatsMap((existingMap) =>
        // In case of duplicate (Scotland), HB takes precedence
        deepmerge(
          parseNhsCACsvData(currentTotalsCouncilAreaDataset),
          existingMap
        )
      );
    }
  }, [currentTotalsCouncilAreaDataset]);

  useEffect(() => {
    if (null !== councilAreaDataset) {
      setPlaceStatsMap((existingMap) =>
        // In case of duplicate (Scotland), HB takes precedence
        deepmerge(Object.fromEntries(parse7DayWindowCsvData(councilAreaDataset)), existingMap)
      );
    }
  }, [councilAreaDataset]);

  useEffect(() => {
    if (null !== healthBoardDataset) {
      setPlaceStatsMap((existingMap) =>
        deepmerge(existingMap, Object.fromEntries(parse7DayWindowCsvData(healthBoardDataset)))
      );
    }
  }, [healthBoardDataset]);

  return (
    <RegionSingleValueBar
      placeStatsMap={placeStatsMap}
      regionCode={regionCode}
    />
  );
}

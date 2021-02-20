import "./SingleValueBar.css";
import SingleValue from "./SingleValue";
import React, { useEffect, useState } from "react";
import {
  FEATURE_CODE_SCOTLAND,
  FEATURE_CODE_MAP,
  parse7DayWindowCsvData,
  getRelativeReportedDate,
} from "../Utils/CsvUtils";
import moment from "moment";

// Exported for tests
export function parseNhsHBCsvData(lines) {
  const placeStatsMap = new Map();

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
      const date = moment.utc(dateString).valueOf();

      placeStatsMap.set(place, {
        cases: { date: date, value: Number(dailyCases) },
        deaths: { date: date, value: Number(dailyDeaths) },
        cumulativeCases: { date: date, value: Number(cumulativeCases) },
        cumulativeDeaths: { date: date, value: Number(cumulativeDeaths) },
      });
    }
  );
  return placeStatsMap;
}

// Exported for tests
export function parseNhsCACsvData(lines) {
  const placeStatsMap = new Map();

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
      const date = moment.utc(dateString).valueOf();

      placeStatsMap.set(place, {
        cases: { date: date, value: Number(dailyCases) },
        deaths: { date: date, value: Number(dailyDeaths) },
        cumulativeCases: { date: date, value: Number(cumulativeCases) },
        cumulativeDeaths: { date: date, value: Number(cumulativeDeaths) },
      });
    }
  );
  return placeStatsMap;
}

const emptyDate = { date: undefined, value: undefined };

function RegionalSingleValueBar({
  currentTotalsHealthBoardDataset = null,
  currentTotalsCouncilAreaDataset = null,
  councilAreaDataset = null,
  healthBoardDataset = null,
  regionCode = null,
}) {
  const [placeStatsMap, setPlaceStatsMap] = useState(new Map());
  const [placeWeeklyStatsMap, setPlaceWeeklyStatsMap] = useState(new Map());

  const [dailyCases, setDailyCases] = useState(emptyDate);
  const [weeklyCases, setWeeklyCases] = useState(undefined);
  const [totalCases, setTotalCases] = useState(emptyDate);
  const [dailyDeaths, setDailyDeaths] = useState(emptyDate);
  const [weeklyDeaths, setWeeklyDeaths] = useState(undefined);
  const [totalDeaths, setTotalDeaths] = useState(emptyDate);

  const missingData = "Not available";
  const SUBTITLE_WEEKLY = "last 7 days";
  const SUBTITLE_TOTAL = "reported since 28 February, 2020";

  if (regionCode !== null && FEATURE_CODE_MAP[regionCode] === undefined) {
    throw new Error("Unrecognised regionCode: " + regionCode);
  }

  function guardMissingData(input) {
    return input === undefined ? missingData : input.toLocaleString();
  }

  useEffect(() => {
    if (currentTotalsHealthBoardDataset !== null) {
      const datasetPlaceStatsMap = parseNhsHBCsvData(currentTotalsHealthBoardDataset);
      setPlaceStatsMap(
        (existingMap) => new Map([...existingMap, ...datasetPlaceStatsMap])
      );
    }
  }, [currentTotalsHealthBoardDataset]);

  useEffect(() => {
    if (currentTotalsCouncilAreaDataset !== null) {
      const datasetPlaceStatsMap = parseNhsCACsvData(currentTotalsCouncilAreaDataset);
      setPlaceStatsMap(
        (existingMap) => new Map([...datasetPlaceStatsMap, ...existingMap])
      );
    }
  }, [currentTotalsCouncilAreaDataset]);

  useEffect(() => {
    if (null !== councilAreaDataset) {
      const datasetPlaceStatsMap = parse7DayWindowCsvData(councilAreaDataset);
      setPlaceWeeklyStatsMap(
        // In case of duplicate (Scotland), HB takes precedence
        (existingMap) => new Map([...datasetPlaceStatsMap, ...existingMap])
      );
    }
  }, [councilAreaDataset]);

  useEffect(() => {
    if (null !== healthBoardDataset) {
      const datasetPlaceStatsMap = parse7DayWindowCsvData(healthBoardDataset);
      setPlaceWeeklyStatsMap(
        // In case of duplicate (Scotland), HB takes precedence
        (existingMap) => new Map([...existingMap, ...datasetPlaceStatsMap])
      );
    }
  }, [healthBoardDataset]);

  useEffect(() => {
    if (placeStatsMap == null) {
      return;
    }
    const results = placeStatsMap.get(
      regionCode == null ? FEATURE_CODE_SCOTLAND : regionCode
    );
    if (results !== null && results !== undefined) {
      setDailyCases(results.cases);
      setTotalCases(results.cumulativeCases);
      setDailyDeaths(results.deaths);
      setTotalDeaths(results.cumulativeDeaths);
    }
  }, [placeStatsMap, regionCode]);

  useEffect(() => {
    if (placeWeeklyStatsMap == null) {
      return;
    }
    const results = placeWeeklyStatsMap.get(
      regionCode == null ? FEATURE_CODE_SCOTLAND : regionCode
    );
    if (results !== null && results !== undefined) {
      setWeeklyCases(results.cases);
      setWeeklyDeaths(results.deaths);
    }
  }, [placeWeeklyStatsMap, regionCode]);

  return (
    <>
      <div className="region-single-value-bar">
        <div className="single-value-container">
          <SingleValue
            id="dailyCases"
            title="DAILY CASES"
            subtitle={guardMissingData(
              getRelativeReportedDate(dailyCases.date)
            )}
            value={guardMissingData(dailyCases.value)}
            tooltip="These are the cases reported today and updated after 2pm daily (Can be delayed because of data fetching)."
          />
        </div>
        <div className="single-value-container">
          <SingleValue
            id="weeklyCases"
            title="WEEKLY CASES"
            subtitle={SUBTITLE_WEEKLY}
            value={guardMissingData(weeklyCases)}
            tooltip="These are the cases over the last week and updated after 2pm daily (Can be delayed because of data fetching)."
          />
        </div>
        <div className="single-value-container">
          <SingleValue
            id="totalCases"
            title="TOTAL CASES"
            subtitle={SUBTITLE_TOTAL}
            value={guardMissingData(totalCases.value)}
            tooltip="These are the total cases of COVID-19 since the COVID-19 Pandemic began."
          />
        </div>
      </div>

      <div className="region-single-value-bar">
        <div className="single-value-container">
          <SingleValue
            id="dailyDeaths"
            title="DAILY DEATHS"
            subtitle={guardMissingData(
              getRelativeReportedDate(dailyDeaths.date)
            )}
            value={guardMissingData(dailyDeaths.value)}
            tooltip="These are the deaths reported today and updated after 2pm daily (Can be delayed because of data fetching)."
          />
        </div>
        <div className="single-value-container">
          <SingleValue
            id="weeklyDeaths"
            title="WEEKLY DEATHS"
            subtitle={SUBTITLE_WEEKLY}
            value={guardMissingData(weeklyDeaths)}
            tooltip="These are the deaths over the last week and updated after 2pm daily (Can be delayed because of data fetching)."
          />
        </div>
        <div className="single-value-container">
          <SingleValue
            id="totalDeaths"
            title="TOTAL DEATHS"
            subtitle={SUBTITLE_TOTAL}
            value={guardMissingData(totalDeaths.value)}
            tooltip="These are the total deaths since the COVID-19 Pandemic began."
          />
        </div>
      </div>
    </>
  );
}

export default RegionalSingleValueBar;

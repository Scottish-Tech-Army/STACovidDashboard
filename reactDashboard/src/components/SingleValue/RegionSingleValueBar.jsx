import "./SingleValueBar.css";
import SingleValue from "./SingleValue";
import React, { useEffect, useState } from "react";
import {
  FEATURE_CODE_SCOTLAND,
  FEATURE_CODE_MAP,
  getRelativeReportedDate,
} from "../Utils/CsvUtils";

const emptyDate = { date: undefined, value: undefined };

export default function RegionSingleValueBar({
  allData = null,
  regionCode = null,
}) {
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
    if (allData == null) {
      return;
    }
    const results =
      allData.regions[regionCode == null ? FEATURE_CODE_SCOTLAND : regionCode];
    if (results !== null && results !== undefined) {
      setDailyCases(results.dailyCases);
      setDailyDeaths(results.dailyDeaths);
      setWeeklyCases(results.weeklyCases);
      setWeeklyDeaths(results.weeklyDeaths);
      setTotalCases(results.cumulativeCases);
      setTotalDeaths(results.cumulativeDeaths);
    }
  }, [allData, regionCode]);

  return (
    <>
      <div className="region-single-value-bar">
        <div className="single-value-container">
          <SingleValue
            id="dailyCases"
            title="DAILY CASES"
            subtitle={guardMissingData(
              getRelativeReportedDate(dailyCases && dailyCases.date)
            )}
            value={guardMissingData(dailyCases && dailyCases.value)}
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
            value={guardMissingData(totalCases && totalCases.value)}
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
              getRelativeReportedDate(dailyDeaths && dailyDeaths.date)
            )}
            value={guardMissingData(dailyDeaths && dailyDeaths.value)}
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
            value={guardMissingData(totalDeaths && totalDeaths.value)}
            tooltip="These are the total deaths since the COVID-19 Pandemic began."
          />
        </div>
      </div>
    </>
  );
}

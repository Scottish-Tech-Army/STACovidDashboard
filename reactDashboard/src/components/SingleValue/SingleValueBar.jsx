import "./SingleValueBar.css";
import SingleValue from "./SingleValue";
import React from "react";
import {
  getRelativeReportedDate,
  FEATURE_CODE_SCOTLAND,
} from "../Utils/CsvUtils";

const SUBTITLE_TOTAL = "reported since 28 February, 2020";
const MISSING_DATA = "Not available";

export default function SingleValueBar({ allData = null }) {
  function guardMissingData(input) {
    return input === undefined ? MISSING_DATA : input.toLocaleString();
  }

  const scotlandData =
    (allData && allData.regions[FEATURE_CODE_SCOTLAND]) || {};
  const {
    dailyCases,
    cumulativeCases,
    dailyDeaths,
    cumulativeDeaths,
    fatalityCaseRatio,
  } = scotlandData;

  return (
    <div className="overview-single-value-bar">
      <div className="single-value-container">
        <SingleValue
          id="dailyCases"
          title="DAILY CASES"
          subtitle={guardMissingData(
            getRelativeReportedDate(dailyCases && dailyCases.date)
          )}
          value={guardMissingData(dailyCases && dailyCases.value)}
          tooltip="These are the total cases reported on the above date and updated after 2pm daily (can be delayed because of data fetching)."
        />
      </div>
      <div className="single-value-container">
        <SingleValue
          id="totalCases"
          title="TOTAL CASES"
          subtitle={SUBTITLE_TOTAL}
          value={guardMissingData(cumulativeCases && cumulativeCases.value)}
          tooltip="These are the total number of cases which have tested positive for COVID-19 since records began on 28 February, 2020."
        />
      </div>
      <div className="single-value-container">
        <SingleValue
          id="dailyDeaths"
          title="DAILY DEATHS"
          subtitle={guardMissingData(
            getRelativeReportedDate(dailyDeaths && dailyDeaths.date)
          )}
          value={guardMissingData(dailyDeaths && dailyDeaths.value)}
          tooltip="These are the deaths reported on the above day, and updated after 2pm daily (can be delayed because of data fetching)."
        />
      </div>
      <div className="single-value-container">
        <SingleValue
          id="totalDeaths"
          title="TOTAL DEATHS"
          subtitle={SUBTITLE_TOTAL}
          value={guardMissingData(cumulativeDeaths && cumulativeDeaths.value)}
          tooltip="These are the total number of deaths where COVID-19 is noted on the death certificate since records began on 28 February, 2020."
        />
      </div>
      <div className="single-value-container">
        <SingleValue
          id="fatalityCaseRatio"
          title="DEATH/CASE RATIO"
          value={guardMissingData(fatalityCaseRatio)}
          tooltip="This is the % of people who have died after testing positive for the COVID-19. The real fatality rate is currently estimated at < 1% as not everyone who catches COVID-19 gets tested."
        />
      </div>
    </div>
  );
}

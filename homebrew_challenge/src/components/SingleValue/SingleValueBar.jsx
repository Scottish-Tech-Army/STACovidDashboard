import "./SingleValueBar.css";
import SingleValue from "./SingleValue";
import React, { useEffect, useState } from "react";
import { differenceInDays, format } from "date-fns";
import { FEATURE_CODE_SCOTLAND, readCsvData } from "../Utils/CsvUtils";
import moment from "moment";

export function parseNhsCsvData(csvData) {
  var lines = readCsvData(csvData);
  var result = {
    cases: { date: undefined, value: undefined },
    deaths: { date: undefined, value: undefined },
    cumulativeCases: { date: undefined, value: undefined },
    cumulativeDeaths: { date: undefined, value: undefined },
    fatalityCaseRatio: undefined
  };
  lines.forEach(
    (
      [
        dateString,
        place,
        v1,
        dailyCases,
        cumulativeCases,
        v2,
        v3,
        dailyDeaths,
        cumulativeDeaths
      ],
      i
    ) => {
      if (FEATURE_CODE_SCOTLAND === place) {
        const date = moment.utc(dateString).valueOf();

        const fatalityCaseRatio =
          cumulativeCases !== undefined && cumulativeDeaths !== undefined
            ? ((cumulativeDeaths * 100) / cumulativeCases).toFixed(1) + "%"
            : undefined;

        result = {
          cases: { date: date, value: Number(dailyCases) },
          deaths: { date: date, value: Number(dailyDeaths) },
          cumulativeCases: { date: date, value: Number(cumulativeCases) },
          cumulativeDeaths: { date: date, value: Number(cumulativeDeaths) },
          fatalityCaseRatio: fatalityCaseRatio
        };
      }
    }
  );
  return result;
}

const emptyDate = { date: Date.parse("1999-01-01"), value: 0 };

// Exported for tests
export function getRelativeReportedDate(date) {
  if (!date) {
    return undefined;
  }
  const daysDifference = differenceInDays(Date.now(), date);
  if (daysDifference === 0) {
    return "reported today";
  }
  if (daysDifference === 1) {
    return "reported yesterday";
  }
  if (daysDifference > 1 && daysDifference < 7) {
    return "reported last " + format(date, "EEEE");
  }
  return "reported on " + format(date, "dd MMMM, yyyy");
}

function SingleValueBar() {
  const [dailyCases, setDailyCases] = useState(emptyDate);
  const [totalCases, setTotalCases] = useState(emptyDate);
  const [dailyFatalities, setDailyFatalities] = useState(emptyDate);
  const [totalFatalities, setTotalFatalities] = useState(emptyDate);
  const [fatalityCaseRatio, setFatalityCaseRatio] = useState(0);
  const [nhsDataFetched, setNhsDataFetched] = useState(false);

  // Get the last 3 days of data, to allow diff of the last two values even when today's data is not available
  const missingData = "Not available";

  function guardMissingData(input) {
    return input === undefined ? missingData : input;
  }

  useEffect(() => {
    const currentTotalsHealthBoardsCsv = "data/currentTotalsHealthBoards.csv";

    // Only attempt to fetch data once
    if (!nhsDataFetched) {
      setNhsDataFetched(true);
      fetch(currentTotalsHealthBoardsCsv, {
        method: "GET"
      })
        .then(res => res.text())
        .then(csvData => {
          const results = parseNhsCsvData(csvData);
          if (results !== null) {
            setDailyCases(results.cases);
            setTotalCases(results.cumulativeCases);
            setDailyFatalities(results.deaths);
            setTotalFatalities(results.cumulativeDeaths);
            setFatalityCaseRatio(results.fatalityCaseRatio);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [nhsDataFetched]);

  return (
    <div className="single-value-bar">
      <div className="p-2 single-value-container">
        <SingleValue
          id="dailyCases"
          title="DAILY CASES"
          subtitle={guardMissingData(
            getRelativeReportedDate(dailyCases.date)
          )}
          value={guardMissingData(dailyCases.value.toLocaleString())}
          tooltip="these are the total cases reported on the above date and updated after 2pm daily (can be delayed because of data fetching)."
        />
      </div>
      <div className="p-2 single-value-container">
        <SingleValue
          id="totalCases"
          title="TOTAL CASES"
          subtitle="reported since 20 February, 2020"
          value={guardMissingData(totalCases.value.toLocaleString())}
          tooltip="these are the total number of cases which have tested positive for COVID-19 since records began on 28 February, 2020."
        />
      </div>
      <div className="p-2 single-value-container">
        <SingleValue
          id="dailyFatalities"
          title="DAILY FATALITIES"
          subtitle={guardMissingData(
            getRelativeReportedDate(dailyFatalities.date)
          )}
          value={guardMissingData(dailyFatalities.value.toLocaleString())}
          tooltip="These are the fatalities reported on the above day, and updated after 2pm daily (can be delayed because of data fetching)."
        />
      </div>
      <div className="p-2 single-value-container">
        <SingleValue
          id="totalFatalities"
          title="TOTAL FATALITIES"
          subtitle="reported since 20 February, 2020"
          value={guardMissingData(totalFatalities.value.toLocaleString())}
          tooltip="These are the total number of fatalities where COVID-19 is noted on the Death Certificate since records began on 28 February, 2020."
        />
      </div>
      <div className="p-2 single-value-container">
        <SingleValue
          id="fatalityCaseRatio"
          title="DEATH/CASE RATIO"
          value={guardMissingData(fatalityCaseRatio)}
          tooltip="This is the % of people who have died after testing positive for the COVID-19. The real fatality rate is currently est at < 1% as not everyone who catches COVID-19 gets tested."
        />
      </div>
    </div>
  );
}

export default SingleValueBar;

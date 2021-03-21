import React, { useEffect, useState } from "react";
import { FEATURE_CODE_SCOTLAND } from "../components/Utils/CsvUtils";
import moment from "moment";
import SingleValueBar from "../components/SingleValue/SingleValueBar";

export function parseNhsCsvData(lines) {
  var result = {
    cases: undefined,
    deaths: undefined,
    cumulativeCases: undefined,
    cumulativeDeaths: undefined,
    fatalityCaseRatio: undefined,
  };
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
          fatalityCaseRatio: fatalityCaseRatio,
        };
      }
    }
  );
  return result;
}

export default function SingleValueBarContainer({
  currentTotalsHealthBoardDataset = null,
}) {
  const [dailyCases, setDailyCases] = useState();
  const [totalCases, setTotalCases] = useState();
  const [dailyDeaths, setDailyDeaths] = useState();
  const [totalDeaths, setTotalDeaths] = useState();
  const [fatalityCaseRatio, setFatalityCaseRatio] = useState();

  useEffect(() => {
    if (currentTotalsHealthBoardDataset !== null) {
      const results = parseNhsCsvData(currentTotalsHealthBoardDataset);
      if (results !== null) {
        setDailyCases(results.cases);
        setTotalCases(results.cumulativeCases);
        setDailyDeaths(results.deaths);
        setTotalDeaths(results.cumulativeDeaths);
        setFatalityCaseRatio(results.fatalityCaseRatio);
      }
    }
  }, [currentTotalsHealthBoardDataset]);

  return (
    <SingleValueBar
      dailyCases={dailyCases}
      totalCases={totalCases}
      dailyDeaths={dailyDeaths}
      totalDeaths={totalDeaths}
      fatalityCaseRatio={fatalityCaseRatio}
    />
  );
}

import "./SingleValueBar.css";
import SingleValue from "./SingleValue";
import React, { useEffect, useState } from "react";
import { formatRelative, format, subDays } from "date-fns";
import LoadingComponent from "../LoadingComponent/LoadingComponent";

// Exported for tests
export function parseCsvData(csvData) {
  function getLatestValue(dateValueMap) {
    const lastDate = [...dateValueMap.keys()].sort().pop();
    const lastValue = dateValueMap.get(lastDate);
    return { date: Date.parse(lastDate), value: lastValue };
  }

  function getLatestDiff(dateValueMap) {
    const dates = [...dateValueMap.keys()].sort();
    const lastDate = dates.pop();
    const secondLastDate = dates.pop();
    const lastValue = dateValueMap.get(lastDate);
    const secondLastValue = dateValueMap.get(secondLastDate);
    return { date: Date.parse(lastDate), value: lastValue - secondLastValue };
  }

  var allTextLines = csvData.split(/\r\n|\n/);
  var lines = [];

  allTextLines.forEach((line) => {
    if (line.length > 0) {
      lines.push(line.split(",").map((s) => s.trim()));
    }
  });
  lines.shift();

  const dailyPositiveTestsMap = new Map();
  const cumulativePositiveTestsMap = new Map();
  const cumulativeTotalTestsMap = new Map();
  const cumulativeDeathsMap = new Map();

  lines.forEach(([date, countType, count], i) => {
    if ("dailyPositiveTests" === countType) {
      dailyPositiveTestsMap.set(date, Number(count));
    } else if ("cumulativePositiveTests" === countType) {
      cumulativePositiveTestsMap.set(date, Number(count));
    } else if ("cumulativeTotalTests" === countType) {
      cumulativeTotalTestsMap.set(date, Number(count));
    } else if ("cumulativeDeaths" === countType) {
      cumulativeDeathsMap.set(date, Number(count));
    } else {
      throw new Error("Unrecognised input: " + countType);
    }
  });

  const totalCases = getLatestValue(cumulativePositiveTestsMap);
  const totalFatalities = getLatestValue(cumulativeDeathsMap);

  return {
    dailyCases: getLatestValue(dailyPositiveTestsMap),
    totalCases: totalCases,
    dailyFatalities: getLatestDiff(cumulativeDeathsMap),
    totalFatalities: totalFatalities,
    fatalityCaseRatio:
      ((totalFatalities.value * 100) / totalCases.value).toFixed(2) + "%",
    dailyTestsCompleted: getLatestDiff(cumulativeTotalTestsMap),
    totalTestsCompleted: getLatestValue(cumulativeTotalTestsMap),
  };
}
const emptyDate = { date: Date.parse("1999-01-01"), value: 0 };

// Exported for tests
export function getDateValueClause() {
  const today = Date.now();
  const yesterday = subDays(Date.now(), 1);
  const dayBefore = subDays(Date.now(), 2);

  const singleLine = (date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return (
      "( <http://reference.data.gov.uk/id/day/" +
      dateString +
      '> "' +
      dateString +
      '" )'
    );
  };

  return singleLine(today) + singleLine(yesterday) + singleLine(dayBefore);
}

function SingleValueBar() {
  const [dailyCases, setDailyCases] = useState(emptyDate);
  const [totalCases, setTotalCases] = useState(emptyDate);
  const [dailyFatalities, setDailyFatalities] = useState(emptyDate);
  const [totalFatalities, setTotalFatalities] = useState(emptyDate);
  const [fatalityCaseRatio, setFatalityCaseRatio] = useState(0);
  const [dailyTestsCompleted, setDailyTestsCompleted] = useState(emptyDate);
  const [totalTestsCompleted, setTotalTestsCompleted] = useState(emptyDate);
  const [dataFetched, setDataFetched] = useState(false);

  const queryUrl = "http://statistics.gov.scot/sparql.csv";

  // Get the last 3 days of data, to allow diff of the last two values even when today's data is not available
  const query =
    `PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX dim: <http://purl.org/linked-data/sdmx/2009/dimension#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?date ?shortValue ?count
WHERE {
  VALUES (?value ?shortValue) {
    ( <http://statistics.gov.scot/def/concept/variable/testing-daily-people-found-positive> "dailyPositiveTests" )
    ( <http://statistics.gov.scot/def/concept/variable/testing-cumulative-people-tested-for-covid-19-positive> "cumulativePositiveTests" )
    ( <http://statistics.gov.scot/def/concept/variable/testing-cumulative-people-tested-for-covid-19-total> "cumulativeTotalTests")
    ( <http://statistics.gov.scot/def/concept/variable/number-of-covid-19-confirmed-deaths-registered-to-date> "cumulativeDeaths" )
  }
  VALUES (?perioduri ?date) {` +
    getDateValueClause() +
    `}
  ?obs qb:dataSet <http://statistics.gov.scot/data/coronavirus-covid-19-management-information> .
  ?obs dim:refArea <http://statistics.gov.scot/id/statistical-geography/S92000003> .
  ?obs <http://statistics.gov.scot/def/dimension/variable> ?value .
  ?obs <http://statistics.gov.scot/def/measure-properties/count> ?count .
  ?obs dim:refPeriod ?perioduri
}`;

  useEffect(() => {
    // Only attempt to fetch data once
    if (!dataFetched) {
      setDataFetched(true);
      const form = new FormData();
      form.append("query", query);
      fetch(queryUrl, {
        method: "POST",
        body: form,
      })
        .then((res) => res.text())
        .then((csvData) => {
          const {
            dailyCases,
            totalCases,
            dailyFatalities,
            totalFatalities,
            fatalityCaseRatio,
            dailyTestsCompleted,
            totalTestsCompleted,
          } = parseCsvData(csvData);

          setDailyCases(dailyCases);
          setTotalCases(totalCases);
          setDailyFatalities(dailyFatalities);
          setTotalFatalities(totalFatalities);
          setFatalityCaseRatio(fatalityCaseRatio);
          setDailyTestsCompleted(dailyTestsCompleted);
          setTotalTestsCompleted(totalTestsCompleted);
        })
        .catch((error) => {
          console.error(error);
        });
    }
}, [dataFetched, query]);

  function getRelativeDate(date) {
    var result = formatRelative(date, Date.now());
    // Trim off the trailing 'at HH:MM...' time
    const index = result.indexOf(" at");
    if (index > -1) {
      result = result.substring(0, index);
    }
    return result;
  }

  return (
    <div className="singlevalues">
    <>
    <div className={isDataReady()? "singlevalues": "singlevalues hidden-values" }>
      <SingleValue
        id="dailyCases"
        title={"Cases " + getRelativeDate(dailyCases.date)}
        value={dailyCases.value}
      />
      <SingleValue
        id="totalCases"
        title="Total Cases"
        value={totalCases.value}
      />
      <SingleValue
        id="dailyFatalities"
        title={"Fatalities " + getRelativeDate(dailyCases.date)}
        value={dailyFatalities.value}
      />
      <SingleValue
        id="totalFatalities"
        title="Total Fatalities"
        value={totalFatalities.value}
      />
      <SingleValue
        id="fatalityCaseRatio"
        title="Fatality / Case Ratio"
        value={fatalityCaseRatio}
      />
      <SingleValue
        id="dailyTestsCompleted"
        title="Daily Tests Completed"
        value={dailyTestsCompleted.value}
      />
      <SingleValue
        id="totalTestsCompleted"
        title="Total Tests Completed"
        value={totalTestsCompleted.value}
      />
    </div>
    { isDataReady()? <></> : <LoadingComponent/> }
    </>
  );
}

export default SingleValueBar;

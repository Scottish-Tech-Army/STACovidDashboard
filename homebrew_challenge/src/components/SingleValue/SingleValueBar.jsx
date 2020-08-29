import "./SingleValueBar.css";
import SingleValue from "./SingleValue";
import React, { useEffect, useState } from "react";
import { differenceInDays, format } from "date-fns";
import { FEATURE_CODE_SCOTLAND, readCsvData } from "../Utils/CsvUtils";
import moment from "moment";

// Exported for tests
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

  function numberWithCommas(number) {
    return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
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
            heading="DAILY CASES"
            footnote1={guardMissingData(
              getRelativeReportedDate(dailyCases.date)
            )}
            footnote2="these are the total cases reported on the above date and updated after 2pm daily (can be delayed because of data fetching)."
            value={guardMissingData(numberWithCommas(dailyCases.value))}
          />
        </div>
  <div className="p-2 single-value-container">
          <SingleValue
            id="totalCases"
            heading="TOTAL CASES"
            value={guardMissingData(numberWithCommas(totalCases.value))}
            footnote1="these are the total number of cases which have tested positive for COVID-19 since records began on 28 February, 2020."
          />
        </div>
      <div className="p-2 single-value-container">
          <SingleValue
            id="dailyFatalities"
            heading="DAILY FATALITIES"
            footnote1={guardMissingData(
              getRelativeReportedDate(dailyFatalities.date)
            )}
            value={guardMissingData(numberWithCommas(dailyFatalities.value))}
            footnote2="these are the fatalities reported on the above day and updated after 2pm daily (can be delayed because of data fetching)."
          />
        </div>
      <div className="p-2 single-value-container">
          <SingleValue
            id="totalFatalities"
            heading="TOTAL FATALITIES"
            value={guardMissingData(numberWithCommas(totalFatalities.value))}
            footnote1="these are the total number of fatalities where COVID-19 is noted on the Death Certificate since records began on 28 February, 2020."
          />
        </div>
    <div className="p-2 single-value-container">
          <SingleValue
            id="fatalityCaseRatio"
            heading="DEATH/CASE RATIO"
            value={guardMissingData(numberWithCommas(fatalityCaseRatio))}
            footnote1="this is the percentage of people who have died after testing positive for the COVID-19."
            footnote2="the real fatality rate is currently est at < 1% as not everyone who catches COVID-19 gets tested."
          />
        </div>

    </div>
  );
}

export default SingleValueBar;

// This is the percentage of people who have died after testing positive for the virus.
//
// The real fatality rate will likely be much, much lower, probably under 1%, as not everyone who catches the virus gets tested for it.

// <Row>
//   <Col xs={12} lg={6}>
//     {blockTitleRow("Cases")}
//     <Row className="single-value-bar-row">
//       <Col className="single-value-bar-col">
//         <SingleValue
//           id="dailyCases"
//           title={guardMissingData(
//             getRelativeReportedDate(dailyCases.date)
//           )}
//           value={guardMissingData(dailyCases.value)}
//           tooltip="These are the Total Cases reported today and updated after 2pm daily (Can be delayed because of data fetching)"
//         />
//       </Col>
//       <Col className="single-value-bar-col">
//         <SingleValue
//           id="totalCases"
//           title="Total"
//           value={guardMissingData(totalCases.value)}
//           tooltip="These are the Total Cases of COVID-19 since the COVID-19 Pandemic began"
//         />
//       </Col>
//     </Row>
//   </Col>
//   <Col xs={12} lg={6}>
//     {blockTitleRow("Deaths")}
//     <Row className="single-value-bar-row">
//       <Col className="single-value-bar-col">
//         <SingleValue
//           id="dailyFatalities"
//           title={guardMissingData(
//             getRelativeReportedDate(dailyFatalities.date)
//           )}
//           value={guardMissingData(dailyFatalities.value)}
//           tooltip="These are the fatalities reported today and updated after 2pm daily (Can be delayed because of data fetching)"
//         />
//       </Col>
//       <Col className="single-value-bar-col">
//         <SingleValue
//           id="totalFatalities"
//           title="Total"
//           value={guardMissingData(totalFatalities.value)}
//           tooltip="These are the Total Fatalities since the COVID-19 Pandemic began"
//         />
//       </Col>
//       <Col className="single-value-bar-col">
//         <SingleValue
//           id="fatalityCaseRatio"
//           title="Death / Case Ratio"
//           value={guardMissingData(fatalityCaseRatio)}
//           tooltip="This shows the Ratio of Total Fatalities to Total Cases of COVID-19"
//         />
//       </Col>
//     </Row>
//   </Col>
// </Row>

// tooltip="These are the Total Cases reported today and updated after 2pm daily (Can be delayed because of data fetching)"

// tooltip="These are the Total Cases of COVID-19 since the COVID-19 Pandemic began"

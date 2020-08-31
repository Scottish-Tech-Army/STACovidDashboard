import "./SingleValueBar.css";
import SingleValue from "./SingleValue";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FEATURE_CODE_SCOTLAND, readCsvData,getRelativeReportedDate } from "../Utils/CsvUtils";
import moment from "moment";

// Exported for tests
export function parseNhsCsvData(csvData) {
  var lines = readCsvData(csvData);
  var result = {
    cases: { date: undefined, value: undefined },
    deaths: { date: undefined, value: undefined },
    cumulativeCases: { date: undefined, value: undefined },
    cumulativeDeaths: { date: undefined, value: undefined },
    fatalityCaseRatio: undefined,
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

const emptyDate = { date: Date.parse("1999-01-01"), value: 0 };

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
        method: "GET",
      })
        .then((res) => res.text())
        .then((csvData) => {
          const results = parseNhsCsvData(csvData);
          if (results !== null) {
            setDailyCases(results.cases);
            setTotalCases(results.cumulativeCases);
            setDailyFatalities(results.deaths);
            setTotalFatalities(results.cumulativeDeaths);
            setFatalityCaseRatio(results.fatalityCaseRatio);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [nhsDataFetched]);

  function blockTitleRow(title) {
    return (
      <Row className="title-row">
        <Col className="title-col">
          <div className="title">{title}</div>
        </Col>
      </Row>
    );
  }

  return (
    <Container fluid className="single-value-bar">
      <Row>
        <Col xs={12} lg={6}>
          {blockTitleRow("Cases")}
          <Row className="single-value-bar-row">
            <Col className="single-value-bar-col">
              <SingleValue
                id="dailyCases"
                title={guardMissingData(
                  getRelativeReportedDate(dailyCases.date)
                )}
                value={guardMissingData(dailyCases.value)}
                tooltip="These are the Total Cases reported today and updated after 2pm daily (Can be delayed because of data fetching)"
              />
            </Col>
            <Col className="single-value-bar-col">
              <SingleValue
                id="totalCases"
                title="Total"
                value={guardMissingData(totalCases.value)}
                tooltip="These are the Total Cases of COVID-19 since the COVID-19 Pandemic began"
              />
            </Col>
          </Row>
        </Col>
        <Col xs={12} lg={6}>
          {blockTitleRow("Deaths")}
          <Row className="single-value-bar-row">
            <Col className="single-value-bar-col">
              <SingleValue
                id="dailyFatalities"
                title={guardMissingData(
                  getRelativeReportedDate(dailyFatalities.date)
                )}
                value={guardMissingData(dailyFatalities.value)}
                tooltip="These are the fatalities reported today and updated after 2pm daily (Can be delayed because of data fetching)"
              />
            </Col>
            <Col className="single-value-bar-col">
              <SingleValue
                id="totalFatalities"
                title="Total"
                value={guardMissingData(totalFatalities.value)}
                tooltip="These are the Total Fatalities since the COVID-19 Pandemic began"
              />
            </Col>
            <Col className="single-value-bar-col">
              <SingleValue
                id="fatalityCaseRatio"
                title="Death / Case Ratio"
                value={guardMissingData(fatalityCaseRatio)}
                tooltip="This shows the Ratio of Total Fatalities to Total Cases of COVID-19"
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default SingleValueBar;

import "./SingleValueBar.css";
import SingleValue from "./SingleValue";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  FEATURE_CODE_SCOTLAND,
  parse7DayWindowCsvData,getRelativeReportedDate
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
        dailyCases,
        cumulativeCases,
        v2,
        v3,
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
        dailyCases,
        cumulativeCases,
        v2,
        v3,
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

const emptyDate = { date: Date.parse("1999-01-01"), value: 0 };

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
  const [weeklyCases, setWeeklyCases] = useState(0);
  const [totalCases, setTotalCases] = useState(emptyDate);
  const [dailyDeaths, setDailyDeaths] = useState(emptyDate);
  const [weeklyDeaths, setWeeklyDeaths] = useState(0);
  const [totalDeaths, setTotalDeaths] = useState(emptyDate);

  const missingData = "Not available";

  function guardMissingData(input) {
    return input === undefined ? missingData : input;
  }

  useEffect(() => {
    if (currentTotalsHealthBoardDataset !== null) {
      const placeStatsMap = parseNhsHBCsvData(currentTotalsHealthBoardDataset);
      setPlaceStatsMap(
        // In case of duplicate (Scotland), HB takes precedence
        (existingMap) => new Map([...existingMap, ...placeStatsMap])
      );
    }
  }, [currentTotalsHealthBoardDataset]);

  useEffect(() => {
    if (currentTotalsCouncilAreaDataset !== null) {
      const placeStatsMap = parseNhsCACsvData(currentTotalsCouncilAreaDataset);
      setPlaceStatsMap(
        // In case of duplicate (Scotland), HB takes precedence
        (existingMap) => new Map([...placeStatsMap, ...existingMap])
      );
    }
  }, [currentTotalsCouncilAreaDataset]);

  useEffect(() => {
    if (null !== councilAreaDataset) {
      const placeStatsMap = parse7DayWindowCsvData(councilAreaDataset);
      setPlaceWeeklyStatsMap(
        // In case of duplicate (Scotland), HB takes precedence
        (existingMap) => new Map([...placeStatsMap, ...existingMap])
      );
    }
  }, [councilAreaDataset]);

  useEffect(() => {
    if (null !== healthBoardDataset) {
      const placeStatsMap = parse7DayWindowCsvData(healthBoardDataset);
      setPlaceWeeklyStatsMap(
        // In case of duplicate (Scotland), HB takes precedence
        (existingMap) => new Map([...existingMap, ...placeStatsMap])
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
      {blockTitleRow("Cases")}
      <Row className="single-value-bar-row">
        <Col className="single-value-bar-col">
          <SingleValue
            id="dailyCases"
            title={guardMissingData(getRelativeReportedDate(dailyCases.date))}
            value={guardMissingData(dailyCases.value)}
            tooltip="These are the cases reported today and updated after 2pm daily (Can be delayed because of data fetching)"
          />
        </Col>
        <Col className="single-value-bar-col">
          <SingleValue
            id="weeklyCases"
            title="This week"
            value={guardMissingData(weeklyCases)}
            tooltip="These are the cases over the last week and updated after 2pm daily (Can be delayed because of data fetching)"
          />
        </Col>
        <Col className="single-value-bar-col">
          <SingleValue
            id="totalCases"
            title="Total"
            value={guardMissingData(totalCases.value)}
            tooltip="These are the total cases of COVID-19 since the COVID-19 Pandemic began"
          />
        </Col>
      </Row>
      {blockTitleRow("Deaths")}
      <Row className="single-value-bar-row">
        <Col className="single-value-bar-col">
          <SingleValue
            id="dailyDeaths"
            title={guardMissingData(getRelativeReportedDate(dailyDeaths.date))}
            value={guardMissingData(dailyDeaths.value)}
            tooltip="These are the deaths reported today and updated after 2pm daily (Can be delayed because of data fetching)"
          />
        </Col>
        <Col className="single-value-bar-col">
          <SingleValue
            id="dailyDeaths"
            title="This week"
            value={guardMissingData(weeklyDeaths)}
            tooltip="These are the deaths over the last week and updated after 2pm daily (Can be delayed because of data fetching)"
          />
        </Col>
        <Col className="single-value-bar-col">
          <SingleValue
            id="totalDeaths"
            title="Total"
            value={guardMissingData(totalDeaths.value)}
            tooltip="These are the total deaths since the COVID-19 Pandemic began"
          />
        </Col>
      </Row>
    </Container>
  );
}

export default RegionalSingleValueBar;

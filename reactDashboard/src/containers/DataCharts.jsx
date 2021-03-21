import React, { useEffect, useState } from "react";
import {
  createPlaceDateValuesMap,
  getNhsCsvDataDateRange,
} from "../components/Utils/CsvUtils";
import DataCharts from "../components/DataCharts/DataCharts";

// Exported for tests
export function parseNhsCsvData(csvData) {
  const { dates, placeDateValuesMap } = createPlaceDateValuesMap(csvData);

  const regionDailyCasesMap = new Map();
  const regionDailyDeathsMap = new Map();
  const regionTotalCasesMap = new Map();
  const regionTotalDeathsMap = new Map();
  const regionPercentageTestsMap = new Map();

  const places = [...placeDateValuesMap.keys()];
  places.forEach((place) => {
    const dateValuesMap = placeDateValuesMap.get(place);

    const percentageTestsPoints = [];
    const dailyCasesPoints = [];
    const dailyDeathsPoints = [];
    const totalCasesPoints = [];
    const totalDeathsPoints = [];

    dates.forEach((date, i) => {
      const {
        cases,
        deaths,
        cumulativeCases,
        cumulativeDeaths,
        positivePercentage,
      } = dateValuesMap.get(date);

      percentageTestsPoints.push({
        t: date,
        y: positivePercentage,
      });
      dailyCasesPoints.push({
        t: date,
        y: cases,
      });
      dailyDeathsPoints.push({
        t: date,
        y: deaths,
      });
      totalCasesPoints.push({
        t: date,
        y: cumulativeCases,
      });
      totalDeathsPoints.push({
        t: date,
        y: cumulativeDeaths,
      });
    });
    regionPercentageTestsMap.set(place, percentageTestsPoints);
    regionDailyCasesMap.set(place, dailyCasesPoints);
    regionDailyDeathsMap.set(place, dailyDeathsPoints);
    regionTotalCasesMap.set(place, totalCasesPoints);
    regionTotalDeathsMap.set(place, totalDeathsPoints);
  });

  return {
    regionPercentageTestsMap: regionPercentageTestsMap,
    regionDailyCasesMap: regionDailyCasesMap,
    regionDailyDeathsMap: regionDailyDeathsMap,
    regionTotalCasesMap: regionTotalCasesMap,
    regionTotalDeathsMap: regionTotalDeathsMap,
  };
}

export default function DataChartsContainer({
  healthBoardDataset = null,
  darkmode,
  councilAreaDataset = null,
  regionCode,
  populationProportionMap,
}) {
  const [percentageTestsSeriesData, setPercentageTestsSeriesData] = useState();
  const [dailyCasesSeriesData, setDailyCasesSeriesData] = useState();
  const [dailyDeathsSeriesData, setDailyDeathsSeriesData] = useState();
  const [totalCasesSeriesData, setTotalCasesSeriesData] = useState();
  const [totalDeathsSeriesData, setTotalDeathsSeriesData] = useState();
  const [maxDateRange, setMaxDateRange] = useState( { startDate: 0, endDate: 1 });

  useEffect(() => {
    if (healthBoardDataset != null) {
      const {
        regionPercentageTestsMap,
        regionDailyCasesMap,
        regionDailyDeathsMap,
        regionTotalCasesMap,
        regionTotalDeathsMap,
      } = parseNhsCsvData(healthBoardDataset);

      setPercentageTestsSeriesData((existingMap) =>
        existingMap
          ? new Map([...existingMap, ...regionPercentageTestsMap])
          : regionPercentageTestsMap
      );
      setDailyCasesSeriesData((existingMap) =>
        existingMap
          ? new Map([...existingMap, ...regionDailyCasesMap])
          : regionDailyCasesMap
      );
      setDailyDeathsSeriesData((existingMap) =>
        existingMap
          ? new Map([...existingMap, ...regionDailyDeathsMap])
          : regionDailyDeathsMap
      );
      setTotalCasesSeriesData((existingMap) =>
        existingMap
          ? new Map([...existingMap, ...regionTotalCasesMap])
          : regionTotalCasesMap
      );
      setTotalDeathsSeriesData((existingMap) =>
        existingMap
          ? new Map([...existingMap, ...regionTotalDeathsMap])
          : regionTotalDeathsMap
      );
    }
  }, [healthBoardDataset]);

  useEffect(() => {
    if (councilAreaDataset != null) {
      const {
        regionPercentageTestsMap,
        regionDailyCasesMap,
        regionDailyDeathsMap,
        regionTotalCasesMap,
        regionTotalDeathsMap,
      } = parseNhsCsvData(councilAreaDataset);

      setPercentageTestsSeriesData(
        (existingMap) => new Map([...existingMap, ...regionPercentageTestsMap])
      );
      setDailyCasesSeriesData(
        (existingMap) => new Map([...existingMap, ...regionDailyCasesMap])
      );
      setDailyDeathsSeriesData(
        (existingMap) => new Map([...existingMap, ...regionDailyDeathsMap])
      );
      setTotalCasesSeriesData(
        (existingMap) => new Map([...existingMap, ...regionTotalCasesMap])
      );
      setTotalDeathsSeriesData(
        (existingMap) => new Map([...existingMap, ...regionTotalDeathsMap])
      );
    }
  }, [councilAreaDataset]);

  useEffect(() => {
    if (healthBoardDataset !== null) {
        console.log("Parsing set  max");
      const parseDateRange = getNhsCsvDataDateRange(
        healthBoardDataset,
        councilAreaDataset
      );
      setMaxDateRange(parseDateRange);
    }
  }, [healthBoardDataset, councilAreaDataset]);

  return (
    <DataCharts
      percentageTestsSeriesData={percentageTestsSeriesData}
      dailyCasesSeriesData={dailyCasesSeriesData}
      dailyDeathsSeriesData={dailyDeathsSeriesData}
      totalCasesSeriesData={totalCasesSeriesData}
      totalDeathsSeriesData={totalDeathsSeriesData}
      darkmode={darkmode}
      regionCode={regionCode}
      populationProportionMap={populationProportionMap}
      maxDateRange={maxDateRange}
    />
  );
}

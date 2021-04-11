import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import {
  FEATURE_CODE_SCOTLAND,
  FEATURE_CODE_MAP,
  getPlaceNameByFeatureCode,
  getAllFeatureCodes,
} from "./featureCodes";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export function readCsvData(csvData, expectedColumnNames) {
  var allTextLines = csvData
    .toString()
    .split(/\r\n|\n/)
    .filter((line) => line.trim().length > 0);
  var lines = allTextLines.map((line) => line.split(",").map((s) => s.trim()));

  // Remove the column header row
  const columnNames = lines.shift();

  const columnIndices = {};
  expectedColumnNames.forEach((columnName) => {
    const columnIndex = columnNames.findIndex(
      (current) => current.toLowerCase() == columnName.toLowerCase()
    );
    if (columnIndex == -1) {
      throw new Error("Required column missing: " + columnName);
    }
    columnIndices[columnName] = columnIndex;
  });

  return { columnIndices, lines };
}

function getDateValue(value) {
  const date = dayjs.utc(value, "YYYYMMDD", true);
  if (!date.isValid()) {
    throw new Error("Invalid date value: " + value);
  }
  return date.valueOf();
}

function getFeatureCodeValue(featureCode) {
  if (FEATURE_CODE_MAP[featureCode] == undefined) {
    throw new Error("Invalid feature code: " + featureCode);
  }
  return featureCode;
}

function getValue(value) {
  const result = Number(value);
  if (result == NaN || value == "") {
    throw new Error(`Invalid cell value: '${value}'`);
  }
  return result;
}

// Returns a sorted set of all dates and a map of places->dates->values
function createPlaceDateValuesMap(csvData, forCouncilAreas) {
  // Date,HB,HBName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,DailyNegative,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,PositivePercentage7Day,TotalPillar1,TotalPillar2,HospitalAdmissions,HospitalAdmissionsQF,ICUAdmissions,ICUAdmissionsQF,PositivePillar1,PositivePillar2
  // Date,CA,CAName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,DailyNegative,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,PositivePercentage7Day,TotalPillar1,TotalPillar2,PositivePillar1,PositivePillar2
  const { columnIndices, lines } = readCsvData(csvData, [
    "Date",
    forCouncilAreas ? "CA" : "HB",
    "DailyPositive",
    "CumulativePositive",
    "CrudeRatePositive",
    "DailyDeaths",
    "CumulativeDeaths",
    "PositivePercentage",
  ]);

  columnIndices.featureCode = columnIndices[forCouncilAreas ? "CA" : "HB"];

  const placeDateValuesMap = {};
  const dateSet = new Set();

  lines.forEach((line, i) => {
    const date = getDateValue(line[columnIndices.Date]);
    const featureCode = getFeatureCodeValue(line[columnIndices.featureCode]);

    if (!placeDateValuesMap[featureCode]) {
      placeDateValuesMap[featureCode] = new Map();
    }
    var dateValuesMap = placeDateValuesMap[featureCode];
    dateValuesMap.set(date, {
      cases: getValue(line[columnIndices.DailyPositive]),
      deaths: getValue(line[columnIndices.DailyDeaths]),
      cumulativeCases: getValue(line[columnIndices.CumulativePositive]),
      cumulativeDeaths: getValue(line[columnIndices.CumulativeDeaths]),
      crudeRatePositive: getValue(line[columnIndices.CrudeRatePositive]),
      positivePercentage: getValue(line[columnIndices.PositivePercentage]),
    });
    dateSet.add(date);
  });

  const dates = [...dateSet].sort();
  return { dates: dates, placeDateValuesMap: placeDateValuesMap };
}

function parseNhsTotalsCsvData(csvData, forCouncilAreas) {
  // Date,HB,HBQF,HBName,NewPositive,TotalCases,CrudeRatePositive,NewDeaths,TotalDeaths,CrudeRateDeaths,TotalNegative,CrudeRateNegative
  // Date,CA,CAName,NewPositive,TotalCases,CrudeRatePositive,NewDeaths,TotalDeaths,CrudeRateDeaths,TotalNegative,CrudeRateNegative
  const { columnIndices, lines } = readCsvData(csvData, [
    "Date",
    forCouncilAreas ? "CA" : "HB",
    "NewPositive",
    "TotalCases",
    "NewDeaths",
    "TotalDeaths",
  ]);

  columnIndices.featureCode = columnIndices[forCouncilAreas ? "CA" : "HB"];

  const placeStatsMap = {};

  lines.forEach((line, i) => {
    const date = getDateValue(line[columnIndices.Date]);
    const featureCode = getFeatureCodeValue(line[columnIndices.featureCode]);
    const cumulativeCases = getValue(line[columnIndices.TotalCases]);
    const cumulativeDeaths = getValue(line[columnIndices.TotalDeaths]);

    const fatalityCaseRatio =
      cumulativeCases !== undefined && cumulativeDeaths !== undefined
        ? ((cumulativeDeaths * 100) / cumulativeCases).toFixed(1) + "%"
        : undefined;
    placeStatsMap[featureCode] = {
      dailyCases: {
        date: date,
        value: getValue(line[columnIndices.NewPositive]),
      },
      dailyDeaths: {
        date: date,
        value: getValue(line[columnIndices.NewDeaths]),
      },
      cumulativeCases: { date: date, value: cumulativeCases },
      cumulativeDeaths: { date: date, value: cumulativeDeaths },
      fatalityCaseRatio: fatalityCaseRatio,
    };
  });
  return placeStatsMap;
}

// Return summary stats per region for the last 7 days
function getCurrentWeekTotals({ dates, placeDateValuesMap }) {
  const endDate = dates[dates.length - 1];
  const startDate = dayjs.utc(endDate).subtract(6, "days").valueOf();
  const currentWeekDates = dates.filter((date) => date >= startDate);

  var scotlandTotalCases = 0;
  var scotlandTotalDeaths = 0;

  const regions = {};
  Object.keys(placeDateValuesMap).forEach((featureCode) => {
    const dateValuesMap = placeDateValuesMap[featureCode];
    var regionTotalCases = 0;
    var regionTotalDeaths = 0;
    currentWeekDates.forEach((date) => {
      const values = dateValuesMap.get(date);
      if (values !== undefined) {
        regionTotalCases += values.cases;
        regionTotalDeaths += values.deaths;
      }
    });
    regions[featureCode] = {
      weeklyCases: regionTotalCases,
      weeklyDeaths: regionTotalDeaths,
      name: getPlaceNameByFeatureCode(featureCode),
    };
    scotlandTotalCases += regionTotalCases;
    scotlandTotalDeaths += regionTotalDeaths;
  });

  return { currentWeekStartDate: currentWeekDates[0], regions: regions };
}

function getPopulationMap({ placeDateValuesMap }, finalDate) {
  const populationMap = {};
  Object.keys(placeDateValuesMap).forEach((place) => {
    const { cumulativeCases, crudeRatePositive } = placeDateValuesMap[
      place
    ].get(finalDate);
    if (crudeRatePositive === 0) {
      populationMap[place] = 0;
    } else {
      const population = 100000 * (cumulativeCases / crudeRatePositive);
      populationMap[place] = population;
    }
  });

  return populationMap;
}

function calculatePopulationProportionMap(populationMap) {
  const result = {};
  const scotlandPopulation = populationMap[FEATURE_CODE_SCOTLAND];
  if (scotlandPopulation !== undefined) {
    Object.keys(populationMap).forEach(
      (place) => (result[place] = populationMap[place] / scotlandPopulation)
    );
  }
  return result;
}

function getPlaceTotalsStats(
  dateString,
  dailyCases,
  cumulativeCases,
  dailyDeaths,
  cumulativeDeaths
) {
  const date = dayjs.utc(dateString, "YYYYMMDD").valueOf();
  const fatalityCaseRatio =
    cumulativeCases !== undefined && cumulativeDeaths !== undefined
      ? ((cumulativeDeaths * 100) / cumulativeCases).toFixed(1) + "%"
      : undefined;
  return {
    dailyCases: { date: date, value: Number(dailyCases) },
    dailyDeaths: { date: date, value: Number(dailyDeaths) },
    cumulativeCases: { date: date, value: Number(cumulativeCases) },
    cumulativeDeaths: { date: date, value: Number(cumulativeDeaths) },
    fatalityCaseRatio: fatalityCaseRatio,
  };
}

function aggregateWeeks(dates, placeDateValuesMap) {
  const startDate = dates[0];
  const endDate = dates[dates.length - 1];
  const millisInWeek = 7 * 24 * 3600 * 1000;

  const weekStartDates = [];
  let currentDate = startDate;
  while (currentDate < endDate) {
    weekStartDates.push(currentDate);
    currentDate = currentDate + millisInWeek;
  }
  const weeklyPlaceDateValuesMap = new Map();
  Object.keys(placeDateValuesMap).forEach((place) => {
    const dateValueMap = placeDateValuesMap[place];
    const weeklyDateValueMap = new Map();
    weeklyPlaceDateValuesMap.set(place, weeklyDateValueMap);

    weekStartDates.forEach((weekStart) => {
      const weekEnd = weekStart + millisInWeek;

      let total = {
        cases: 0,
        deaths: 0,
        cumulativeCases: 0,
        cumulativeDeaths: 0,
      };
      weeklyDateValueMap.set(weekStart, total);
      dates.forEach((date) => {
        if (date >= weekStart && date < weekEnd) {
          const current = dateValueMap.get(date);
          total.cases += current.cases;
          total.deaths += current.deaths;
          total.cumulativeCases = current.cumulativeCases;
          total.cumulativeDeaths = current.cumulativeDeaths;
        }
      });
    });
  });
  return { weekStartDates, weeklyPlaceDateValuesMap };
}

function getWeeklySeriesData({ dates, placeDateValuesMap }) {
  const { weekStartDates, weeklyPlaceDateValuesMap } = aggregateWeeks(
    dates,
    placeDateValuesMap
  );
  var regions = {};
  weeklyPlaceDateValuesMap.forEach((dateValuesMap, featureCode) => {
    const allCases = [];
    const allDeaths = [];
    weekStartDates.forEach((date) => {
      const { cases, deaths } = dateValuesMap.get(date);
      allCases.push(cases);
      allDeaths.push(deaths);
    });
    regions[featureCode] = { cases: allCases, deaths: allDeaths };
  });

  return {
    weekStartDates: weekStartDates,
    regionWeeklySeries: regions,
  };
}

function getDailySeriesData({ dates, placeDateValuesMap }) {
  const result = {};

  Object.keys(placeDateValuesMap).forEach((place) => {
    const dateValuesMap = placeDateValuesMap[place];

    const percentPositiveTests = [];
    const dailyCases = [];
    const dailyDeaths = [];
    const totalCases = [];
    const totalDeaths = [];

    dates.forEach((date, i) => {
      const {
        cases,
        deaths,
        cumulativeCases,
        cumulativeDeaths,
        positivePercentage,
      } = dateValuesMap.get(date);

      percentPositiveTests.push(positivePercentage);
      dailyCases.push(cases);
      dailyDeaths.push(deaths);
      totalCases.push(cumulativeCases);
      totalDeaths.push(cumulativeDeaths);
    });

    result[place] = {
      percentPositiveTests,
      dailyCases,
      dailyDeaths,
      totalCases,
      totalDeaths,
    };
  });

  return result;
}

function mergePlaceDateValuesMap(healthBoardMap, councilAreaMap) {
  const commonDates = healthBoardMap.dates.filter((date) =>
    councilAreaMap.dates.includes(date)
  );
  const commonPlaceDateValuesMap = {
    ...councilAreaMap.placeDateValuesMap,
    ...healthBoardMap.placeDateValuesMap,
  };
  Object.keys(commonPlaceDateValuesMap).forEach((region) => {
    const dateValuesMap = commonPlaceDateValuesMap[region];
    [...dateValuesMap.keys()].forEach((date) => {
      if (!commonDates.includes(date)) {
        dateValuesMap.delete(date);
      }
    });
  });
  return { dates: commonDates, placeDateValuesMap: commonPlaceDateValuesMap };
}

export function createJsonData(
  councilAreaCsvData = null,
  healthBoardCsvData = null,
  currentTotalsCouncilAreaCsvData = null,
  currentTotalsHealthBoardCsvData = null
) {
  if (
    councilAreaCsvData === null ||
    healthBoardCsvData === null ||
    currentTotalsCouncilAreaCsvData === null ||
    currentTotalsHealthBoardCsvData === null
  ) {
    return null;
  }

  try {
    const placeDateValuesMap = mergePlaceDateValuesMap(
      createPlaceDateValuesMap(healthBoardCsvData, false),
      createPlaceDateValuesMap(councilAreaCsvData, true)
    );

    let featureCodes = Object.keys(placeDateValuesMap.placeDateValuesMap);
    getAllFeatureCodes().forEach((featureCode) => {
      if (!featureCodes.includes(featureCode)) {
        throw new Error("Daily case data is missing a region: " + featureCode);
      }
    });

    const startDate = placeDateValuesMap.dates[0];
    const endDate =
      placeDateValuesMap.dates[placeDateValuesMap.dates.length - 1];

    const populationMap = getPopulationMap(placeDateValuesMap, endDate);
    const populationProportionMap = calculatePopulationProportionMap(
      populationMap
    );

    let { currentWeekStartDate, regions } = getCurrentWeekTotals(
      placeDateValuesMap
    );

    const regionTotals = {
      ...parseNhsTotalsCsvData(currentTotalsCouncilAreaCsvData, true),
      ...parseNhsTotalsCsvData(currentTotalsHealthBoardCsvData, false),
    };

    featureCodes = Object.keys(regionTotals);
    getAllFeatureCodes().forEach((featureCode) => {
      if (!featureCodes.includes(featureCode)) {
        throw new Error("Total case data is missing a region: " + featureCode);
      }
    });

    const { weekStartDates, regionWeeklySeries } = getWeeklySeriesData(
      placeDateValuesMap
    );
    const regionDailySeries = getDailySeriesData(placeDateValuesMap);

    Object.keys(regions).forEach((region, i) => {
      const regionData = regions[region];
      Object.assign(regionData, regionTotals[region]);
      regionData.population = populationMap[region];
      regionData.populationProportion = populationProportionMap[region];
      regionData.weeklySeries = regionWeeklySeries[region];
      regionData.dailySeries = regionDailySeries[region];
    });

    return {
      regions: regions,
      dates: placeDateValuesMap.dates,
      weekStartDates: weekStartDates,
      startDate: startDate,
      endDate: endDate,
      currentWeekStartDate: currentWeekStartDate,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

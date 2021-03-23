import moment from "moment";
import { differenceInDays, format } from "date-fns";
import deepmerge from "deepmerge";

export function getNhsCsvDataDateRange(csvDataHB, csvDataCA = null) {
  let dates = [...createDateSet(csvDataHB)];

  if (csvDataCA != null) {
    dates = [...dates, ...createDateSet(csvDataCA)];
  }
  dates.sort();
  if (dates.length === 0) {
    return { startDate: 0, endDate: 0 };
  }

  return {
    startDate: dates[0],
    endDate: dates.pop(),
  };
}

export function readCsvData(csvData) {
  var allTextLines = csvData
    .toString()
    .split(/\r\n|\n/)
    .filter((line) => line.trim().length > 0);
  var lines = [];

  // Remove the column header row
  allTextLines.shift();

  allTextLines.forEach((line) => {
    const splitline = line.split(",").map((s) => s.trim());
    if (isValidCsvRow(splitline)) {
      lines.push(splitline);
    } else {
      console.warn("Invalid csv data: [" + line + "]");
    }
  });
  return lines;
}

// Validate the first two cells ([date, featureCode] common to all the current CSV files)
function isValidCsvRow(cells) {
  const [dateString, featureCode] = cells;
  return (
    moment.utc(dateString, true).isValid() &&
    FEATURE_CODE_MAP[featureCode] !== undefined
  );
}

// Expects the input CSV columns to be: Date,[HB or CA],DailyPositive,U1,U2,U3,DailyDeaths,CumulativeDeaths,...
// as returned from :
// Daily Case Trends By Health Board
// https://www.opendata.nhs.scot/dataset/covid-19-in-scotland/resource/2dd8534b-0a6f-4744-9253-9565d62f96c2
// Daily Case Trends By Council Area
// https://www.opendata.nhs.scot/dataset/covid-19-in-scotland/resource/427f9a25-db22-4014-a3bc-893b68243055
//
// Returns a sorted set of all dates and a map of places->dates->values
export function createPlaceDateValuesMap(lines) {
  const placeDateValuesMap = new Map();
  const dateSet = new Set();

  lines.forEach(
    (
      [
        dateString,
        place,
        v1,
        dailyCases,
        cumulativeCases,
        crudeRatePositive,
        v2,
        dailyDeaths,
        cumulativeDeaths,
        v3,
        v4,
        v5,
        v6,
        v7,
        v8,
        positivePercentage,
      ],
      i
    ) => {
      const date = moment.utc(dateString).valueOf();
      if (!placeDateValuesMap.has(place)) {
        placeDateValuesMap.set(place, new Map());
      }
      var dateValuesMap = placeDateValuesMap.get(place);
      dateValuesMap.set(date, {
        cases: Number(dailyCases),
        deaths: Number(dailyDeaths),
        cumulativeCases: Number(cumulativeCases),
        cumulativeDeaths: Number(cumulativeDeaths),
        crudeRatePositive: Number(crudeRatePositive),
        positivePercentage: Number(positivePercentage),
      });
      dateSet.add(date);
    }
  );

  const dates = [...dateSet].sort();
  return { dates: dates, placeDateValuesMap: placeDateValuesMap };
}

// Expects the input CSV columns to be: Date,[HB or CA],DailyPositive,U1,U2,U3,DailyDeaths,CumulativeDeaths,...
// as returned from :
// Daily Case Trends By Health Board
// https://www.opendata.nhs.scot/dataset/covid-19-in-scotland/resource/2dd8534b-0a6f-4744-9253-9565d62f96c2
// Daily Case Trends By Council Area
// https://www.opendata.nhs.scot/dataset/covid-19-in-scotland/resource/427f9a25-db22-4014-a3bc-893b68243055
//

function createDateSet(lines) {
  const result = new Set();
  lines.forEach(([dateString]) => {
    result.add(moment.utc(dateString).valueOf());
  });

  return result;
}

const queryUrl = process.env.PUBLIC_URL + "/data/";

// Retrieve a cached csv response, do some processing on it, then store the processed result
export async function fetchAndStore(datasetName, setDataset, processCsvData) {
  fetch(queryUrl + datasetName, {
    method: "GET",
  })
    .then((res) => res.text())
    .then((csvData) => {
      setDataset(processCsvData(csvData));
    })
    .catch((error) => {
      console.error(error);
    });
}

// Return summary stats per region for the last 7 days
export function parse7DayWindowCsvData({ dates, placeDateValuesMap }) {
  const endDate = dates[dates.length - 1];
  const startDate = moment.utc(endDate).subtract(6, "days").valueOf();
  const filteredDates = dates.filter((date) => date >= startDate);

  var scotlandTotalCases = 0;
  var scotlandTotalDeaths = 0;

  const regions = new Map();
  placeDateValuesMap.forEach((dateValuesMap, featureCode) => {
    var regionTotalCases = 0;
    var regionTotalDeaths = 0;
    filteredDates.forEach((date) => {
      const values = dateValuesMap.get(date);
      if (values !== undefined) {
        regionTotalCases += values.cases;
        regionTotalDeaths += values.deaths;
      }
    });
    regions.set(featureCode, {
      weeklyCases: regionTotalCases,
      weeklyDeaths: regionTotalDeaths,
      fromDate: filteredDates[0],
      name: getPlaceNameByFeatureCode(featureCode),
      toDate: endDate,
    });
    scotlandTotalCases += regionTotalCases;
    scotlandTotalDeaths += regionTotalDeaths;
  });

  regions.set(FEATURE_CODE_SCOTLAND, {
    weeklyCases: scotlandTotalCases,
    weeklyDeaths: scotlandTotalDeaths,
    fromDate: filteredDates[0],
    name: getPlaceNameByFeatureCode(FEATURE_CODE_SCOTLAND),
    toDate: endDate,
  });

  return regions;
}

// Return date in words relative to today
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

export function getPopulationMap(placeDateValuesResult) {
  const { dates, placeDateValuesMap } = placeDateValuesResult;

  const populationMap = new Map();
  const reverseDates = [...dates].reverse();

  const places = [...placeDateValuesMap.keys()];
  places.forEach((place) => {
    const dateValuesMap = placeDateValuesMap.get(place);
    const finalDate = reverseDates.find((date) => dateValuesMap.get(date));
    const { cumulativeCases, crudeRatePositive } = dateValuesMap.get(finalDate);
    if (crudeRatePositive === 0) {
      populationMap.set(place, 0);
    } else {
      const population = 100000 * (cumulativeCases / crudeRatePositive);
      populationMap.set(place, population);
    }
  });

  return populationMap;
}

// Exported for tests
export function calculatePopulationProportionMap(populationMap) {
  const result = new Map();

  const scotlandPopulation = populationMap.get(FEATURE_CODE_SCOTLAND);
  if (scotlandPopulation !== undefined) {
    const places = [...populationMap.keys()];
    places.forEach((place) => {
      const population = populationMap.get(place);
      result.set(place, population / scotlandPopulation);
    });
  }
  return result;
}

export const FEATURE_CODE_SCOTLAND = "S92000003";

export const FEATURE_CODE_COUNCIL_AREAS_MAP = {
  S12000033: "Aberdeen City",
  S12000034: "Aberdeenshire",
  S12000041: "Angus",
  S12000035: "Argyll & Bute",
  S12000036: "City of Edinburgh",
  S12000005: "Clackmannanshire",
  S12000006: "Dumfries & Galloway",
  S12000042: "Dundee City",
  S12000008: "East Ayrshire",
  S12000045: "East Dunbartonshire",
  S12000010: "East Lothian",
  S12000011: "East Renfrewshire",
  S12000014: "Falkirk",
  S12000047: "Fife",
  S12000049: "Glasgow City",
  S12000017: "Highland",
  S12000018: "Inverclyde",
  S12000019: "Midlothian",
  S12000020: "Moray",
  S12000013: "Na h-Eileanan Siar",
  S12000021: "North Ayrshire",
  S12000050: "North Lanarkshire",
  S12000023: "Orkney Islands",
  S12000048: "Perth & Kinross",
  S12000038: "Renfrewshire",
  S12000026: "Scottish Borders",
  S12000027: "Shetland Islands",
  S12000028: "South Ayrshire",
  S12000029: "South Lanarkshire",
  S12000030: "Stirling",
  S12000039: "West Dunbartonshire",
  S12000040: "West Lothian",
};

export const FEATURE_CODE_COUNCIL_AREAS = Object.keys(
  FEATURE_CODE_COUNCIL_AREAS_MAP
);

export const FEATURE_CODE_HEALTH_BOARDS_MAP = {
  S08000015: "Ayrshire & Arran",
  S08000016: "Borders",
  S08000017: "Dumfries & Galloway",
  S08000029: "Fife",
  S08000019: "Forth Valley",
  S08000020: "Grampian",
  S08000031: "Greater Glasgow & Clyde",
  S08000022: "Highland",
  S08000032: "Lanarkshire",
  S08000024: "Lothian",
  S08000025: "Orkney",
  S08000026: "Shetland",
  S08000030: "Tayside",
  S08000028: "Western Isles",
};

export const FEATURE_CODE_HEALTH_BOARDS = Object.keys(
  FEATURE_CODE_HEALTH_BOARDS_MAP
);

export const FEATURE_CODE_MAP = {
  S92000003: "Scotland",
  ...FEATURE_CODE_HEALTH_BOARDS_MAP,
  ...FEATURE_CODE_COUNCIL_AREAS_MAP,
};

export function getPlaceNameByFeatureCode(featureCode) {
  const result = FEATURE_CODE_MAP[featureCode];
  if (result === undefined) {
    throw new Error("Unknown feature code: " + featureCode);
  }
  return result;
}

export function getPhoneticPlaceNameByFeatureCode(featureCode) {
  if (featureCode === "S12000013") {
    return "Nahelen an sheer";
  }
  return getPlaceNameByFeatureCode(featureCode);
}

function getPlaceTotalsStats(
  dateString,
  dailyCases,
  cumulativeCases,
  dailyDeaths,
  cumulativeDeaths
) {
  const date = moment.utc(dateString).valueOf();
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

function parseNhsHBTotalsCsvData(lines) {
  const placeStatsMap = {};

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
      placeStatsMap[place] = getPlaceTotalsStats(
        dateString,
        dailyCases,
        cumulativeCases,
        dailyDeaths,
        cumulativeDeaths
      );
    }
  );
  return placeStatsMap;
}

function parseNhsCATotalsCsvData(lines) {
  const placeStatsMap = {};

  lines.forEach(
    (
      [
        dateString,
        place,
        v1,
        dailyCases,
        cumulativeCases,
        v2,
        dailyDeaths,
        cumulativeDeaths,
      ],
      i
    ) => {
      placeStatsMap[place] = getPlaceTotalsStats(
        dateString,
        dailyCases,
        cumulativeCases,
        dailyDeaths,
        cumulativeDeaths
      );
    }
  );
  return placeStatsMap;
}

function aggregateWeeks(dates, placeDateValuesMap) {
  const startDate = dates[0];
  const endDate = dates[dates.length - 1];
  const millisInWeek = 7 * 24 * 3600 * 1000;

  const weeklyDates = [];
  let currentDate = startDate;
  while (currentDate < endDate) {
    weeklyDates.push(currentDate);
    currentDate = currentDate + millisInWeek;
  }
  const weeklyPlaceDateValuesMap = new Map();
  placeDateValuesMap.forEach((dateValueMap, place) => {
    const weeklyDateValueMap = new Map();
    weeklyPlaceDateValuesMap.set(place, weeklyDateValueMap);

    weeklyDates.forEach((weekStart) => {
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
  return { weeklyDates, weeklyPlaceDateValuesMap };
}

// Exported for tests
export function parseHeatmapCsvData({ dates, placeDateValuesMap }) {
  const { weeklyDates, weeklyPlaceDateValuesMap } = aggregateWeeks(
    dates,
    placeDateValuesMap
  );
  var regions = {};
  var scotland = null;
  weeklyPlaceDateValuesMap.forEach((dateValuesMap, featureCode) => {
    const allCases = [];
    const allDeaths = [];
    var totalCases = 0;
    var totalDeaths = 0;
    weeklyDates.forEach((date) => {
      const {
        cases,
        deaths,
        cumulativeCases,
        cumulativeDeaths,
      } = dateValuesMap.get(date);
      allCases.push(cases);
      allDeaths.push(deaths);
      // Only using the last of each of the cumulative values
      totalCases = cumulativeCases;
      totalDeaths = cumulativeDeaths;
    });
    const region = {
      featureCode: featureCode,
      name: getPlaceNameByFeatureCode(featureCode),
      totalDeaths: totalDeaths,
      totalCases: totalCases,
      cases: allCases,
      deaths: allDeaths,
    };
    regions[featureCode] = region;
  });

  return {
    startDate: dates[0],
    endDate: dates[dates.length - 1],
    dates: weeklyDates,
    scotland: scotland,
    regions: regions,
  };
}

// Exported for tests
export function getScotlandHeatmapRegion(regions) {
  var result = regions.find(
    ({ featureCode }) => featureCode === FEATURE_CODE_SCOTLAND
  );
  if (result !== undefined) {
    return result;
  }
  // Calculate Scotland region
  const weekCount = regions[0] ? regions[0].cases.length : 0;

  result = {
    featureCode: FEATURE_CODE_SCOTLAND,
    name: getPlaceNameByFeatureCode(FEATURE_CODE_SCOTLAND),
    totalDeaths: 0,
    totalCases: 0,
    cases: Array(weekCount).fill(0),
    deaths: Array(weekCount).fill(0),
  };

  regions.forEach(({ totalDeaths, totalCases, cases, deaths }) => {
    result.totalDeaths += totalDeaths;
    result.totalCases += totalCases;
    for (let i = 0; i < weekCount; i++) {
      result.cases[i] += cases[i];
      result.deaths[i] += deaths[i];
    }
  });
  return result;
}

// Exported for tests
export function parseDatachartsNhsCsvData({ dates, placeDateValuesMap }) {
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

      percentageTestsPoints.push(positivePercentage);
      dailyCasesPoints.push(cases);
      dailyDeathsPoints.push(deaths);
      totalCasesPoints.push(cumulativeCases);
      totalDeathsPoints.push(cumulativeDeaths);
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

export function getAllData(
  currentTotalsHealthBoardDataset = null,
  currentTotalsCouncilAreaDataset = null,
  councilAreaDataset = null,
  healthBoardDataset = null
) {
  if (
    currentTotalsHealthBoardDataset === null ||
    currentTotalsCouncilAreaDataset === null ||
    councilAreaDataset === null ||
    healthBoardDataset === null
  ) {
    return null;
  }

  const hbPlaceDateValuesMap = createPlaceDateValuesMap(healthBoardDataset);
  const caPlaceDateValuesMap = createPlaceDateValuesMap(councilAreaDataset);

  const hbPopulationMap = getPopulationMap(hbPlaceDateValuesMap);
  const caPopulationMap = getPopulationMap(caPlaceDateValuesMap);
  const populationMap = new Map([...caPopulationMap, ...hbPopulationMap]);

  const populationProportionMap = calculatePopulationProportionMap(
    populationMap
  );

  let regions = {
    ...Object.fromEntries(parse7DayWindowCsvData(caPlaceDateValuesMap)),
    ...Object.fromEntries(parse7DayWindowCsvData(hbPlaceDateValuesMap)),
  };
  const regionTotals = {
    ...parseNhsCATotalsCsvData(currentTotalsCouncilAreaDataset),
    ...parseNhsHBTotalsCsvData(currentTotalsHealthBoardDataset),
  };

  const hbHeatmap = parseHeatmapCsvData(hbPlaceDateValuesMap);
  const caHeatmap = parseHeatmapCsvData(caPlaceDateValuesMap);
  const heatmapDataset = {
    ...hbHeatmap,
    regions: { ...caHeatmap.regions, ...hbHeatmap.regions },
  };

  const maxDateRange = {
    startDate: hbPlaceDateValuesMap.dates[0],
    endDate: hbPlaceDateValuesMap.dates[hbPlaceDateValuesMap.dates.length - 1],
  };

  const hbDatacharts = parseDatachartsNhsCsvData(hbPlaceDateValuesMap);
  const caDatacharts = parseDatachartsNhsCsvData(caPlaceDateValuesMap);

  const percentageTestsSeriesData = {
    ...Object.fromEntries(caDatacharts.regionPercentageTestsMap),
    ...Object.fromEntries(hbDatacharts.regionPercentageTestsMap),
  };
  const dailyCasesSeriesData = {
    ...Object.fromEntries(caDatacharts.regionDailyCasesMap),
    ...Object.fromEntries(hbDatacharts.regionDailyCasesMap),
  };
  const dailyDeathsSeriesData = {
    ...Object.fromEntries(caDatacharts.regionDailyDeathsMap),
    ...Object.fromEntries(hbDatacharts.regionDailyDeathsMap),
  };
  const totalCasesSeriesData = {
    ...Object.fromEntries(caDatacharts.regionTotalCasesMap),
    ...Object.fromEntries(hbDatacharts.regionTotalCasesMap),
  };
  const totalDeathsSeriesData = {
    ...Object.fromEntries(caDatacharts.regionTotalDeathsMap),
    ...Object.fromEntries(hbDatacharts.regionTotalDeathsMap),
  };

  Object.keys(regions).forEach((region, i) => {
    const regionData = regions[region];
    regionData.population = populationMap.get(region);
    regionData.populationProportion = populationProportionMap.get(region);
    Object.assign(regionData, regionTotals[region]);
    regionData.heatmap = heatmapDataset.regions[region];
    regionData.dataseries = {
      percentageTestsSeriesData: percentageTestsSeriesData[region],
      dailyCasesSeriesData: dailyCasesSeriesData[region],
      dailyDeathsSeriesData: dailyDeathsSeriesData[region],
      totalCasesSeriesData: totalCasesSeriesData[region],
      totalDeathsSeriesData: totalDeathsSeriesData[region],
    };
  });

  const result = {
    regions: regions,
    dates: hbPlaceDateValuesMap.dates,
    startDate: heatmapDataset.startDate,
    endDate: heatmapDataset.endDate,
    maxDateRange: maxDateRange,
  };
  console.log(JSON.stringify(result));
  return result;
}

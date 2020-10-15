import moment from "moment";
import { differenceInDays, format } from "date-fns";

export function getNhsCsvDataDateRange(csvDataHB, csvDataCA = null) {
  let dateAggregateValuesMap = createDateAggregateValuesMap(csvDataHB);

  let dates = [...dateAggregateValuesMap.keys()].sort();

  if (csvDataCA != null) {
    dateAggregateValuesMap = createDateAggregateValuesMap(csvDataCA);

    dates = [...dates, ...dateAggregateValuesMap.keys()].sort();
  }

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

// Expects the input CVS columns to be: Date,[HB or CA],DailyPositive,U1,U2,U3,DailyDeaths,CumulativeDeaths,...
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
        v3,
        dailyDeaths,
        cumulativeDeaths,
        v4,
        cumulativeNegativeTests,
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
        cumulativeNegativeTests: Number(cumulativeNegativeTests),
      });
      dateSet.add(date);
    }
  );

  const dates = [...dateSet].sort();
  return { dates: dates, placeDateValuesMap: placeDateValuesMap };
}

// Expects the input CVS columns to be: Date,[HB or CA],DailyPositive,U1,U2,U3,DailyDeaths,CumulativeDeaths,...
// as returned from :
// Daily Case Trends By Health Board
// https://www.opendata.nhs.scot/dataset/covid-19-in-scotland/resource/2dd8534b-0a6f-4744-9253-9565d62f96c2
// Daily Case Trends By Council Area
// https://www.opendata.nhs.scot/dataset/covid-19-in-scotland/resource/427f9a25-db22-4014-a3bc-893b68243055
//
// Returns a map of dates->summed values over all places
export function createDateAggregateValuesMap(lines) {
  const result = new Map();

  lines.forEach(
    (
      [
        dateString,
        featureCode,
        v5,
        dailyCases,
        cumulativeCases,
        v2,
        v3,
        dailyDeaths,
        cumulativeDeaths,
        v4,
        cumulativeNegativeTests,
      ],
      i
    ) => {
      if (featureCode !== FEATURE_CODE_SCOTLAND) {
        const date = moment.utc(dateString).valueOf();
        if (!result.has(date)) {
          result.set(date, {
            cases: 0,
            deaths: 0,
            cumulativeCases: 0,
            cumulativeDeaths: 0,
            cumulativeNegativeTests: 0,
          });
        }
        var values = result.get(date);
        result.set(date, {
          cases: values.cases + Number(dailyCases),
          deaths: values.deaths + Number(dailyDeaths),
          cumulativeCases: values.cumulativeCases + Number(cumulativeCases),
          cumulativeDeaths: values.cumulativeDeaths + Number(cumulativeDeaths),
          cumulativeNegativeTests:
            values.cumulativeNegativeTests + Number(cumulativeNegativeTests),
        });
      }
    }
  );

  return result;
}

const queryUrl = "/data/";

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
export function parse7DayWindowCsvData(csvData) {
  const { dates, placeDateValuesMap } = createPlaceDateValuesMap(csvData);
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
      cases: regionTotalCases,
      deaths: regionTotalDeaths,
      fromDate: filteredDates[0],
      name: getPlaceNameByFeatureCode(featureCode),
      toDate: endDate,
    });
    scotlandTotalCases += regionTotalCases;
    scotlandTotalDeaths += regionTotalDeaths;
  });

  regions.set(FEATURE_CODE_SCOTLAND, {
    cases: scotlandTotalCases,
    deaths: scotlandTotalDeaths,
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

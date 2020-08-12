import moment from "moment";

export function readCsvData(csvData) {
  var allTextLines = csvData.toString().split(/\r\n|\n/);
  var lines = [];

  allTextLines.forEach((line) => {
    if (line.trim().length > 0) {
      lines.push(line.split(",").map((s) => s.trim()));
    }
  });
  // Remove the column header row
  lines.shift();
  return lines;
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
      if (!placeDateValuesMap.has(place)) {
        placeDateValuesMap.set(place, new Map());
      }
      var dateValuesMap = placeDateValuesMap.get(place);
      dateValuesMap.set(date, {
        cases: Number(dailyCases),
        deaths: Number(dailyDeaths),
        cumulativeCases: Number(cumulativeCases),
        cumulativeDeaths: Number(cumulativeDeaths),
      });
      dateSet.add(date);
    }
  );

  const dates = [...dateSet].sort();
  return { dates: dates, placeDateValuesMap: placeDateValuesMap };
}

const queryUrl = "data/";

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

const FEATURE_CODE_MAP = {
  // Country
  S92000003: "Scotland",
  //Health boards
  S08000015: "Ayrshire & Arran",
  S08000016: "Borders",
  S08000017: "Dumfries & Galloway",
  S08000019: "Forth Valley",
  S08000020: "Grampian",
  S08000022: "Highland",
  S08000024: "Lothian",
  S08000025: "Orkney",
  S08000026: "Shetland",
  S08000028: "Western Isles",
  S08000029: "Fife",
  S08000030: "Tayside",
  S08000031: "Greater Glasgow & Clyde",
  S08000032: "Lanarkshire",
  //Council areas
  S12000005: "Clackmannanshire",
  S12000006: "Dumfries & Galloway",
  S12000008: "East Ayrshire",
  S12000010: "East Lothian",
  S12000011: "East Renfrewshire",
  S12000013: "Na h-Eileanan Siar",
  S12000014: "Falkirk",
  S12000017: "Highland",
  S12000018: "Inverclyde",
  S12000019: "Midlothian",
  S12000020: "Moray",
  S12000021: "North Ayrshire",
  S12000023: "Orkney Islands",
  S12000026: "Scottish Borders",
  S12000027: "Shetland Islands",
  S12000028: "South Ayrshire",
  S12000029: "South Lanarkshire",
  S12000030: "Stirling",
  S12000033: "Aberdeen City",
  S12000034: "Aberdeenshire",
  S12000035: "Argyll & Bute",
  S12000036: "City of Edinburgh",
  S12000038: "Renfrewshire",
  S12000039: "West Dunbartonshire",
  S12000040: "West Lothian",
  S12000041: "Angus",
  S12000042: "Dundee City",
  S12000045: "East Dunbartonshire",
  S12000047: "Fife",
  S12000048: "Perth & Kinross",
  S12000049: "Glasgow City",
  S12000050: "North Lanarkshire",
};

export function getPlaceNameByFeatureCode(featureCode) {
  const result = FEATURE_CODE_MAP[featureCode];
  if (result === undefined) {
    throw new Error("Unknown feature code: " + featureCode);
  }
  return result;
}

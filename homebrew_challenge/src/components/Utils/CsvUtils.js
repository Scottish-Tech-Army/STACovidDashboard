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

// Expects the input CVS columns to be: date, place, value
// Returns a sorted set of all dates, and a map of places->dates->values in sorted place order
export function createPlaceDateValueMap(lines) {
  const placeDateValueMap = new Map();
  const dateSet = new Set();

  lines.forEach(([dateString, place, count], i) => {
    // weekly dates start with "w/c "
    dateString = dateString.replace("w/c ", "");
    const date = Date.parse(dateString);

    if (!placeDateValueMap.has(place)) {
      placeDateValueMap.set(place, new Map());
    }
    var dateValueMap = placeDateValueMap.get(place);
    dateValueMap.set(date, count === "*" ? 0 : Number(count));
    dateSet.add(date);
  });

  const sortedPlaceDateValueMap = new Map([...placeDateValueMap].sort());
  const dates = [...dateSet].sort();
  return { dates: dates, placeDateValueMap: sortedPlaceDateValueMap };
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

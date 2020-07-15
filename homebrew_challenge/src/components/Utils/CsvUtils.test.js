import {
  readCsvData,
  createPlaceDateValueMap,
  createPlaceMomentDateValueMap,
  fetchAndStore,
} from "../Utils/CsvUtils";
import { act } from "react-dom/test-utils";
import moment from "moment";

beforeEach(() => {
  fetch.resetMocks();
});

const weeklyCsvData = `date,areaname,count
  w/c 2020-03-16,Orkney Islands,0
  w/c 2020-03-23,Glasgow City,7
  w/c 2020-03-23,Aberdeen City,0
  w/c 2020-03-30,Orkney Islands,0
  w/c 2020-03-30,Glasgow City,46
  w/c 2020-03-16,Glasgow City,1
  w/c 2020-03-16,Aberdeen City,1
  w/c 2020-03-23,Orkney Islands,0
  w/c 2020-03-30,Aberdeen City,2
  w/c 2020-04-06,Orkney Islands,2
  w/c 2020-04-06,Glasgow City,97
  w/c 2020-04-06,Aberdeen City,12

  `;

const dailyCsvData = `date,areaname,count
    2020-03-16,Orkney Islands,0
    2020-03-23,Glasgow City,7
    2020-03-23,Aberdeen City,0
    2020-03-30,Orkney Islands,0
    2020-03-30,Glasgow City,46
    2020-03-16,Glasgow City,1
    2020-03-16,Aberdeen City,1
    2020-03-23,Orkney Islands,0
    2020-03-30,Aberdeen City,2

    `;

const parsedWeeklyCsvData = [
  ["w/c 2020-03-16", "Orkney Islands", "0"],
  ["w/c 2020-03-23", "Glasgow City", "7"],
  ["w/c 2020-03-23", "Aberdeen City", "0"],
  ["w/c 2020-03-30", "Orkney Islands", "0"],
  ["w/c 2020-03-30", "Glasgow City", "46"],
  ["w/c 2020-03-16", "Glasgow City", "1"],
  ["w/c 2020-03-16", "Aberdeen City", "1"],
  ["w/c 2020-03-23", "Orkney Islands", "0"],
  ["w/c 2020-03-30", "Aberdeen City", "2"],
  ["w/c 2020-04-06", "Orkney Islands", "2"],
  ["w/c 2020-04-06", "Glasgow City", "97"],
  ["w/c 2020-04-06", "Aberdeen City", "12"],
];

const parsedDailyCsvData = [
  ["2020-03-16", "Orkney Islands", "0"],
  ["2020-03-23", "Glasgow City", "7"],
  ["2020-03-23", "Aberdeen City", "0"],
  ["2020-03-30", "Orkney Islands", "0"],
  ["2020-03-30", "Glasgow City", "46"],
  ["2020-03-16", "Glasgow City", "1"],
  ["2020-03-16", "Aberdeen City", "1"],
  ["2020-03-23", "Orkney Islands", "0"],
  ["2020-03-30", "Aberdeen City", "2"],
];

const expectedWeeklyPlaceDateValueMap = {
  dates: [
    Date.parse("2020-03-16"),
    Date.parse("2020-03-23"),
    Date.parse("2020-03-30"),
    Date.parse("2020-04-06"),
  ],
  placeDateValueMap: new Map()
    .set(
      "Aberdeen City",
      new Map()
        .set(Date.parse("2020-03-16"), 1)
        .set(Date.parse("2020-03-23"), 0)
        .set(Date.parse("2020-03-30"), 2)
        .set(Date.parse("2020-04-06"), 12)
    )
    .set(
      "Glasgow City",
      new Map()
        .set(Date.parse("2020-03-16"), 1)
        .set(Date.parse("2020-03-23"), 7)
        .set(Date.parse("2020-03-30"), 46)
        .set(Date.parse("2020-04-06"), 97)
    )
    .set(
      "Orkney Islands",
      new Map()
        .set(Date.parse("2020-03-16"), 0)
        .set(Date.parse("2020-03-23"), 0)
        .set(Date.parse("2020-03-30"), 0)
        .set(Date.parse("2020-04-06"), 2)
    ),
};

const expectedDailyPlaceDateValueMap = {
  dates: [
    Date.parse("2020-03-16"),
    Date.parse("2020-03-23"),
    Date.parse("2020-03-30"),
  ],
  placeDateValueMap: new Map()
    .set(
      "Aberdeen City",
      new Map()
        .set(Date.parse("2020-03-16"), 1)
        .set(Date.parse("2020-03-23"), 0)
        .set(Date.parse("2020-03-30"), 2)
    )
    .set(
      "Glasgow City",
      new Map()
        .set(Date.parse("2020-03-16"), 1)
        .set(Date.parse("2020-03-23"), 7)
        .set(Date.parse("2020-03-30"), 46)
    )
    .set(
      "Orkney Islands",
      new Map()
        .set(Date.parse("2020-03-16"), 0)
        .set(Date.parse("2020-03-23"), 0)
        .set(Date.parse("2020-03-30"), 0)
    ),
};

it("readCsvData", () => {
  // Parse both types of input date
  expect(readCsvData(weeklyCsvData)).toEqual(parsedWeeklyCsvData);
  expect(readCsvData(dailyCsvData)).toEqual(parsedDailyCsvData);
});

it("createPlaceDateValueMap weekly", () => {
  const result = createPlaceDateValueMap(parsedWeeklyCsvData);
  expect(result).toEqual(expectedWeeklyPlaceDateValueMap);
  // Check place iterator order
  expect([...result.placeDateValueMap.keys()]).toEqual([
    "Aberdeen City",
    "Glasgow City",
    "Orkney Islands",
  ]);
});

it("createPlaceDateValueMap daily", () => {
  const result = createPlaceDateValueMap(parsedDailyCsvData);
  expect(result).toEqual(expectedDailyPlaceDateValueMap);
  // Check place iterator order
  expect([...result.placeDateValueMap.keys()]).toEqual([
    "Aberdeen City",
    "Glasgow City",
    "Orkney Islands",
  ]);
});

it("fetchAndStore when fetch fails", async () => {
  fetch.mockReject(new Error("fetch failed"));
  // Suppress console error message
  spyOn(console, "error");
  var processedResult = null;

  await act(async () => {
    await fetchAndStore(
      "test query",
      readCsvData,
      (val) => (processedResult = parsedWeeklyCsvData)
    );
  });

  expect(processedResult).toBeNull();
  expect(fetch.mock.calls.length).toEqual(1);
});

it("fetchAndStore when fetch succeeds", async () => {
  fetch.mockResponse(weeklyCsvData);
  var processedResult = null;

  await act(async () => {
    await fetchAndStore(
      "test query",
      readCsvData,
      (val) => (processedResult = parsedWeeklyCsvData)
    );
  });

  expect(processedResult).toEqual(parsedWeeklyCsvData);
  expect(fetch.mock.calls.length).toEqual(1);
});

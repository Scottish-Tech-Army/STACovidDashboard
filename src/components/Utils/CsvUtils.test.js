import {
  readCsvData,
  createPlaceDateValueMap,
  fetchAndStore,
} from "../Utils/CsvUtils";
import { act } from "react-dom/test-utils";

beforeEach(() => {
  fetch.resetMocks();
});

const csvData = `date,areaname,count
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
  w/c 2020-04-06,Aberdeen City,12`;

const parsedCsvData = [
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

const expectedPlaceDateValueMap = {
  dates: [
    "w/c 2020-03-16",
    "w/c 2020-03-23",
    "w/c 2020-03-30",
    "w/c 2020-04-06",
  ],
  placeDateValueMap: new Map()
    .set(
      "Aberdeen City",
      new Map()
        .set("w/c 2020-03-16", 1)
        .set("w/c 2020-03-23", 0)
        .set("w/c 2020-03-30", 2)
        .set("w/c 2020-04-06", 12)
    )
    .set(
      "Glasgow City",
      new Map()
        .set("w/c 2020-03-16", 1)
        .set("w/c 2020-03-23", 7)
        .set("w/c 2020-03-30", 46)
        .set("w/c 2020-04-06", 97)
    )
    .set(
      "Orkney Islands",
      new Map()
        .set("w/c 2020-03-16", 0)
        .set("w/c 2020-03-23", 0)
        .set("w/c 2020-03-30", 0)
        .set("w/c 2020-04-06", 2)
    ),
};

it("readCsvData", () => {
  expect(readCsvData(csvData)).toEqual(parsedCsvData);
});

it("createPlaceDateValueMap", () => {
  const result = createPlaceDateValueMap(parsedCsvData);
  expect(result).toEqual(expectedPlaceDateValueMap);
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
    await fetchAndStore("test query", readCsvData, (val) =>
      processedResult = parsedCsvData
    );
  });

  expect(processedResult).toBeNull();
  expect(fetch.mock.calls.length).toEqual(1);
});

it("fetchAndStore when fetch succeeds", async () => {
  fetch.mockResponse(csvData);
  var processedResult = null;

  await act(async () => {
    await fetchAndStore("test query", readCsvData, (val) =>
      processedResult = parsedCsvData
    );
  });

  expect(processedResult).toEqual(parsedCsvData);
  expect(fetch.mock.calls.length).toEqual(1);
});

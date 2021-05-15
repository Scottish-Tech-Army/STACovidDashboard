import fetch from "node-fetch";
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const OBJECT_FOLDER = "data/";

const NHS_SCOT_URL_PREFIX = "https://www.opendata.nhs.scot/dataset/";
const NHS_SCOT_DAILY_URL_PREFIX =
  NHS_SCOT_URL_PREFIX + "b318bddf-a4dc-4262-971f-0ba329e09b87/resource/";

const MAIN_DATASETS = [
  {
    url:
      NHS_SCOT_DAILY_URL_PREFIX +
      "427f9a25-db22-4014-a3bc-893b68243055/download",
    objectKey: OBJECT_FOLDER + "dailyCouncilAreas.csv",
  },
  {
    url:
      NHS_SCOT_DAILY_URL_PREFIX +
      "2dd8534b-0a6f-4744-9253-9565d62f96c2/download",
    objectKey: OBJECT_FOLDER + "dailyHealthBoards.csv",
  },
  {
    url:
      NHS_SCOT_DAILY_URL_PREFIX +
      "e8454cf0-1152-4bcb-b9da-4343f625dfef/download",
    objectKey: OBJECT_FOLDER + "currentTotalsCouncilAreas.csv",
  },
  {
    url:
      NHS_SCOT_DAILY_URL_PREFIX +
      "7fad90e5-6f19-455b-bc07-694a22f8d5dc/download",
    objectKey: OBJECT_FOLDER + "currentTotalsHealthBoards.csv",
  },
];

const BUCKET_NAME = "dashboard.aws.scottishtecharmy.org";

const JSON_KEY_NAME = OBJECT_FOLDER + "phsData.json";

export function downloadAndStoreMainCsvData() {
  return Promise.allSettled(
    MAIN_DATASETS.map(({ url, objectKey }) =>
      downloadAndStoreCsvData(url, objectKey)
    )
  ).then((results) => results.map((result) => result.value));
}

export function downloadAndStoreCsvData(url, objectKeyName) {
  let storedModificationDate;
  let retrievedModificationDate;
  let retrievedText;

  console.log("downloadAndStoreCsvData", url, objectKeyName);
  return getObjectSourceLastModified(objectKeyName)
    .then((storedObjectLastModified) => {
      storedModificationDate = storedObjectLastModified;
      console.log("last modified", storedObjectLastModified);
      const requestHeaders = {};
      if (storedObjectLastModified) {
        requestHeaders["If-Modified-Since"] = storedObjectLastModified;
      }
      return fetch(url, { headers: requestHeaders });
    })
    .then((response) => {
      if (response.status == 200) {
        retrievedModificationDate = response.headers.get("Last-Modified");
        if (retrievedModificationDate == storedModificationDate) {
          // Should have returned a 304
          console.log(objectKeyName, "not updated - skipping");
          return null;
        }
        console.log(objectKeyName, "Last-Modified=", retrievedModificationDate);
        return response
          .text()
          .then((csvData) => {
            retrievedText = csvData;
            console.log("Last-Modified=", retrievedModificationDate);
            return storeObject(
              csvData,
              objectKeyName,
              retrievedModificationDate
            );
          })
          .then(() => retrievedText);
      } else if (response.status == 304) {
        console.log(objectKeyName, "not updated - skipping");
        return null;
      } else {
        console.error(
          objectKeyName,
          "Failed to retrieve, response: " + response.status
        );
        return null;
      }
    });
}

export function storeObject(text, objectKeyName, objectKeyModificationDate) {
  console.log(
    "storeObject",
    text.length,
    objectKeyName,
    objectKeyModificationDate
  );
  const textBuffer = Buffer.from(text);
  console.log("storeObject buffer length", textBuffer.length);

  const metadata = {};
  if (objectKeyModificationDate) {
    metadata.sourcelastmodified = objectKeyModificationDate;
  } else {
    console.warn(
      "Object sourcelastmodified not available to store with " + objectKeyName
    );
  }
  return s3
    .putObject({
      ACL: "public-read",
      Bucket: BUCKET_NAME,
      Key: objectKeyName,
      Body: textBuffer,
      ContentType: "text/plain",
      ContentLength: textBuffer.length,
      Metadata: metadata,
    })
    .promise()
    .then((result) => {
      console.log("Object stored in S3 at " + objectKeyName + "\n", result);
      return Promise.resolve();
    })
    .catch((error) => {
      console.error(
        "Object failed store in S3 at " + objectKeyName + "\n",
        error
      );
      return Promise.reject(error);
    });
}

export function getObjectSourceLastModified(objectKeyName) {
  console.log("getObjectSourceLastModified", objectKeyName);
  return s3
    .headObject({ Bucket: BUCKET_NAME, Key: objectKeyName })
    .promise()
    .then((data) => {
      if (data.Metadata && data.Metadata.sourcelastmodified) {
        return data.Metadata.sourcelastmodified;
      }
      console.warn(
        "Object sourcelastmodified not found in S3 at " + objectKeyName + "\n"
      );
      return null;
    })
    .catch(() => {
      console.warn("Object not found in S3 at " + objectKeyName + "\n");
      return null;
    });
}

export function jsonDataExists() {
  console.log("jsonDataExists", JSON_KEY_NAME);
  return s3
    .headObject({ Bucket: BUCKET_NAME, Key: JSON_KEY_NAME })
    .promise()
    .then(() => true)
    .catch(() => {
      console.warn("Object not found in S3 at " + JSON_KEY_NAME + "\n");
      return false;
    });
}

export function storeJsonProcessedData(jsonData) {
  const textBuffer = Buffer.from(JSON.stringify(jsonData));
  console.log("storeJsonProcessedData buffer length", textBuffer.length);
  return s3
    .putObject({
      ACL: "public-read",
      Bucket: BUCKET_NAME,
      Key: JSON_KEY_NAME,
      Body: textBuffer,
      ContentType: "application/json",
      ContentLength: textBuffer.length,
    })
    .promise()
    .then((result) => {
      console.log("Object stored in S3 at " + JSON_KEY_NAME + "\n", result);
      return Promise.resolve();
    })
    .catch((error) => {
      console.error(
        "Object failed store in S3 at " + JSON_KEY_NAME + "\n",
        error
      );
      return Promise.reject(error);
    });
}

export function getRemainingCsvData(downloadedCsvFileData) {
  return Promise.allSettled(
    MAIN_DATASETS.map(({ objectKey }, index) => {
      if (downloadedCsvFileData[index]) {
        return Promise.resolve(downloadedCsvFileData[index]);
      }
      return getStoredCsvData(objectKey);
    })
  ).then((results) => results.map((result) => result.value));
}

export function getStoredCsvData(objectKey) {
  console.log("getStoredCsvData", objectKey);
  return s3
    .getObject({ Bucket: BUCKET_NAME, Key: objectKey })
    .promise()
    .then((response) => response.Body.toString())
    .catch((error) => {
      console.error("Object not found in S3 at " + JSON_KEY_NAME + "\n" + error);
      return Promise.resolve(null);
    });
}

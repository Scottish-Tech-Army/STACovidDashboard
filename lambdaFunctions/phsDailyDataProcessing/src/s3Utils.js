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

const ADDITIONAL_DATASETS = [
  {
    url:
      NHS_SCOT_DAILY_URL_PREFIX +
      "3349540e-dc63-4d6d-a78b-00387b9aca50/download",
    objectKey: OBJECT_FOLDER + "testsCouncilAreas.csv",
  },
  {
    url:
      NHS_SCOT_DAILY_URL_PREFIX +
      "8da654cd-293b-4286-96a4-b3ece86225f0/download",
    objectKey: OBJECT_FOLDER + "testsHealthBoards.csv",
  },
  {
    url:
      NHS_SCOT_DAILY_URL_PREFIX +
      "287fc645-4352-4477-9c8c-55bc054b7e76/download",
    objectKey: OBJECT_FOLDER + "dailyAndCumulativeTests.csv",
  },
  {
    url:
      NHS_SCOT_DAILY_URL_PREFIX +
      "8906de12-f413-4b3f-95a0-11ed15e61773/download",
    objectKey: OBJECT_FOLDER + "weeklyTrendsByNeighbourhood.csv",
  },
  {
    url:
      NHS_SCOT_DAILY_URL_PREFIX +
      "9393bd66-5012-4f01-9bc5-e7a10accacf4/download",
    objectKey: OBJECT_FOLDER + "dailyCaseTrendsByAgeAndSex.csv",
  },
  {
    url:
      NHS_SCOT_DAILY_URL_PREFIX +
      "a38a4c21-7c75-4ecd-a511-3f83e0e8f0c3/download",
    objectKey: OBJECT_FOLDER + "dailyCaseTrendsByDeprivation.csv",
  },
  {
    url:
      NHS_SCOT_URL_PREFIX +
      "d67b13ef-73a4-482d-b5df-d39d777540fd/resource/5acbccb1-e9d6-4ab2-a7ac-f3e4d378e7ec/download",
    objectKey: OBJECT_FOLDER + "hospitalOnset.csv",
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

export function downloadAndStoreAdditionalCsvData() {
  return Promise.allSettled(
    ADDITIONAL_DATASETS.map(({ url, objectKey }) =>
      downloadAndStoreCsvData(url, objectKey)
    )
  );
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
      ContentType: "text/json",
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

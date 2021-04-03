import {
  getObjectSourceLastModified,
  storeObject,
  downloadAndStoreCsvData,
  downloadAndStoreMainCsvData,
  downloadAndStoreAdditionalCsvData,
  jsonDataExists,
  storeJsonProcessedData,
  getRemainingCsvData,
} from "./s3Utils";
import fetch from "node-fetch";

const AWS = require("aws-sdk");

jest.mock("node-fetch");

jest.mock("aws-sdk", () => {
  // Nasty but avoids hoisting problem
  const mockHeadObjectPromise = jest.fn();
  const mockHeadObject = jest.fn(() => ({
    promise: mockHeadObjectPromise,
  }));
  const mockPutObjectPromise = jest.fn();
  const mockPutObject = jest.fn(() => ({
    promise: mockPutObjectPromise,
  }));
  const mockGetObjectPromise = jest.fn();
  const mockGetObject = jest.fn(() => ({
    promise: mockGetObjectPromise,
  }));
  return {
    mockHeadObjectPromise,
    mockHeadObject,
    mockPutObjectPromise,
    mockPutObject,
    mockGetObjectPromise,
    mockGetObject,
    S3: jest.fn(() => ({
      headObject: mockHeadObject,
      putObject: mockPutObject,
      getObject: mockGetObject,
    })),
  };
});

// const BUCKET_NAME = "dashboard.aws.scottishtecharmy.org";
const BUCKET_NAME = "dashcoviddata";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getObjectSourceLastModified", () => {
  it("when headObject fails", async () => {
    AWS.mockHeadObjectPromise.mockReturnValue(
      Promise.reject(new Error("headObject failed"))
    );

    const result = await getObjectSourceLastModified("MyObject");

    expect(result).toBeNull();
    checkHeadObjectCalled("MyObject");
  });

  it("when headObject succeeds", async () => {
    AWS.mockHeadObjectPromise.mockReturnValue(
      Promise.resolve({
        Metadata: { sourcelastmodified: "Yesterday" },
      })
    );

    const result = await getObjectSourceLastModified("MyObject");

    expect(result).toStrictEqual("Yesterday");
    checkHeadObjectCalled("MyObject");
  });

  it("when headObject doesn't hold a sourcelastmodified key", async () => {
    AWS.mockHeadObjectPromise.mockReturnValue(
      Promise.resolve({ Metadata: {} })
    );

    const result = await getObjectSourceLastModified("MyObject");

    expect(result).toBeNull();
    checkHeadObjectCalled("MyObject");
  });
});

describe("storeObject", () => {
  it("when putObject fails", async () => {
    AWS.mockPutObjectPromise.mockRejectedValue(new Error("Store failed"));

    return expect(
      storeObject("test data", "MyObject", "Yesterday at teatime")
    ).rejects.toThrow("Store failed");
  });

  it("when putObject succeeds", async () => {
    AWS.mockPutObjectPromise.mockReturnValue(
      Promise.resolve({ ETag: "stuff" })
    );

    await storeObject("test data", "MyObject", "Yesterday at teatime");

    checkPutObjectCalled("MyObject", "test data", 9, "Yesterday at teatime");
  });

  it("when putObject succeeds without last modified date", async () => {
    AWS.mockPutObjectPromise.mockReturnValue(
      Promise.resolve({ ETag: "stuff" })
    );

    await storeObject("test data", "MyObject");

    checkPutObjectCalled("MyObject", "test data", 9);
  });
});

describe("downloadAndStoreCsvData", () => {
  const mockGetHeader = jest.fn();

  beforeEach(() => {
    // default happy path responses
    mockGetHeader.mockImplementation((key) =>
      key == "Last-Modified" ? "Today" : "UNEXPECTED KEY CALLED"
    );
    fetch.mockReturnValue(
      Promise.resolve({
        text: () => Promise.resolve("new data"),
        status: 200,
        headers: { get: mockGetHeader },
      })
    );
    AWS.mockHeadObjectPromise.mockReturnValue(
      Promise.resolve({
        Metadata: { sourcelastmodified: "Yesterday" },
      })
    );
    AWS.mockPutObjectPromise.mockReturnValue(
      Promise.resolve({ ETag: "stuff" })
    );
  });

  it("when stored object doesn't exist", async () => {
    AWS.mockHeadObjectPromise.mockReturnValue(
      Promise.reject(new Error("object not found"))
    );

    const result = await downloadAndStoreCsvData("test url", "MyObject");

    expect(result).toStrictEqual("new data");

    checkHeadObjectCalled("MyObject");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("test url", { headers: {} });
    expect(mockGetHeader).toHaveBeenCalledTimes(1);
    checkPutObjectCalled("MyObject", "new data", 8, "Today");
  });

  it("when remote object is newer", async () => {
    const result = await downloadAndStoreCsvData("test url", "MyObject");

    checkHeadObjectCalled("MyObject");
    expect(result).toStrictEqual("new data");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("test url", {
      headers: { "If-Modified-Since": "Yesterday" },
    });
    expect(mockGetHeader).toHaveBeenCalledTimes(1);
    checkPutObjectCalled("MyObject", "new data", 8, "Today");
  });

  it("when remote object is not newer", async () => {
    fetch.mockReturnValue(Promise.resolve({ status: 304 }));

    const result = await downloadAndStoreCsvData("test url", "MyObject");

    expect(result).toBeNull();

    checkHeadObjectCalled("MyObject");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("test url", {
      headers: { "If-Modified-Since": "Yesterday" },
    });
    expect(AWS.mockPutObject).not.toHaveBeenCalled();
  });

  it("when remote object does not return last modified date", async () => {
    mockGetHeader.mockImplementation(() => null);

    const result = await downloadAndStoreCsvData("test url", "MyObject");

    expect(result).toStrictEqual("new data");

    checkHeadObjectCalled("MyObject");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("test url", {
      headers: { "If-Modified-Since": "Yesterday" },
    });
    expect(mockGetHeader).toHaveBeenCalledTimes(1);
    checkPutObjectCalled("MyObject", "new data", 8);
  });

  it("when remote object ignores the last modified date", async () => {
    mockGetHeader.mockImplementation(() => "Yesterday");

    const result = await downloadAndStoreCsvData("test url", "MyObject");

    expect(result).toBeNull();
    checkHeadObjectCalled("MyObject");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("test url", {
      headers: { "If-Modified-Since": "Yesterday" },
    });
    expect(mockGetHeader).toHaveBeenCalledTimes(1);
    expect(AWS.mockPutObject).not.toHaveBeenCalled();
  });

  it("when fetch fails", async () => {
    fetch.mockReturnValue(Promise.resolve({ status: 400 }));

    const result = await downloadAndStoreCsvData("test url", "MyObject");

    expect(result).toBeNull();
    checkHeadObjectCalled("MyObject");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("test url", {
      headers: { "If-Modified-Since": "Yesterday" },
    });
    expect(AWS.mockPutObject).not.toHaveBeenCalled();
  });
});

describe("downloadAndStoreMainCsvData", () => {
  const mockGetHeader = jest.fn();

  beforeEach(() => {
    // default happy path responses
    mockGetHeader.mockImplementation((key) =>
      key == "Last-Modified" ? "Today" : "UNEXPECTED KEY CALLED"
    );
    fetch
      .mockReturnValueOnce(
        Promise.resolve({
          text: () => Promise.resolve("new data1"),
          status: 200,
          headers: { get: mockGetHeader },
        })
      )
      .mockReturnValueOnce(
        Promise.resolve({
          text: () => Promise.resolve("new data2"),
          status: 200,
          headers: { get: mockGetHeader },
        })
      )
      .mockReturnValueOnce(
        Promise.resolve({
          text: () => Promise.resolve("new data3"),
          status: 200,
          headers: { get: mockGetHeader },
        })
      )
      .mockReturnValueOnce(
        Promise.resolve({
          text: () => Promise.resolve("new data4"),
          status: 200,
          headers: { get: mockGetHeader },
        })
      );
    AWS.mockHeadObjectPromise.mockReturnValue(
      Promise.resolve({
        Metadata: { sourcelastmodified: "Yesterday" },
      })
    );
    AWS.mockPutObjectPromise.mockReturnValue(
      Promise.resolve({ ETag: "stuff" })
    );
  });

  it("when all files succeed", async () => {
    const result = await downloadAndStoreMainCsvData();

    expect(result).toStrictEqual([
      "new data1",
      "new data2",
      "new data3",
      "new data4",
    ]);

    expect(fetch).toHaveBeenCalledTimes(4);
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      "https://www.opendata.nhs.scot/dataset/b318bddf-a4dc-4262-971f-0ba329e09b87/resource/427f9a25-db22-4014-a3bc-893b68243055/download",
      { headers: { "If-Modified-Since": "Yesterday" } }
    );
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      "https://www.opendata.nhs.scot/dataset/b318bddf-a4dc-4262-971f-0ba329e09b87/resource/2dd8534b-0a6f-4744-9253-9565d62f96c2/download",
      { headers: { "If-Modified-Since": "Yesterday" } }
    );
    expect(fetch).toHaveBeenNthCalledWith(
      3,
      "https://www.opendata.nhs.scot/dataset/b318bddf-a4dc-4262-971f-0ba329e09b87/resource/e8454cf0-1152-4bcb-b9da-4343f625dfef/download",
      { headers: { "If-Modified-Since": "Yesterday" } }
    );
    expect(fetch).toHaveBeenNthCalledWith(
      4,
      "https://www.opendata.nhs.scot/dataset/b318bddf-a4dc-4262-971f-0ba329e09b87/resource/7fad90e5-6f19-455b-bc07-694a22f8d5dc/download",
      { headers: { "If-Modified-Since": "Yesterday" } }
    );

    expect(AWS.mockPutObject).toHaveBeenCalledTimes(4);
    expect(AWS.mockPutObject).toHaveBeenNthCalledWith(1, {
      ACL: "public-read",
      Body: Buffer.from("new data1"),
      Bucket: BUCKET_NAME,
      ContentLength: 9,
      ContentType: "text/plain",
      Key: "data/dailyCouncilAreas.csv",
      Metadata: { sourcelastmodified: "Today" },
    });
    expect(AWS.mockPutObject).toHaveBeenNthCalledWith(2, {
      ACL: "public-read",
      Body: Buffer.from("new data2"),
      Bucket: BUCKET_NAME,
      ContentLength: 9,
      ContentType: "text/plain",
      Key: "data/dailyHealthBoards.csv",
      Metadata: { sourcelastmodified: "Today" },
    });
    expect(AWS.mockPutObject).toHaveBeenNthCalledWith(3, {
      ACL: "public-read",
      Body: Buffer.from("new data3"),
      Bucket: BUCKET_NAME,
      ContentLength: 9,
      ContentType: "text/plain",
      Key: "data/currentTotalsCouncilAreas.csv",
      Metadata: { sourcelastmodified: "Today" },
    });
    expect(AWS.mockPutObject).toHaveBeenNthCalledWith(4, {
      ACL: "public-read",
      Body: Buffer.from("new data4"),
      Bucket: BUCKET_NAME,
      ContentLength: 9,
      ContentType: "text/plain",
      Key: "data/currentTotalsHealthBoards.csv",
      Metadata: { sourcelastmodified: "Today" },
    });
  });

  it("when mixed fetch responses", async () => {
    fetch.mockReset();
    fetch
      .mockReturnValueOnce(
        Promise.resolve({
          text: () => Promise.resolve("new data1"),
          status: 200,
          headers: { get: () => "Yesterday" },
        })
      )
      .mockReturnValueOnce(
        Promise.resolve({
          text: () => Promise.resolve("new data2"),
          status: 200,
          headers: { get: () => null },
        })
      )
      .mockReturnValueOnce(
        Promise.resolve({
          status: 400,
        })
      )
      .mockReturnValueOnce(
        Promise.resolve({
          status: 304,
        })
      );

    const result = await downloadAndStoreMainCsvData();

    expect(result).toStrictEqual([null, "new data2", null, null]);

    checkPutObjectCalled("data/dailyHealthBoards.csv", "new data2", 9);
  });
});

describe("downloadAndStoreAdditionalCsvData", () => {
  const mockGetHeader = jest.fn();

  beforeEach(() => {
    // default happy path responses
    mockGetHeader.mockImplementation((key) =>
      key == "Last-Modified" ? "Today" : "UNEXPECTED KEY CALLED"
    );
    fetch
      .mockReturnValueOnce(
        Promise.resolve({
          text: () => Promise.resolve("new data1"),
          status: 200,
          headers: { get: mockGetHeader },
        })
      )
      .mockReturnValueOnce(
        Promise.resolve({
          text: () => Promise.resolve("new data2"),
          status: 200,
          headers: { get: mockGetHeader },
        })
      )
      .mockReturnValueOnce(
        Promise.resolve({
          text: () => Promise.resolve("new data3"),
          status: 200,
          headers: { get: mockGetHeader },
        })
      )
      .mockReturnValueOnce(
        Promise.resolve({
          text: () => Promise.resolve("new data4"),
          status: 200,
          headers: { get: mockGetHeader },
        })
      )
      .mockReturnValueOnce(
        Promise.resolve({
          text: () => Promise.resolve("new data5"),
          status: 200,
          headers: { get: mockGetHeader },
        })
      )
      .mockReturnValueOnce(
        Promise.resolve({
          text: () => Promise.resolve("new data6"),
          status: 200,
          headers: { get: mockGetHeader },
        })
      )
      .mockReturnValueOnce(
        Promise.resolve({
          text: () => Promise.resolve("new data7"),
          status: 200,
          headers: { get: mockGetHeader },
        })
      );
    AWS.mockHeadObjectPromise.mockReturnValue(
      Promise.resolve({
        Metadata: { sourcelastmodified: "Yesterday" },
      })
    );
    AWS.mockPutObjectPromise.mockReturnValue(
      Promise.resolve({ ETag: "stuff" })
    );
  });

  it("when all files succeed", async () => {
    await downloadAndStoreAdditionalCsvData();

    expect(fetch).toHaveBeenCalledTimes(7);
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      "https://www.opendata.nhs.scot/dataset/b318bddf-a4dc-4262-971f-0ba329e09b87/resource/3349540e-dc63-4d6d-a78b-00387b9aca50/download",
      { headers: { "If-Modified-Since": "Yesterday" } }
    );
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      "https://www.opendata.nhs.scot/dataset/b318bddf-a4dc-4262-971f-0ba329e09b87/resource/8da654cd-293b-4286-96a4-b3ece86225f0/download",
      { headers: { "If-Modified-Since": "Yesterday" } }
    );
    expect(fetch).toHaveBeenNthCalledWith(
      3,
      "https://www.opendata.nhs.scot/dataset/b318bddf-a4dc-4262-971f-0ba329e09b87/resource/287fc645-4352-4477-9c8c-55bc054b7e76/download",
      { headers: { "If-Modified-Since": "Yesterday" } }
    );
    expect(fetch).toHaveBeenNthCalledWith(
      4,
      "https://www.opendata.nhs.scot/dataset/b318bddf-a4dc-4262-971f-0ba329e09b87/resource/8906de12-f413-4b3f-95a0-11ed15e61773/download",
      { headers: { "If-Modified-Since": "Yesterday" } }
    );
    expect(fetch).toHaveBeenNthCalledWith(
      5,
      "https://www.opendata.nhs.scot/dataset/b318bddf-a4dc-4262-971f-0ba329e09b87/resource/9393bd66-5012-4f01-9bc5-e7a10accacf4/download",
      { headers: { "If-Modified-Since": "Yesterday" } }
    );
    expect(fetch).toHaveBeenNthCalledWith(
      6,
      "https://www.opendata.nhs.scot/dataset/b318bddf-a4dc-4262-971f-0ba329e09b87/resource/a38a4c21-7c75-4ecd-a511-3f83e0e8f0c3/download",
      { headers: { "If-Modified-Since": "Yesterday" } }
    );
    expect(fetch).toHaveBeenNthCalledWith(
      7,
      "https://www.opendata.nhs.scot/dataset/d67b13ef-73a4-482d-b5df-d39d777540fd/resource/5acbccb1-e9d6-4ab2-a7ac-f3e4d378e7ec/download",
      { headers: { "If-Modified-Since": "Yesterday" } }
    );

    expect(AWS.mockPutObject).toHaveBeenCalledTimes(7);
    expect(AWS.mockPutObject).toHaveBeenNthCalledWith(1, {
      ACL: "public-read",
      Body: Buffer.from("new data1"),
      Bucket: BUCKET_NAME,
      ContentLength: 9,
      ContentType: "text/plain",
      Key: "data/testsCouncilAreas.csv",
      Metadata: { sourcelastmodified: "Today" },
    });
    expect(AWS.mockPutObject).toHaveBeenNthCalledWith(2, {
      ACL: "public-read",
      Body: Buffer.from("new data2"),
      Bucket: BUCKET_NAME,
      ContentLength: 9,
      ContentType: "text/plain",
      Key: "data/testsHealthBoards.csv",
      Metadata: { sourcelastmodified: "Today" },
    });
    expect(AWS.mockPutObject).toHaveBeenNthCalledWith(3, {
      ACL: "public-read",
      Body: Buffer.from("new data3"),
      Bucket: BUCKET_NAME,
      ContentLength: 9,
      ContentType: "text/plain",
      Key: "data/dailyAndCumulativeTests.csv",
      Metadata: { sourcelastmodified: "Today" },
    });
    expect(AWS.mockPutObject).toHaveBeenNthCalledWith(4, {
      ACL: "public-read",
      Body: Buffer.from("new data4"),
      Bucket: BUCKET_NAME,
      ContentLength: 9,
      ContentType: "text/plain",
      Key: "data/weeklyTrendsByNeighbourhood.csv",
      Metadata: { sourcelastmodified: "Today" },
    });
    expect(AWS.mockPutObject).toHaveBeenNthCalledWith(5, {
      ACL: "public-read",
      Body: Buffer.from("new data5"),
      Bucket: BUCKET_NAME,
      ContentLength: 9,
      ContentType: "text/plain",
      Key: "data/dailyCaseTrendsByAgeAndSex.csv",
      Metadata: { sourcelastmodified: "Today" },
    });
    expect(AWS.mockPutObject).toHaveBeenNthCalledWith(6, {
      ACL: "public-read",
      Body: Buffer.from("new data6"),
      Bucket: BUCKET_NAME,
      ContentLength: 9,
      ContentType: "text/plain",
      Key: "data/dailyCaseTrendsByDeprivation.csv",
      Metadata: { sourcelastmodified: "Today" },
    });
    expect(AWS.mockPutObject).toHaveBeenNthCalledWith(7, {
      ACL: "public-read",
      Body: Buffer.from("new data7"),
      Bucket: BUCKET_NAME,
      ContentLength: 9,
      ContentType: "text/plain",
      Key: "data/hospitalOnset.csv",
      Metadata: { sourcelastmodified: "Today" },
    });
  });

  it("when mixed fetch responses", async () => {
    fetch.mockReset();
    fetch
      .mockReturnValueOnce(
        Promise.resolve({
          text: () => Promise.resolve("new data1"),
          status: 200,
          headers: { get: () => "Yesterday" },
        })
      )
      .mockReturnValueOnce(
        Promise.resolve({
          text: () => Promise.resolve("new data2"),
          status: 200,
          headers: { get: () => null },
        })
      )
      .mockReturnValueOnce(
        Promise.resolve({
          status: 400,
        })
      )
      .mockReturnValueOnce(
        Promise.resolve({
          status: 304,
        })
      )
      .mockReturnValueOnce(
        Promise.resolve({
          text: () => Promise.resolve("new data5"),
          status: 200,
          headers: { get: () => null },
        })
      )
      .mockReturnValueOnce(
        Promise.resolve({
          status: 400,
        })
      )
      .mockReturnValueOnce(
        Promise.resolve({
          status: 304,
        })
      );

    await downloadAndStoreAdditionalCsvData();

    expect(AWS.mockPutObject).toHaveBeenCalledTimes(2);
    expect(AWS.mockPutObject).toHaveBeenNthCalledWith(1, {
      ACL: "public-read",
      Body: Buffer.from("new data2"),
      Bucket: BUCKET_NAME,
      ContentLength: 9,
      ContentType: "text/plain",
      Key: "data/testsHealthBoards.csv",
      Metadata: {},
    });
    expect(AWS.mockPutObject).toHaveBeenNthCalledWith(2, {
      ACL: "public-read",
      Body: Buffer.from("new data5"),
      Bucket: BUCKET_NAME,
      ContentLength: 9,
      ContentType: "text/plain",
      Key: "data/dailyCaseTrendsByAgeAndSex.csv",
      Metadata: {},
    });
  });
});

describe("jsonDataExists", () => {
  it("when headObject fails", async () => {
    AWS.mockHeadObjectPromise.mockReturnValue(
      Promise.reject(new Error("headObject failed"))
    );

    const result = await jsonDataExists();

    expect(result).toStrictEqual(false);
    checkHeadObjectCalled("data/phsData.json");
  });

  it("when headObject succeeds", async () => {
    AWS.mockHeadObjectPromise.mockReturnValue(
      Promise.resolve({ Metadata: {} })
    );

    const result = await jsonDataExists();

    expect(result).toStrictEqual(true);
    checkHeadObjectCalled("data/phsData.json");
  });
});

describe("storeJsonProcessedData", () => {
  it("when putObject fails", async () => {
    AWS.mockPutObjectPromise.mockRejectedValue(new Error("Store failed"));

    return expect(storeJsonProcessedData({ test: "data" })).rejects.toThrow(
      "Store failed"
    );
  });

  it("when putObject succeeds", async () => {
    AWS.mockPutObjectPromise.mockReturnValue(
      Promise.resolve({ ETag: "stuff" })
    );

    await storeJsonProcessedData({ test: "data" });

    expect(AWS.mockPutObject).toHaveBeenCalledTimes(1);
    expect(AWS.mockPutObject).toHaveBeenCalledWith({
      ACL: "public-read",
      Body: Buffer.from('{"test":"data"}'),
      Bucket: BUCKET_NAME,
      ContentLength: 15,
      ContentType: "text/json",
      Key: "data/phsData.json",
    });
  });
});

describe("getRemainingCsvData", () => {
  it("when headObject fails", async () => {
    AWS.mockHeadObjectPromise.mockReturnValue(
      Promise.reject(new Error("headObject failed"))
    );

    const result = await jsonDataExists();

    expect(result).toStrictEqual(false);
    checkHeadObjectCalled("data/phsData.json");
  });

  it("retrieving some files", async () => {
    AWS.mockGetObjectPromise
      .mockReturnValueOnce(Promise.resolve({ Body: Buffer.from("stored1") }))
      .mockReturnValueOnce(Promise.resolve({ Body: Buffer.from("stored2") }));

    const result = await getRemainingCsvData([
      "fetched1",
      null,
      null,
      "fetched4",
    ]);

    expect(result).toStrictEqual([
      "fetched1",
      "stored1",
      "stored2",
      "fetched4",
    ]);
    expect(AWS.mockGetObject).toHaveBeenCalledTimes(2);
    expect(AWS.mockGetObject).toHaveBeenNthCalledWith(1, {
      Bucket: BUCKET_NAME,
      Key: "data/dailyHealthBoards.csv",
    });
    expect(AWS.mockGetObject).toHaveBeenNthCalledWith(2, {
      Bucket: BUCKET_NAME,
      Key: "data/currentTotalsCouncilAreas.csv",
    });
  });

  it("a retrieval failed", async () => {
    AWS.mockGetObjectPromise
      .mockReturnValueOnce(Promise.resolve({ Body: Buffer.from("stored1") }))
      .mockReturnValueOnce(Promise.reject(new Error("stored2 failed")));

    const result = await getRemainingCsvData([
      "fetched1",
      null,
      null,
      "fetched4",
    ]);

    expect(result).toStrictEqual(["fetched1", "stored1", null, "fetched4"]);
    expect(AWS.mockGetObject).toHaveBeenCalledTimes(2);
    expect(AWS.mockGetObject).toHaveBeenNthCalledWith(1, {
      Bucket: BUCKET_NAME,
      Key: "data/dailyHealthBoards.csv",
    });
    expect(AWS.mockGetObject).toHaveBeenNthCalledWith(2, {
      Bucket: BUCKET_NAME,
      Key: "data/currentTotalsCouncilAreas.csv",
    });
  });
});

function checkHeadObjectCalled(objectKey) {
  expect(AWS.mockHeadObject).toHaveBeenCalledTimes(1);
  expect(AWS.mockHeadObject).toHaveBeenCalledWith({
    Bucket: BUCKET_NAME,
    Key: objectKey,
  });
}

function checkPutObjectCalled(
  objectKey,
  objectData,
  objectDataLength,
  modificationDate = null
) {
  expect(AWS.mockPutObject).toHaveBeenCalledTimes(1);
  expect(AWS.mockPutObject).toHaveBeenCalledWith({
    ACL: "public-read",
    Body: Buffer.from(objectData),
    Bucket: BUCKET_NAME,
    ContentLength: objectDataLength,
    ContentType: "text/plain",
    Key: objectKey,
    Metadata: modificationDate ? { sourcelastmodified: modificationDate } : {},
  });
}

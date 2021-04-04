import {
  downloadAndStoreMainCsvData,
  downloadAndStoreAdditionalCsvData,
  jsonDataExists,
  getRemainingCsvData,
  storeJsonProcessedData,
} from "./s3Utils.js";
import { createJsonData } from "./dataProcessingUtils.js";
import { handler } from "./index.js";

const AWS = require("aws-sdk");

jest.mock("./s3Utils.js");
jest.mock("./dataProcessingUtils.js");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("handler", () => {
  it("no main files updated and json file exists", async () => {
    downloadAndStoreMainCsvData.mockReturnValue([null, null, null, null]);
    jsonDataExists.mockReturnValue(true);

    expect(await handler()).toStrictEqual({
      statusCode: 200,
      body: "No updates available",
    });

    expect(downloadAndStoreMainCsvData).toHaveBeenCalledTimes(1);
    expect(downloadAndStoreAdditionalCsvData).toHaveBeenCalledTimes(1);
    expect(jsonDataExists).toHaveBeenCalledTimes(1);
    expect(getRemainingCsvData).not.toHaveBeenCalled();
    expect(createJsonData).not.toHaveBeenCalled();
    expect(storeJsonProcessedData).not.toHaveBeenCalled();
  });

  it("no main files updated and json file doesn't exist", async () => {
    downloadAndStoreMainCsvData.mockReturnValue([null, null, null, null]);
    getRemainingCsvData.mockReturnValue([
      "stored1",
      "stored2",
      "stored3",
      "stored4",
    ]);
    jsonDataExists.mockReturnValue(false);
    createJsonData.mockReturnValue("new json data");

    expect(await handler()).toStrictEqual({
      statusCode: 200,
      body: "JSON data updated",
    });

    expect(downloadAndStoreMainCsvData).toHaveBeenCalledTimes(1);
    expect(downloadAndStoreAdditionalCsvData).toHaveBeenCalledTimes(1);
    expect(jsonDataExists).toHaveBeenCalledTimes(1);
    expect(getRemainingCsvData).toHaveBeenCalledTimes(1);
    expect(getRemainingCsvData).toHaveBeenCalledWith([null, null, null, null]);
    expect(createJsonData).toHaveBeenCalledTimes(1);
    expect(createJsonData).toHaveBeenCalledWith(
      "stored1",
      "stored2",
      "stored3",
      "stored4"
    );
    expect(storeJsonProcessedData).toHaveBeenCalledTimes(1);
    expect(storeJsonProcessedData).toHaveBeenCalledWith("new json data");
  });

  it("some main files updated and json file exists", async () => {
    downloadAndStoreMainCsvData.mockReturnValue([
      null,
      "fetched2",
      "fetched3",
      null,
    ]);
    getRemainingCsvData.mockReturnValue([
      "stored1",
      "fetched2",
      "fetched3",
      "stored4",
    ]);
    jsonDataExists.mockReturnValue(true);
    createJsonData.mockReturnValue("new json data");

    expect(await handler()).toStrictEqual({
      statusCode: 200,
      body: "JSON data updated",
    });

    expect(downloadAndStoreMainCsvData).toHaveBeenCalledTimes(1);
    expect(downloadAndStoreAdditionalCsvData).toHaveBeenCalledTimes(1);
    expect(jsonDataExists).toHaveBeenCalledTimes(1);
    expect(getRemainingCsvData).toHaveBeenCalledTimes(1);
    expect(getRemainingCsvData).toHaveBeenCalledWith([
      null,
      "fetched2",
      "fetched3",
      null,
    ]);
    expect(createJsonData).toHaveBeenCalledTimes(1);
    expect(createJsonData).toHaveBeenCalledWith(
      "stored1",
      "fetched2",
      "fetched3",
      "stored4"
    );
    expect(storeJsonProcessedData).toHaveBeenCalledTimes(1);
    expect(storeJsonProcessedData).toHaveBeenCalledWith("new json data");
  });

  it("some main files updated and json file doesn't exist", async () => {
    downloadAndStoreMainCsvData.mockReturnValue([
      null,
      "fetched2",
      "fetched3",
      null,
    ]);
    getRemainingCsvData.mockReturnValue([
      "stored1",
      "fetched2",
      "fetched3",
      "stored4",
    ]);
    jsonDataExists.mockReturnValue(false);
    createJsonData.mockReturnValue("new json data");

    expect(await handler()).toStrictEqual({
      statusCode: 200,
      body: "JSON data updated",
    });

    expect(downloadAndStoreMainCsvData).toHaveBeenCalledTimes(1);
    expect(downloadAndStoreAdditionalCsvData).toHaveBeenCalledTimes(1);
    expect(jsonDataExists).toHaveBeenCalledTimes(1);
    expect(getRemainingCsvData).toHaveBeenCalledTimes(1);
    expect(getRemainingCsvData).toHaveBeenCalledWith([
      null,
      "fetched2",
      "fetched3",
      null,
    ]);
    expect(createJsonData).toHaveBeenCalledTimes(1);
    expect(createJsonData).toHaveBeenCalledWith(
      "stored1",
      "fetched2",
      "fetched3",
      "stored4"
    );
    expect(storeJsonProcessedData).toHaveBeenCalledTimes(1);
    expect(storeJsonProcessedData).toHaveBeenCalledWith("new json data");
  });

  it("some main stored files missing", async () => {
    downloadAndStoreMainCsvData.mockReturnValue([
      null,
      "fetched2",
      "fetched3",
      null,
    ]);
    getRemainingCsvData.mockReturnValue([
      null,
      "fetched2",
      "fetched3",
      "stored4",
    ]);
    jsonDataExists.mockReturnValue(false);
    createJsonData.mockReturnValue(null);

    expect(await handler()).toStrictEqual({
      statusCode: 200,
      body: "No updates available",
    });

    expect(downloadAndStoreMainCsvData).toHaveBeenCalledTimes(1);
    expect(downloadAndStoreAdditionalCsvData).toHaveBeenCalledTimes(1);
    expect(jsonDataExists).toHaveBeenCalledTimes(1);
    expect(getRemainingCsvData).toHaveBeenCalledTimes(1);
    expect(getRemainingCsvData).toHaveBeenCalledWith([
      null,
      "fetched2",
      "fetched3",
      null,
    ]);
    expect(createJsonData).toHaveBeenCalledTimes(1);
    expect(createJsonData).toHaveBeenCalledWith(
      null,
      "fetched2",
      "fetched3",
      "stored4"
    );
    expect(storeJsonProcessedData).not.toHaveBeenCalled();
  });
});

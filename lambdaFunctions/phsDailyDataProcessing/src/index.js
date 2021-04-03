import {
  downloadAndStoreMainCsvData,
  downloadAndStoreAdditionalCsvData,
  jsonDataExists,
  getRemainingCsvData,
  storeJsonProcessedData,
} from "./s3Utils.js";
import { createJsonData } from "./dataProcessingUtils.js";

exports.handler = async (event) => {
  const downloadedCsvFileData = await downloadAndStoreMainCsvData();

  let result = "No updates available";
  const jsonDataNotFound = !(await jsonDataExists());
  if (downloadedCsvFileData.filter(Boolean).length > 0 || jsonDataNotFound) {
    const currentCsvData = await getRemainingCsvData(downloadedCsvFileData);
    const jsonProcessedData = createJsonData(...currentCsvData);
    if (jsonProcessedData) {
      await storeJsonProcessedData(jsonProcessedData);
      result = "JSON data updated";
    }
  }

  await downloadAndStoreAdditionalCsvData();

  const response = {
    statusCode: 200,
    body: result,
  };
  return response;
};

import { getRegionCodeFromUrl, getCanonicalUrl } from "./Regional";
import { FEATURE_CODE_SCOTLAND } from "../components/Utils/CsvUtils";

test("getRegionCodeFromUrl", () => {
  expect(getRegionCodeFromUrl()).toStrictEqual(FEATURE_CODE_SCOTLAND);

  expect(getRegionCodeFromUrl("unknown")).toStrictEqual(FEATURE_CODE_SCOTLAND);

  expect(getRegionCodeFromUrl("")).toStrictEqual(FEATURE_CODE_SCOTLAND);

  expect(getRegionCodeFromUrl("S08000016")).toBe("S08000016");

  expect(getRegionCodeFromUrl("S12000033")).toBe("S12000033");
});

test("getCanonicalUrl", () => {
  expect(getCanonicalUrl(FEATURE_CODE_SCOTLAND)).toBe("/regional");

  expect(getCanonicalUrl("S08000016")).toBe("/regional/S08000016");

  expect(getCanonicalUrl("S12000033")).toBe("/regional/S12000033");
});

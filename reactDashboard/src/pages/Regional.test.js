import { getRegionCodeFromUrl, getCanonicalUrl } from "./Regional";
import { FEATURE_CODE_SCOTLAND } from "../components/Utils/CsvUtils";

test("getRegionCodeFromUrl", () => {
  expect(
    getRegionCodeFromUrl({ pathname: "http://localhost:3000/regional" })
  ).toStrictEqual(FEATURE_CODE_SCOTLAND);

  expect(
    getRegionCodeFromUrl({ pathname: "http://localhost:3000/regional/unknown" })
  ).toStrictEqual(FEATURE_CODE_SCOTLAND);

  expect(getRegionCodeFromUrl({ pathname: "unknown" })).toStrictEqual(
    FEATURE_CODE_SCOTLAND
  );

  expect(getRegionCodeFromUrl({ pathname: "" })).toStrictEqual(
    FEATURE_CODE_SCOTLAND
  );

  expect(
    getRegionCodeFromUrl({
      pathname: "http://localhost:3000/regional/S08000016",
    })
  ).toStrictEqual("S08000016");

  expect(
    getRegionCodeFromUrl({
      pathname: "http://localhost:3000/regional/S12000033",
    })
  ).toStrictEqual("S12000033");
});

test("getCanonicalUrl", () => {
  expect(
    getCanonicalUrl("http://localhost:3000/regional", FEATURE_CODE_SCOTLAND)
  ).toStrictEqual("http://localhost:3000/regional");

  expect(getCanonicalUrl("https://other", "S08000016")).toStrictEqual(
    "https://other/S08000016"
  );

  expect(
    getCanonicalUrl("http://localhost:3000/regional", "S12000033")
  ).toStrictEqual("http://localhost:3000/regional/S12000033");
});

import { getPlaceNameByFeatureCode, getAllFeatureCodes } from "./featureCodes";

test("getPlaceNameByFeatureCode", async () => {
  // Health board
  expect(getPlaceNameByFeatureCode("S08000031")).toStrictEqual(
    "Greater Glasgow & Clyde"
  );
  expect(getPlaceNameByFeatureCode("S08000017")).toStrictEqual(
    "Dumfries & Galloway"
  );
  // Council area
  expect(getPlaceNameByFeatureCode("S12000040")).toStrictEqual("West Lothian");
  expect(getPlaceNameByFeatureCode("S12000013")).toStrictEqual(
    "Na h-Eileanan Siar"
  );
  // Country
  expect(getPlaceNameByFeatureCode("S92000003")).toStrictEqual("Scotland");
  expect(() => getPlaceNameByFeatureCode("S12345678")).toThrow(
    "Unknown feature code: S12345678"
  );
  expect(() => getPlaceNameByFeatureCode("unknown")).toThrow(
    "Unknown feature code: unknown"
  );
  expect(() => getPlaceNameByFeatureCode("")).toThrow("Unknown feature code: ");
  expect(() => getPlaceNameByFeatureCode(null)).toThrow(
    "Unknown feature code: null"
  );
  expect(() => getPlaceNameByFeatureCode(undefined)).toThrow(
    "Unknown feature code: undefined"
  );
});

test("getAllFeatureCodes", async () => {
  expect(getAllFeatureCodes()).toHaveLength(47);
  expect(getAllFeatureCodes()).toEqual(
    expect.arrayContaining(["S08000017", "S12000040", "S92000003"])
  );
});

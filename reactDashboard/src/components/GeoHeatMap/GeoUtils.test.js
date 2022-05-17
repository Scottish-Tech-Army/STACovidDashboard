import { featureCodeForFeature } from "./GeoUtils";

test("featureCodeForFeature", async () => {
  expect(
    featureCodeForFeature({ properties: { HBCode: "healthBoardCode1" } })
  ).toBe("healthBoardCode1");

  expect(
    featureCodeForFeature({ properties: { CODE: "councilAreaCode1" } })
  ).toBe("councilAreaCode1");
});

import { featureCodeForFeature } from "./GeoUtils";

test("featureCodeForFeature", async () => {
  expect(
    featureCodeForFeature({
      properties: {
        HBCode: "healthBoardCode1",
      },
    })
  ).toStrictEqual("healthBoardCode1");

  expect(
    featureCodeForFeature({
      properties: {
        CODE: "councilAreaCode1",
      },
    })
  ).toStrictEqual("councilAreaCode1");
});

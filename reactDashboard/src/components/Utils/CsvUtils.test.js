import {
  getPlaceNameByFeatureCode,
  getPhoneticPlaceNameByFeatureCode,
  getRelativeReportedDate,
} from "../Utils/CsvUtils";

beforeEach(() => {
  fetch.resetMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});

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

test("getPhoneticPlaceNameByFeatureCode", async () => {
  // Health board
  expect(getPhoneticPlaceNameByFeatureCode("S08000031")).toStrictEqual(
    "Greater Glasgow & Clyde"
  );
  expect(getPhoneticPlaceNameByFeatureCode("S08000017")).toStrictEqual(
    "Dumfries & Galloway"
  );
  // Council area
  expect(getPhoneticPlaceNameByFeatureCode("S12000040")).toStrictEqual(
    "West Lothian"
  );
  expect(getPhoneticPlaceNameByFeatureCode("S12000013")).toStrictEqual(
    "Nahelen an sheer"
  );
  // Country
  expect(getPhoneticPlaceNameByFeatureCode("S92000003")).toStrictEqual(
    "Scotland"
  );
  expect(() => getPhoneticPlaceNameByFeatureCode("S12345678")).toThrow(
    "Unknown feature code: S12345678"
  );
  expect(() => getPhoneticPlaceNameByFeatureCode("unknown")).toThrow(
    "Unknown feature code: unknown"
  );
  expect(() => getPhoneticPlaceNameByFeatureCode("")).toThrow(
    "Unknown feature code: "
  );
  expect(() => getPhoneticPlaceNameByFeatureCode(null)).toThrow(
    "Unknown feature code: null"
  );
  expect(() => getPhoneticPlaceNameByFeatureCode(undefined)).toThrow(
    "Unknown feature code: undefined"
  );
});

test("getRelativeReportedDate", () => {
  // Set today to be 2020-06-22
  setMockDate("2020-06-22");

  expect(getRelativeReportedDate(Date.parse("2020-06-22"))).toBe(
    "reported today"
  );
  expect(getRelativeReportedDate(Date.parse("2020-06-21"))).toBe(
    "reported yesterday"
  );
  expect(getRelativeReportedDate(Date.parse("2020-06-20"))).toBe(
    "reported last Saturday"
  );
  expect(getRelativeReportedDate(Date.parse("2020-06-19"))).toBe(
    "reported last Friday"
  );
  expect(getRelativeReportedDate(Date.parse("2020-06-18"))).toBe(
    "reported last Thursday"
  );
  expect(getRelativeReportedDate(Date.parse("2020-06-17"))).toBe(
    "reported last Wednesday"
  );
  expect(getRelativeReportedDate(Date.parse("2020-06-16"))).toBe(
    "reported last Tuesday"
  );
  expect(getRelativeReportedDate(Date.parse("2020-06-15"))).toBe(
    "reported on 15 June, 2020"
  );
  expect(getRelativeReportedDate(undefined)).toBeUndefined();
  expect(getRelativeReportedDate(null)).toBeUndefined();
});

function setMockDate(date) {
  jest
    .spyOn(global.Date, "now")
    .mockImplementation(() => Date.parse(date).valueOf());
}

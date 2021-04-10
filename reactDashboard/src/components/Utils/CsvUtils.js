import { differenceInDays, format } from "date-fns";

// Return date in words relative to today
export function getRelativeReportedDate(date) {
  if (!date) {
    return undefined;
  }
  const daysDifference = differenceInDays(Date.now(), date);
  if (daysDifference === 0) {
    return "reported today";
  }
  if (daysDifference === 1) {
    return "reported yesterday";
  }
  if (daysDifference > 1 && daysDifference < 7) {
    return "reported last " + format(date, "EEEE");
  }
  return "reported on " + format(date, "dd MMMM, yyyy");
}

export const FEATURE_CODE_SCOTLAND = "S92000003";

export const FEATURE_CODE_COUNCIL_AREAS_MAP = {
  S12000033: "Aberdeen City",
  S12000034: "Aberdeenshire",
  S12000041: "Angus",
  S12000035: "Argyll & Bute",
  S12000036: "City of Edinburgh",
  S12000005: "Clackmannanshire",
  S12000006: "Dumfries & Galloway",
  S12000042: "Dundee City",
  S12000008: "East Ayrshire",
  S12000045: "East Dunbartonshire",
  S12000010: "East Lothian",
  S12000011: "East Renfrewshire",
  S12000014: "Falkirk",
  S12000047: "Fife",
  S12000049: "Glasgow City",
  S12000017: "Highland",
  S12000018: "Inverclyde",
  S12000019: "Midlothian",
  S12000020: "Moray",
  S12000013: "Na h-Eileanan Siar",
  S12000021: "North Ayrshire",
  S12000050: "North Lanarkshire",
  S12000023: "Orkney Islands",
  S12000048: "Perth & Kinross",
  S12000038: "Renfrewshire",
  S12000026: "Scottish Borders",
  S12000027: "Shetland Islands",
  S12000028: "South Ayrshire",
  S12000029: "South Lanarkshire",
  S12000030: "Stirling",
  S12000039: "West Dunbartonshire",
  S12000040: "West Lothian",
};

export const FEATURE_CODE_COUNCIL_AREAS = Object.keys(
  FEATURE_CODE_COUNCIL_AREAS_MAP
);

export const FEATURE_CODE_HEALTH_BOARDS_MAP = {
  S08000015: "Ayrshire & Arran",
  S08000016: "Borders",
  S08000017: "Dumfries & Galloway",
  S08000029: "Fife",
  S08000019: "Forth Valley",
  S08000020: "Grampian",
  S08000031: "Greater Glasgow & Clyde",
  S08000022: "Highland",
  S08000032: "Lanarkshire",
  S08000024: "Lothian",
  S08000025: "Orkney",
  S08000026: "Shetland",
  S08000030: "Tayside",
  S08000028: "Western Isles",
};

export const FEATURE_CODE_HEALTH_BOARDS = Object.keys(
  FEATURE_CODE_HEALTH_BOARDS_MAP
);

export const FEATURE_CODE_MAP = {
  S92000003: "Scotland",
  ...FEATURE_CODE_HEALTH_BOARDS_MAP,
  ...FEATURE_CODE_COUNCIL_AREAS_MAP,
};

export function getPlaceNameByFeatureCode(featureCode) {
  const result = FEATURE_CODE_MAP[featureCode];
  if (result === undefined) {
    throw new Error("Unknown feature code: " + featureCode);
  }
  return result;
}

export function getPhoneticPlaceNameByFeatureCode(featureCode) {
  if (featureCode === "S12000013") {
    return "Nahelen an sheer";
  }
  return getPlaceNameByFeatureCode(featureCode);
}

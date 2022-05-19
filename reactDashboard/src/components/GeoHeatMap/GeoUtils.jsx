export const SCOTLAND_BOUNDS = [
  [54.6, -7.5],
  [61.0, -0.4],
];
export const SCOTLAND_MAX_BOUNDS = [
  [52.0, -10.0],
  [63.5, 2.0],
];

export const MAP_TILES_URL =
  "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png";
export const DARK_MAP_TILES_URL =
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";

export const ATTRIBUTION =
  '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';


export function featureCodeForFeature(feature) {
  var featureCode = feature.properties.HBCode;
  if (featureCode === undefined) {
    featureCode = feature.properties.CODE;
  }
  return featureCode;
}

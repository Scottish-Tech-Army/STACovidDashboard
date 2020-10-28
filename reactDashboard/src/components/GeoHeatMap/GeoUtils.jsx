const SCOTLAND_BOUNDS = [
  [54.6, -7.5],
  [61.0, -0.4],
];
const SCOTLAND_MAX_BOUNDS = [
  [52.0, -10.0],
  [63.5, 2.0],
];

export const MAP_TILES_URL =
  "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png";
export const DARK_MAP_TILES_URL =
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";

// Fit bounds and restrict the panning
export function setScotlandDefaultBounds(leafletMap) {
  leafletMap.invalidateSize();
  leafletMap.setMaxBounds(SCOTLAND_MAX_BOUNDS);
  leafletMap.fitBounds(SCOTLAND_BOUNDS, { maxZoom: 10, animate: false });
}

export function featureCodeForFeature(feature) {
  var featureCode = feature.properties.HBCode;
  if (featureCode === undefined) {
    featureCode = feature.properties.CODE;
  }
  return featureCode;
}

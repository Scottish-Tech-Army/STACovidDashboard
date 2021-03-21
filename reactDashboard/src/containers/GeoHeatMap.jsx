import React, { useState, useEffect } from "react";
import { parse7DayWindowCsvData } from "../components/Utils/CsvUtils";
import GeoHeatMap from "../components/GeoHeatMap/GeoHeatMap";

export default function GeoHeatMapContainer({
  councilAreaDataset,
  healthBoardDataset,
  valueType,
  areaType,
  toggleFullscreen,
  fullscreenEnabled,
  setAreaType,
  setValueType,
  darkmode,
}) {
  const [sevenDayDataset, setSevenDayDataset] = useState();

  // Parse datasets
  useEffect(() => {
    if (null !== councilAreaDataset && undefined !== councilAreaDataset) {
      setSevenDayDataset((existingMap) =>
        existingMap
          ? new Map([
              ...existingMap,
              ...parse7DayWindowCsvData(councilAreaDataset),
            ])
          : parse7DayWindowCsvData(councilAreaDataset)
      );
    }
  }, [councilAreaDataset]);

  useEffect(() => {
    if (null !== healthBoardDataset && undefined !== healthBoardDataset) {
      setSevenDayDataset((existingMap) =>
        existingMap
          ? new Map([
              ...existingMap,
              ...parse7DayWindowCsvData(healthBoardDataset),
            ])
          : parse7DayWindowCsvData(healthBoardDataset)
      );
    }
  }, [healthBoardDataset]);

  return (
    <GeoHeatMap
      sevenDayDataset={sevenDayDataset}
      valueType={valueType}
      areaType={areaType}
      toggleFullscreen={toggleFullscreen}
      fullscreenEnabled={fullscreenEnabled}
      setAreaType={setAreaType}
      setValueType={setValueType}
      darkmode={darkmode}
    />
  );
}

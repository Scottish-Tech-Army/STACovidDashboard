import React from "react";
import "./App.css";
import GeoHeatMap from "./components/GeoHeatMap/GeoHeatMap";
import Heatmap from "./components/HeatMap/Heatmap";
import PercentTestsChart from "./components/PercentTestsChart/PercentTestsChart";

const App = () => {
  return (
    <div className="App">
      <GeoHeatMap />
    </div>
  );
};

export default App;

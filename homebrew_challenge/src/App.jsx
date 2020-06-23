import React from "react";
import "./App.css";
import GeoHeatMap from "./components/GeoHeatMap/GeoHeatMap";
import Heatmap from "./components/HeatMap/Heatmap";
import PercentTestsChart from "./components/PercentTestsChart/PercentTestsChart";
import SingleValueBar from "./components/SingleValue/SingleValueBar";

const App = () => {
  return (
    <div className="App">
      <SingleValueBar />
      <GeoHeatMap />
    </div>
  );
};

export default App;

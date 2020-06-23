import React from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import GeoHeatMap from "./components/GeoHeatMap/GeoHeatMap";
import HeatmapContainer from "./components/HeatmapContainer/HeatmapContainer";
import PercentTestsChart from "./components/PercentTestsChart/PercentTestsChart";
import SingleValueBar from "./components/SingleValue/SingleValueBar";
/*<SingleValueBar />
<GeoHeatMap />
<PercentTestsChart />*/
const App = () => {
  return (
    <div className="App">

      <HeatmapContainer />
    </div>
  );
};

export default App;

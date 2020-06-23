import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import HeatmapContainer from "./components/HeatmapContainer/HeatmapContainer";
import PercentTestsChart from "./components/PercentTestsChart/PercentTestsChart";
import SingleValueBar from "./components/SingleValue/SingleValueBar";

const App = () => {
  return (
    <div className="App">
      <SingleValueBar />
      <HeatmapContainer />
      <PercentTestsChart />
    </div>
  );
};

export default App;

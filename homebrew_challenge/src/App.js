import React from "react";
import "./App.css";
import Heatmap from "./components/HeatMap/Heatmap";
import TestFetch from './containers/TestFetch';

function App() {
  return (
    <div className="App">
        <TestFetch/>
        <Heatmap />
    </div>
  );
}

export default App;

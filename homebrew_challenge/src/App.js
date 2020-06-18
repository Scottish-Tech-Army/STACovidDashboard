import React from "react";
import "./App.css";
import Heatmap from "./Heatmap";
import TestFetch from './TestFetch';

function App() {
  return (
    <div className="App">
        <TestFetch/>
        <Heatmap />
    </div>
  );
}

export default App;

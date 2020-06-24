import React from "react";
import HeatmapContainer from "./HeatmapContainer";
import Heatmap from "../HeatMap/Heatmap";
import GeoHeatMap from "../GeoHeatMap/GeoHeatMap";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import TestRenderer from "react-test-renderer";

jest.mock('../HeatMap/Heatmap', () => () => 'Heatmap');
jest.mock('../GeoHeatMap/GeoHeatMap', () => () => 'GeoHeatMap');

var container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  fetch.resetMocks();
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("default render", async () => {
  fetch.mockReject(new Error("fetch failed"));
  // Suppress console error message
  spyOn(console, "error");

  const testRenderer = TestRenderer.create(<HeatmapContainer />);
  const testInstance = testRenderer.root;

  expect(testInstance.findByType(Heatmap).props.valueType).toBe("deaths");
  expect(testInstance.findByType(Heatmap).props.areaType).toBe("health-boards");
  expect(testInstance.findByType(GeoHeatMap).props.valueType).toBe("deaths");
  expect(testInstance.findByType(GeoHeatMap).props.areaType).toBe(
    "health-boards"
  );
});

import React from "react";
import GeoHeatMap from "./GeoHeatMap";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

var container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("default render", async () => {
  act(() => {
    render(<GeoHeatMap toggleFullscreen={() => {}} />, container);
  });
  expect(map()).not.toBeNull();
});

const map = () => container.querySelector(".geo-map #map");

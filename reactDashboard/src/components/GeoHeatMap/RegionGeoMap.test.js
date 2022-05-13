import React from "react";
import RegionGeoMap from "./RegionGeoMap";
import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";

var container = null;
var root = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  // cleanup on exiting
  root.unmount(container);
  container.remove();
  container = null;
});

test("default render", async () => {
  act(() => {
    root.render(<RegionGeoMap />);
  });
  expect(map()).not.toBeNull();
});

const map = () => container.querySelector(".geo-map #regionmap");

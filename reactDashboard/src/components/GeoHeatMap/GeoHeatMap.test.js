import { render } from "@testing-library/react";
import React from "react";
import GeoHeatMap from "./GeoHeatMap";

test("default render", async () => {
  render(
    <GeoHeatMap
      toggleFullscreen={() => {
        // Do nothing
      }}
    />
  );

  expect(map()).not.toBeNull();
});

const map = () => document.querySelector(".geo-map #map");

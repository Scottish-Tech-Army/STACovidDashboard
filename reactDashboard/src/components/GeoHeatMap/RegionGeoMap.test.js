import React from "react";
import RegionGeoMap from "./RegionGeoMap";
import { render } from "@testing-library/react";

test("default render", async () => {
  render(<RegionGeoMap />);

  expect(map()).not.toBeNull();
});

const map = () => document.querySelector(".geo-map #regionmap");

/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkStoredValues"] }] */

import React from "react";
import { RegionTypeControl } from "./RegionTypeControl";
import { act } from "react-dom/test-utils";
import { AREATYPE_HEALTH_BOARDS } from "../HeatmapDataSelector/HeatmapConsts";
import { createRoot } from "react-dom/client";
import { MapContainer } from "react-leaflet";

// eslint-disable-next-line jest/require-hook
var storedAreaType = AREATYPE_HEALTH_BOARDS;
const setAreaType = (value) => (storedAreaType = value);

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
    root.render(
      <MapContainer>
        <RegionTypeControl
          areaType={storedAreaType}
          setAreaType={setAreaType}
        />
      </MapContainer>
    );
  });

  checkButtonText("Health Boards", "Council Areas");
  checkStoredValues("health-boards");

  click(councilAreasButton());
  checkStoredValues("council-areas");

  click(healthBoardsButton());
  checkStoredValues("health-boards");
});

function checkButtonText(expectedHealthBoards, expectedCouncilAreas) {
  expect(healthBoardsButton().textContent).toBe(expectedHealthBoards);
  expect(councilAreasButton().textContent).toBe(expectedCouncilAreas);
}

function checkStoredValues(expectedAreaType) {
  expect(storedAreaType).toBe(expectedAreaType);
}

const healthBoardsButton = () =>
  container.querySelector("#healthBoards + label");
const councilAreasButton = () =>
  container.querySelector("#councilAreas + label");

function click(button) {
  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    root.render(
      <MapContainer>
        <RegionTypeControl
          areaType={storedAreaType}
          setAreaType={setAreaType}
        />
      </MapContainer>
    );
  });
}

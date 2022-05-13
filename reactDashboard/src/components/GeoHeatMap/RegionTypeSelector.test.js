/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkStoredValues"] }] */

import React from "react";
import RegionTypeSelector from "./RegionTypeSelector";
import { act } from "react-dom/test-utils";
import { AREATYPE_HEALTH_BOARDS } from "../HeatmapDataSelector/HeatmapConsts";
import { createRoot } from "react-dom/client";

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

test("null/undefined input throws error", async () => {
  global.suppressConsoleErrorLogs();

  expect(() => {
    act(() => {
      root.render(
        <RegionTypeSelector areaType={null} setAreaType={setAreaType} />
      );
    });
  }).toThrow("Unrecognised areaType: null");

  expect(() => {
    act(() => {
      root.render(<RegionTypeSelector setAreaType={setAreaType} />);
    });
  }).toThrow("Unrecognised areaType: undefined");

  expect(() => {
    act(() => {
      root.render(<RegionTypeSelector areaType="health-boards" />);
    });
  }).toThrow("Unrecognised setAreaType: undefined");

  expect(() => {
    act(() => {
      root.render(
        <RegionTypeSelector areaType="unknown" setAreaType={setAreaType} />
      );
    });
  }).toThrow("Unrecognised areaType: unknown");
});

test("default render", async () => {
  act(() => {
    root.render(
      <RegionTypeSelector areaType={storedAreaType} setAreaType={setAreaType} />
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
      <RegionTypeSelector areaType={storedAreaType} setAreaType={setAreaType} />
    );
  });
}

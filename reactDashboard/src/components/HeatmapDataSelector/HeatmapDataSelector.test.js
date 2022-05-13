/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkStoredValues"] }] */

import React from "react";
import HeatmapDataSelector from "./HeatmapDataSelector";
import { act } from "react-dom/test-utils";
import { AREATYPE_HEALTH_BOARDS, VALUETYPE_DEATHS } from "./HeatmapConsts";
import { createRoot } from "react-dom/client";

var storedValueType = VALUETYPE_DEATHS;
var storedAreaType = AREATYPE_HEALTH_BOARDS;
const setValueType = (value) => (storedValueType = value);
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

function checkButtonText(
  expectedHealthBoards,
  expectedCouncilAreas,
  expectedDeaths,
  expectedCases
) {
  expect(healthBoardsButton().textContent).toBe(expectedHealthBoards);
  expect(councilAreasButton().textContent).toBe(expectedCouncilAreas);
  expect(deathsButton().textContent).toBe(expectedDeaths);
  expect(casesButton().textContent).toBe(expectedCases);
}

function checkStoredValues(expectedAreaType, expectedValueType) {
  expect(storedAreaType).toBe(expectedAreaType);
  expect(storedValueType).toBe(expectedValueType);
}

const healthBoardsButton = () =>
  container.querySelector("#healthBoards + label");
const councilAreasButton = () =>
  container.querySelector("#councilAreas + label");
const deathsButton = () => container.querySelector("#deaths + label");
const casesButton = () => container.querySelector("#cases + label");

function click(button) {
  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    root.render(
      <HeatmapDataSelector
        areaType={storedAreaType}
        valueType={storedValueType}
        setAreaType={setAreaType}
        setValueType={setValueType}
      />
    );
  });
}

test("null/undefined input throws error", async () => {
  global.suppressConsoleErrorLogs();

  expect(() => {
    act(() => {
      root.render(
        <HeatmapDataSelector
          areaType={null}
          valueType="deaths"
          setAreaType={setAreaType}
          setValueType={setValueType}
        />
      );
    });
  }).toThrow("Unrecognised areaType: null");

  expect(() => {
    act(() => {
      root.render(
        <HeatmapDataSelector
          valueType="deaths"
          setAreaType={setAreaType}
          setValueType={setValueType}
        />
      );
    });
  }).toThrow("Unrecognised areaType: undefined");

  expect(() => {
    act(() => {
      root.render(
        <HeatmapDataSelector
          areaType={AREATYPE_HEALTH_BOARDS}
          setAreaType={setAreaType}
          setValueType={setValueType}
        />
      );
    });
  }).toThrow("Unrecognised valueType: undefined");

  expect(() => {
    act(() => {
      root.render(
        <HeatmapDataSelector
          areaType="health-boards"
          valueType="deaths"
          setValueType={setValueType}
        />
      );
    });
  }).toThrow("Unrecognised setAreaType: undefined");

  expect(() => {
    act(() => {
      root.render(
        <HeatmapDataSelector
          areaType="health-boards"
          valueType="deaths"
          setAreaType={setAreaType}
        />
      );
    });
  }).toThrow("Unrecognised setValueType: undefined");

  expect(() => {
    act(() => {
      root.render(
        <HeatmapDataSelector
          areaType="unknown"
          valueType="deaths"
          setAreaType={setAreaType}
          setValueType={setValueType}
        />
      );
    });
  }).toThrow("Unrecognised areaType: unknown");

  expect(() => {
    act(() => {
      root.render(
        <HeatmapDataSelector
          areaType="health-boards"
          valueType="unknown"
          setAreaType={setAreaType}
          setValueType={setValueType}
        />
      );
    });
  }).toThrow("Unrecognised valueType: unknown");
});

test("default render", async () => {
  act(() => {
    root.render(
      <HeatmapDataSelector
        areaType={storedAreaType}
        valueType={storedValueType}
        setAreaType={setAreaType}
        setValueType={setValueType}
      />
    );
  });

  checkButtonText("Health Boards", "Council Areas", "Deaths", "Cases");
  checkStoredValues("health-boards", "deaths");

  click(councilAreasButton());
  checkStoredValues("council-areas", "deaths");

  click(casesButton());
  checkStoredValues("council-areas", "cases");

  click(healthBoardsButton());
  checkStoredValues("health-boards", "cases");

  click(deathsButton());
  checkStoredValues("health-boards", "deaths");
});

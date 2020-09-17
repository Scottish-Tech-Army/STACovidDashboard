/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkStoredValues"] }] */

import React from "react";
import HeatmapDataSelector from "./HeatmapDataSelector";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { AREATYPE_HEALTH_BOARDS, VALUETYPE_DEATHS } from "./HeatmapConsts";

var storedValueType = VALUETYPE_DEATHS;
var storedAreaType = AREATYPE_HEALTH_BOARDS;
const setValueType = (value) => (storedValueType = value);
const setAreaType = (value) => (storedAreaType = value);

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

const healthBoardsButton = () => container.querySelector("#healthBoards");
const councilAreasButton = () => container.querySelector("#councilAreas");
const deathsButton = () => container.querySelector("#deaths");
const casesButton = () => container.querySelector("#cases");

function click(button) {
  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    render(
      <HeatmapDataSelector
        areaType={storedAreaType}
        valueType={storedValueType}
        setAreaType={setAreaType}
        setValueType={setValueType}
      />,
      container
    );
  });
}

test("null/undefined input throws error", async () => {
  global.suppressConsoleErrorLogs();

  expect(() => {
    render(
      <HeatmapDataSelector
        areaType={null}
        valueType="deaths"
        setAreaType={setAreaType}
        setValueType={setValueType}
      />,
      container
    );
  }).toThrow("Unrecognised areaType: null");

  expect(() => {
    render(
      <HeatmapDataSelector
        valueType="deaths"
        setAreaType={setAreaType}
        setValueType={setValueType}
      />,
      container
    );
  }).toThrow("Unrecognised areaType: undefined");

  expect(() => {
    render(
      <HeatmapDataSelector
        areaType={AREATYPE_HEALTH_BOARDS}
        setAreaType={setAreaType}
        setValueType={setValueType}
      />,
      container
    );
  }).toThrow("Unrecognised valueType: undefined");

  expect(() => {
    render(
      <HeatmapDataSelector
        areaType="health-boards"
        valueType="deaths"
        setValueType={setValueType}
      />,
      container
    );
  }).toThrow("Unrecognised setAreaType: undefined");

  expect(() => {
    render(
      <HeatmapDataSelector
        areaType="health-boards"
        valueType="deaths"
        setAreaType={setAreaType}
      />,
      container
    );
  }).toThrow("Unrecognised setValueType: undefined");

  expect(() => {
    render(
      <HeatmapDataSelector
        areaType="unknown"
        valueType="deaths"
        setAreaType={setAreaType}
        setValueType={setValueType}
      />,
      container
    );
  }).toThrow("Unrecognised areaType: unknown");

  expect(() => {
    render(
      <HeatmapDataSelector
        areaType="health-boards"
        valueType="unknown"
        setAreaType={setAreaType}
        setValueType={setValueType}
      />,
      container
    );
  }).toThrow("Unrecognised valueType: unknown");
});

test("default render", async () => {
  act(() => {
    render(
      <HeatmapDataSelector
        areaType={storedAreaType}
        valueType={storedValueType}
        setAreaType={setAreaType}
        setValueType={setValueType}
      />,
      container
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

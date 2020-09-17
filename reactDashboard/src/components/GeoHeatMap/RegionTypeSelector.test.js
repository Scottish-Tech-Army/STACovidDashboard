/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkStoredValues"] }] */

import React from "react";
import RegionTypeSelector from "./RegionTypeSelector";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { AREATYPE_HEALTH_BOARDS } from "../HeatmapDataSelector/HeatmapConsts";

var storedAreaType = AREATYPE_HEALTH_BOARDS;
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

test("null/undefined input throws error", async () => {
  global.suppressConsoleErrorLogs();

  expect(() => {
    render(
      <RegionTypeSelector areaType={null} setAreaType={setAreaType} />,
      container
    );
  }).toThrow("Unrecognised areaType: null");

  expect(() => {
    render(<RegionTypeSelector setAreaType={setAreaType} />, container);
  }).toThrow("Unrecognised areaType: undefined");

  expect(() => {
    render(<RegionTypeSelector areaType="health-boards" />, container);
  }).toThrow("Unrecognised setAreaType: undefined");

  expect(() => {
    render(
      <RegionTypeSelector areaType="unknown" setAreaType={setAreaType} />,
      container
    );
  }).toThrow("Unrecognised areaType: unknown");
});

test("default render", async () => {
  act(() => {
    render(
      <RegionTypeSelector
        areaType={storedAreaType}
        setAreaType={setAreaType}
      />,
      container
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

const healthBoardsButton = () => container.querySelector("#healthBoards");
const councilAreasButton = () => container.querySelector("#councilAreas");

function click(button) {
  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    render(
      <RegionTypeSelector
        areaType={storedAreaType}
        setAreaType={setAreaType}
      />,
      container
    );
  });
}

import React from "react";
import HeatmapDataSelector from "./HeatmapDataSelector";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import {
  AREATYPE_COUNCIL_AREAS,
  AREATYPE_HEALTH_BOARDS,
  VALUETYPE_CASES,
  VALUETYPE_DEATHS,
} from "./HeatmapConsts";

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

function checkButtonsDisabled(casesButtonDisabled, councilAreasButtonDisabled) {
  expect(casesButton().getAttribute("class").indexOf("disabled") > -1).toBe(
    casesButtonDisabled
  );
  expect(
    councilAreasButton().getAttribute("class").indexOf("disabled") > -1
  ).toBe(councilAreasButtonDisabled);
}

it("null/undefined input throws error", async () => {
  // Suppress console error message
  spyOn(console, "error");

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

it("invalid council areas cases combination throws error", async () => {
  // Suppress console error message
  spyOn(console, "error");

  expect(() => {
    render(
      <HeatmapDataSelector
        areaType="council-areas"
        valueType="cases"
        setAreaType={setAreaType}
        setValueType={setValueType}
      />,
      container
    );
  }).toThrow("Invalid combination: council-areas and cases");
});

it("default render", async () => {
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

  checkButtonText("Health boards", "Council areas", "Deaths", "Cases");
  checkButtonsDisabled(false, false);
  checkStoredValues("health-boards", "deaths");

  click(councilAreasButton());
  checkButtonText(
    "Health boards",
    "Council areas",
    "Deaths",
    "Cases [Data not available]"
  );
  checkButtonsDisabled(true, false);
  checkStoredValues("council-areas", "deaths");

  click(healthBoardsButton());
  checkButtonText("Health boards", "Council areas", "Deaths", "Cases");
  checkButtonsDisabled(false, false);
  checkStoredValues("health-boards", "deaths");

  click(casesButton());
  checkButtonText(
    "Health boards",
    "Council areas [Data not available]",
    "Deaths",
    "Cases"
  );
  checkButtonsDisabled(false, true);
  checkStoredValues("health-boards", "cases");

  click(deathsButton());
  checkButtonText("Health boards", "Council areas", "Deaths", "Cases");
  checkButtonsDisabled(false, false);
  checkStoredValues("health-boards", "deaths");
});

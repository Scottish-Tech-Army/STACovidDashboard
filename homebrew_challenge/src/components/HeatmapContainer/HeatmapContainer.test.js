import React from "react";
import HeatmapContainer from "./HeatmapContainer";
import Heatmap from "../HeatMap/Heatmap";
import GeoHeatMap from "../GeoHeatMap/GeoHeatMap";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

var heatmapProps = null;
var geoHeatmapProps = null;

jest.mock("../HeatMap/Heatmap", () => (props) => {
  heatmapProps = props;
  return "Heatmap";
});
jest.mock("../GeoHeatMap/GeoHeatMap", () => (props) => {
  geoHeatmapProps = props;
  return "GeoHeatMap";
});

var container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  fetch.resetMocks();
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

function checkHeatmapsProps(expectedAreaType, expectedValueType) {
  expect(heatmapProps.areaType).toBe(expectedAreaType);
  expect(heatmapProps.valueType).toBe(expectedValueType);
  expect(geoHeatmapProps.areaType).toBe(expectedAreaType);
  expect(geoHeatmapProps.valueType).toBe(expectedValueType);
}

const healthBoardsButton = () =>
  container.querySelector("#datasetSelectionButtons #healthBoards");
const councilAreasButton = () =>
  container.querySelector("#datasetSelectionButtons #councilAreas");
const deathsButton = () =>
  container.querySelector("#datasetSelectionButtons #deaths");
const casesButton = () =>
  container.querySelector("#datasetSelectionButtons #cases");

function click(button) {
  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

function checkButtonsDisabled(casesButtonDisabled, councilAreasButtonDisabled) {
    expect(casesButton().getAttribute("class").indexOf("disabled") > -1).toBe(casesButtonDisabled);
    expect(councilAreasButton().getAttribute("class").indexOf("disabled") > -1).toBe(councilAreasButtonDisabled);
}

it("default render", async () => {
  fetch.mockReject(new Error("fetch failed"));
  // Suppress console error message
  spyOn(console, "error");

  act(() => {
    render(<HeatmapContainer />, container);
  });

  checkButtonText("Health boards", "Council areas", "Deaths", "Cases");
  checkButtonsDisabled(false, false);
  checkHeatmapsProps("health-boards", "deaths");

  click(councilAreasButton());
  checkButtonText(
    "Health boards",
    "Council areas",
    "Deaths",
    "Cases [Data not available]"
  );
  checkButtonsDisabled(true, false);
  checkHeatmapsProps("council-areas", "deaths");

  click(healthBoardsButton());
  checkButtonText(
    "Health boards",
    "Council areas",
    "Deaths",
    "Cases"
  );
  checkButtonsDisabled(false, false);
  checkHeatmapsProps("health-boards", "deaths");

  click(casesButton());
  checkButtonText(
    "Health boards",
    "Council areas [Data not available]",
    "Deaths",
    "Cases"
  );
  checkButtonsDisabled(false, true);
  checkHeatmapsProps("health-boards", "cases");

  click(deathsButton());
  checkButtonText(
    "Health boards",
    "Council areas",
    "Deaths",
    "Cases"
  );
  checkButtonsDisabled(false, false);
  checkHeatmapsProps("health-boards", "deaths");
});

/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkStoredValues"] }] */

import React from "react";
import HeatmapDataSelector from "./HeatmapDataSelector";
import {
  AREATYPE_COUNCIL_AREAS,
  AREATYPE_HEALTH_BOARDS,
  VALUETYPE_CASES,
  VALUETYPE_DEATHS,
} from "./HeatmapConsts";
import { render } from "@testing-library/react";
import { renderWithUser } from "../../ReactTestUtils";

const setValueType = jest.fn();
const setAreaType = jest.fn();

const healthBoardsButton = () =>
  document.querySelector("#healthBoards + label");
const councilAreasButton = () =>
  document.querySelector("#councilAreas + label");
const deathsButton = () => document.querySelector("#deaths + label");
const casesButton = () => document.querySelector("#cases + label");

test("null/undefined input throws error", async () => {
  global.suppressConsoleErrorLogs();

  expect(() => {
    render(
      <HeatmapDataSelector
        areaType={null}
        valueType="deaths"
        setAreaType={setAreaType}
        setValueType={setValueType}
      />
    );
  }).toThrow("Unrecognised areaType: null");

  expect(() => {
    render(
      <HeatmapDataSelector
        valueType="deaths"
        setAreaType={setAreaType}
        setValueType={setValueType}
      />
    );
  }).toThrow("Unrecognised areaType: undefined");

  expect(() => {
    render(
      <HeatmapDataSelector
        areaType={AREATYPE_HEALTH_BOARDS}
        setAreaType={setAreaType}
        setValueType={setValueType}
      />
    );
  }).toThrow("Unrecognised valueType: undefined");

  expect(() => {
    render(
      <HeatmapDataSelector
        areaType="health-boards"
        valueType="deaths"
        setValueType={setValueType}
      />
    );
  }).toThrow("Unrecognised setAreaType: undefined");

  expect(() => {
    render(
      <HeatmapDataSelector
        areaType="health-boards"
        valueType="deaths"
        setAreaType={setAreaType}
      />
    );
  }).toThrow("Unrecognised setValueType: undefined");

  expect(() => {
    render(
      <HeatmapDataSelector
        areaType="unknown"
        valueType="deaths"
        setAreaType={setAreaType}
        setValueType={setValueType}
      />
    );
  }).toThrow("Unrecognised areaType: unknown");

  expect(() => {
    render(
      <HeatmapDataSelector
        areaType="health-boards"
        valueType="unknown"
        setAreaType={setAreaType}
        setValueType={setValueType}
      />
    );
  }).toThrow("Unrecognised valueType: unknown");
});

test("default render", async () => {
  const { user, rerender } = renderWithUser(
    <HeatmapDataSelector
      areaType={AREATYPE_HEALTH_BOARDS}
      valueType={VALUETYPE_DEATHS}
      setAreaType={setAreaType}
      setValueType={setValueType}
    />
  );

  expect(healthBoardsButton().textContent).toBe("Health Boards");
  expect(councilAreasButton().textContent).toBe("Council Areas");
  expect(deathsButton().textContent).toBe("Deaths");
  expect(casesButton().textContent).toBe("Cases");

  await user.click(councilAreasButton());
  expect(setAreaType).toHaveBeenLastCalledWith(AREATYPE_COUNCIL_AREAS);

  await user.click(casesButton());
  expect(setValueType).toHaveBeenLastCalledWith(VALUETYPE_CASES);

  rerender(
    <HeatmapDataSelector
      areaType={AREATYPE_COUNCIL_AREAS}
      valueType={VALUETYPE_CASES}
      setAreaType={setAreaType}
      setValueType={setValueType}
    />
  );
  await user.click(healthBoardsButton());
  expect(setAreaType).toHaveBeenLastCalledWith(AREATYPE_HEALTH_BOARDS);

  await user.click(deathsButton());
  expect(setValueType).toHaveBeenLastCalledWith(VALUETYPE_DEATHS);
});

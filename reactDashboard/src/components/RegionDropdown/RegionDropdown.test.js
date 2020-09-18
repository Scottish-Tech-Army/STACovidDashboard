/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkStoredValues"] }] */

import React from "react";
import RegionDropdown from "./RegionDropdown";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { FEATURE_CODE_MAP, FEATURE_CODE_SCOTLAND } from "../Utils/CsvUtils";

var storedRegionCode = FEATURE_CODE_SCOTLAND;
const setRegionCode = (value) => (storedRegionCode = value);

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

const selectedItem = () => container.querySelector(".selected-region");
const dropdownMenuItems = () => container.querySelectorAll(".region-menu a");
const dropdownMenuItem = (text) =>
  Array.from(dropdownMenuItems()).find((el) => el.textContent === text);

function click(button) {
  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    render(
      <RegionDropdown
        regionCode={storedRegionCode}
        setRegionCode={setRegionCode}
      />,
      container
    );
  });
}

test("null/undefined input throws error", async () => {
  global.suppressConsoleErrorLogs();

  expect(() => {
    render(
      <RegionDropdown regionCode={null} setRegionCode={setRegionCode} />,
      container
    );
  }).toThrow("Unrecognised regionCode: null");

  expect(() => {
    render(<RegionDropdown regionCode={storedRegionCode} />, container);
  }).toThrow("Unrecognised setRegionCode: undefined");

  expect(() => {
    render(
      <RegionDropdown regionCode="unknown" setRegionCode={setRegionCode} />,
      container
    );
  }).toThrow("Unrecognised regionCode: unknown");
});

test("default render", () => {
  act(() => {
    render(<RegionDropdown setRegionCode={setRegionCode} />, container);
  });

  expect(selectedItem().textContent).toBe("Scotland");
});

test("supplied regionCode render", () => {
  act(() => {
    render(
      <RegionDropdown regionCode="S12000036" setRegionCode={setRegionCode} />,
      container
    );
  });

  expect(selectedItem().textContent).toBe("City of Edinburgh");
});

test("select dropdown items", () => {
  act(() => {
    render(
      <RegionDropdown
        regionCode={storedRegionCode}
        setRegionCode={setRegionCode}
      />,
      container
    );
  });

  expect(storedRegionCode).toBe(FEATURE_CODE_SCOTLAND);
  expect(selectedItem().textContent).toBe("Scotland");

  // Make the menu appear
  click(selectedItem());

  expect(dropdownMenuItems()).toHaveLength(
    Object.keys(FEATURE_CODE_MAP).length
  );
  expect(dropdownMenuItem("Scotland")).not.toBeNull();
  expect(dropdownMenuItem("Greater Glasgow & Clyde")).not.toBeNull();
  expect(dropdownMenuItem("City of Edinburgh")).not.toBeNull();
  expect(dropdownMenuItem("unknown")).toBeUndefined();

  // Pick a council area
  click(dropdownMenuItem("City of Edinburgh"));
  expect(storedRegionCode).toBe("S12000036");
  expect(selectedItem().textContent).toBe("City of Edinburgh");

  // Pick a health board
  click(dropdownMenuItem("Greater Glasgow & Clyde"));
  expect(storedRegionCode).toBe("S08000031");
  expect(selectedItem().textContent).toBe("Greater Glasgow & Clyde");

  // Pick Scotland
  click(dropdownMenuItem("Scotland"));
  expect(storedRegionCode).toBe(FEATURE_CODE_SCOTLAND);
  expect(selectedItem().textContent).toBe("Scotland");
});

/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkStoredValues"] }] */

import React from "react";
import RegionDropdown from "./RegionDropdown";
import { act } from "react-dom/test-utils";
import {
  FEATURE_CODE_MAP,
  FEATURE_CODE_SCOTLAND,
  FEATURE_CODE_HEALTH_BOARDS_MAP,
} from "../Utils/CsvUtils";
import { createRoot } from "react-dom/client";

var showCouncilAreas = true;
var storedRegionCode = FEATURE_CODE_SCOTLAND;
const setRegionCode = (value) => (storedRegionCode = value);

var container = null;
var root = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  showCouncilAreas = true;
  storedRegionCode = FEATURE_CODE_SCOTLAND;
});

afterEach(() => {
  // cleanup on exiting
  root.unmount(container);
  container.remove();
  container = null;
});

const selectedItem = () => container.querySelector(".selected-region");
const dropdownMenuItems = () => container.querySelectorAll(".region-menu a");
const dropdownMenuItem = (text) =>
  Array.from(dropdownMenuItems()).find((el) => el.textContent === text);

const FEATURE_CODE_CA_ABERDEEN_CITY = "S12000033";

function click(button) {
  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    root.render(
      <RegionDropdown
        regionCode={storedRegionCode}
        setRegionCode={setRegionCode}
        showCouncilAreas={showCouncilAreas}
      />
    );
  });
}

test("null/undefined input throws error", async () => {
  global.suppressConsoleErrorLogs();

  expect(() => {
    act(() => {
      root.render(
        <RegionDropdown regionCode={null} setRegionCode={setRegionCode} />
      );
    });
  }).toThrow("Unrecognised regionCode: null");

  expect(() => {
    act(() => {
      root.render(<RegionDropdown regionCode={storedRegionCode} />);
    });
  }).toThrow("Unrecognised setRegionCode: undefined");

  expect(() => {
    act(() => {
      root.render(
        <RegionDropdown regionCode="unknown" setRegionCode={setRegionCode} />
      );
    });
  }).toThrow("Unrecognised regionCode: unknown");

  expect(() => {
    act(() => {
      root.render(
        <RegionDropdown
          regionCode={FEATURE_CODE_CA_ABERDEEN_CITY}
          setRegionCode={setRegionCode}
          showCouncilAreas={false}
        />
      );
    });
  }).toThrow("Unrecognised regionCode: " + FEATURE_CODE_CA_ABERDEEN_CITY);
});

test("default render", () => {
  act(() => {
    root.render(<RegionDropdown setRegionCode={setRegionCode} />);
  });

  expect(selectedItem().textContent).toBe("Scotland");
});

test("supplied regionCode render", () => {
  act(() => {
    root.render(
      <RegionDropdown
        regionCode="S12000036"
        setRegionCode={setRegionCode}
        showCouncilAreas={true}
      />
    );
  });

  expect(selectedItem().textContent).toBe("City of Edinburgh");
});

test("select dropdown items", () => {
  act(() => {
    root.render(
      <RegionDropdown
        regionCode={storedRegionCode}
        setRegionCode={setRegionCode}
      />
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

test("select dropdown items, no council areas", () => {
  showCouncilAreas = false;

  act(() => {
    root.render(
      <RegionDropdown
        regionCode={storedRegionCode}
        setRegionCode={setRegionCode}
        showCouncilAreas={showCouncilAreas}
      />
    );
  });

  expect(storedRegionCode).toBe(FEATURE_CODE_SCOTLAND);
  expect(selectedItem().textContent).toBe("Scotland");

  // Make the menu appear
  click(selectedItem());

  expect(dropdownMenuItems()).toHaveLength(
    Object.keys(FEATURE_CODE_HEALTH_BOARDS_MAP).length + 1
  );
  expect(dropdownMenuItem("Scotland")).not.toBeNull();
  expect(dropdownMenuItem("Greater Glasgow & Clyde")).not.toBeNull();
  expect(dropdownMenuItem("City of Edinburgh")).toBeUndefined();
  expect(dropdownMenuItem("unknown")).toBeUndefined();

  // Pick a health board
  click(dropdownMenuItem("Greater Glasgow & Clyde"));
  expect(storedRegionCode).toBe("S08000031");
  expect(selectedItem().textContent).toBe("Greater Glasgow & Clyde");

  // Pick Scotland
  click(dropdownMenuItem("Scotland"));
  expect(storedRegionCode).toBe(FEATURE_CODE_SCOTLAND);
  expect(selectedItem().textContent).toBe("Scotland");
});

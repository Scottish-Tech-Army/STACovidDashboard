import React from "react";
import RegionDropdown from "./RegionDropdown";
import { FEATURE_CODE_MAP, FEATURE_CODE_SCOTLAND } from "../Utils/CsvUtils";
import { render } from "@testing-library/react";
import { renderWithUser } from "../../ReactTestUtils";

const setRegionCode = jest.fn();

const selectedItem = () => document.querySelector(".selected-region");
const dropdownMenuItems = () => document.querySelectorAll(".region-menu a");
const dropdownMenuItem = (text) =>
  Array.from(dropdownMenuItems()).find((el) => el.textContent === text);

test("null/undefined input throws error", async () => {
  global.suppressConsoleErrorLogs();

  expect(() => {
    render(<RegionDropdown regionCode={null} setRegionCode={setRegionCode} />);
  }).toThrow("Unrecognised regionCode: null");

  expect(() => {
    render(<RegionDropdown regionCode={FEATURE_CODE_SCOTLAND} />);
  }).toThrow("Unrecognised setRegionCode: undefined");

  expect(() => {
    render(
      <RegionDropdown regionCode="unknown" setRegionCode={setRegionCode} />
    );
  }).toThrow("Unrecognised regionCode: unknown");
});

test("default render", () => {
  render(<RegionDropdown setRegionCode={setRegionCode} />);

  expect(selectedItem().textContent).toBe("Scotland");
});

test("supplied regionCode render", () => {
  render(
    <RegionDropdown regionCode="S12000036" setRegionCode={setRegionCode} />
  );

  expect(selectedItem().textContent).toBe("City of Edinburgh");
});

test("select dropdown items", async () => {
  const { user, rerender } = renderWithUser(
    <RegionDropdown
      regionCode={FEATURE_CODE_SCOTLAND}
      setRegionCode={setRegionCode}
    />
  );

  expect(selectedItem().textContent).toBe("Scotland");

  // Make the menu appear
  await user.click(selectedItem());

  expect(dropdownMenuItems()).toHaveLength(
    Object.keys(FEATURE_CODE_MAP).length
  );
  expect(dropdownMenuItem("Scotland")).not.toBeNull();
  expect(dropdownMenuItem("Greater Glasgow & Clyde")).not.toBeNull();
  expect(dropdownMenuItem("City of Edinburgh")).not.toBeNull();
  expect(dropdownMenuItem("unknown")).toBeUndefined();

  // Pick a council area
  await user.click(dropdownMenuItem("City of Edinburgh"));
  expect(setRegionCode).toHaveBeenLastCalledWith("S12000036");

  // Pick a health board
  await user.click(dropdownMenuItem("Greater Glasgow & Clyde"));
  expect(setRegionCode).toHaveBeenLastCalledWith("S08000031");

  // Pick Scotland
  await user.click(dropdownMenuItem("Scotland"));
  expect(setRegionCode).toHaveBeenLastCalledWith(FEATURE_CODE_SCOTLAND);
});

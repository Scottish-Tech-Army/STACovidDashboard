/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkSingleValue"] }] */

import React from "react";
import SingleValue from "./SingleValue";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

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

test("singleValue renders correctly", () => {
  act(() => {
    root.render(<SingleValue value="Test count" subtitle={null} />);
  });
  checkSingleValue("Test count", "");
});

test("singleValue renders error message when missing props", async () => {
  act(() => {
    root.render(<SingleValue value="Test count" />);
  });
  checkSingleValue("Test count", "");

  act(() => {
    root.render(<SingleValue subtitle="test date reported" />);
  });
  checkSingleValue("Missing value", "test date reported");

  act(() => {
    root.render(<SingleValue />);
  });
  checkSingleValue("Missing value", "");
});

const subtitle = () => container.querySelector(".subtitle");
const value = () => container.querySelector(".single-value-number");

function checkSingleValue(expectedValue, expectedSubtitle = null) {
  expect(subtitle().textContent).toBe(
    expectedSubtitle === null ? "" : expectedSubtitle
  );
  expect(value().textContent).toBe(expectedValue);
}

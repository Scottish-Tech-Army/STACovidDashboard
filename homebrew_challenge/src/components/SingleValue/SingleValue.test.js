/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkSingleValue"] }] */

import React from "react";
import SingleValue from "./SingleValue";
import { render, unmountComponentAtNode } from "react-dom";

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

test("singleValue renders correctly", () => {
  render(<SingleValue dateReported="Reported date not available" value="Test count" />, container);
  checkSingleValue("*Reported date not available", "Test count");
});

test("singleValue renders error message when missing props", async () => {
  render(<SingleValue value="Test count" />, container);
  checkSingleValue("*Reported date not available", "Test count");

  render(<SingleValue dateReported="Test date reported" />, container);
  checkSingleValue("*Test date reported", "Missing value");

  render(<SingleValue />, container);
  checkSingleValue("*Reported date not available", "Missing value");
});

const dateReported = () => container.querySelector(".date-reported");
const value = () => container.querySelector(".single-value-number");

function checkSingleValue(expectedDate, expectedValue) {
  expect(dateReported().textContent).toBe(expectedDate);
  expect(value().textContent).toBe(expectedValue);
}

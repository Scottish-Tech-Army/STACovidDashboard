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
  render(<SingleValue subtitle="reported date not available" value="Test count" />, container);
  checkSingleValue("Test count", "reported date not available");
});

test("singleValue renders error message when missing props", async () => {
  render(<SingleValue value="Test count" />, container);
  checkSingleValue("Test count", "reported date not available");

  render(<SingleValue subtitle="Test date reported" />, container);
  checkSingleValue("Missing value", "test date reported");

  render(<SingleValue />, container);
  checkSingleValue("Missing value", "reported date not available");
});

const subtitle = () => container.querySelector(".subtitle");
const value = () => container.querySelector(".single-value-number");

function checkSingleValue(expectedValue, expectedSubtitle=null) {
  expect(subtitle().textContent).toBe(expectedSubtitle === null ? "" : expectedSubtitle);
  expect(value().textContent).toBe(expectedValue);
}

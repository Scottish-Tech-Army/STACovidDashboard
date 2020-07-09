import React from "react";
import SingleValue from "./SingleValue";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

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

it("SingleValue renders correctly", () => {
  render(<SingleValue title="Test title" value="Test count" />, container);
  checkSingleValue("Test title", "Test count");
});

it("SingleValue renders error message when missing props", async () => {
  render(<SingleValue value="Test count" />, container);
  checkSingleValue("Missing title", "Test count");

  render(<SingleValue title="Test title" />, container);
  checkSingleValue("Test title", "Missing value");

  render(<SingleValue />, container);
  checkSingleValue("Missing title", "Missing value");
});

const title = () => container.querySelector(".single-value-header");
const value = () => container.querySelector(".single-value-total");

function checkSingleValue(expectedTitle, expectedValue) {
  expect(title().textContent).toBe(expectedTitle);
  expect(value().textContent).toBe(expectedValue);
}

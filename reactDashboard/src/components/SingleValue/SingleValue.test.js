/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkSingleValue"] }] */

import React from "react";
import SingleValue from "./SingleValue";
import { render } from "@testing-library/react";

test("singleValue renders correctly", () => {
  const { rerender } = render(
    <SingleValue value="Test count" subtitle="test date reported" />
  );
  checkSingleValue("Test count", "test date reported");

  rerender(<SingleValue value="Test count" />);
  checkSingleValue("Test count", "");
});

test("singleValue renders error message when missing props", async () => {
  const { rerender } = render(<SingleValue subtitle="test date reported" />);
  checkSingleValue("Missing value", "test date reported");

  rerender(<SingleValue />);
  checkSingleValue("Missing value", "");
});

const subtitle = () => document.querySelector(".subtitle");
const value = () => document.querySelector(".single-value-number");

function checkSingleValue(expectedValue, expectedSubtitle) {
  expect(subtitle().textContent).toBe(expectedSubtitle);
  expect(value().textContent).toBe(expectedValue);
}

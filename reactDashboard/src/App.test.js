import React from "react";
import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import App from "./App";

test("renders learn react link", async () => {
  fetch.mockReject(new Error("fetch failed"));
  global.suppressConsoleErrorLogs();

  var result;
  await act(async () => {
    result = render(<App />);
  });
  // const { getByText } = render(<App />);
  const linkElement = result.getByText(/Unless otherwise stated, this webpage contains public sector information licensed under/i);
  expect(linkElement).toBeInTheDocument();
});

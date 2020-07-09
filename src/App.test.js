import React from "react";
import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import App from "./App";

test("renders learn react link", async () => {
  fetch.mockReject(new Error("fetch failed"));
  // Suppress console error message
  spyOn(console, "error");
  
  var result;
  await act(async () => {
    result = render(<App />);
  });
  //const { getByText } = render(<App />);
  const linkElement = result.getByText(/Area/i);
  expect(linkElement).toBeInTheDocument();
});

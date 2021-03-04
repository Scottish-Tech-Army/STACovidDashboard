import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import App from "./App";

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

test("default render", async () => {
  fetch.mockReject(new Error("fetch failed"));
  global.suppressConsoleErrorLogs();

  const app = () => container.querySelector(".App");

  await act(async () => {
    render(<App />, container);
  });
  expect(app().getAttribute("class")).not.toContain("darkmode");

});

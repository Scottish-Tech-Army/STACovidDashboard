import React from "react";
import PercentTestsChart from "./PercentTestsChart";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

var container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("PercentTestsChart renders default data", () => {
  act(() => {
    render(
      <PercentTestsChart/>,
      container
    );
  });
  const canvas = container.querySelector(".chart-container canvas");
  expect(canvas).not.toBeNull();
});

it("Test PercentTestsChart throw errors when arrays don't match", () => {
  expect(() => {
    act(() => {
      render(
        <PercentTestsChart inputData={badInputData} />,
        container
      );
    });
  }).toThrow("Array lengths don't match");
});

const badInputData = {
  t: [
    "2020-04-06",
    "2020-04-07",
    "2020-04-08",
    "2020-04-09",
    "2020-04-10",
    "2020-04-11"
  ],
  y: [5, 7, 12, 16, 25, 22, 15]
};

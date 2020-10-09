import React from "react";
import DataChartsUtils from "./DataChartsUtils";
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

test("dataCharts renders default data input dataset is null", async () => {
  global.suppressConsoleErrorLogs();

  await act(async () => {
    render(<DataCharts />, container);
  });



  const canvas = container.querySelector(".chart-container canvas");
  expect(canvas).not.toBeNull();
});


<Dropdown onSelect={(eventKey) => setChartType(eventKey)}>
      <Dropdown.Toggle
        variant="primary"
        className="selected-chart"
        value={chartType}
        title={chartType}
      ></Dropdown.Toggle>
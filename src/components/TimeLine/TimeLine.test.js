import React from "react";
import TimeLine from "./TimeLine";
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
  jest.resetAllMocks();
});

const testEvents = [
  { date: "2020-05-29", text: "Event 1" },
  { date: "2021-03-11", text: "Event 4" },
  { date: "2020-06-19", text: "Event 2" },
  { date: "2020-03-01", text: "Event 3a" },
  { date: "2020-03-01", text: "Event 3b" },
];

it("TimeLine rendering text and order", async () => {
  await act(async () => {
    render(<TimeLine events={testEvents} />, container);
  });

  const tableRows = container.querySelectorAll("tr");
  expect(tableRows.length).toBe(6);

  // Not too bothered about layout - checking the rows are in the right order
  expect(tableRows[0].textContent).toBe("2021");
  expect(tableRows[1].textContent).toBe("11 MarEvent 4");
  expect(tableRows[2].textContent).toBe("2020");
  expect(tableRows[3].textContent).toBe("19 JunEvent 2");
  expect(tableRows[4].textContent).toBe("29 MayEvent 1");
  expect(tableRows[5].textContent).toBe("1 MarEvent 3aEvent 3b");
});

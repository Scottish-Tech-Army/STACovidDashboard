import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { getMarks } from "./DateRangeSlider";

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

describe("getMarks", () => {
  it("normalRange", () => {
    const expectedResult = [
      {
        value: Date.parse("2020-02-28"),
        label: "28 Feb 2020"
      },
      {
        value: Date.parse("2020-04-02"),
        label: "02 Apr 2020"
      },
      {
        value: Date.parse("2020-03-01")
      },
      {
        value: Date.parse("2020-04-01")
      },
    ];

    expect(
      getMarks({
        startDate: Date.parse("2020-02-28"),
        endDate: Date.parse("2020-04-02")
      })
    ).toStrictEqual(expectedResult);
  });

  it("firstOfMonth", () => {
    const expectedResult = [
      {
        value: Date.parse("2020-02-01"),
        label: "01 Feb 2020"
      },
      {
        value: Date.parse("2020-06-01"),
        label: "01 Jun 2020"
      },
      {
        value: Date.parse("2020-03-01")
      },
      {
        value: Date.parse("2020-04-01")
      },
      {
        value: Date.parse("2020-05-01")
      }
    ];

    expect(
      getMarks({
        startDate: Date.parse("2020-02-01"),
        endDate: Date.parse("2020-06-01")
      })
    ).toStrictEqual(expectedResult);
  });

  it("defaultValues", () => {
    const expectedResult = [];

    expect(
      getMarks({
        startDate: 0,
        endDate: 0
      })
    ).toStrictEqual(expectedResult);
  });
});

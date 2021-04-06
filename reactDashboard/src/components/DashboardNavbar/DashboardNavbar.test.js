import React from "react";
import DashboardNavbar from "./DashboardNavbar";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";

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

const findNavlink = (linkText) =>
  Array.from(document.querySelectorAll(".navbar-links a.nav-link")).find(
    (el) => el.textContent === linkText
  );
const overviewNavlink = () => findNavlink("Summary Statistics");
const regionalNavlink = () => findNavlink("Regional Insights");

describe("nav links content and highlighting", () => {
  const darkmode = { value: false };

  it("summary page", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <DashboardNavbar darkmode={darkmode} />
        </MemoryRouter>,
        container
      );
    });

    expect(overviewNavlink().getAttribute("href")).toStrictEqual("/");
    expect(overviewNavlink().getAttribute("class")).toContain("selected");

    expect(regionalNavlink().getAttribute("href")).toStrictEqual("/regional");
    expect(regionalNavlink().getAttribute("class")).not.toContain("selected");
  });

  it("regional default page", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/regional"]}>
          <DashboardNavbar darkmode={darkmode} />
        </MemoryRouter>,
        container
      );
    });

    expect(overviewNavlink().getAttribute("href")).toStrictEqual("/");
    expect(overviewNavlink().getAttribute("class")).not.toContain("selected");

    expect(regionalNavlink().getAttribute("href")).toStrictEqual("/regional");
    expect(regionalNavlink().getAttribute("class")).toContain("selected");
  });

  it("regional area page", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/regional/S08000026"]}>
          <DashboardNavbar darkmode={darkmode} />
        </MemoryRouter>,
        container
      );
    });

    expect(overviewNavlink().getAttribute("href")).toStrictEqual("/");
    expect(overviewNavlink().getAttribute("class")).not.toContain("selected");

    expect(regionalNavlink().getAttribute("href")).toStrictEqual("/regional");
    expect(regionalNavlink().getAttribute("class")).toContain("selected");
  });

  it("about page", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/about"]}>
          <DashboardNavbar darkmode={darkmode} />
        </MemoryRouter>,
        container
      );
    });

    expect(overviewNavlink().getAttribute("href")).toStrictEqual("/");
    expect(overviewNavlink().getAttribute("class")).not.toContain("selected");

    expect(regionalNavlink().getAttribute("href")).toStrictEqual("/regional");
    expect(regionalNavlink().getAttribute("class")).not.toContain("selected");
  });
});

describe("darkmode button", () => {
  const darkmodeButton = () => container.querySelector(".darkmode-btn-toggle");
  var storedDarkmode = false;
  const darkmode = {
    value: storedDarkmode,
    toggle: () => (storedDarkmode = !storedDarkmode),
  };

  it("darkmode button", () => {
    act(() => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <DashboardNavbar darkmode={darkmode} />
        </MemoryRouter>,
        container
      );
    });
    expect(storedDarkmode).toStrictEqual(false);

    darkmodeButton().dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(storedDarkmode).toStrictEqual(true);
    darkmodeButton().dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(storedDarkmode).toStrictEqual(false);
  });

  it("darkmode button initial value dark", () => {
    darkmode.value = true
    storedDarkmode = true

    act(() => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <DashboardNavbar darkmode={darkmode} />
        </MemoryRouter>,
        container
      );
    });
    
    darkmodeButton().dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(storedDarkmode).toStrictEqual(false);
    darkmodeButton().dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(storedDarkmode).toStrictEqual(true);
  });
});

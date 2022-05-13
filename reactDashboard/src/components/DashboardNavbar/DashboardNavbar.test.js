import React from "react";
import DashboardNavbar from "./DashboardNavbar";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";

var container = null;
var root = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  // cleanup on exiting
  root.unmount(container);
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
      root.render(
        <MemoryRouter initialEntries={["/"]}>
          <DashboardNavbar darkmode={darkmode} />
        </MemoryRouter>
      );
    });

    expect(overviewNavlink().getAttribute("href")).toStrictEqual("/");
    expect(overviewNavlink().getAttribute("class")).toContain("active");

    expect(regionalNavlink().getAttribute("href")).toStrictEqual("/regional");
    expect(regionalNavlink().getAttribute("class")).not.toContain("active");
  });

  it("regional default page", async () => {
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={["/regional"]}>
          <DashboardNavbar darkmode={darkmode} />
        </MemoryRouter>
      );
    });

    expect(overviewNavlink().getAttribute("href")).toStrictEqual("/");
    expect(overviewNavlink().getAttribute("class")).not.toContain("active");

    expect(regionalNavlink().getAttribute("href")).toStrictEqual("/regional");
    expect(regionalNavlink().getAttribute("class")).toContain("active");
  });

  it("regional area page", async () => {
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={["/regional/S08000026"]}>
          <DashboardNavbar darkmode={darkmode} />
        </MemoryRouter>
      );
    });

    expect(overviewNavlink().getAttribute("href")).toStrictEqual("/");
    expect(overviewNavlink().getAttribute("class")).not.toContain("active");

    expect(regionalNavlink().getAttribute("href")).toStrictEqual("/regional");
    expect(regionalNavlink().getAttribute("class")).toContain("active");
  });

  it("about page", async () => {
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={["/about"]}>
          <DashboardNavbar darkmode={darkmode} />
        </MemoryRouter>
      );
    });

    expect(overviewNavlink().getAttribute("href")).toStrictEqual("/");
    expect(overviewNavlink().getAttribute("class")).not.toContain("active");

    expect(regionalNavlink().getAttribute("href")).toStrictEqual("/regional");
    expect(regionalNavlink().getAttribute("class")).not.toContain("active");
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
      root.render(
        <MemoryRouter initialEntries={["/"]}>
          <DashboardNavbar darkmode={darkmode} />
        </MemoryRouter>
      );
    });
    expect(storedDarkmode).toStrictEqual(false);

    darkmodeButton().dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(storedDarkmode).toStrictEqual(true);
    darkmodeButton().dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(storedDarkmode).toStrictEqual(false);
  });

  it("darkmode button initial value dark", () => {
    darkmode.value = true;
    storedDarkmode = true;

    act(() => {
      root.render(
        <MemoryRouter initialEntries={["/"]}>
          <DashboardNavbar darkmode={darkmode} />
        </MemoryRouter>
      );
    });

    darkmodeButton().dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(storedDarkmode).toStrictEqual(false);
    darkmodeButton().dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(storedDarkmode).toStrictEqual(true);
  });
});

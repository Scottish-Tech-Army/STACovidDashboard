import React from "react";
import DashboardNavbar from "./DashboardNavbar";
import { MemoryRouter } from "react-router-dom";
import { renderWithUser } from "../../ReactTestUtils";
import { render } from "@testing-library/react";

const findNavlink = (linkText) =>
  Array.from(document.querySelectorAll(".navbar-links a.nav-link")).find(
    (el) => el.textContent === linkText
  );
const overviewNavlink = () => findNavlink("Summary Statistics");
const regionalNavlink = () => findNavlink("Regional Insights");

describe("nav links content and highlighting", () => {
  const darkmode = { value: false };

  it("summary page", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <DashboardNavbar darkmode={darkmode} />
      </MemoryRouter>
    );

    expect(overviewNavlink().getAttribute("href")).toBe("/");
    expect(overviewNavlink().getAttribute("class")).toContain("selected");

    expect(regionalNavlink().getAttribute("href")).toBe("/regional");
    expect(regionalNavlink().getAttribute("class")).not.toContain("selected");
  });

  it("regional default page", async () => {
    render(
      <MemoryRouter initialEntries={["/regional"]}>
        <DashboardNavbar darkmode={darkmode} />
      </MemoryRouter>
    );

    expect(overviewNavlink().getAttribute("href")).toBe("/");
    expect(overviewNavlink().getAttribute("class")).not.toContain("selected");

    expect(regionalNavlink().getAttribute("href")).toBe("/regional");
    expect(regionalNavlink().getAttribute("class")).toContain("selected");
  });

  it("regional area page", async () => {
    render(
      <MemoryRouter initialEntries={["/regional/S08000026"]}>
        <DashboardNavbar darkmode={darkmode} />
      </MemoryRouter>
    );

    expect(overviewNavlink().getAttribute("href")).toBe("/");
    expect(overviewNavlink().getAttribute("class")).not.toContain("selected");

    expect(regionalNavlink().getAttribute("href")).toBe("/regional");
    expect(regionalNavlink().getAttribute("class")).toContain("selected");
  });

  it("about page", async () => {
    render(
      <MemoryRouter initialEntries={["/about"]}>
        <DashboardNavbar darkmode={darkmode} />
      </MemoryRouter>
    );

    expect(overviewNavlink().getAttribute("href")).toBe("/");
    expect(overviewNavlink().getAttribute("class")).not.toContain("selected");

    expect(regionalNavlink().getAttribute("href")).toBe("/regional");
    expect(regionalNavlink().getAttribute("class")).not.toContain("selected");
  });
});

describe("darkmode button", () => {
  const darkmodeButton = () => document.querySelector(".darkmode-btn-toggle");
  let storedDarkmode;
  const darkmode = {
    value: false,
    toggle: () => (storedDarkmode = !storedDarkmode),
  };

  it("darkmode button", async () => {
    storedDarkmode = false;
    const { user } = renderWithUser(
      <MemoryRouter initialEntries={["/"]}>
        <DashboardNavbar darkmode={darkmode} />
      </MemoryRouter>
    );

    expect(storedDarkmode).toBe(false);

    await user.click(darkmodeButton());
    expect(storedDarkmode).toBe(true);
    await user.click(darkmodeButton());
    expect(storedDarkmode).toBe(false);
  });

  it("darkmode button initial value dark", async () => {
    darkmode.value = true;
    storedDarkmode = true;

    const { user } = renderWithUser(
      <MemoryRouter initialEntries={["/"]}>
        <DashboardNavbar darkmode={darkmode} />
      </MemoryRouter>
    );

    await user.click(darkmodeButton());
    expect(storedDarkmode).toBe(false);
    await user.click(darkmodeButton());
    expect(storedDarkmode).toBe(true);
  });
});

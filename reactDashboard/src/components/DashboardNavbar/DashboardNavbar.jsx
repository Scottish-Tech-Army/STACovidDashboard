import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DashboardNavbar.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { URL_OVERVIEW, URL_REGIONAL } from "../../pages/PageConsts";
import { NavLink, Link } from "react-router-dom";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import SvgIcon from "../Utils/SvgIcon";

const DashboardNavbar = ({ darkmode }) => {
  const [expanded, setExpanded] = useState(false);

  function navLink(pageUrl, title) {
    return (
      <NavLink
        className="nav-link"
        to={pageUrl}
        activeClassName="selected"
        onClick={() => setExpanded(false)}
      >
        {title}
      </NavLink>
    );
  }

  const darkmodeIcon = (className) => {
    return (
      <div onClick={() => darkmode.toggle()}>
        <SvgIcon
          faIcon={darkmode.value ? faSun : faMoon}
          className={className}
        />
      </div>
    );
  };

  return (
    <Navbar className="dashboard-navbar" expand="sm" expanded={expanded}>
      <Link to={URL_OVERVIEW}>
        <img
          id="logo"
          src={process.env.PUBLIC_URL + "/STALogoSquare.svg"}
          alt="Scottish Tech Army Logo"
        />
      </Link>
      <Nav className="hide-darkmode">{darkmodeIcon("darkmode-btn-toggle")}</Nav>
      <Navbar.Toggle
        aria-controls="basic-navbar-nav"
        onClick={() => setExpanded((value) => !value)}
      />
      <Navbar.Collapse id="basic-navbar-nav">
        <Navbar.Brand className="heading-container">
          <h1 aria-hidden={true} className="heading">
            Scottish COVID-19 Statistics
          </h1>
        </Navbar.Brand>
        <Nav className="navbar-links">
          {navLink(URL_OVERVIEW, "Summary Statistics")}
          {navLink(URL_REGIONAL, "Regional Insights")}
        </Nav>
      </Navbar.Collapse>
      {darkmodeIcon("darkmode-btn")}
    </Navbar>
  );
};

export default DashboardNavbar;

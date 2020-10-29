import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DashboardNavbar.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { URL_OVERVIEW, URL_REGIONAL } from "../../pages/PageConsts";
import { NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudSun } from "@fortawesome/free-solid-svg-icons";
import { faCloudMoon } from "@fortawesome/free-solid-svg-icons";

const DashboardNavbar = ({ darkmode, setDarkmode }) => {
  function navLink(pageUrl, title, exact = true) {
    return (
      <NavLink
        className="nav-link"
        to={pageUrl}
        exact={exact}
        activeClassName="selected"
      >
        {title}
      </NavLink>
    );
  }

  return (
    <Navbar className="dashboard-navbar" expand="sm">
      <Link to={URL_OVERVIEW}>
        <img
          id="logo"
          src="/Square avatar trimmed.svg"
          alt="Scottish Tech Army Logo"
        />
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="heading-container">
        <Navbar.Brand className="heading">
          <h1>Scottish COVID-19 Statistics</h1>
        </Navbar.Brand>
        <Nav className="navbar-links">
          {navLink(URL_OVERVIEW, "Summary Dashboard")}
          {navLink(URL_REGIONAL, "Regional Insights", false)}
        </Nav>
      </Navbar.Collapse>
      <FontAwesomeIcon
        icon={faCloudSun}
        className="dark-mode-btn"
        size="2x"
        onClick={() => setDarkmode((value) => !value)}
      />
    </Navbar>
  );
};

export default DashboardNavbar;

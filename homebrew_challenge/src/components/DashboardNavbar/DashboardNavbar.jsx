import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DashboardNavbar.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { PAGE_OVERVIEW, PAGE_REGIONAL } from "../../pages/PageConsts";

const DashboardNavbar = ({ currentPage, setCurrentPage }) => {
  function navLink(pageId, title) {
    return (
      <Nav.Link
        disabled={currentPage === pageId}
        onClick={(event) => {
          setCurrentPage(pageId);
          event.target.blur();
        }}
        className="nav-page-link"
      >
        {title}
      </Nav.Link>
    );
  }

  return (
    <Navbar className="dashboard-navbar" bg="white" expand="sm">
      <img
        onClick={() => setCurrentPage(PAGE_OVERVIEW)}
        id="logo"
        src="STALogo.png"
        alt="Scottish Tech Army Logo"
      />
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="heading-container">
        <Navbar.Brand className="heading">
          <h1>Scottish COVID-19 Statistics</h1>
        </Navbar.Brand>
        <Nav className="navbar-links">
          {navLink(PAGE_OVERVIEW, "Summary Dashboard")}
          {navLink(PAGE_REGIONAL, "Regional Insights")}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default DashboardNavbar;

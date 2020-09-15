import React from "react";
import "./Header.css";
import {
  PAGE_ABOUT_US,
  PAGE_ACCESSIBILITY,
  PAGE_DATA_SOURCES,
  PAGE_OVERVIEW,
  PAGE_REGIONAL,
} from "../../pages/PageConsts";

function Header({ pageTitle }, { setCurrentPage }) {
  return (
    <header>
      <div className="heading-container">
        <div className="heading">
          <img
            onClick={() => setCurrentPage(PAGE_OVERVIEW)}
            id="logo"
            src="STALogo.png"
            alt="Scottish Tech Army Logo"
          />
        </div>
        <div className="heading heading-title">
          <h1>Scottish COVID-19 Statistics</h1>
          <h2>{pageTitle()}</h2>
        </div>
      </div>
    </header>
  );
}
export default Header;

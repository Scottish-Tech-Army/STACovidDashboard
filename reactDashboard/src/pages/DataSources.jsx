import React from "react";
import DataDefinitions from "../components/DataDefinitions/DataDefinitions";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const DataSources = () => {
  return (
    <div className="data-sources">
      <hr className="full-width-hr" />
      <h1>Data sources and attributions</h1>
      <ul className="data-sources-list">
        <li>
          Data source:{" "}
          <a
            href={"https://www.opendata.nhs.scot/dataset/covid-19-in-scotland"}
            target="_blank"
            rel="noopener noreferrer"
            className="link "
          >
            Public Health Scotland
          </a>
        </li>
        <li>
          Health Board Shapefile:{" "}
          <a
            href={
              "https://data.gov.uk/dataset/27d0fe5f-79bb-4116-aec9-a8e565ff756a/nhs-health-boards"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="link "
          >
            Scottish Government SpatialData.gov.scot
          </a>
        </li>
        <li>
          Council Area Shapefile:{" "}
          <a
            href={"https://osdatahub.os.uk/downloads/open/BoundaryLine"}
            target="_blank"
            rel="noopener noreferrer"
            className="link "
          >
            Ordnance Survey Data Hub
          </a>
        </li>
      </ul>
      <hr className="full-width-hr" />
      <DataDefinitions />
    </div>
  );
};

export default DataSources;

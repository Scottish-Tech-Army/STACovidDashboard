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
        {/* <li>
          Routemap information:
          <a
            href={
              "https://www.gov.scot/publications/coronavirus-covid-19-what-you-can-and-cannot-do/pages/overview/"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="link "
          >
            https://www.gov.scot/publications/coronavirus-covid-19-what-you-can-and-cannot-do/pages/overview/
          </a>
        </li> */}
        <li>
          Data source:{" "}
          <a
            href={"https://www.opendata.nhs.scot/dataset/covid-19-in-scotland"}
            target="_blank"
            rel="noopener noreferrer"
            className="link "
          >
            https://www.opendata.nhs.scot/dataset/covid-19-in-scotland
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
            https://data.gov.uk/dataset/27d0fe5f-79bb-4116-aec9-a8e565ff756a/nhs-health-boards
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
            https://osdatahub.os.uk/downloads/open/BoundaryLine
          </a>
        </li>
      </ul>
      <hr className="full-width-hr" />
      <DataDefinitions />
    </div>
  );
};

export default DataSources;

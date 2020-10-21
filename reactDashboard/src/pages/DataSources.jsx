import React from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const DataSources = () => {
  return (
    <div className="data-sources">
      <h1>Data sources and attributions</h1>
      <hr className="full-width-hr" />
      <ul>
        <li>
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
        </li>
        <li>
          Management Data:{" "}
          <a
            href={
              "https://statistics.gov.scot/data/coronavirus-covid-19-management-information"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="link "
          >
            https://statistics.gov.scot/data/coronavirus-covid-19-management-information
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
          Intermediate Deaths:{" "}
          <a
            href={
              "https://www.nrscotland.gov.uk/statistics-and-data/statistics/statistics-by-theme/vital-events/general-publications/weekly-and-monthly-data-on-births-and-deaths/deaths-involving-coronavirus-covid-19-in-scotland/archive"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="link "
          >
            https://www.nrscotland.gov.uk/statistics-and-data/statistics/statistics-by-theme/vital-events/general-publications/weekly-and-monthly-data-on-births-and-deaths/deaths-involving-coronavirus-covid-19-in-scotland/archive
          </a>
        </li>
        <li>
          Intermediate Zone Shapefile:{" "}
          <a
            href={
              "https://data.gov.uk/dataset/133d4983-c57d-4ded-bc59-390c962ea280/intermediate-zone-boundaries-2011"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="link "
          >
            https://data.gov.uk/dataset/133d4983-c57d-4ded-bc59-390c962ea280/intermediate-zone-boundaries-2011
          </a>
        </li>
        <li>
          Explanation of the IZ coded zones:{" "}
          <a
            href={
              "https://www2.gov.scot/Topics/Statistics/sns/SNSRef/DZresponseplan"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="link "
          >
            https://www2.gov.scot/Topics/Statistics/sns/SNSRef/DZresponseplan
          </a>
        </li>
        <li>
          Cardiovascular Prescriptions:{" "}
          <a
            href={"https://scotland.shinyapps.io/phs-covid-wider-impact/"}
            target="_blank"
            rel="noopener noreferrer"
            className="link "
          >
            https://scotland.shinyapps.io/phs-covid-wider-impact/
          </a>
        </li>
      </ul>
      <hr />
      <div className="footnote-container">
        <h5 className="footnote-heading">Understanding the dates:</h5>
        <p>
          There may be some minor fluctuations in the daily number of cases due
          to laboratory reporting delays for specimen dates and additional
          information becoming available, in which case the data is revised in a
          future next update.{" "}
          <a
            href="https://www.opendata.nhs.scot/dataset/covid-19-in-scotland"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Click here for further information relating to the accuracy and
            completeness of the Public Health Scotland Covid-19 dataset.
          </a>
        </p>
        <ul>
          <li>
            <span className="defined-term">Reported Dates</span>: Since the time
            taken to test samples and report the results varies, new cases
            reported on a daily basis in the headline summary figures on the dashboard pages may
            be distributed across a range of Specimen Dates.
          </li>
          <li>
            <span className="defined-term">Specimen Dates</span>: The specimen
            date is the date the sample was collected from the patient. The
            specimen date is used in the map, heatmap table and chart components
            within the STA Summary Dashboard Page, and the chart component
            within the Regional Insights Dashboard Page to show the number of
            test samples taken and % positive samples for each day. This is the
            date most suited for surveillance to show trends of COVID-19 over a
            period of time.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DataSources;

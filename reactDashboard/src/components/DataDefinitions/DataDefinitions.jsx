import React from "react";
import "./DataDefinitions.css";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import {
  URL_OVERVIEW,
  URL_REGIONAL,
  URL_DATA_SOURCES,
} from "../../pages/PageConsts";
import { Switch, Route } from "react-router-dom";

function DataDefinitions() {
  const DATA_DEFINITIONS_PREAMBLE =
    "There may be some minor fluctuations in the daily number of cases due to laboratory reporting delays for specimen dates and additional information becoming available, in which case the data is revised in a future next update.";

  function reportingDateDefinition() {
    return (
      <li>
        <span className="defined-term">Reported Dates</span>: Since the time
        taken to test samples and report the results varies, new cases reported
        on a daily basis in the headline summary figures on the dashboard pages
        may be distributed across a range of Specimen Dates.
      </li>
    );
  }

  const OVERVIEW_TEXT_VARIABLE =
    "map, heatmap table and chart components within the STA Summary Dashboard Page to show the number of % positive samples for each day and";
  const REGIONAL_TEXT_VARIABLE =
    "chart component within the STA Regional Insights Dashboard Page to show the";
  const DATA_SOURCES_TEXT_VARIABLE = "map, heatmap table and chart components within the STA Summary Dashboard Page, and the chart component within the Regional Insights Dashboard Page to show the % positive samples for each day and";

  function specimenDateDefinition(pageVariableText) {
    return (
      <li>
        <span className="defined-term">Specimen Dates</span>: The specimen date
        is the date the sample was collected from the patient. The specimen date
        is used in the {pageVariableText} number of test samples taken for each
        day. This is the date most suited for surveillance to show trends of
        COVID-19 over a period of time.
      </li>
    );
  }

  function createLink(url, text) {
    return (
      <a
        className="footer-link"
        target="_blank"
        rel="noopener noreferrer"
        href={url}
      >
        {text}
      </a>
    );
  }

  return (
    <Accordion>
      <Card>
        <Card.Header className="accordion-header">
          <Accordion.Toggle as={Button} variant="link" eventKey="0">
            Understanding the dates
          </Accordion.Toggle>
          <Accordion.Toggle as={Button} variant="link" eventKey="0">
            <FontAwesomeIcon
              icon={faAngleDown}
              className="data-accordion-toggle-down"
              size="1x"
              color="#000000"
            />
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <Switch>
              <Route exact path={URL_OVERVIEW}>
                <p>
                  {DATA_DEFINITIONS_PREAMBLE}{" "}
                  {createLink(
                    "https://www.opendata.nhs.scot/dataset/covid-19-in-scotland",
                    "Click here for further information relating to the accuracy and completeness of the Public Health Scotland Covid-19 dataset."
                  )}
                </p>
                <ul className="footnote-container">
                  {reportingDateDefinition()}
                  {specimenDateDefinition(OVERVIEW_TEXT_VARIABLE)}
                </ul>
              </Route>
              <Route exact path={URL_REGIONAL}>
                <p>
                  {DATA_DEFINITIONS_PREAMBLE}{" "}
                  {createLink(
                    "https://www.opendata.nhs.scot/dataset/covid-19-in-scotland",
                    "Click here for further information relating to the accuracy and completeness of the Public Health Scotland Covid-19 dataset."
                  )}
                </p>
                <ul>
                  {reportingDateDefinition()}
                  {specimenDateDefinition(REGIONAL_TEXT_VARIABLE)}
                </ul>
              </Route>
              <Route exact path={URL_DATA_SOURCES}>
                <p>
                  {DATA_DEFINITIONS_PREAMBLE}{" "}
                  {createLink(
                    "https://www.opendata.nhs.scot/dataset/covid-19-in-scotland",
                    "Click here for further information relating to the accuracy and completeness of the Public Health Scotland Covid-19 dataset."
                  )}
                </p>
                <ul>
                  {reportingDateDefinition()}
                  {specimenDateDefinition(DATA_SOURCES_TEXT_VARIABLE)}
                </ul>
              </Route>
            </Switch>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}

export default DataDefinitions;

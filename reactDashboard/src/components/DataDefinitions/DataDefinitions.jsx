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
  function createLink(url, text) {
    return (
      <a
        className="data-definitions-link"
        target="_blank"
        rel="noopener noreferrer"
        href={url}
      >
        {text}
      </a>
    );
  }

  function specimenDateDefinition() {
    return (
      <Switch>
        <Route exact path={URL_OVERVIEW}>
          The specimen date is the date the sample was collected from the
          patient. The specimen date is used in the map, heatmap table and chart
          components within the STA Summary Dashboard Page to show the number of
          % positive samples for each day and number of test samples taken for
          each day. This is the date most suited for surveillance to show trends
          of COVID-19 over a period of time.
        </Route>
        <Route exact path={URL_REGIONAL}>
          The specimen date is the date the sample was collected from the
          patient. The specimen date is used in the chart component within the
          STA Regional Insights Dashboard Page to show the number of test
          samples taken for each day. This is the date most suited for
          surveillance to show trends of COVID-19 over a period of time.
        </Route>
        <Route exact path={URL_DATA_SOURCES}>
          The specimen date is the date the sample was collected from the
          patient. The specimen date is used in the map, heatmap table and chart
          components within the STA Summary Dashboard Page, and the chart
          component within the Regional Insights Dashboard Page to show the %
          positive samples for each day and number of test samples taken for
          each day. This is the date most suited for surveillance to show trends
          of COVID-19 over a period of time.
        </Route>
      </Switch>
    );
  }

  return (
    <Accordion className="data-definitions">
      <Card>
        <Card.Header className="accordion-header">
          <Accordion.Toggle as={Button} variant="link" eventKey="0">
            Understanding the dates
          </Accordion.Toggle>
          <Accordion.Toggle as={Button} variant="link" eventKey="0">
            <FontAwesomeIcon
              icon={faAngleDown}
              className="data-accordion-toggle-down"
              size="3x"
              color="#000000"
            />
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body className="data-definitions-body">
            <p>
              There can be reporting delays by NHS Labs or UK Government Testing into the HPS database.  On average it is a 2-3 day lag for 90% of tests.  Positive results with a specimen date during the most recent 10 day period may be subject to change due to re-testing in some instances to ensure that an initially detected positive result is a true positive.
            </p>
            <hr/>
            <ul>
              <li>
                <span className="defined-term">Reported Dates</span>: Since the
                time taken to test samples and report the results varies, new
                cases reported on a daily basis in the headline summary figures
                on the dashboard pages may be distributed across a range of
                specimen dates.
              </li>
              <li>
                <span className="defined-term">Specimen Dates</span>:{" "}
                {specimenDateDefinition()}
              </li>
            </ul>
            <p>
              {createLink(
                "https://www.opendata.nhs.scot/dataset/covid-19-in-scotland",
                "Click here for further information relating to the accuracy and completeness of the Public Health Scotland Covid-19 dataset."
              )}
            </p>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}

export default DataDefinitions;

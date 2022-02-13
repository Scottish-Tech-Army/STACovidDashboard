import React, { useContext } from "react";
import "./DataDefinitions.css";
import Accordion from "react-bootstrap/Accordion";
import AccordionContext from "react-bootstrap/AccordionContext";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import Card from "react-bootstrap/Card";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import {
  URL_OVERVIEW,
  URL_REGIONAL,
  URL_DATA_SOURCES,
} from "../../pages/PageConsts";
import { Switch, Route } from "react-router-dom";
import SvgIcon from "../Utils/SvgIcon";

function ContextAwareToggle({ children, callback }) {
  const  { activeEventKey } = useContext(AccordionContext);

  const decoratedOnClick = useAccordionButton(
    "0",
    () => callback && callback("0")
  );

  const isCurrentEventKey = activeEventKey === "0";

  return (
    <Card.Header className="accordion-header" onClick={decoratedOnClick}>
      <h2>Understanding the data</h2>
      <SvgIcon
        faIcon={isCurrentEventKey ? faAngleUp : faAngleDown}
        className="data-accordion-toggle"
        size="3"
      />
    </Card.Header>
  );
}

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
        <Route path={URL_REGIONAL}>
          The specimen date is the date the sample was collected from the
          patient. The specimen date is used in the chart component within the
          STA Regional Insights Dashboard Page to show the number of test
          samples taken for each day, and is also used for the weekly headline
          figures i.e. totals over the last 7 days. This is the date most suited
          for surveillance to show trends of COVID-19 over a period of time.
        </Route>
        <Route exact path={URL_DATA_SOURCES}>
          The specimen date is the date the sample was collected from the
          patient. The specimen date is used in the following components:-{" "}
          <ul>
            <li>
              <b>STA Summary Page</b>: (a) the map; (b) the heatmap table; and
              (c) the chart component.
            </li>
            <li>
              <b>Regional Insights Page</b>: (a) the chart component to show the
              % positive samples for each day and number of test samples taken
              for each day; and (b) the weekly headline figures i.e. totals over
              the last 7 days. This is the date most suited for surveillance to
              show trends of COVID-19 over a period of time.
            </li>
          </ul>
        </Route>
      </Switch>
    );
  }

  return (
    <Accordion className="data-definitions">
      <Card>
        <ContextAwareToggle />
        <Accordion.Collapse eventKey="0">
          <Card.Body className="data-definitions-body">
            <p className="definitions-heading">Reporting and Specimen Dates</p>
            <hr aria-hidden={true} />
            <p>
              <strong>Reported Dates</strong>: Since the time taken to test
              samples and report the results varies, new cases reported on a
              daily basis in the headline summary figures on the dashboard pages
              may be distributed across a range of specimen dates.
            </p>
            <br />
            <p>
              <strong>Specimen Dates</strong>: {specimenDateDefinition()}
            </p>
            <p>
              There is a reporting delay in testing results, so data on tests
              carried out in the most recent 2-3 days will be incomplete. On
              average 90% of tests carried out are reported to Public Health
              Scotland within 2 days. Positive results with a specimen date
              during the most recent 10 day period may be subject to change due
              to re-testing in some instances to ensure that an initially
              detected positive result is a true positive.{" "}
              <span>
                <a href="https://public.tableau.com/profile/phs.covid.19#!/vizhome/COVID-19DailyDashboard_15960160643010/Overview">
                  <cite className="source-attribution">Source PHS</cite>
                </a>
              </span>
            </p>
            <hr aria-hidden={true} />
            <p className="definitions-heading">
              Total Counts for Health Boards and Council Areas
            </p>
            <hr aria-hidden={true} />
            <p className="definition-paragraph">
              NHS Board is assigned in the laboratory dataset and is based on
              postcode of residence, or if postcode is missing to the NHS Board
              of submitting laboratory. Otherwise, Local Authority has been
              derived from residential postcode. PHS will try to determine
              postcode via CHI linkage, but where postcode is missing no Local
              Authority is assigned. This approach means that in a small number
              of cases, the Local Authority total may not be exactly the same as
              the sum of neighbourhood totals within it. The CHI database is
              updated monthly, which can affect the allocation of individuals to
              areas. This may affect trend comparisons for the numbers of cases
              tested by Local Authority.{" "}
              <span>
                <a href="https://public.tableau.com/profile/phs.covid.19#!/vizhome/COVID-19DailyDashboard_15960160643010/Overview">
                  <cite className="source-attribution">Source PHS</cite>
                </a>
              </span>
            </p>
            <p className="definition-paragraph">
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

import React from "react";
import "./RouteMapRules.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { URL_OVERVIEW, URL_REGIONAL } from "../../pages/PageConsts";
import { Switch, Route } from "react-router-dom";

const RouteMapRules = () => {
  function createLink(url, text) {
    return (
      <a
        className="link"
        id="link"
        target="_blank"
        rel="noopener noreferrer"
        href={url}
      >
        {text}
      </a>
    );
  }
  return (
    <Container fluid className="d-flex flex-column">
      <Row fluid>
        <Col className="hr-container">
          <hr className="full-width-hr" />
        </Col>
      </Row>
      <Row>
        <Col xs="12" className="headline-banner">
          <Switch>
            <Route exact path={URL_OVERVIEW}>
              <h2>
                We are currently in{" "}
                <span className="headline-banner-highlight">Phase 3</span> of
                the Scottish Government's{" "}
                {createLink(
                  "https://www.gov.scot/coronavirus-covid-19/",
                  "COVID-19 Route Map"
                )}
              </h2>
            </Route>
            <Route path={URL_REGIONAL}>
              <h2>
                There are a number of{" "}
                <span className="headline-banner-highlight">
                  Regional Restrictions
                </span>{" "}
                in place to help fight the pandemic. See the{" "}
                {createLink(
                  "https://www.gov.scot/publications/coronavirus-covid-19-local-measures/",
                  "latest Scottish Government guidance"
                )}
                .
              </h2>
            </Route>
          </Switch>
        </Col>
      </Row>
    </Container>
  );
};

export default RouteMapRules;

import React, { useState, useEffect } from "react";
import "./RouteMapRules.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const RouteMapRules = () => {
  // set default phase here
  const [phase, setPhase] = useState("phase1");


  const phaseText = {
    lockdown: {
      introText: "l-intro",
      cat1: "l1",
      cat2: "l2",
      cat3: "l3",
      cat4: "l4"
    },
    phase1: {
      introText: "p1-intro",
      cat1:
        "Maintain social distancing, keeping 2m from people not in your household.",
      cat2: "You can meet one other household outdoors.",
      cat3: "Unrestricted trips outdoors for exercise.",
      cat4: "Frequent handwashing and hygiene measures for al (Call me Al :) )."
    },
    phase2: {
      introText: "Scotland moved to Phase 2 of the routemap on 19 June 2020.",
      cat1:
        "Maintain social distancing, keeping 2m from people not in your household",
      cat2: "You can meet with people from another two households inside.",
      cat3:
        "You must wear a face covering when using public transport or in shops.",
      cat4: "Non-essential retail can open with safeguards in place."
    },
    phase3: {
      introText: "",
      cat1:
        "Maintain social distancing, keeping 2m from people not in your household",
      cat2:
        "Able to meet with people from more than one household indoors with physical distancing and hygiene measure ",
      cat3:
        "Museums, galleries, libraries, cinemas open, subject to physical distancing and hygience measures.",
      cat4: "Hotels, campsites, B&Bs can open with safeguards in place."
    },
    phase4: {
      introText: "",
      cat1: "Frequent handwashing and hygiene measures for al (call me Al :) )",
      cat2: "Further relaxation on restrictions on gathering.",
      cat3:
        "Schools and childcare provision, operating with any necessary precaution.",
      cat4:
        "Further relaxation of restrictions on live events in line with public health advice."
    }
  };

  // onSelect (eventKey: any, event: Object) => any
  function selectPhase(phase, evt) {
    evt.preventDefault();
    setPhase(phase);
  }

  return (
    <Container fluid className="route-map-rules">
      <Row
        className="d-flex justify-content-center intro-text"
      >
        Scotland moved to Phase 2 of the routemap on 19 June 2020.
      </Row>
      <Row
        className="d-flex flex-row"
      >
        <Col sm="12" md="2">
          <Row
            className="d-flex flex-column phase-bar"
          >
            <Col
              className="phase"
              id="lockdown"
            >
              Lockdown
            </Col>
            <Col
              className="phase"
              id="phase-1"
            >
              Phase 1
            </Col>
            <Col
              className="phase"
              id="phase-2"
            >
              Phase 2
            </Col>
            <Col
              className="phase"
              id="phase-3"
            >
              Phase 3
            </Col>
            <Col
              className="phase"
              id="phase-4"
            >
              Phase 4
            </Col>
          </Row>
        </Col>
        <Col sm="12" md="10">
          <Row>
            <Col
              className="category d-flex flex-column"
            >
              <img className="category-icon" src="./larger_crowd.png" />
              <span>Maintain social distancing, keeping 2m from people not in your household.
              </span>
            </Col>
            <Col
              className="category d-flex flex-column"
            >
              <img className="category-icon" src="./meet_other_households_outdoors.png" />
              <span>You can meet with people from another two households inside.</span>
            </Col>
            <Col
              className="category d-flex flex-column"
            >
              <img className="category-icon" src="./museum.png" />
              <span>You must wear a face covering when using public transport or in shops.</span>
            </Col>
            <Col
              className="category d-flex flex-column"
            >
              <img className="category-icon" src="./outdoor_sports.png" />
              <span>Further relaxation of restrictions on live events in line with public health advice.</span>
            </Col>
            <Col
              className="category d-flex flex-column"
            >
              <a
                className="route-map-link"
                href="https://www.gov.scot/publications/coronavirus-covid-19-what-you-can-and-cannot-do/pages/overview/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  className="d-sm-block"
                  icon={faCircle}
                  size="3x"
                  color="#319bd5"
                  alt="link to Scottish Government further guidance"
                />
                <span className="headline">
                  View the full Scottish Government guidance here.
                </span>
              </a>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default RouteMapRules;

import React, { useState, useEffect } from "react";
import "./RouteMapRules.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";


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
      cat1: "Maintain social distancing, keeping 2m from people not in your household.",
      cat2: "You can meet one other household outdoors.",
      cat3: "Unrestricted trips outdoors for exercise.",
      cat4: "Frequent handwashing and hygiene measures for al (Call me Al :) )."
    },
    phase2: {
      introText: "Scotland moved to Phase 2 of the routemap on 19 June 2020.",
      cat1: "Maintain social distancing, keeping 2m from people not in your household",
      cat2: "You can meet with people from another two households inside.",
      cat3: "You must wear a face covering when using public transport or in shops.",
      cat4: "Non-essential retail can open with safeguards in place."
    },
    phase3: {
      introText: "",
      cat1: "Maintain social distancing, keeping 2m from people not in your household",
      cat2: "Able to meet with people from more than one household indoors with physical distancing and hygiene measure ",
      cat3: "Museums, galleries, libraries, cinemas open, subject to physical distancing and hygience measures.",
      cat4: "Hotels, campsites, B&Bs can open with safeguards in place."
    },
    phase4: {
      introText: "",
      cat1: "Frequent handwashing and hygiene measures for al (call me Al :) )",
      cat2: "Further relaxation on restrictions on gathering.",
      cat3: "Schools and childcare provision, operating with any necessary precaution.",
      cat4: "Further relaxation of restrictions on live events in line with public health advice."
    },
  }

  const phaseTitle = {
    lockdown: "Lockdown",
    phase1: "Phase 1",
    phase2: "Phase 2",
    phase3: "Phase 3",
    phase4: "Phase 4"
  }

  // onSelect (eventKey: any, event: Object) => any
  function selectPhase(phase, evt) {
    evt.preventDefault();
    setPhase(phase);
  }

  return (
    <Container fluid className="route-map-rules">
      <Row>
        <Col sm="12" md="2" className="select-phase">
          <span className="headline">
            {phaseText[phase].introText}
          </span>
          <DropdownButton id="dropdown-basic" title={phaseTitle[phase]}>
            <Dropdown.Item onSelect={selectPhase} eventKey="lockdown">
              Lockdown
            </Dropdown.Item>
            <Dropdown.Item onSelect={selectPhase} eventKey="phase1">
              Phase 1
            </Dropdown.Item>
            <Dropdown.Item onSelect={selectPhase} eventKey="phase2">
              Phase 2
            </Dropdown.Item>
            <Dropdown.Item onSelect={selectPhase} eventKey="phase3">
              Phase 3
            </Dropdown.Item>
            <Dropdown.Item onSelect={selectPhase} eventKey="phase4">
              Phase 4
            </Dropdown.Item>
          </DropdownButton>
        </Col>
        <Col xs="12" md="2">
        <span className="category">
          <FontAwesomeIcon  className="d-none d-sm-block"
            icon={faCircle}
            size="5x"
            color="#319bd5"
            alt="category 1"
          />
          <span className="headline">
            {phaseText[phase].cat1}
          </span>
          </span>
        </Col>
        <Col xs="12" md="2">
        <span className="category">
          <FontAwesomeIcon className="d-none d-sm-block"
            icon={faCircle}
            size="5x"
            color="#319bd5"
            alt="category 2"
          />
          <span className="headline">
            {phaseText[phase].cat2}
          </span>
          </span>
        </Col>
        <Col xs="12" md="2">
          <span className="category">
          <div className="d-none d-sm-block">
          <FontAwesomeIcon
            icon={faCircle}
            size="5x"
            color="#319bd5"
            alt="category 3"
          />
          </div>
          <span xs="12" className="headline">
            {phaseText[phase].cat3}
          </span>
          </span>
        </Col>
        <Col xs="12" md="2">
        <span className="category">
          <FontAwesomeIcon className="d-none d-sm-block"
            icon={faCircle}
            size="5x"
            color="#319bd5"
            alt="category 4"
          />
          <span className="headline">
            {phaseText[phase].cat4}
          </span>
          </span>
        </Col>
        <Col xs="12" md="2" className="more-info">
        <a
          className="route-map-link"
          href="https://www.gov.scot/publications/coronavirus-covid-19-what-you-can-and-cannot-do/pages/overview/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="headline">
            For more information on Phase 2 guidelines view the latest Scottish Government guidance.
            <FontAwesomeIcon className="d-sm-block"
              icon={faExternalLinkAlt}
              size="2x"
              color="#319bd5"
              alt="link to Scottish Government further guidance"
          />
          </span>
        </a>
        </Col>
      </Row>
    </Container>
  );
};

export default RouteMapRules;

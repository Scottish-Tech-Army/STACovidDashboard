import React, { useState } from 'react';
import './RouteMapRules.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

const RouteMapRules = () => {

  const [phase, setPhase] = useState("Phase 2");

  // onSelect (eventKey: any, event: Object) => any
  function selectPhase(phase, evt) {
      evt.preventDefault();
      setPhase(phase);
  };

  return (
    <Container fluid className="route-map-rules">
    <Row>
      <Col md="1" className="dropdown-col">
      <DropdownButton id="dropdown-basic-button" title={phase}>
        <Dropdown.Item onSelect={selectPhase} eventKey="Lockdown">Lockdown</Dropdown.Item>
        <Dropdown.Item onSelect={selectPhase}  eventKey="Phase 1">Phase 1</Dropdown.Item>
        <Dropdown.Item onSelect={selectPhase}  eventKey="Phase 2">Phase 2</Dropdown.Item>
        <Dropdown.Item onSelect={selectPhase}  eventKey="Phase 3">Phase 3</Dropdown.Item>
        <Dropdown.Item onSelect={selectPhase}  eventKey="Phase 4">Phase 4</Dropdown.Item>
      </DropdownButton>
      </Col>
      <Col>
        <Row md="11">
          <Col className="category-col">
          <span className="intro-text">
            Scotland moved to Phase 2 of the routemap on 19 June 2020.
          </span>
          </Col>
          <Col className="category-col">
            <FontAwesomeIcon
              icon={faCircle}
              size="3x"
              color="#319bd5"
              aria-hidden="true"
            />
          <span>
            Maintain social distancing, keeping 2m from people not in your household.
          </span>
          </Col>
          <Col className="category-col">
            <FontAwesomeIcon
              className="category-icon"
              icon={faCircle}
              size="3x"
              color="#319bd5"
              aria-hidden="true"
            />
            <span>
              You can meet up with people from another two households outside.
            </span>
          </Col>
          <Col className="category-col">
            <FontAwesomeIcon
              className="category-icon"
              icon={faCircle}
              size="3x"
              color="#319bd5"
              aria-hidden="true"
            />
            <span>
              You must wear a face covering when using Public Transport or in Shops.
            </span>
          </Col>
          <Col className="category-col">
            <FontAwesomeIcon
              className="category-icon"
              icon={faCircle}
              size="3x"
              color="#319bd5"
              aria-hidden="true"
            />
            <span>
              Non Essential retail can open with safeguards in place.
            </span>
          </Col>
          <Col className="category-col">
            <span>
              For more information on Phase 2 guidelines view the latest Scottish Government guidance.
            </span>
            <span>
              More Info
            </span>
          </Col>
        </Row>
      </Col>
    </Row>
    </Container>
  );
};

// <i class="fa fa-circle" aria-hidden="true"></i>
// <i class="fa fa-angle-up" aria-hidden="true"></i>
// <i class="fa fa-angle-down" aria-hidden="true"></i>

export default RouteMapRules;

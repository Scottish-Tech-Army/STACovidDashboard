import React, { useState, useEffect } from "react";
import "./RouteMapRules.css";
import PhaseRules from "./PhaseRules";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import ListGroup from "react-bootstrap/ListGroup";

const RouteMapRules = () => {
  // set default phase here
  const [phase, setPhase] = useState("phase2");

  const phaseText = {
    lockdown: {
      introText: "UK wide lockdown in place from 24th March 2020.",
      cat1: [
        "Maintain strict social distancing, keeping 2m from people not from your household.",
        "./assets/social_distancing.png"
      ],
      cat2: [
        "Shielding of high risk individuals in line with public health advice.",
        "./assets/public_health_advice.png"
      ],
      cat3: [
        "Frequent handwashing and hygiene measures for all.",
        "./assets/washing_hands_dark.png"
      ],
      cat4: [
        "Schools and childcare services closed.",
        "./assets/school_roof_alt.png"
      ]
    },
    phase1: {
      introText: "Scotland moved to Phase 1 of the routemap on 29 May 2020.",
      cat1: [
        "Maintain social distancing, keeping 2m from people not in your household.",
        "./assets/social_distancing.png"
      ],
      cat2: [
        "You can meet one other household outdoors.",
        "./assets/households_outdoor.png"
      ],
      cat3: [
        "Unrestricted trips outdoors for exercise.",
        "./assets/exercising.png"
      ],
      cat4: [
        "Frequent handwashing and hygiene measures for all.",
        "./assets/washing_hands_dark.png"
      ]
    },
    phase2: {
      introText: "Scotland moved to Phase 2 of the routemap on 19 June 2020.",
      cat1: [
        "Maintain social distancing, keeping 2m from people not in your household.",
        "./assets/social_distancing.png"
      ],
      cat2: [
        "You can meet with people from another two households inside.",
        "./assets/household_meeting_alt.png"
      ],
      cat3: [
        "You must wear a face covering when using public transport or in shops.",
        "./assets/face_covering_alt.png"
      ],
      cat4: [
        "Non-essential retail can open with safeguards in place.",
        "./assets/shopping_centre.png"
      ]
    },
    phase3: {
      introText: "[Disclaimer]",
      cat1: [
        "Maintain social distancing, keeping 2m from people not in your household.",
        "./assets/social_distancing.png"
      ],
      cat2: [
        "Able to meet with people from more than one household indoors with physical distancing and hygiene measures still in place. ",
        "./assets/household_meeting_alt.png"
      ],
      cat3: [
        "Museums, galleries, libraries, cinemas open, subject to physical distancing and hygience measures.",
        "./assets/cinema_museum.png"
      ],
      cat4: [
        "Hotels, campsites, B&Bs can open with safeguards in place.",
        "./assets/hotels_campsites.png"
      ]
    },
    phase4: {
      introText: "[Disclaimer]",
      cat1: [
        "Maintain social distancing, keeping 2m from people not in your household.",
        "./assets/social_distancing.png"
      ],
      cat2: [
        "Further relaxation on restrictions on gathering.",
        "./assets/larger_gatherings.png"
      ],
      cat3: [
        "Schools and childcare provision, operating with any necessary precaution.",
        "./assets/school_roof_alt.png"
      ],
      cat4: [
        "Further relaxation of restrictions on live events in line with public health advice.",
        "./assets/larger_gatherings_alt.png"
      ]
    }
  };

  function selectPhase(phase) {
    setPhase(phase);
  }

  return (
    <Container fluid className="route-map-rules">
      <Row>
        <Col xs="12" lg="2" className="select-phase">
          <ToggleButtonGroup
            className="d-flex flex-column"
            name="phase"
            type="radio"
            value={phase}
            onChange={val => setPhase(val)}
          >
            <ToggleButton id="lockdown" value={"lockdown"}>
              Lockdown
            </ToggleButton>
            <ToggleButton id="phase-1" value={"phase1"}>
              Phase 1
            </ToggleButton>
            <ToggleButton id="phase-2" value={"phase2"}>
              Phase 2
            </ToggleButton>
            <ToggleButton id="phase-3" value={"phase3"}>
              Phase 3
            </ToggleButton>
            <ToggleButton id="phase-4" value={"phase4"}>
              Phase 4
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
        <Col xs="12" lg="10" className="d-flex flex-row">
          <PhaseRules
            category1={phaseText[phase].cat1}
            category2={phaseText[phase].cat2}
            category3={phaseText[phase].cat3}
            category4={phaseText[phase].cat4}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default RouteMapRules;

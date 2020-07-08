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
      title: "Lockdown",
      introText: "UK wide lockdown in place from 24th March 2020.",
      cat1: {
        text: "Maintain strict social distancing, keeping 2m from people not from your household.",
        icon: "./assets/social_distancing.png",
      },
      cat2: {
        text: "Shielding of high risk individuals in line with public health advice.",
        icon: "./assets/public_health_advice.png"
      },
      cat3: {
        text: "Frequent handwashing and hygiene measures for all.",
        icon: "./assets/washing_hands_dark.png"
      },
      cat4: {
        text: "Schools and childcare services closed.",
        icon: "./assets/school_roof_alt.png"
      }
    },
    phase1: {
      title: "Phase 1",
      introText: "Scotland moved to Phase 1 of the routemap on 29 May 2020.",
      cat1: {
        text: "Maintain social distancing, keeping 2m from people not in your household.",
        icon: "./assets/social_distancing.png"
      },
      cat2: {
        text: "You can meet one other household outdoors.",
        icon: "./assets/households_outdoor.png"
      },
      cat3: {
        text: "Unrestricted trips outdoors for exercise.",
        icon: "./assets/exercising.png"
      },
      cat4: {
        text: "Frequent handwashing and hygiene measures for all.",
        icon: "./assets/washing_hands_dark.png"
      }
    },
    phase2: {
      title: "Phase 2",
      introText: "Scotland moved to Phase 2 of the routemap on 19 June 2020.",
      cat1: {
        text: "Maintain social distancing, keeping 2m from people not in your household.",
        icon: "./assets/social_distancing.png"
      },
      cat2: {
        text: "You can meet with people from another two households inside.",
        icon: "./assets/household_meeting_alt.png"
      },
      cat3: {
        text: "You must wear a face covering when using public transport or in shops.",
        icon: "./assets/face_covering_alt.png"
      },
      cat4: {
        text: "Non-essential retail can open with safeguards in place.",
        icon: "./assets/shopping_centre.png"
      }
    },
    phase3: {
      title: "Phase 3",
      introText: "[Disclaimer]",
      cat1: {
        text: "Maintain social distancing, keeping 2m from people not in your household.",
        icon: "./assets/social_distancing.png"
      },
      cat2: {
        text: "Able to meet with people from more than one household indoors with physical distancing and hygiene measures still in place. ",
        icon: "./assets/household_meeting_alt.png"
      },
      cat3: {
        text: "Museums, galleries, libraries, cinemas open, subject to physical distancing and hygience measures.",
        icon: "./assets/cinema_museum.png"
      },
      cat4: {
        text: "Hotels, campsites, B&Bs can open with safeguards in place.",
        icon: "./assets/hotels_campsites.png"
      }
    },
    phase4: {
      title: "Phase 4",
      introText: "[Disclaimer]",
      cat1: {
        text: "Maintain social distancing, keeping 2m from people not in your household.",
        icon: "./assets/social_distancing.png"
      },
      cat2: {
        text: "Further relaxation on restrictions on gathering.",
        icon: "./assets/larger_gatherings.png"
      },
      cat3: {
        text: "Schools and childcare provision, operating with any necessary precaution.",
        icon: "./assets/school_roof_alt.png"
      },
      cat4: {
        text: "Further relaxation of restrictions on live events in line with public health advice.",
        icon: "./assets/larger_gatherings_alt.png"
      }
    }
  };

  function selectPhase(phase) {
    setPhase(phase);
  };

  return (
    <Container fluid className="route-map-rules">
      <Row>
        <Col xs="12" className="current-phase">
          <span>We are currently in Phase 2 of the Scottish Government's Covid-19 Routemap</span>
        </Col>
      </Row>
      <Row>
        <Col xs="12" className="intro-text">
          {phaseText[phase].introText}
        </Col>
      </Row>
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
            categories={phaseText[phase]}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default RouteMapRules;

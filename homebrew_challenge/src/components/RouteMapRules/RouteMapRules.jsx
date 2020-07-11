import React, { useState } from "react";
import "./RouteMapRules.css";
import PhaseRules from "./PhaseRules";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToolTip from "../ToolTips/ToolTip";
import {
  PHASE_CONTENT,
  CURRENT_PHASE,
  LOCKDOWN,
  PHASE_1,
  PHASE_2,
  PHASE_3,
  PHASE_4,
} from "./RouteMapContent";

const RouteMapRules = () => {
  const [phase, setPhase] = useState(CURRENT_PHASE);

  return (
    <Container fluid className="route-map-rules">
      <Row>
        <Col xs="12" className="current-phase mb-2">
          <ToolTip tooltip="The description of the phases is summary rather than comprehensive: it will not include every aspect of the restrictions that is of concern." />
          <h3>
            We are currently in Phase 3 of the Scottish Government's Covid-19
            Routemap.
          </h3>
        </Col>
      </Row>
      <Row>
        <Col
          xs="12"
          lg="2"
          className="select-phase d-flex align-content-center justify-content-center mt-lg-1 mb-lg-1"
        >
          <ToggleButtonGroup
            className="d-flex flex-column phase-toggle-buttons"
            name="phase"
            type="radio"
            value={phase}
            onChange={(val) => setPhase(val)}
          >
            <ToggleButton id="lockdown" value={LOCKDOWN}>
              Lockdown
            </ToggleButton>
            <ToggleButton id="phase-1" value={PHASE_1}>
              Phase 1
            </ToggleButton>
            <ToggleButton id="phase-2" value={PHASE_2}>
              Phase 2
            </ToggleButton>
            <ToggleButton id="phase-3" value={PHASE_3}>
              Phase 3
            </ToggleButton>
            <ToggleButton id="phase-4" value={PHASE_4}>
              Phase 4
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
        <Col xs="12" lg="10" className="d-flex flex-row p-0">
          <PhaseRules categories={PHASE_CONTENT[phase]} />
        </Col>
      </Row>
    </Container>
  );
};

export default RouteMapRules;

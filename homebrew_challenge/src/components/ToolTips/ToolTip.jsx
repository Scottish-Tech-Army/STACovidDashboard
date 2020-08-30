import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import "./ToolTip.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Tooltip as ReactBootstrapTooltip } from "react-bootstrap";

function ToolTip({ id, tooltip }) {
  return (
    <OverlayTrigger
        overlay={<ReactBootstrapTooltip id="tooltip">{tooltip}</ReactBootstrapTooltip>}
    >
      <div className="tooltip-icon">
        <FontAwesomeIcon icon={faQuestionCircle} size="1x" />
      </div>
    </OverlayTrigger>
  );
}

export default ToolTip;

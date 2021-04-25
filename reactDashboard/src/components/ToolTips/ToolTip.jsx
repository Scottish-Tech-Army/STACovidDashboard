import React from "react";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import "./ToolTip.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Tooltip as ReactBootstrapTooltip } from "react-bootstrap";
import SvgIcon from "../Utils/SvgIcon";

function ToolTip({ id, tooltip }) {
  return (
    <OverlayTrigger
      overlay={
        <ReactBootstrapTooltip id="tooltip">{tooltip}</ReactBootstrapTooltip>
      }
    >
      <div className="tooltip-icon">
        <SvgIcon faIcon={faQuestionCircle} />
      </div>
    </OverlayTrigger>
  );
}

export default ToolTip;

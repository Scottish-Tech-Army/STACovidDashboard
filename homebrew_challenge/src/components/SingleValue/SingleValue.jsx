import React from "react";
import ToolTip from "../ToolTips/ToolTip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

function SingleValue({
  id,
  title = "Missing title",
  value = "Missing value",
  tooltip,
}) {
  return (
    <div className="single-value" id={id}>
      {tooltip ? <ToolTip tooltip={tooltip} /> : {}}
      <div className="single-value-header">{title}</div>
      <div className="single-value-total">{value}</div>
    </div>
  );
}

export default SingleValue;

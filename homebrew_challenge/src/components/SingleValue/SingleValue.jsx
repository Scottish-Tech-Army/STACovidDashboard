import React from "react";
import ToolTip from "../ToolTips/ToolTip";

function SingleValue({
  id,
  title = "Missing title",
  value = "Missing value",
  tooltip,
}) {
  return (
    <div className="single-value" id={id}>
      {tooltip ? <ToolTip tooltip={tooltip} /> : <></>}
      <div className="single-value-header">{title}</div>
      <div className="single-value-total">{value}</div>
    </div>
  );
}

export default SingleValue;

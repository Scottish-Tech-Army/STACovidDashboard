import React from "react";
import ToolTip from "../ToolTips/ToolTip";
import "./SingleValueBar.css";

function SingleValue({
  dateReported,
  tooltip,
  value = "Missing value",
  heading,
  id,
}) {
  return (
    <div className="single-value" id={id}>
      {tooltip ? <ToolTip tooltip={tooltip} /> : <></>}
      <div className="single-value-heading">
        <strong>{heading}</strong>
        {dateReported ? (
          <div className="date-reported">
            {dateReported}
          </div>
        ) : (
          <></>
        )}
      </div>
      <hr />
      <div className="single-value-number">{value}</div>
    </div>
  );
}

export default SingleValue;

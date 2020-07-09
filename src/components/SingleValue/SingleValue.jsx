import React from "react";

function SingleValue({ id, title = "Missing title", value = "Missing value" }) {
  return (
    <div className="single-value" id={id}>
      <div className="single-value-header">{title}</div>
      <div className="single-value-total">{value}</div>
    </div>
  );
}

export default SingleValue;

import React from "react";

function SingleValue({ id, title = "Missing title", value = "Missing value" }) {
  return (
    <div className="singlevalue" id={id}>
      <div className="title">{title}</div>
      <div className="value">{value}</div>
    </div>
  );
}

export default SingleValue;

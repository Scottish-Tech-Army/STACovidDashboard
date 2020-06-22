import React from "react";
import "./SingleValue.css";

function SingleValue({ title = "Missing title", value = "Missing value" }) {
  return (
    <div className="singlevalue">
      <div className="title">{title}</div>
      <div className="value">{value}</div>
    </div>
  );
}

export default SingleValue;

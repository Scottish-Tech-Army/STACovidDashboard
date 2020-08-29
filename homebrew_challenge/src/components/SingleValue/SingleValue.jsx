import React from "react";
import "./SingleValueBar.css";

function SingleValue({
  footnote1 = null,
  footnote2 = null,
  value = "Missing value",
  heading
}) {
  return (
    <div className="single-value">
      <div className="single-value-heading">
        <strong>{heading}</strong>
      </div>
      <div className="single-value-number">{value}</div>
      <hr className="single-value-line"/>
      {footnote1 ? (
        <div className="footnote">
          <span className="footnote-stars">*</span>
          {footnote1}
        </div>
      ) : (
        <></>
      )}
      {footnote2 ? (
        <div className="footnote">
          <span className="footnote-stars">**</span>
          {footnote2}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default SingleValue;

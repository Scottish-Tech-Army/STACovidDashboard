import React from "react";
import "./SingleValueBar.css";

function SingleValue({
  dateReported,
  footnote = null,
  value = "Missing value",
  heading,
  id,
}) {
  return (
    <div className="single-value" id={id}>
      <div className="single-value-heading">
        <strong>{heading}</strong>
      </div>
      <div className="single-value-number">{value}</div>
      <hr className="single-value-line"/>
      {dateReported ? (
        <div className="date-reported">
          <span className="footnote-stars">*</span>
          {dateReported}
        </div>
      ) : (
        <></>
      )}
      {footnote ? (
        <div className="footnote">
          <span className="footnote-stars">**</span>
          {footnote}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default SingleValue;

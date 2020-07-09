import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const PhaseRules = ({ categories }) => {
  function getGuidanceText() {
    return (
      <>
        View the full Scottish Government guidance for all of the phases here.
      </>
    );
  }

  function phaseRuleFormatting(icon, text, anchor) {
    const content = (
      <>
        <div className="d-flex justify-content-center p-4">
          <img className="category-image" src={icon} />
        </div>
        <div className="d-flex text-lg-center justify-content-lg-center align-items-center p-4">
          <span>{text}</span>
        </div>
      </>
    );

    return (
      <div className="category-card d-flex flex-row flex-lg-column w-100">
        {anchor ? (
          <a
            className="route-map-link d-flex flex-row flex-lg-column"
            href={anchor}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content}
          </a>
        ) : (
           content
        )}
      </div>
    );
  }

  function addPhaseRules(category) {
    return phaseRuleFormatting(
      categories[category]["icon"],
      categories[category]["text"]
    );
  }

  return (
    <div className="d-flex flex-column flex-lg-row">
      {addPhaseRules("cat1")}
      {addPhaseRules("cat2")}
      {addPhaseRules("cat3")}
      {addPhaseRules("cat4")}
      {phaseRuleFormatting("./assets/more_info.png", getGuidanceText(), "https://www.gov.scot/publications/coronavirus-covid-19-what-you-can-and-cannot-do/pages/overview/")}
    </div>
  );
};

export default PhaseRules;

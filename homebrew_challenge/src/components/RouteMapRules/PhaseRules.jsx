import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const PhaseRules = ({ categories }) => {
  function getGuidanceText() {
    return (
      <>
        View the full Scottish Government guidance for {categories["title"]}{" "}
        here.
      </>
    );
  }

  function phaseRuleFormatting(icon, text, anchor) {
    const content = (
      <>
        <div className="d-flex justify-content-center">
          <img className="category-image" src={icon} />
        </div>
        <div className="category-text d-flex p-4 text-lg-center align-items-center">
          <span>{text}</span>
        </div>
      </>
    );

    return (
      <div className="category-card d-flex flex-row flex-lg-column">
        {anchor ? (
          <a
            className="route-map-link"
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
    <div className="d-flex flex-column flex-lg-row phase-rules">
      {addPhaseRules("cat1")}
      {addPhaseRules("cat2")}
      {addPhaseRules("cat3")}
      {addPhaseRules("cat4")}
      {phaseRuleFormatting("./assets/more_info.png", getGuidanceText(), "https://www.gov.scot/publications/coronavirus-covid-19-what-you-can-and-cannot-do/pages/overview/")}
    </div>
  );
};

export default PhaseRules;

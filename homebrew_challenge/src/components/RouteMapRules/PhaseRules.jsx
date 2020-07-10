import React from "react";

const PhaseRules = ({ categories }) => {
  function getGuidanceText() {
    return (
      <>
        View the full Scottish Government guidance for all of the phases here.
      </>
    );
  }

  function phaseRuleFormatting(image, imageAltText, text, anchor) {
    const content = (
      <>
        <div className="d-flex justify-content-center p-4">
          <img className="category-image" src={image} alt={imageAltText} />
        </div>
        <div className="d-flex text-lg-center justify-content-lg-center align-items-center p-4">
          <span>{text}</span>
        </div>
      </>
    );

    return (
      <div className="category-card d-flex flex-row flex-lg-column w-100 m-lg-1">
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
      categories[category]["icon"].image,
      categories[category]["icon"].altText,
      categories[category]["text"]
    );
  }

  return (
    <div className="d-flex flex-column flex-lg-row">
      {addPhaseRules("cat1")}
      {addPhaseRules("cat2")}
      {addPhaseRules("cat3")}
      {addPhaseRules("cat4")}
      {phaseRuleFormatting(
        "./assets/more_info.png",
        "more information",
        getGuidanceText(),
        "https://www.gov.scot/publications/coronavirus-covid-19-what-you-can-and-cannot-do/pages/overview/"
      )}
    </div>
  );
};

export default PhaseRules;

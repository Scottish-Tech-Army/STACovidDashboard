import React from 'react';
import Row from "react-bootstrap/Row";

const PhaseRules = ({categories}) => {

  return (
    <>
      <div className="category-card">
        <div className="d-flex justify-content-center">
          <img className="category-image" src={categories["cat1"]["icon"]}/>
        </div>
        <div className="category-text">
          <span>{categories["cat1"]["text"]}</span>
        </div>
      </div>

      <div className="category-card">
        <div className="d-flex justify-content-center">
          <img className="category-image" src={categories["cat2"]["icon"]}/>
        </div>
        <div className="category-text">
          <span>{categories["cat2"]["text"]}</span>
        </div>
      </div>

      <div className="category-card">
        <div className="d-flex justify-content-center">
          <img className="category-image" src={categories["cat3"]["icon"]}/>
        </div>
        <div className="category-text">
          <span>{categories["cat3"]["text"]}</span>
        </div>
      </div>

      <div className="category-card">
        <div className="d-flex justify-content-center">
          <img className="category-image" src={categories["cat4"]["icon"]}/>
        </div>
        <div className="category-text">
          <span>{categories["cat4"]["text"]}</span>
        </div>
      </div>

      <div className="category-card">
        <a
          className="route-map-link"
          href="https://www.gov.scot/publications/coronavirus-covid-19-what-you-can-and-cannot-do/pages/overview/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="d-flex justify-content-center">
            <img className="category-image" src="./assets/more_info.png"/>
          </div>
          <div className="category-text">
            <span>View the full Scottish Government guidance for {categories["title"]} here.</span>
          </div>
        </a>
      </div>
    </>
  );
};

export default PhaseRules;

// <div className="category-card">
//   <div className="d-flex justify-content-center">
//     <img className="category-image"/>
//   </div>
//   <div className="category-text">
//     <span></span>
//   </div>
//   </div>
//   <div className="category-card">
//     <div className="d-flex justify-content-center">
//       <img className="category-image"/>
//     </div>
//     <div className="category-text">
//       <span></span>
//     </div>
//   </div>
//   <div className="category-card">
//   <div className="d-flex justify-content-center">
//     <img className="category-image"/>
//   </div>
//   <div className="category-text">
//     <span></span>
//   </div>
//   </div>

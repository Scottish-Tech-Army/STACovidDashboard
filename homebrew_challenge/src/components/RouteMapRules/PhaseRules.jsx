import React from 'react';
import Row from "react-bootstrap/Row";

const PhaseRules = ({category1, category2, category3, category4}) => {
  return (
    <>
      <div className="category-card">
        <div className="d-flex justify-content-center">
          <img className="category-image" src={category1[1]}/>
        </div>
        <div className="category-text">
          <span>{category1[0]}</span>
        </div>
      </div>
      <div className="category-card">
        <div className="d-flex justify-content-center">
          <img className="category-image" src={category2[1]}/>
        </div>
        <div className="category-text">
          <span>{category2[0]}</span>
        </div>
        </div>
        <div className="category-card">
          <div className="d-flex justify-content-center">
            <img className="category-image" src={category3[1]}/>
          </div>
          <div className="category-text">
            <span>{category3[0]}</span>
          </div>
        </div>
        <div className="category-card">
        <div className="d-flex justify-content-center">
          <img className="category-image" src={category4[1]}/>
        </div>
        <div className="category-text">
          <span>{category4[0]}</span>
        </div>
        </div>
        <div className="category-card">
        <div className="d-flex justify-content-center">
          <img className="category-image" src="./assets/more_info.png"/>
        </div>
        <div className="category-text">
          <span>View the full Scottish Government guidance for Phase [] here.</span>
        </div>
      </div>
    </>
  );
};

export default PhaseRules;

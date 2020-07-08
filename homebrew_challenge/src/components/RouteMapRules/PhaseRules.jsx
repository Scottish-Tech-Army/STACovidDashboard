import React from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const PhaseRules = ({categories}) => {

  return (
    <>
      <Row className="category-card">
        <Col>
        <Col className="d-flex justify-content-center">
          <img className="category-image" src={categories["cat1"]["icon"]}/>
        </Col>
        <Col className="category-text">
          <span>{categories["cat1"]["text"]}</span>
        </Col>
        </Col>
      </Row>

      <Row className="category-card">
        <Col>
        <Col className="d-flex justify-content-center">
          <img className="category-image" src={categories["cat2"]["icon"]}/>
        </Col>
        <Col className="category-text">
          <span>{categories["cat2"]["text"]}</span>
        </Col>
        </Col>
      </Row>

      <Row className="category-card">
      <Col>
        <Col className="d-flex justify-content-center">
          <img className="category-image" src={categories["cat3"]["icon"]}/>
        </Col>
        <Col className="category-text">
          <span>{categories["cat3"]["text"]}</span>
        </Col>
        </Col>
      </Row>

      <Row className="category-card">
      <Col>
        <Col className="d-flex justify-content-center">
          <img className="category-image" src={categories["cat4"]["icon"]}/>
        </Col>
        <Col className="category-text">
          <span>{categories["cat4"]["text"]}</span>
        </Col>
        </Col>
      </Row>

      <Row className="category-card">
        <Col>
        <a
          className="route-map-link"
          href="https://www.gov.scot/publications/coronavirus-covid-19-what-you-can-and-cannot-do/pages/overview/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Col className="d-flex justify-content-center">
            <img className="category-image" src="./assets/more_info.png"/>
          </Col>
          <Col className="category-text">
            <span>View the full Scottish Government guidance for {categories["title"]} here.</span>
          </Col>
        </a>
        </Col>
      </Row>
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

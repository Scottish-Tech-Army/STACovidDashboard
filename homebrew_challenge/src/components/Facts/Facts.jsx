import React from 'react';
import "./Facts.css";

const Facts = () => {
  return (
    <div className="facts-container">
      <div className="facts-heading">
        Remember FACTS...
      </div>
      <div className="facts-row">
        <div className="facts-component">
          <img className="facts-icon" src="./assets/face_covering.png" alt=""/>
          <div className="facts-guidance">
            Wear a face covering.
          </div>
        </div>
        <div className="facts-component">
          <img className="facts-icon" src="./assets/larger_gatherings_alt.png" alt=""/>
          <div className="facts-guidance">
            Avoid Crowded Places.
          </div>
        </div>
        <div className="facts-component">
          <img className="facts-icon" src="./assets/washing_hands.png" alt=""/>
          <div className="facts-guidance">
            Clean hands and surfaces regularly.
          </div>
        </div>
        <div className="facts-component">
          <img className="facts-icon" src="./assets/physical_distancing.png" alt=""/>
          <div className="facts-guidance">
            Stay 2m away from other people.
          </div>
        </div>
        <div className="facts-component">
          <img className="facts-icon" src="./assets/public_health_advice.png" alt=""/>
          <div className="facts-guidance">
            Self-isolate and book a test if you have COVID-19 symptoms
          </div>
        </div>
      </div>
    </div>
  );
}

export default Facts;

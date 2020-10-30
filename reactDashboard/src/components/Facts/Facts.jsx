import React from "react";
import "./Facts.css";

const Facts = () => {
  return (
    <div className="facts-container">
      <div className="facts-row">
        <div className="facts-component">
          <img className="facts-icon" src="./assets/face_covering.png" alt="" />
          <div className="facts-guidance">
            <div>
              Wear a <span className="highlight-facts">F</span>ace covering.
            </div>
          </div>
        </div>
        <div className="facts-component">
          <img
            className="facts-icon"
            src="./assets/larger_gatherings_alt.png"
            alt=""
          />
          <div className="facts-guidance">
            <div>
              <span className="highlight-facts">A</span>void crowded places.
            </div>
          </div>
        </div>
        <div className="facts-component">
          <img className="facts-icon" src="./assets/washing_hands.png" alt="" />
          <div className="facts-guidance">
            <div>
              <span className="highlight-facts">C</span>lean hands and surfaces
              regularly.
            </div>
          </div>
        </div>
        <div className="facts-component">
          <img
            className="facts-icon"
            src="./assets/physical_distancing.png"
            alt=""
          />
          <div className="facts-guidance">
            <div>
              Stay <span className="highlight-facts">T</span>wo metres away from
              other people.
            </div>
          </div>
        </div>
        <div className="facts-component">
          <img
            className="facts-icon"
            src="./assets/public_health_advice.png"
            alt=""
          />
          <div className="facts-guidance">
            <div>
              <a
                className="link"
                id="test-link"
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.gov.scot/coronavirus-covid-19/"
              >
                <span className="highlight-facts">S</span>
                elf-isolate and book a test if you have COVID-19 symptoms.
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Facts;

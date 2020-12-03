import React from "react";
import "./Facts.css";

const Facts = () => {
  return (
    <div className="facts-container">
      <div className="facts-row">
        <div className="facts-component">
          <img
            className="facts-icon"
            src="./assets/wear_face_coverings_no_bg.png"
            alt="two faces wearing masks"
          />
          <div className="facts-guidance">
            <div>
              <span className="highlight-facts">F</span>ace coverings
            </div>
          </div>
        </div>
        <div className="facts-component">
          <img
            className="facts-icon"
            src="./assets/avoid_crovded_places_no_bg.png"
            alt="7 human figures with circles highlighting their personal space"
          />
          <div className="facts-guidance">
            <div>
              <span className="highlight-facts">A</span>void crowded places
            </div>
          </div>
        </div>
        <div className="facts-component">
          <img
            className="facts-icon"
            src="./assets/clean_hands_no_bg.png"
            alt="two hands touching with soap suds betweem them"
          />
          <div className="facts-guidance">
            <div>
              <span className="highlight-facts">C</span>lean your hands
              regularly
            </div>
          </div>
        </div>
        <div className="facts-component">
          <img
            className="facts-icon"
            src="./assets/stay_2_m_apart_no_bg.png"
            alt="Two human figures standing 2 meters apart"
          />
          <div className="facts-guidance">
            <div>
              <span className="highlight-facts">T</span>wo metres distance
            </div>
          </div>
        </div>
        <div className="facts-component">
          <img
            className="facts-icon"
            src="./assets/self_isolat_book_test_no_bg.png"
            alt="A generic location market, shaped like an inverted tear drop"
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
                <span className="highlight-facts">S</span>elf isolate and book a
                test if you have symptoms
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Facts;

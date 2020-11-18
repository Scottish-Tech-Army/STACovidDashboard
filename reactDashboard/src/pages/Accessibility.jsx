import React from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Accessibility = () => {
  return (
    <div fluid="true" className="accessibility-page">
      <div className="accessibility-details">
        <hr className="full-width-hr" />
        <h1>Accessibility</h1>
        <hr className="full-width-hr" />
        <p>
          We want everyone who visits the Covid-19 Dashboard to feel welcome,
          and able to find information whatever their circumstances. To do this
          we've:
        </p>
        <ul>
          <li>
            Designed the dashboard to be accessible and usable for everyone.
          </li>
          <li>
            Provided alternative text and audio for media content where
            appropriate.
          </li>
        </ul>
      </div>
      <div className="accessibility-details">
        <hr className="full-width-hr" />
        <h2>Conformance Statement</h2>
        <hr className="full-width-hr" />
        <p>
          We're working towards meeting the AA standard of the{" "}
          <a
            href="https://www.w3.org/TR/WCAG20/"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            Web Content Accessibility Guidelines (WCAG) 2.0
          </a>
          . Automated testing has taken place against these standards and all
          expectations are met under the directive.
        </p>
      </div>
      <div className="accessibility-details">
        <hr className="full-width-hr" />
        <h2>Browsers</h2>
        <hr className="full-width-hr" />
        <p>We've tested the website using the following web browsers:</p>
        <ul>
          <li>Google Chrome</li>
          <li>Mozilla Firefox</li>
          <li>Safari</li>
          <li>Microsoft Edge</li>
        </ul>
        <p>We've tested the website using the following mobile browsers:</p>
        <ul>
          <li>Google Chrome</li>
          <li>Mozilla Firefox</li>
          <li>Safari</li>
          <li>Samsung Browser</li>
        </ul>
      </div>
      <div className="accessibility-details">
        <hr className="full-width-hr" />
        <h2>Screen Readers</h2>
        <hr className="full-width-hr" />
        <p>
          This website is compatible with modern screen readers and other
          assistive technologies.
        </p>
      </div>
    </div>
  );
};

export default Accessibility;

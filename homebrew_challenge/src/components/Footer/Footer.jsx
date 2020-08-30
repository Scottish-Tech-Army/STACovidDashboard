import React from "react";
import "./Footer.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  PAGE_OVERVIEW,
  PAGE_REGIONAL,
  PAGE_DATA_SOURCES,
  PAGE_ABOUT_US,
} from "../../pages/PageConsts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

const Footer = ({ setCurrentPage }) => {
  function sitemapEntry(key, text) {
    return (
      <div className="entry link" onClick={() => setCurrentPage(key)}>
        <div
          className="entry link"
          id="entry-link"
          onClick={() => setCurrentPage(key)}
        >
          {text}
        </div>
      </div>
    );
  }

  return (
    <footer>
      <Container fluid className="font-small">
        <Row className="p-1">
          <Col md={12} className="p-2 d-flex justify-content-left sta-logo">
            <a
              href="https://www.scottishtecharmy.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="STABanner.png"
                alt="Scottish Tech Army"
                width="270"
                height="50"
              />
            </a>
          </Col>
          <Col
            md={12}
            className="sitemap-container d-flex justify-content-between"
          >
            <div className="sitemap">
              <div className="title">DASHBOARDS</div>
              {sitemapEntry(PAGE_OVERVIEW, "Summary Dashboard")}
              {sitemapEntry(PAGE_REGIONAL, "Regional Dashboard")}
              {sitemapEntry(PAGE_DATA_SOURCES, "Data Sources")}
            </div>
            <div className="sitemap">
              <div className="title">COVID HELP</div>
              <div className="entry link">
                <a
                  href="https://www.gov.scot/collections/coronavirus-covid-19-guidance/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="entry link"
                >
                  Scottish Government Guidance
                </a>
              </div>
              <div className="entry link">
                <a
                  href="https://www.nhsinform.scot/illnesses-and-conditions/infections-and-poisoning/coronavirus-covid-19"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="entry link"
                >
                  NHS inform Advice
                </a>
              </div>
            </div>
            <div className="sitemap">
              <div className="title">LEGAL</div>
              <div className="entry link">
                <a
                  className="entry link"
                  href="https://www.scottishtecharmy.org/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </div>
              <div className="entry link">
                <a
                  className="entry link"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Accessibility
                </a>
              </div>
            </div>
            <div className="sitemap">
              <div className="title">ABOUT</div>
              {sitemapEntry(PAGE_ABOUT_US, "About Us")}
            </div>
            <div className="sitemap">
              <div className="title">CONTACT</div>
              <div>
                <a
                  href="mailto:info@sta.org?subject=Covid-19%20Dashboard%20Feedback"
                  className=" entry link entry-link"
                >
                  info@sta.org
                </a>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="d-sm-flex">
          <Col>
            <hr className="full-width-hr" />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={9}>
            <div className="footer-copyright text-left">
              Unless otherwise stated, this webpage contains public sector
              information licensed under{" "}
              <a
                href="http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                target="_blank"
                rel="noopener noreferrer licence"
                className="entry link"
                id="entry-link"
              >
                the Open Government Licence 3.0.
              </a>
              <br />© 2020 Copyright:&nbsp;
              <a
                href="https://www.scottishtecharmy.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="entry link"
              >
                ScottishTechArmy.org
              </a>
            </div>
          </Col>
          <Col sm={12} md={3} className="d-flex justify-content-end social">
            <div className="d-flex align-items-center">Connect with us: </div>
            <div className="entry link">
              <a
                className="entry link"
                href="https://www.linkedin.com/company/scottish-tech-army-limited"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faTwitter}
                  size="3x"
                  color="#133a53"
                  className="social-media"
                />
              </a>
            </div>
            <div className="entry link">
              <a
                className="entry link"
                href="https://twitter.com/ScotTechArmy"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faLinkedinIn}
                  size="3x"
                  color="#133a53"
                  className="social-media"
                />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

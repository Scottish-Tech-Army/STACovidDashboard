import React from "react";
import "./Footer.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  URL_ABOUT_US,
  URL_ACCESSIBILITY,
  URL_DATA_SOURCES,
  URL_OVERVIEW,
  URL_REGIONAL,
} from "../../pages/PageConsts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedinIn, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { NavLink } from "react-router-dom";

const Footer = () => {
  function sitemapEntry(pageUrl, text) {
    return (
      <div className="entry link">
        <NavLink className="entry link" to={pageUrl}>
          {text}
        </NavLink>
      </div>
    );
  }

  function sitemapExternalLink(href, content) {
    return (
      <div className="entry link">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="entry link"
        >
          {content}
        </a>
      </div>
    );
  }

  return (
    <footer>
      <Container fluid className="font-small">
        <Row>
          <Col>
            <hr className="full-width-hr" />
          </Col>
        </Row>
        <Row className="p-1">
          <Col
            md={12}
            className="sitemap-container d-flex justify-content-between"
          >
            <div className="sitemap">
              <div className="title">DASHBOARDS</div>
              {sitemapEntry(URL_OVERVIEW, "Summary Dashboard")}
              {sitemapEntry(URL_REGIONAL, "Regional Insights")}
              {sitemapEntry(URL_DATA_SOURCES, "Data Sources")}
            </div>
            <div className="sitemap">
              <div className="title">COVID HELP</div>
              {sitemapExternalLink(
                "https://www.gov.scot/collections/coronavirus-covid-19-guidance/",
                "Scottish Government Guidance"
              )}
              {sitemapExternalLink(
                "https://www.nhsinform.scot/illnesses-and-conditions/infections-and-poisoning/coronavirus-covid-19",
                "NHS inform Advice"
              )}
            </div>
            <div className="sitemap">
              <div className="title">LEGAL</div>
              {sitemapExternalLink(
                "https://www.scottishtecharmy.org/privacy-policy",
                "Privacy Policy"
              )}
              {sitemapEntry(URL_ACCESSIBILITY, "Accessibility")}
            </div>
            <div className="sitemap">
              <div className="title">ABOUT</div>
              {sitemapEntry(URL_ABOUT_US, "About Us")}
            </div>
            <div className="sitemap">
              <div className="title">CONTACT</div>
              {sitemapExternalLink(
                "mailto:info@scottishtecharmy.org?subject=Covid-19%20Dashboard%20Feedback",
                "info@scottishtecharmy.org"
              )}
              <a
                href="https://www.scottishtecharmy.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="sta-logo-text"
              >
                <div className="dedication">
                  Proudly made by volunteers from
                  <br />
                  <img
                    src="/STABanner.png"
                    alt="Scottish Tech Army"
                    width="270"
                  />
                </div>
              </a>
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
          <Col
            sm={12}
            md={3}
            className="d-flex justify-content-end social align-items-center"
          >
            <div>Connect with us:</div>
            {sitemapExternalLink(
              "https://www.linkedin.com/company/scottish-tech-army-limited",
              <FontAwesomeIcon
                icon={faLinkedinIn}
                size="2x"
                color="#133a53"
                className="third-party-logo"
                title="Link to Scottish Tech Army LinkedIn account"
              />
            )}
            {sitemapExternalLink(
              "https://twitter.com/ScotTechArmy",
              <FontAwesomeIcon
                icon={faTwitter}
                size="3x"
                color="#133a53"
                className="third-party-logo"
                title="Link to Scottish Tech Army Twitter account"
              />
            )}
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

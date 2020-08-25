import React from "react";
import "./Footer.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Footer = ({PAGE_PUBLIC_DASHBOARD, PAGE_ANALYTICS_DASHBOARD, PAGE_DATA_SOURCES, PAGE_ABOUT_US, setCurrentPage}) => {

  function sitemapEntry(key, text) {
    return (
      <div className="entry link" onClick={() => setCurrentPage(key)}>
        {text}
      </div>
    );
  }

  return (
    <footer>
      <Container className="font-small blue pt-4">
        <Row className="d-flex">
          <Col xs={12} md={4} className="p-2 d-flex justify-content-center">
            <a
              href="https://www.gov.scot/collections/coronavirus-covid-19-guidance/"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              Guidance from Scottish Government
            </a>
          </Col>
          <Col xs={12} md={4} className="p-2 d-flex justify-content-center">
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
          <Col xs={12} md={4} className="p-2 d-flex justify-content-center">
            <a
              href="https://www.nhsinform.scot/illnesses-and-conditions/infections-and-poisoning/coronavirus-covid-19"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              Advice from NHS inform
            </a>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <div className="sitemap p-2">
              <div className="title">Sitemap</div>
              {sitemapEntry(PAGE_PUBLIC_DASHBOARD, "Public Dashboard")}
              {sitemapEntry(PAGE_ANALYTICS_DASHBOARD, "Analytics Dashboard")}
              {sitemapEntry(
                PAGE_DATA_SOURCES,
                "Data sources and attribution"
              )}
              {sitemapEntry(PAGE_ABOUT_US, "About us")}
              <div className="entry link">
                <a id="entry-link" className="entry link" href="https://www.scottishtecharmy.org/privacy-policy">
                  Privacy Policy
                </a>
              </div>
              <div className="title">Contact Us</div>
              <div className="entry">info@sta.org</div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="footer-copyright text-center py-3">
              Unless otherwise stated, this webpage contains public sector
              information licensed under
              <a
                href="http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                target="_blank"
                rel="noopener noreferrer licence"
                className=" scot-gov-link link"
              >
                the Open Government Licence 3.0.
              </a>
              <br />© 2020 Copyright:&nbsp;
              <a
                href="https://www.scottishtecharmy.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                ScottishTechArmy.org
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

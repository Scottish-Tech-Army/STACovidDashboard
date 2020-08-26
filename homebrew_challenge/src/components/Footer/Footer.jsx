import React from "react";
import "./Footer.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Footer = () => {

  return (
    <footer>
      <Container fluid className="footer-container font-small">
        <Row className="d-flex p-3">
          <Col
            xs={12}
            md={4}
            className="p-2 d-flex justify-content-center align-items-center"
          >
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
          <Col
            xs={12}
            md={4}
            className="p-2 d-flex justify-content-center align-items-center"
          >
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
        <Row className="d-none d-sm-flex">
          <Col>
            <hr className="full-width-hr" />
          </Col>
        </Row>
        <Row className="p-3">
          <Col xs={12} md={4}>
            <div className="sitemap">
              <div className="title">LEGAL</div>
              <div className="entry link">
                <a
                  id="entry-link"
                  className="entry link"
                  href="https://www.scottishtecharmy.org/privacy-policy"
                >
                  Privacy Policy
                </a>
              </div>
              <div className="entry link">
                <a
                  id="entry-link"
                  className="entry link"
                  href="#"
                >
                  [Accessibility etc.]
                </a>
              </div>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div className="sitemap">
              <div className="title">CONTACT US</div>
              <div className="email">info@sta.org</div>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div className="sitemap">
              <div className="title">CONNECT WITH US</div>
              <div className="entry link">
                <a
                  id="entry-link"
                  className="entry link"
                  href="https://twitter.com/ScotTechArmy"
                >
                  Twitter
                </a>
              </div>
              <div className="entry link">
                <a id="entry-link" className="entry link" href="https://www.linkedin.com/company/scottish-tech-army-limited">
                  LinkedIn
                </a>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="footer-copyright text-center p-3">
              Unless otherwise stated, this webpage contains public sector
              information licensed under{" "}
              <a
                href="http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                target="_blank"
                rel="noopener noreferrer licence"
                className=" scot-gov-link link"
                id="entry-link"
              >
                the Open Government Licence 3.0.
              </a>
              <br />© 2020 Copyright:&nbsp;
              <a
                href="https://www.scottishtecharmy.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
                id="entry-link"
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

import React from "react";
import "./Footer.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Footer = () => {

  return (
    <footer>
      <Container fluid className="font-small">
        <Row className="p-3 d-flex justify-content-center">
          <Col xs={12} md={3}>
            <div className="sitemap">
              <div className="title">CONNECT WITH US</div>
              <div className="entry link">
                <a
                  className="entry link"
                  href="https://twitter.com/ScotTechArmy"
                >
                  Twitter
                </a>
              </div>
              <div className="entry link">
                <a className="entry link" href="https://www.linkedin.com/company/scottish-tech-army-limited">
                  LinkedIn
                </a>
              </div>
              <div className="entry link">
                <a className="entry link" href="https://www.scottishtecharmy.org/podcasts">
                  STA Podcast
                </a>
              </div>
            </div>
          </Col>
          <Col xs={12} md={3}>
            <div className="sitemap">
              <div className="title">CONTACT US</div>
              <div className="email">info@sta.org</div>
            </div>
          </Col>
          <Col xs={12} md={3}>
            <div className="sitemap">
              <div className="title">LEGAL</div>
              <div className="entry link">
                <a
                  className="entry link"
                  href="https://www.scottishtecharmy.org/privacy-policy"
                >
                  Privacy Policy
                </a>
              </div>
              <div className="entry link">
                <a
                  className="entry link"
                  href="#"
                >
                  Accessibility
                </a>
              </div>
            </div>
          </Col>
          <Col xs={12} md={3}>
            <div className="sitemap">
              <div className="title">USEFUL LINKS</div>
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
                  Advice from NHS inform
                </a>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="footer-copyright text-left py-3 p-3">
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
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const HeadlineBanner = () => {
  return (
    <Container fluid className="d-flex flex-column">
      <Row>
        <Col className="hr-container" style={{ padding: 0 }}>
          <hr aria-hidden={true} className="full-width-hr" />
        </Col>
      </Row>
      <Row>
        <Col
          xs="12"
          className="headline-banner"
          style={{ backgroundColor: "#133a53", padding: "1rem" }}
        ></Col>
      </Row>
    </Container>
  );
};

export default HeadlineBanner;

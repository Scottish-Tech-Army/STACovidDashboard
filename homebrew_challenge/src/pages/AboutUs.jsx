import React from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Rhi Batstone",
      linkedinRef: "https://www.linkedin.com/in/rhiannon-batstone-076191120",
    },
    {
      name: "Ric Clark",
      linkedinRef: "https://www.linkedin.com/in/richard--clark",
    },
    {
      name: "Eirini Komninou",
      linkedinRef: "https://www.linkedin.com/in/eirinikomninou",
    },
    {
      name: "Adam Daniel Hidvegi",
      linkedinRef: "https://www.linkedin.com/in/adam-daniel-hidvegi",
    },
    {
      name: "Rob Armitage",
      linkedinRef: "https://www.linkedin.com/in/rob-armitage",
    },
    {
      name: "Becky Still",
      linkedinRef: "https://www.linkedin.com/in/rebeccastill1",
    },
    {
      name: "Bhagyashri Dhadage",
      linkedinRef: "https://www.linkedin.com/in/bhagyashri-dhadage-1b1278b1",
    },
    {
      name: "Andrew Rendle",
      linkedinRef: "https://www.linkedin.com/in/andrew-rendle-578546",
    },
    {
      name: "Donal Stewart",
      linkedinRef: "https://www.linkedin.com/in/donalstewart",
    },
    {
      name: "Allan Stevenson",
      linkedinRef: "https://www.linkedin.com/in/alstev",
    },
    {
      name: "Gabriela Satrovskaja",
      linkedinRef: "https://www.linkedin.com/in/gabriela-satrovskaja",
    },
    {
      name: "Euan Robertson",
      linkedinRef: "https://www.linkedin.com/in/euan-robertson-5845582",
    },
    {
      name: "Luke Pritchard-Woollett",
      linkedinRef: "https://www.linkedin.com/in/lukepritchardwoollett",
    },
    {
      name: "Cristina Perez",
      linkedinRef: "https://www.linkedin.com/in/cristina-perez-11229846",
    },
    {
      name: "Colin Lyman",
      linkedinRef: "https://www.linkedin.com/in/colin-lyman",
    },
    {
      name: "Jonathan Lau",
      linkedinRef: "https://www.linkedin.com/in/jonathancylau",
    },
    {
      name: "Craig Climie",
      linkedinRef: "https://www.linkedin.com/in/craig-climie",
    },
  ];

  const sortedTeamMembers = teamMembers
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((data, index) => {
      return (
        <li key={index}>
          <a
            href={data.linkedinRef}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            {data.name}
          </a>
        </li>
      );
    });

  return (
    <div fluid="true" className="about-us">
      <div className="about-us-details">
        <h1>About us</h1>
        <hr className="full-width-hr" />
        <p>
          This dashboard has been developed by members of the Scottish Tech Army
          to improve awareness of the impacts of Covid-19.
        </p>
      </div>
      <div className="about-us-details">
        <h2>The Scottish Tech Army</h2>
        <hr className="full-width-hr" />
        <p>
          Founded by Edinburgh based entrepreneurs, Alistair Forbes and Peter
          Jaco, the Scottish Tech Army Limited is a not for profit company that
          is building a volunteer Covid-19 technical response team that will
          work to help the Scottish Government, local authorities and other
          organisations across the country with rapid technical development
          projects to address current Covid-19 related challenges and post
          pandemic economic recovery.{" "}
        </p>
      </div>
      <div className="about-us-details">
        <h2>Meet the team</h2>
        <hr className="full-width-hr" />
        <p>
          The Covid-19 dashboard for Scotland was created by the following STA
          volunteers:{" "}
        </p>
        <Container className="team-members">
          <Row>
            <Col>
              {sortedTeamMembers.slice(0, sortedTeamMembers.length / 2 + 1)}
            </Col>
            <Col>
              {sortedTeamMembers.slice(
                sortedTeamMembers.length / 2 + 1,
                sortedTeamMembers.length
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AboutUs;

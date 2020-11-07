import React from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function AboutUs() {
  const teamMembers = [
    {
      name: "Rhi Batstone",
      url: "https://www.linkedin.com/in/rhiannon-batstone-076191120",
    },
    {
      name: "Ric Clark",
      url: "https://www.linkedin.com/in/richard--clark",
    },
    {
      name: "Eirini Komninou",
      url: "https://www.linkedin.com/in/eirinikomninou",
    },
    {
      name: "Adam Daniel Hidvegi",
      url: "https://www.linkedin.com/in/adam-daniel-hidvegi",
    },
    {
      name: "Rob Armitage",
      url: "https://www.linkedin.com/in/rob-armitage",
    },
    {
      name: "Becky Still",
      url: "https://www.linkedin.com/in/rebeccastill1",
    },
    {
      name: "Bhagyashri Dhadage",
      url: "https://www.linkedin.com/in/bhagyashri-dhadage-1b1278b1",
    },
    {
      name: "Andrew Rendle",
      url: "https://www.linkedin.com/in/andrew-rendle-578546",
    },
    {
      name: "Donal Stewart",
      url: "https://www.linkedin.com/in/donalstewart",
    },
    {
      name: "Allan Stevenson",
      url: "https://www.linkedin.com/in/alstev",
    },
    {
      name: "Gabriela Satrovskaja",
      url: "https://www.linkedin.com/in/gabriela-satrovskaja",
    },
    {
      name: "Euan Robertson",
      url: "https://www.linkedin.com/in/euan-robertson-5845582",
    },
    {
      name: "Luke Pritchard-Woollett",
      url: "https://www.linkedin.com/in/lukepritchardwoollett",
    },
    {
      name: "Cristina Perez",
      url: "https://www.linkedin.com/in/cristina-perez-11229846",
    },
    {
      name: "Colin Lyman",
      url: "https://www.linkedin.com/in/colin-lyman",
    },
    {
      name: "Jonathan Lau",
      url: "https://www.linkedin.com/in/jonathancylau",
    },
    {
      name: "Craig Climie",
      url: "https://www.linkedin.com/in/craig-climie",
    },
    {
      name: "Stephen Ramsay",
      url: "https://www.linkedin.com/in/stephen-ramsay",
    },
  ];

  function createMemberLinks(members) {
    return members
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((data, index) => {
        return (
          <li key={index}>
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              {data.name}
            </a>
          </li>
        );
      });
  }

  const sortedTeamMembers = createMemberLinks(teamMembers);

  const vendors = [
    {
      name: "Atlassian",
      url: "https://www.atlassian.com/",
    },
    {
      name: "AWS",
      url: "https://aws.amazon.com/",
    },
    {
      name: "Slack",
      url: "https://slack.com/",
    },
    {
      name: "Stadia Maps",
      url: "https://stadiamaps.com/",
    },
  ];

  const sortedVendors = createMemberLinks(vendors);

  return (
    <div  fluid="true" className="about-us">
      <div className="about-us-details">
        <hr className="full-width-hr" />
        <h1>About us</h1>
        <hr className="full-width-hr" />
        <p>
          This dashboard has been developed by members of the Scottish Tech Army
          to improve awareness of the impacts of Covid-19.
        </p>
      </div>
      <div className="about-us-details">
        <hr className="full-width-hr" />
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
        <hr className="full-width-hr" />
        <h2>Meet the team</h2>
        <hr className="full-width-hr" />
        <p>
          The Covid-19 dashboard for Scotland was created by the following STA
          volunteers:{" "}
        </p>
        <Container className="team-members">
          <Row>
            <Col>
              {sortedTeamMembers.slice(0, sortedTeamMembers.length / 2)}
            </Col>
            <Col>
              {sortedTeamMembers.slice(
                sortedTeamMembers.length / 2,
                sortedTeamMembers.length
              )}
            </Col>
          </Row>
        </Container>
      </div>
      <div className="about-us-details">
        <hr className="full-width-hr" />
        <h2>Thanks to</h2>
        <hr className="full-width-hr" />
        <p>
          The work the team has undertaken to produce this dashboard would not
          be possible without the kind donations from some of our partner
          organisations. We would like to thank the following companies for
          donating access to their systems to the Scottish Tech Army:
        </p>
        <Container className="vendors">
          <Row>
            <Col>{sortedVendors.slice(0, sortedVendors.length / 2)}</Col>
            <Col>
              {sortedVendors.slice(
                sortedVendors.length / 2,
                sortedVendors.length
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AboutUs;

import React from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  PERCENTAGE_CASES,
  TOTAL_CASES,
  TOTAL_DEATHS,
} from "./DataChartsConsts";

function DataChartsSelector({ chartType, setChartType }) {
  if (
    chartType !== PERCENTAGE_CASES &&
    chartType !== TOTAL_CASES &&
    chartType !== TOTAL_DEATHS
  ) {
    throw new Error("Unrecognised chartType: " + chartType);
  }
  if (setChartType === null || setChartType === undefined) {
    throw new Error("Unrecognised setChartType: " + setChartType);
  }

  return (
    <Container fluid className="justify-content-between align-items-center">
      <Row className="justify-content-between align-items-stretch">
        <span className="align-middle">
          <strong>Select chart:</strong>
        </span>
        <ToggleButtonGroup
          name="chartType"
          type="radio"
          value={chartType}
          onChange={(val) => setChartType(val)}
        >
          <ToggleButton id="percentageCases" value={PERCENTAGE_CASES}>
            % Tests Positive
          </ToggleButton>
          <ToggleButton id="totalCases" value={TOTAL_CASES}>
            Total Cases
          </ToggleButton>
          <ToggleButton id="totalDeaths" value={TOTAL_DEATHS}>
            Total Deaths
          </ToggleButton>
        </ToggleButtonGroup>
      </Row>
    </Container>
  );
}

export default DataChartsSelector;
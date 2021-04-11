import React, { useEffect, useRef, useState } from "react";
import "./DataCharts.css";
import "../../common.css";
import DateRangeSlider from "./DateRangeSlider";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import SonificationPlayButton from "./SonificationPlayButton";
import { FEATURE_CODE_SCOTLAND } from "../Utils/CsvUtils";
import QuickSelectDateRange from "./QuickSelectDateRange";
import ChartDropdown from "../ChartDropdown/ChartDropdown";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { stopAudio } from "../Utils/Sonification";
import { createChart } from "./DataChartsModel";
import { DAILY_CASES } from "./DataChartsConsts";

export default function DataCharts({
  allData = null,
  darkmode,
  regionCode = FEATURE_CODE_SCOTLAND,
}) {
  const chartContainer = useRef();
  const chartInstance = useRef(null);
  const [chartType, setChartType] = useState(DAILY_CASES);
  const [dateRange, setDateRange] = useState({
    startDate: 0,
    endDate: 1,
  });

  // Stop audio on chart or dateRange change
  useEffect(() => {
    stopAudio();
  }, [chartType, dateRange]);

  useEffect(() => {
    if (allData !== null) {
      setDateRange({ startDate: allData.startDate, endDate: allData.endDate });
    }
  }, [allData]);

  useEffect(() => {
    if (allData !== null) {
      if (chartInstance.current !== null) {
        chartInstance.current.destroy();
      }

      chartInstance.current = createChart(
        chartContainer.current,
        allData,
        chartType,
        regionCode,
        darkmode,
        dateRange
      );
    }
  }, [chartType, regionCode, dateRange, darkmode, allData]);

  const isDataReady = allData !== null;

  const maxDateRange = allData
    ? { startDate: allData.startDate, endDate: allData.endDate }
    : { startDate: 0, endDate: 1 };

  return (
    <Container className="chart-border">
      <Row className="chart-dropdown-container">
        <Col className="chart-title">
          <ChartDropdown chartType={chartType} setChartType={setChartType} />
        </Col>
      </Row>
      <Row className="chart-dropdown-container">
        <QuickSelectDateRange
          setDateRange={setDateRange}
          maxDateRange={maxDateRange}
        />
        <SonificationPlayButton
          allData={allData}
          chartType={chartType}
          regionCode={regionCode}
          dateRange={dateRange}
          darkmode={darkmode}
        />
      </Row>
      <Row aria-hidden={true} className="d-flex justify-content-center">
        <DateRangeSlider
          id="date-range-slider-position"
          dateRange={dateRange}
          setDateRange={setDateRange}
          maxDateRange={maxDateRange}
        />
        <div
          className={"chart-container" + (isDataReady ? "" : " hidden-chart")}
        >
          <canvas ref={chartContainer} />
        </div>
        {isDataReady ? <></> : <LoadingComponent />}
      </Row>
    </Container>
  );
}

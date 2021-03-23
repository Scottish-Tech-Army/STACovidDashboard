import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js";
import "./DataCharts.css";
import "../../common.css";
import DateRangeSlider from "./DateRangeSlider";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import SonificationPlayButton from "./SonificationPlayButton";
import {
  PERCENTAGE_TESTS,
  DAILY_CASES,
  DAILY_DEATHS,
  TOTAL_CASES,
  TOTAL_DEATHS,
  REGION_DATASET_COLOUR,
  AVERAGE_DATASET_COLOUR,
} from "../DataCharts/DataChartsConsts";
import { FEATURE_CODE_SCOTLAND } from "../Utils/CsvUtils";
import {
  commonChartConfiguration,
  datasetConfiguration,
  getWhoThresholdLine,
} from "./DataChartsUtils";
import QuickSelectDateRange from "./QuickSelectDateRange";
import ChartDropdown from "../ChartDropdown/ChartDropdown";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { stopAudio } from "../Utils/Sonification";
import "../../chartjs-plugin-annotation/index.js";

export default function DataCharts({
  allData = null,
  darkmode,
  regionCode = FEATURE_CODE_SCOTLAND,
}) {
  const chartContainer = useRef();
  const chartInstance = useRef(null);
  const [audio, setAudio] = useState(null);
  const [seriesTitle, setSeriesTitle] = useState("No data");
  const [chartType, setChartType] = useState(DAILY_CASES);
  const [dateRange, setDateRange] = useState({
    startDate: 0,
    endDate: 1,
  });

  const percentageTestsDatasetLabel = "% of Tests Positive";
  const dailyCasesDatasetLabel = "Daily Cases";
  const dailyDeathsDatasetLabel = "Daily Deaths";
  const totalCasesDatasetLabel = "Total Cases";
  const totalDeathsDatasetLabel = "Total Deaths";

  // Stop audio on chart or dateRange change
  useEffect(() => {
    stopAudio();
  }, [chartType, dateRange]);

  useEffect(() => {
    if (allData !== null) {
      setDateRange({ ...allData.maxDateRange });
    }
  }, [allData]);

  useEffect(() => {
    function getAverageSeriesData(seriesDataName, populationProportion) {
      const scotlandData =
        allData.regions[FEATURE_CODE_SCOTLAND].dataseries[seriesDataName];
      if (chartType === PERCENTAGE_TESTS) {
        return scotlandData;
      }
      return scotlandData.map(({ t, y }) => {
        return { t: t, y: y * populationProportion };
      });
    }

    const AVERAGE_DATASET_FILL_COLOUR = darkmode
      ? "rgb(118, 118, 118, 0.50)"
      : "rgb(118, 118, 118, 0.25)";

    function getAverageSeriesLabel() {
      return chartType === PERCENTAGE_TESTS
        ? "Scotland average"
        : "Scotland average (adjusted for population)";
    }

    function getChartDatasets(datasetLabel, seriesDataName) {
      const datasets = [];
      const regionSeriesData =
        allData.regions[regionCode].dataseries[seriesDataName];
      if (regionSeriesData !== undefined) {
        datasets.push(
          datasetConfiguration(
            datasetLabel,
            regionSeriesData,
            REGION_DATASET_COLOUR
          )
        );
        if (regionCode !== FEATURE_CODE_SCOTLAND) {
          const averageSeriesData = getAverageSeriesData(
            seriesDataName,
            allData.regions[regionCode].populationProportion
          );
          if (averageSeriesData) {
            datasets.push(
              datasetConfiguration(
                getAverageSeriesLabel(),
                averageSeriesData,
                AVERAGE_DATASET_COLOUR,
                AVERAGE_DATASET_FILL_COLOUR
              )
            );
          }
        }
      }
      return datasets;
    }

    function setChart(
      datasetLabel,
      seriesDataName,
      additionalConfiguration,
      sonificationLabel
    ) {
      const datasets = getChartDatasets(datasetLabel, seriesDataName);
      const chartConfiguration = commonChartConfiguration(
          allData.dates,
        datasets,
        darkmode,
        dateRange
      );

      if (additionalConfiguration) {
        additionalConfiguration(chartConfiguration);
      }

      const chartRef = chartContainer.current.getContext("2d");
      chartInstance.current = new Chart(chartRef, chartConfiguration);

      setSonification(
        allData.regions[regionCode].dataseries[seriesDataName],
        sonificationLabel !== undefined ? sonificationLabel : datasetLabel
      );
    }

    function percentageTestsChartConfiguration(configuration) {
      configuration.options.scales.yAxes[0].ticks.callback = (
        value,
        index,
        values
      ) => {
        return Math.round(value) + "%";
      };
      configuration.options.annotation.annotations.push(getWhoThresholdLine());
    }

    function setSonification(seriesData, seriesLabel) {
      if (seriesData !== null && seriesData !== undefined) {
        setAudio(seriesData);
        setSeriesTitle(seriesLabel);
      }
    }
    if (allData !== null) {
      if (chartInstance.current !== null) {
        chartInstance.current.destroy();
      }

      if (chartType === DAILY_CASES) {
        setChart(dailyCasesDatasetLabel, "dailyCasesSeriesData");
      } else if (chartType === DAILY_DEATHS) {
        setChart(dailyDeathsDatasetLabel, "dailyDeathsSeriesData");
      } else if (chartType === TOTAL_CASES) {
        setChart(totalCasesDatasetLabel, "totalCasesSeriesData");
      } else if (chartType === TOTAL_DEATHS) {
        setChart(totalDeathsDatasetLabel, "totalDeathsSeriesData");
      } else if (chartType === PERCENTAGE_TESTS) {
        setChart(
          percentageTestsDatasetLabel,
          "percentageTestsSeriesData",
          percentageTestsChartConfiguration,
          "Percentage tests positive"
        );
      }
    }
  }, [chartType, regionCode, dateRange, darkmode, allData]);

  const isDataReady = () => {
    return allData !== null;
  };

  function getScreenModeClassName() {
    return isDataReady() ? "chart-container" : "chart-container hidden-chart";
  }

  const maxDateRange = allData ? allData.maxDateRange : { startDate: 0, endDate: 1 };
  return (
    <Container className="chart-border">
      <Row className="chart-dropdown-container">
        <Col className="chart-title">
          <h2>Select Chart:</h2>
          <ChartDropdown chartType={chartType} setChartType={setChartType} />
        </Col>
      </Row>
      <Row className="chart-dropdown-container">
        <QuickSelectDateRange
          setDateRange={setDateRange}
          maxDateRange={maxDateRange}
        />
      </Row>
      <Row className="d-flex justify-content-center">
        <DateRangeSlider
          id="date-range-slider-position"
          dateRange={dateRange}
          setDateRange={setDateRange}
          maxDateRange={maxDateRange}
        />
        <SonificationPlayButton
          seriesData={audio}
          seriesTitle={seriesTitle}
          regionCode={regionCode}
          dateRange={dateRange}
          darkmode={darkmode}
        />
        <div className={getScreenModeClassName()}>
          <canvas ref={chartContainer} />
        </div>
        {isDataReady() ? <></> : <LoadingComponent />}
      </Row>
    </Container>
  );
}

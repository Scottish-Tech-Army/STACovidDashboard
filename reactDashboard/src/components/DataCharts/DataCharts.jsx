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
  percentageTestsSeriesData = new Map(),
  dailyCasesSeriesData = new Map(),
  dailyDeathsSeriesData = new Map(),
  totalCasesSeriesData = new Map(),
  totalDeathsSeriesData = new Map(),
  darkmode,
  regionCode = FEATURE_CODE_SCOTLAND,
  populationProportionMap = new Map(),
  maxDateRange = { startDate: 0, endDate: 1 },
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
    setDateRange({ ...maxDateRange });
  }, [maxDateRange]);

  useEffect(() => {
    function getAverageSeriesData(seriesData) {
      const scotlandData = seriesData.get(FEATURE_CODE_SCOTLAND);
      if (!regionCode || !scotlandData) {
        return scotlandData;
      }
      if (chartType === PERCENTAGE_TESTS) {
        return scotlandData;
      }
      const populationProportion = populationProportionMap.get(regionCode);
      if (!populationProportion) {
        return null;
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

    function getChartDatasets(seriesData, datasetLabel) {
      const datasets = [];
      const regionSeriesData = seriesData.get(regionCode);
      if (regionSeriesData !== undefined) {
        datasets.push(
          datasetConfiguration(
            datasetLabel,
            regionSeriesData,
            REGION_DATASET_COLOUR
          )
        );
        if (regionCode !== FEATURE_CODE_SCOTLAND) {
          const averageSeriesData = getAverageSeriesData(seriesData);
          if (averageSeriesData) {
            datasets.push(
              datasetConfiguration(
                getAverageSeriesLabel(),
                getAverageSeriesData(seriesData),
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
      seriesData,
      additionalConfiguration,
      sonificationLabel
    ) {
      const datasets = getChartDatasets(seriesData, datasetLabel);
      const chartConfiguration = commonChartConfiguration(
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
        seriesData.get(regionCode),
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

    if (chartInstance.current !== null) {
      chartInstance.current.destroy();
    }

    if (chartType === DAILY_CASES) {
      setChart(dailyCasesDatasetLabel, dailyCasesSeriesData);
    } else if (chartType === DAILY_DEATHS) {
      setChart(dailyDeathsDatasetLabel, dailyDeathsSeriesData);
    } else if (chartType === TOTAL_CASES) {
      setChart(totalCasesDatasetLabel, totalCasesSeriesData);
    } else if (chartType === TOTAL_DEATHS) {
      setChart(totalDeathsDatasetLabel, totalDeathsSeriesData);
    } else if (chartType === PERCENTAGE_TESTS) {
      setChart(
        percentageTestsDatasetLabel,
        percentageTestsSeriesData,
        percentageTestsChartConfiguration,
        "Percentage tests positive"
      );
    }
  }, [
    percentageTestsSeriesData,
    dailyCasesSeriesData,
    dailyDeathsSeriesData,
    totalCasesSeriesData,
    totalDeathsSeriesData,
    chartType,
    populationProportionMap,
    regionCode,
    dateRange,
    darkmode,
  ]);

  const isDataReady = () => {
    if (chartType === DAILY_CASES) {
      return dailyCasesSeriesData !== null;
    }
    if (chartType === DAILY_DEATHS) {
      return dailyDeathsSeriesData !== null;
    }
    if (chartType === TOTAL_CASES) {
      return totalCasesSeriesData !== null;
    }
    if (chartType === TOTAL_DEATHS) {
      return totalDeathsSeriesData !== null;
    }
    if (chartType === PERCENTAGE_TESTS) {
      return percentageTestsSeriesData !== null;
    }
    return false;
  };

  function getScreenModeClassName() {
    return isDataReady() ? "chart-container" : "chart-container hidden-chart";
  }

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

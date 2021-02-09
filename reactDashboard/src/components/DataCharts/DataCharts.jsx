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
import {
  createPlaceDateValuesMap,
  getNhsCsvDataDateRange,
  FEATURE_CODE_SCOTLAND,
} from "../Utils/CsvUtils";
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

// Exported for tests
export function parseNhsCsvData(csvData) {
  const { dates, placeDateValuesMap } = createPlaceDateValuesMap(csvData);

  const regionDailyCasesMap = new Map();
  const regionDailyDeathsMap = new Map();
  const regionTotalCasesMap = new Map();
  const regionTotalDeathsMap = new Map();
  const regionPercentageTestsMap = new Map();

  const places = [...placeDateValuesMap.keys()];
  places.forEach((place) => {
    const dateValuesMap = placeDateValuesMap.get(place);

    const percentageTestsPoints = [];
    const dailyCasesPoints = [];
    const dailyDeathsPoints = [];
    const totalCasesPoints = [];
    const totalDeathsPoints = [];

    dates.forEach((date, i) => {
      const {
        cases,
        deaths,
        cumulativeCases,
        cumulativeDeaths,
        positivePercentage,
      } = dateValuesMap.get(date);

      percentageTestsPoints.push({
        t: date,
        y: positivePercentage,
      });
      dailyCasesPoints.push({
        t: date,
        y: cases,
      });
      dailyDeathsPoints.push({
        t: date,
        y: deaths,
      });
      totalCasesPoints.push({
        t: date,
        y: cumulativeCases,
      });
      totalDeathsPoints.push({
        t: date,
        y: cumulativeDeaths,
      });
    });
    regionPercentageTestsMap.set(place, percentageTestsPoints);
    regionDailyCasesMap.set(place, dailyCasesPoints);
    regionDailyDeathsMap.set(place, dailyDeathsPoints);
    regionTotalCasesMap.set(place, totalCasesPoints);
    regionTotalDeathsMap.set(place, totalDeathsPoints);
  });

  return {
    regionPercentageTestsMap: regionPercentageTestsMap,
    regionDailyCasesMap: regionDailyCasesMap,
    regionDailyDeathsMap: regionDailyDeathsMap,
    regionTotalCasesMap: regionTotalCasesMap,
    regionTotalDeathsMap: regionTotalDeathsMap,
  };
}

const DataCharts = ({
  healthBoardDataset = null,
  darkmode,
  councilAreaDataset = null,
  regionCode = FEATURE_CODE_SCOTLAND,
  populationProportionMap = new Map(),
}) => {
  const chartContainer = useRef();
  const chartInstance = useRef(null);
  const [percentageTestsSeriesData, setPercentageTestsSeriesData] = useState(
    new Map()
  );
  const [dailyCasesSeriesData, setDailyCasesSeriesData] = useState(new Map());
  const [dailyDeathsSeriesData, setDailyDeathsSeriesData] = useState(new Map());
  const [totalCasesSeriesData, setTotalCasesSeriesData] = useState(new Map());
  const [totalDeathsSeriesData, setTotalDeathsSeriesData] = useState(new Map());
  const [audio, setAudio] = useState(null);
  const [seriesTitle, setSeriesTitle] = useState("No data");
  const [chartType, setChartType] = useState(DAILY_CASES);
  const [dateRange, setDateRange] = useState({
    startDate: 0,
    endDate: 1,
  });
  const [maxDateRange, setMaxDateRange] = useState({
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
    if (healthBoardDataset != null) {
      const {
        regionPercentageTestsMap,
        regionDailyCasesMap,
        regionDailyDeathsMap,
        regionTotalCasesMap,
        regionTotalDeathsMap,
      } = parseNhsCsvData(healthBoardDataset);

      setPercentageTestsSeriesData(
        (existingMap) => new Map([...existingMap, ...regionPercentageTestsMap])
      );
      setDailyCasesSeriesData(
        (existingMap) => new Map([...existingMap, ...regionDailyCasesMap])
      );
      setDailyDeathsSeriesData(
        (existingMap) => new Map([...existingMap, ...regionDailyDeathsMap])
      );
      setTotalCasesSeriesData(
        (existingMap) => new Map([...existingMap, ...regionTotalCasesMap])
      );
      setTotalDeathsSeriesData(
        (existingMap) => new Map([...existingMap, ...regionTotalDeathsMap])
      );
    }
  }, [healthBoardDataset]);

  useEffect(() => {
    if (councilAreaDataset != null) {
      const {
        regionPercentageTestsMap,
        regionDailyCasesMap,
        regionDailyDeathsMap,
        regionTotalCasesMap,
        regionTotalDeathsMap,
      } = parseNhsCsvData(councilAreaDataset);

      setPercentageTestsSeriesData(
        (existingMap) => new Map([...existingMap, ...regionPercentageTestsMap])
      );
      setDailyCasesSeriesData(
        (existingMap) => new Map([...existingMap, ...regionDailyCasesMap])
      );
      setDailyDeathsSeriesData(
        (existingMap) => new Map([...existingMap, ...regionDailyDeathsMap])
      );
      setTotalCasesSeriesData(
        (existingMap) => new Map([...existingMap, ...regionTotalCasesMap])
      );
      setTotalDeathsSeriesData(
        (existingMap) => new Map([...existingMap, ...regionTotalDeathsMap])
      );
    }
  }, [councilAreaDataset]);

  useEffect(() => {
    if (healthBoardDataset != null) {
      const parseDateRange = getNhsCsvDataDateRange(
        healthBoardDataset,
        councilAreaDataset
      );
      setMaxDateRange(parseDateRange);
      setDateRange(parseDateRange);
    }
  }, [healthBoardDataset, councilAreaDataset]);

  useEffect(() => {
    function getAverageSeriesData(seriesData, regionCode, chartType) {
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

    function getAverageSeriesLabel(chartType) {
      return chartType === PERCENTAGE_TESTS
        ? "Scotland average"
        : "Scotland average (adjusted for population)";
    }

    function getChartDatasets(chartType, seriesData, regionCode, datasetLabel) {
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
          const averageSeriesData = getAverageSeriesData(
            seriesData,
            regionCode,
            chartType
          );
          if (averageSeriesData) {
            datasets.push(
              datasetConfiguration(
                getAverageSeriesLabel(chartType),
                getAverageSeriesData(seriesData, regionCode, chartType),
                AVERAGE_DATASET_COLOUR,
                AVERAGE_DATASET_FILL_COLOUR
              )
            );
          }
        }
      }
      console.error("getChartDatasets datasets", JSON.stringify(datasets));
      return datasets;
    }

    function setChart(
      chartType,
      datasetLabel,
      seriesData,
      regionCode,
      additionalConfiguration,
      sonificationLabel
    ) {
      const datasets = getChartDatasets(
        chartType,
        seriesData,
        regionCode,
        datasetLabel
      );
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

    function setSonification(seriesData, seriesTitle) {
      if (seriesData !== null && seriesData !== undefined) {
        setAudio(seriesData);
        setSeriesTitle(seriesTitle);
      }
    }

    if (chartInstance.current !== null) {
      chartInstance.current.destroy();
    }

    if (chartType === DAILY_CASES) {
      setChart(
        chartType,
        dailyCasesDatasetLabel,
        dailyCasesSeriesData,
        regionCode
      );
    } else if (chartType === DAILY_DEATHS) {
      setChart(
        chartType,
        dailyDeathsDatasetLabel,
        dailyDeathsSeriesData,
        regionCode
      );
    } else if (chartType === TOTAL_CASES) {
      setChart(
        chartType,
        totalCasesDatasetLabel,
        totalCasesSeriesData,
        regionCode
      );
    } else if (chartType === TOTAL_DEATHS) {
      setChart(
        chartType,
        totalDeathsDatasetLabel,
        totalDeathsSeriesData,
        regionCode
      );
    } else if (chartType === PERCENTAGE_TESTS) {
      setChart(
        chartType,
        percentageTestsDatasetLabel,
        percentageTestsSeriesData,
        regionCode,
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
          dateRange={dateRange}
          setDateRange={setDateRange}
          maxDateRange={maxDateRange}
          setMaxDateRange={setMaxDateRange}
        />
      </Row>
      <Row className="d-flex justify-content-center">
        <DateRangeSlider
          id="date-range-slider-position"
          dateRange={dateRange}
          setDateRange={setDateRange}
          healthBoardDataset={healthBoardDataset}
          councilAreaDataset={councilAreaDataset}
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
};

export default DataCharts;

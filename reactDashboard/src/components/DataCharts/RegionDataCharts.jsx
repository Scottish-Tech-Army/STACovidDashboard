import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js";
import "./DataCharts.css";
import "../../common.css";
import moment from "moment";
import DateRangeSlider from "./DateRangeSlider";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import SonificationPlayButton from "./SonificationPlayButton";
import {
  PERCENTAGE_CASES,
  DAILY_CASES,
  DAILY_DEATHS,
  TOTAL_CASES,
  TOTAL_DEATHS,
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
import "chartjs-plugin-annotation";


// Exported for tests
export function getPopulationMap(placeDateValuesResult) {
  const { dates, placeDateValuesMap } = placeDateValuesResult;

  const populationMap = new Map();
  const finalDate = dates[dates.length - 1];

  const places = [...placeDateValuesMap.keys()];
  places.forEach((place) => {
    const dateValuesMap = placeDateValuesMap.get(place);
    const { cumulativeCases, crudeRatePositive } = dateValuesMap.get(finalDate);
    if (crudeRatePositive === 0) {
      populationMap.set(place, 0);
    } else {
      const population = 100000 * (cumulativeCases / crudeRatePositive);
      populationMap.set(place, population);
    }
  });

  return populationMap;
}

// Exported for tests
export function parseNhsCsvData(csvData) {
  const { dates, placeDateValuesMap } = createPlaceDateValuesMap(csvData);

  const regionDailyCasesMap = new Map();
  const regionDailyDeathsMap = new Map();
  const regionTotalCasesMap = new Map();
  const regionTotalDeathsMap = new Map();
  const regionPercentageCasesMap = new Map();

  const places = [...placeDateValuesMap.keys()];
  places.forEach((place) => {
    const dateValuesMap = placeDateValuesMap.get(place);

    const percentageCasesPoints = [];
    const dailyCasesPoints = [];
    const dailyDeathsPoints = [];
    const totalCasesPoints = [];
    const totalDeathsPoints = [];

    function get5DayDiff(valueMap, key, endDate, dateSet) {
      const maximumStartDate = moment(endDate).subtract(5, "days");
      for (let i = dateSet.length - 1; i >= 0; i--) {
        if (maximumStartDate.isSameOrAfter(dateSet[i])) {
          const startDate = dateSet[i];
          return valueMap.get(endDate)[key] - valueMap.get(startDate)[key];
        }
      }
      // Entire dataset is withing the 5 day window - just return the end cumulative total
      return valueMap.get(endDate)[key];
    }

    dates.forEach((date) => {
      const {
        cases,
        deaths,
        cumulativeCases,
        cumulativeDeaths,
      } = dateValuesMap.get(date);

      const positiveCases5DayWindow = get5DayDiff(
        dateValuesMap,
        "cumulativeCases",
        date,
        dates
      );
      const negativeCases5DayWindow = get5DayDiff(
        dateValuesMap,
        "cumulativeNegativeTests",
        date,
        dates
      );
      const totalCases5DayWindow =
        positiveCases5DayWindow + negativeCases5DayWindow;

      percentageCasesPoints.push({
        t: date,
        y:
          totalCases5DayWindow === 0
            ? 0
            : (positiveCases5DayWindow * 100) / totalCases5DayWindow,
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
    regionPercentageCasesMap.set(place, percentageCasesPoints);
    regionDailyCasesMap.set(place, dailyCasesPoints);
    regionDailyDeathsMap.set(place, dailyDeathsPoints);
    regionTotalCasesMap.set(place, totalCasesPoints);
    regionTotalDeathsMap.set(place, totalDeathsPoints);
  });

  const populationMap = getPopulationMap({ dates, placeDateValuesMap });

  return {
    regionPercentageCasesMap: regionPercentageCasesMap,
    regionDailyCasesMap: regionDailyCasesMap,
    regionDailyDeathsMap: regionDailyDeathsMap,
    regionTotalCasesMap: regionTotalCasesMap,
    regionTotalDeathsMap: regionTotalDeathsMap,
    populationMap: populationMap,
  };
}

// Exported for tests
export function calculatePopulationProportionMap(populationMap) {
  const result = new Map();

  const scotlandPopulation = populationMap.get(FEATURE_CODE_SCOTLAND);
  if (scotlandPopulation !== undefined) {
    const places = [...populationMap.keys()];
    places.forEach((place) => {
      const population = populationMap.get(place);
      result.set(place, population / scotlandPopulation);
    });
  }
  return result;
}

const RegionDataCharts = ({
  healthBoardDataset = null,
  councilAreaDataset = null,
  regionCode = FEATURE_CODE_SCOTLAND,
  showPercentageTests = true,
}) => {
  const chartContainer = useRef();
  const chartInstance = useRef(null);
  const [percentageCasesSeriesData, setPercentageCasesSeriesData] = useState(
    new Map()
  );
  const [dailyCasesSeriesData, setDailyCasesSeriesData] = useState(new Map());
  const [dailyDeathsSeriesData, setDailyDeathsSeriesData] = useState(new Map());
  const [totalCasesSeriesData, setTotalCasesSeriesData] = useState(new Map());
  const [totalDeathsSeriesData, setTotalDeathsSeriesData] = useState(new Map());
  const [audio, setAudio] = useState(null);
  const [seriesTitle, setSeriesTitle] = useState("No data");
  const [populationMap, setPopulationMap] = useState(new Map());
  const [populationProportionMap, setPopulationProportionMap] = useState(
    new Map()
  );
  const [chartType, setChartType] = useState(DAILY_CASES);
  const [dateRange, setDateRange] = useState({
    startDate: 0,
    endDate: 1,
  });
  const [maxDateRange, setMaxDateRange] = useState({
    startDate: 0,
    endDate: 1,
  });

  const percentageCasesDatasetLabel =
    "% of Positive Tests (5 day moving average)";
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
        regionPercentageCasesMap,
        regionDailyCasesMap,
        regionDailyDeathsMap,
        regionTotalCasesMap,
        regionTotalDeathsMap,
        populationMap,
      } = parseNhsCsvData(healthBoardDataset);

      setPercentageCasesSeriesData(
        (existingMap) => new Map([...existingMap, ...regionPercentageCasesMap])
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
      setPopulationMap(
        (existingMap) => new Map([...existingMap, ...populationMap])
      );
    }
  }, [healthBoardDataset]);

  useEffect(() => {
    if (councilAreaDataset != null) {
      const {
        regionPercentageCasesMap,
        regionDailyCasesMap,
        regionDailyDeathsMap,
        regionTotalCasesMap,
        regionTotalDeathsMap,
        populationMap,
      } = parseNhsCsvData(councilAreaDataset);

      setPercentageCasesSeriesData(
        (existingMap) => new Map([...existingMap, ...regionPercentageCasesMap])
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
      setPopulationMap(
        (existingMap) => new Map([...existingMap, ...populationMap])
      );
    }
  }, [councilAreaDataset]);

  useEffect(() => {
    setPopulationProportionMap(calculatePopulationProportionMap(populationMap));
  }, [populationMap]);

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
    function getAverageSeriesData(seriesData, regionCode) {
      if (regionCode == null) {
        return seriesData.get(FEATURE_CODE_SCOTLAND);
      }
      const populationProportion = populationProportionMap.get(regionCode);
      const scotlandData = seriesData.get(FEATURE_CODE_SCOTLAND);
      if (scotlandData == null) {
        return null;
      }
      const scaledSeries = scotlandData.map(({ t, y }) => {
        return {
          t: t,
          y: y * populationProportion,
        };
      });
      return scaledSeries;
    }

    const REGION_DATASET_COLOUR = "#ec6730";
    const AVERAGE_DATASET_COLOUR = "blue";

    function setChart(
      datasetLabel,
      seriesData,
      regionCode,
      additionalConfiguration,
      sonificationLabel
    ) {
      const datasets = [
        datasetConfiguration(
          datasetLabel,
          seriesData.get(regionCode),
          REGION_DATASET_COLOUR
        ),
      ];
      if (regionCode !== FEATURE_CODE_SCOTLAND) {
        datasets.push(
          datasetConfiguration(
            datasetLabel + " (Scotland average adjusted for population)",
            getAverageSeriesData(seriesData, regionCode),
            AVERAGE_DATASET_COLOUR
          )
        );
      }
      const chartConfiguration = commonChartConfiguration(datasets, dateRange);
      chartConfiguration.options.tooltips = {
        callbacks: {
          label: (tooltipItem, data) => {
            return (
              data.datasets[tooltipItem.datasetIndex].label +
              ": " +
              (Number.isInteger(tooltipItem.yLabel)
                ? tooltipItem.yLabel
                : tooltipItem.yLabel.toFixed(1))
            );
          },
        },
      };

      if (additionalConfiguration) {
          console.log(chartConfiguration.options.annotation.annotations.length)
        additionalConfiguration(chartConfiguration);
        console.log(chartConfiguration.options.annotation.annotations.length)
      }

      const chartRef = chartContainer.current.getContext("2d");
      chartInstance.current = new Chart(chartRef, chartConfiguration);

      setSonification(
        seriesData.get(regionCode),
        sonificationLabel !== undefined ? sonificationLabel : datasetLabel
      );
    }

    function percentageCasesChartConfiguration(configuration) {
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
      setChart(dailyCasesDatasetLabel, dailyCasesSeriesData, regionCode);
    } else if (chartType === DAILY_DEATHS) {
      setChart(dailyDeathsDatasetLabel, dailyDeathsSeriesData, regionCode);
    } else if (chartType === TOTAL_CASES) {
      setChart(totalCasesDatasetLabel, totalCasesSeriesData, regionCode);
    } else if (chartType === TOTAL_DEATHS) {
      setChart(totalDeathsDatasetLabel, totalDeathsSeriesData, regionCode);
    } else if (chartType === PERCENTAGE_CASES) {
      setChart(
        percentageCasesDatasetLabel,
        percentageCasesSeriesData,
        regionCode,
        percentageCasesChartConfiguration,
        "Percentage tests positive"
      );
    }
  }, [
    percentageCasesSeriesData,
    dailyCasesSeriesData,
    dailyDeathsSeriesData,
    totalCasesSeriesData,
    totalDeathsSeriesData,
    chartType,
    populationProportionMap,
    regionCode,
    dateRange,
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
    if (chartType === PERCENTAGE_CASES) {
      return percentageCasesSeriesData !== null;
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
          <ChartDropdown
            chartType={chartType}
            setChartType={setChartType}
            showPercentageTests={showPercentageTests}
          />
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
        />
        <div className={getScreenModeClassName()}>
          <canvas ref={chartContainer} />
        </div>
        {isDataReady() ? <></> : <LoadingComponent />}
      </Row>
    </Container>
  );
};

export default RegionDataCharts;

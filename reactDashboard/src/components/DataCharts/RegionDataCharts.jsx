import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js";
import "./DataCharts.css";
import "../../common.css";
import DateRangeSlider from "./DateRangeSlider";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import SonificationPlayButton from "./SonificationPlayButton";
import {
  DAILY_CASES,
  DAILY_DEATHS,
  TOTAL_CASES,
  TOTAL_DEATHS,
} from "../DataCharts/DataChartsConsts";
import {
  createPlaceDateValuesMap,
  FEATURE_CODE_SCOTLAND,
} from "../Utils/CsvUtils";
import {
  commonChartConfiguration,
  datasetConfiguration,
} from "./DataChartsUtils";
import QuickSelectDateRange from "./QuickSelectDateRange";
import ChartDropdown from "../ChartDropdown/ChartDropdown";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Exported for tests
export function getPopulationMap(placeDateValuesResult) {
  const { dates, placeDateValuesMap } = placeDateValuesResult;

  const populationMap = new Map();
  var populationTotal = 0;
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
      populationTotal += population;
    }
  });

  populationMap.set(FEATURE_CODE_SCOTLAND, populationTotal);
  return populationMap;
}

// Exported for tests
export function addAggregateSeries(placeSeriesMap, key) {
  const aggregatePoints = [];
  const series = [...placeSeriesMap.values()];
  const points = series[0].length;
  for (let i = 0; i < points; i++) {
    var sum = 0;
    for (let j = 0; j < series.length; j++) {
      sum += series[j][i].y;
    }
    aggregatePoints.push({
      t: series[0][i].t,
      y: sum,
    });
  }

  placeSeriesMap.set(FEATURE_CODE_SCOTLAND, aggregatePoints);
}

// Exported for tests
export function parseNhsCsvData(csvData) {
  const { dates, placeDateValuesMap } = createPlaceDateValuesMap(csvData);

  const regionDailyCasesMap = new Map();
  const regionDailyDeathsMap = new Map();
  const regionTotalCasesMap = new Map();
  const regionTotalDeathsMap = new Map();

  const places = [...placeDateValuesMap.keys()];
  places.forEach((place) => {
    const dateValuesMap = placeDateValuesMap.get(place);

    const dailyCasesPoints = [];
    const dailyDeathsPoints = [];
    const totalCasesPoints = [];
    const totalDeathsPoints = [];

    dates.forEach((date) => {
      const {
        cases,
        deaths,
        cumulativeCases,
        cumulativeDeaths,
      } = dateValuesMap.get(date);

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
    regionDailyCasesMap.set(place, dailyCasesPoints);
    regionDailyDeathsMap.set(place, dailyDeathsPoints);
    regionTotalCasesMap.set(place, totalCasesPoints);
    regionTotalDeathsMap.set(place, totalDeathsPoints);
  });

  const populationMap = getPopulationMap({ dates, placeDateValuesMap });
  const scotlandPopulation = populationMap.get(FEATURE_CODE_SCOTLAND);
  const populationProportionMap = new Map();
  places.forEach((place) => {
    const population = populationMap.get(place);
    populationProportionMap.set(place, population / scotlandPopulation);
  });

  addAggregateSeries(regionDailyCasesMap);
  addAggregateSeries(regionDailyDeathsMap);
  addAggregateSeries(regionTotalCasesMap);
  addAggregateSeries(regionTotalDeathsMap);

  return {
    regionDailyCasesMap: regionDailyCasesMap,
    regionDailyDeathsMap: regionDailyDeathsMap,
    regionTotalCasesMap: regionTotalCasesMap,
    regionTotalDeathsMap: regionTotalDeathsMap,
    populationMap: populationMap,
    populationProportionMap: populationProportionMap,
  };
}

const RegionDataCharts = ({
  chartType = DAILY_CASES,
  setChartType,
  healthBoardDataset = null,
  councilAreaDataset = null,
  regionCode = null,
  dateRange,
  setDateRange,
  maxDateRange,
  setMaxDateRange,
}) => {
  const chartContainer = useRef();
  const chartInstance = useRef(null);
  const [dailyCasesSeriesData, setDailyCasesSeriesData] = useState(new Map());
  const [dailyDeathsSeriesData, setDailyDeathsSeriesData] = useState(new Map());
  const [totalCasesSeriesData, setTotalCasesSeriesData] = useState(new Map());
  const [totalDeathsSeriesData, setTotalDeathsSeriesData] = useState(new Map());
  const [audio, setAudio] = useState(null);
  const [seriesTitle, setSeriesTitle] = useState("No data");
  const [populationProportionMap, setPopulationProportionMap] = useState(
    new Map()
  );

  const dailyCasesDatasetLabel = "Daily Cases";
  const dailyDeathsDatasetLabel = "Daily Deaths";
  const totalCasesDatasetLabel = "Total Cases";
  const totalDeathsDatasetLabel = "Total Deaths";

  useEffect(() => {
    if (healthBoardDataset != null) {
      const {
        regionDailyCasesMap,
        regionDailyDeathsMap,
        regionTotalCasesMap,
        regionTotalDeathsMap,
        populationProportionMap,
      } = parseNhsCsvData(healthBoardDataset);
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
      setPopulationProportionMap(
        (existingMap) => new Map([...existingMap, ...populationProportionMap])
      );
    }
  }, [healthBoardDataset]);

  useEffect(() => {
    if (councilAreaDataset != null) {
      const {
        regionDailyCasesMap,
        regionDailyDeathsMap,
        regionTotalCasesMap,
        regionTotalDeathsMap,
        populationProportionMap,
      } = parseNhsCsvData(councilAreaDataset);
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
      setPopulationProportionMap(
        (existingMap) => new Map([...existingMap, ...populationProportionMap])
      );
    }
  }, [councilAreaDataset]);

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

    function setChart(datasetLabel, seriesData, regionCode) {
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

      const chartRef = chartContainer.current.getContext("2d");
      chartInstance.current = new Chart(chartRef, chartConfiguration);
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
      setSonification(
        dailyCasesSeriesData.get(regionCode),
        dailyCasesDatasetLabel
      );
    } else if (chartType === DAILY_DEATHS) {
      setChart(dailyDeathsDatasetLabel, dailyDeathsSeriesData, regionCode);
      setSonification(
        dailyDeathsSeriesData.get(regionCode),
        dailyDeathsDatasetLabel
      );
    } else if (chartType === TOTAL_CASES) {
      setChart(totalCasesDatasetLabel, totalCasesSeriesData, regionCode);
      setSonification(
        totalCasesSeriesData.get(regionCode),
        totalCasesDatasetLabel
      );
    } else if (chartType === TOTAL_DEATHS) {
      setChart(totalDeathsDatasetLabel, totalDeathsSeriesData, regionCode);
      if (totalDeathsSeriesData.get(regionCode) !== undefined) {
        setSonification(
          totalDeathsSeriesData.get(regionCode),
          totalDeathsDatasetLabel
        );
      }
    }
  }, [
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
        <ChartDropdown chartType={chartType} setChartType={setChartType} showPercentageTests={false} />

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

import React from "react";
import GeoHeatMapContainer from "./GeoHeatMap";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import GeoHeatMap from "../components/GeoHeatMap/GeoHeatMap";
import { readCsvData } from "../components/Utils/CsvUtils";

jest.mock("../components/GeoHeatMap/GeoHeatMap", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => <div></div>),
  };
});

var container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  GeoHeatMap.mockClear();
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("empty render", async () => {
  act(() => {
    render(<GeoHeatMapContainer />, container);
  });

  expect(GeoHeatMap).toHaveBeenLastCalledWith(
    {
      percentageTestsSeriesData: undefined,
      dailyCasesSeriesData: undefined,
      dailyDeathsSeriesData: undefined,
      totalCasesSeriesData: undefined,
      totalDeathsSeriesData: undefined,
      darkmode: undefined,
      regionCode: undefined,
      populationProportionMap: undefined,
      maxDateRange: undefined,
    },
    {}
  );
});

const mockToggleFullscreen = jest.fn();
const mockSetAreaType = jest.fn();
const mockSetValueType = jest.fn();

test("default render", async () => {
  act(() => {
    render(
      <GeoHeatMapContainer
        councilAreaDataset={councilAreaDataset}
        healthBoardDataset={healthBoardDataset}
        valueType="cases"
        areaType="health boards"
        toggleFullscreen={mockToggleFullscreen}
        fullscreenEnabled={true}
        setAreaType={mockSetAreaType}
        setValueType={mockSetValueType}
        darkmode={true}
      />,
      container
    );
  });

  expect(GeoHeatMap).toHaveBeenLastCalledWith(
    {
      sevenDayDataset: sevenDayDataset,
      valueType: "cases",
      areaType: "health boards",
      toggleFullscreen: mockToggleFullscreen,
      fullscreenEnabled: true,
      setAreaType: mockSetAreaType,
      setValueType: mockSetValueType,
      darkmode: true,
    },
    {}
  );
});

const nhsHBCsvData = `Date,HB,HBName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,DailyNegative,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,TotalPillar1,TotalPillar2,HospitalAdmissions,HospitalAdmissionsQF,ICUAdmissions,ICUAdmissionsQF
20200302,S08000031,unknown,1,2,2,0,5,6,7,8,9,0,0,0,0.1
20200302,S08000022,unknown,11,12,6,0,15,16,17,18,19,0,0,0,1.1
20200302,S92000003,Scotland,33,36,4.133333333333334,0,45,48,17,54,19,0,0,0,3.3
20200303,S08000031,unknown,31,32,32,0,35,36,37,38,39,0,0,0,3.1
20200303,S08000022,unknown,41,42,21,0,45,46,47,48,49,0,0,0,4.1
20200303,S92000003,Scotland,123,126,21.133333333333333,0,135,138,47,144,49,0,0,0,12.3
20200304,S08000031,unknown,61,62,62,0,65,66,67,68,69,0,0,0,6.1
20200304,S08000022,unknown,71,72,36,0,75,76,77,78,79,0,0,0,7.1
20200304,S92000003,Scotland,213,216,38.13333333333333,0,225,228,77,234,79,0,0,0,21.3
20200305,S08000031,unknown,91,92,92,0,95,96,97,98,99,0,0,0,9.1
20200305,S08000022,unknown,101,102,51,0,105,106,107,108,109,0,0,0,10.1
20200305,S92000003,Scotland,303,306,55.13333333333333,0,315,318,107,324,109,0,0,0,30.3
20200306,S08000031,unknown,121,122,122,0,125,126,127,128,129,0,0,0,12.1
20200306,S08000022,unknown,131,132,66,0,135,136,137,138,139,0,0,0,13.1
20200306,S92000003,Scotland,393,396,72.13333333333334,0,405,408,137,414,139,0,0,0,39.3
20200307,S08000031,unknown,151,152,152,0,155,156,157,158,159,0,0,0,15.1
20200307,S08000022,unknown,161,162,81,0,165,166,167,168,169,0,0,0,16.1
20200307,S92000003,Scotland,483,486,89.13333333333333,0,495,498,167,504,169,0,0,0,48.3
20200308,S08000031,unknown,181,182,182,0,185,186,187,188,189,0,0,0,18.1
20200308,S08000022,unknown,191,192,96,0,195,196,197,198,199,0,0,0,19.1
20200308,S92000003,Scotland,573,576,106.13333333333333,0,585,588,197,594,199,0,0,0,57.3
20200309,S08000031,unknown,211,212,212,0,215,216,217,218,219,0,0,0,21.1
20200309,S08000022,unknown,221,222,111,0,225,226,227,228,229,0,0,0,22.1
20200309,S92000003,Scotland,663,888,111,0,675,678,227,684,229,0,0,0,66.3
`;

const nhsCACsvData = `Date,CA,CAName,DailyPositive,CumulativePositive,CrudeRatePositive,CrudeRate7DayPositive,DailyDeaths,CumulativeDeaths,CrudeRateDeaths,DailyNegative,CumulativeNegative,CrudeRateNegative,TotalTests,PositiveTests,PositivePercentage,TotalPillar1,TotalPillar2,HospitalAdmissions,HospitalAdmissionsQF,ICUAdmissions,ICUAdmissionsQF
20200302,S12000013,unknown,21,22,4.4,0,25,26,27,28,29,0,0,0,2.1
20200303,S12000013,unknown,51,52,10.4,0,55,56,57,58,59,0,0,0,5.1
20200304,S12000013,unknown,81,82,16.4,0,85,86,87,88,89,0,0,0,8.1
20200305,S12000013,unknown,111,112,22.4,0,115,116,117,118,119,0,0,0,11.1
20200306,S12000013,unknown,141,142,28.4,0,145,146,147,148,149,0,0,0,14.1
20200307,S12000013,unknown,171,172,34.4,0,175,176,177,178,179,0,0,0,17.1
20200308,S12000013,unknown,201,202,40.4,0,205,206,207,208,209,0,0,0,20.1
20200309,S12000013,unknown,231,232,46.4,0,235,236,237,238,239,0,0,0,23.1
`;

const healthBoardDataset = readCsvData(nhsHBCsvData);

const councilAreaDataset = readCsvData(nhsCACsvData);

const WEEK_START_DATE = Date.parse("2020-03-03");
const WEEK_END_DATE = Date.parse("2020-03-09");

const sevenDayDataset = new Map()
  .set("S12000013", {
    fromDate: WEEK_START_DATE,
    name: "Na h-Eileanan Siar",
    toDate: WEEK_END_DATE,
    weeklyCases: 987,
    weeklyDeaths: 1015,
  })
  .set("S92000003", {
    fromDate: WEEK_START_DATE,
    name: "Scotland",
    toDate: WEEK_END_DATE,
    weeklyCases: 4515,
    weeklyDeaths: 4655,
  })
  .set("S08000031", {
    fromDate: WEEK_START_DATE,
    name: "Greater Glasgow & Clyde",
    toDate: WEEK_END_DATE,
    weeklyCases: 847,
    weeklyDeaths: 875,
  })
  .set("S08000022", {
    fromDate: WEEK_START_DATE,
    name: "Highland",
    toDate: WEEK_END_DATE,
    weeklyCases: 917,
    weeklyDeaths: 945,
  });

import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js';
import './PercentTestsChart.css';

const defaultInputData = {
  t: [
    "2020-04-06",
    "2020-04-07",
    "2020-04-08",
    "2020-04-09",
    "2020-04-10",
    "2020-04-11"
  ],
  y: [
    5,
    7,
    12,
    16,
    25,
    22
  ]
}

const PercentTestsChart = ({inputData=defaultInputData}) => {
  const chartContainer = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const createSeriesData = ({t,y}) => {
    if (t.length !== y.length) {
      throw new Error("Array lengths don't match");
    }
    return t.map((k, i) => {
      return {t:Date.parse(k), y:y[i]}
    });
  }

  const chartConfig = (inputData) => {
    return {
    type: 'line',
        data: {
            datasets: [{
                label: '% of Positive Tests',
                data: createSeriesData(inputData)
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        maxTicksLimit: 100
                    },
                }],
                xAxes: [{
                  type: 'time',
                  distribution: 'series'
                }]
            }
        }
      }
  }

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      const newChartInstance = new Chart(chartContainer.current, chartConfig(inputData));
      setChartInstance(newChartInstance);
    }
  }, [inputData, chartContainer]);



  return (
    <div className="chart-container">
      <canvas
        ref={chartContainer}/>
    </div>
  );
};

export default PercentTestsChart;

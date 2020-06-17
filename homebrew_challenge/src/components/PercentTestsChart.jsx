import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js';

const chartConfig = {
  type: 'line',
      data: {
          datasets: [{
              label: '% of Positive Tests',
              data: [{
                t: new Date(2020, 3, 6),
                y: 5
              },
              {
                t: new Date(2020, 3, 7),
                y: 7
              },
              {
                t: new Date(2020, 3, 8),
                y: 12
              },
              {
                t: new Date(2020, 3, 9),
                y: 16
              },
              {
                t: new Date(2020, 3, 10),
                y: 25
              },
              {
                t: new Date(2020, 3, 11),
                y: 22
              }]
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true,
                      maxTicksLimit: 100
                  }
              }],
              xAxes: [{
                type: 'time',
                distribution: 'series'
              }]
          }
      }
}

const PercentTestsChart = () => {
  const chartContainer = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      const newChartInstance = new Chart(chartContainer.current, chartConfig);
      setChartInstance(newChartInstance);
    }
  }, [chartContainer]);

  return (
    <div>
      <canvas
        ref={chartContainer}/>
    </div>
  );
};

export default PercentTestsChart;

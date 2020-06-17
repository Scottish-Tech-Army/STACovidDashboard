import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js';
// import classes from './LineGraph.module.css';

const chartConfig = {
  type: 'line',
      data: {
          dates: ['04/04/2020', '05/04/2020', '06/04/2020', '07/04/2020', '08/04/2020', '09/04/2020'],
          datasets: [{
              label: '% of Positive Tests',
              data: [5, 7, 12, 16, 3, 2]
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true,
                      maxTicksLimit: 100
                  }
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

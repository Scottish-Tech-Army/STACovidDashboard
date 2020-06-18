import React from "react";

// prettier-ignore
const defaultDataset = {
  dates: [
    "1-May", "2-May", "3-May", "4-May", "5-May",
    "6-May", "7-May", "8-May", "9-May","10-May",
    "11-May", "12-May", "13-May", "14-May", "15-May",
  ],
  regions: [
    {
      name: "Edinburgh",
      totalDeaths: "234",
      counts: [ 1, 2, 5, 10, 20, 50, 100, 200, 500, 100, 2000, 5000, 500, 100, 0, ],
    },
    {
      name: "Glasgow",
      totalDeaths: "345",
      counts: [ 20, 50, 100, 200, 500, 100, 2000, 5000, 500, 100, 0, 1, 2, 5, 10, ],
    },
    {
      name: "Aberdeen",
      totalDeaths: "456",
      counts: [ 200, 500, 100, 2000, 5000, 500, 100, 0, 1, 2, 5, 10, 20, 50, 100, ],
    },
  ],
};

function Heatmap({ dataset = defaultDataset }) {
  // Remember to update the css classes if level count changes
  const heatLevels = [0, 10, 100, 500, 1000, 5000];

  function createHeatbar(width, height, elements) {
    const count = elements.length;
    const elementWidth = width / count;
    const offset = elementWidth / 2;

    function createHeatbarline(element, index) {
      const x = offset + elementWidth * index;
      return (
        <line
          key={index}
          className={"l-" + element}
          x1={x}
          y1="0"
          x2={x}
          y2="100%"
          strokeWidth={elementWidth}
        ></line>
      );
    }

    return (
      <svg width={width} height={height}>
        {elements.map(createHeatbarline)}
      </svg>
    );
  }

  function getHeatLevel(count) {
    var i;
    for (i = heatLevels.length - 1; i >= 0; i--) {
      if (heatLevels[i] <= count) {
        return i;
      }
    }
    return 0;
  }

  function createRegionTableline({ name, totalDeaths, counts }, index) {
    return (
      <tr className="area" key={index}>
        <td>{name}</td>
        <td>{totalDeaths}</td>
        <td>{createHeatbar(500, 20, counts.map(getHeatLevel))}</td>
      </tr>
    );
  }

  return (
    <div className="heatmap">
      <table>
        <thead>
          <tr>
            <th>Area</th>
            <th>Total deaths</th>
            <th>Cases over time</th>
          </tr>
        </thead>
        <tbody>{dataset.regions.map(createRegionTableline)}</tbody>
      </table>
    </div>
  );
}

export default Heatmap;

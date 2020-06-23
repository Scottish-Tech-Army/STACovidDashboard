import React, { useState, useEffect } from 'react';
import { format, subDays } from "date-fns";
import L from 'leaflet';
import './GeoHeatMap.css';

// Exported for tests
export function parseCsvData(csvData) {
  function getLatestValue(dateValueMap) {
    const lastDate = [...dateValueMap.keys()].sort().pop();
    return dateValueMap.get(lastDate);
  }

  let allTextLines = csvData.split(/\r\n|\n/);
  let lines = [];

  allTextLines.forEach((line) => {
    if (line.length > 0) {
      lines.push(line.split(",").map((s) => s.trim()));
    }
  });
  lines.shift();

  const valueMap = new Map();

  lines.forEach(([date, areaname, count], i) => {
    if (!valueMap.has(areaname)) {
      valueMap.set(areaname, new Map());
    }
    var dateMap = valueMap.get(areaname);
    dateMap.set(date, (count === '*') ? 0 : Number(count));
  });
  console.log(valueMap);

  const regions = new Map();

  valueMap.forEach((dateMap, areaname) => {
    regions.set( areaname, getLatestValue(dateMap));
  });
  console.log(regions);
  return regions;

};

const latLngs = [
  {
    area: 'Ayrshire and Arran',
    lat: 55.445,
    lng: -4.575
  },
  {
    area: 'Borders',
    lat: 55.2869,
    lng: -2.7861
  },
  {
    area: 'Dumfries and Galloway',
    lat: 55.0701,
    lng: -3.6053
  },
  {
    area: 'Fife',
    lat: 56.2082,
    lng: -3.1495
  },
  {
    area: 'Forth Valley',
    lat: 56.0253,
    lng: -3.8490
  },
  {
    area: 'Grampian',
    lat: 57.1497,
    lng: -2.0943
  },
  {
    area: 'Greater Glasgow and Clyde',
    lat: 55.8836,
    lng: -4.3210
  },
  {
    area: 'Highland',
    lat: 57.4596,
    lng: -4.2264
  },
  {
    area: 'Lanarkshire',
    lat: 55.6736,
    lng: -3.7820
  },
  {
    area: 'Lothian',
    lat: 55.9484,
    lng: -3.2121
  },
  {
    area: 'Orkney',
    lat: 58.9809,
    lng: -2.9605
  },
  {
    area: 'Shetland',
    lat: 60.1580,
    lng: -1.1659
  },
  {
    area: 'Tayside',
    lat: 56.4620,
    lng: -2.970
  },
  {
    area: 'Western Isles',
    lat: 57.1667,
    lng: -7.3594
  }
];

const GeoHeatMap = () => {

  const [dataFetched, setDataFetched] = useState(false);

  const queryUrl = "http://statistics.gov.scot/sparql.csv";

  const calculateRadius = (totalCases) => {
    return Math.sqrt(totalCases) * 500;
  };

  useEffect(() => {

    const query = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dim: <http://purl.org/linked-data/sdmx/2009/dimension#>
    PREFIX qb: <http://purl.org/linked-data/cube#>
    SELECT ?date ?areaname ?count
    WHERE {
      VALUES (?value) {
        ( <http://statistics.gov.scot/def/concept/variable/testing-cumulative-people-tested-for-covid-19-positive> )
       }
       VALUES (?perioduri ?date) {` +
         getDateValueClause() +
      `}
      ?obs qb:dataSet <http://statistics.gov.scot/data/coronavirus-covid-19-management-information> .
      ?obs <http://statistics.gov.scot/def/measure-properties/count> ?count .
      ?obs <http://statistics.gov.scot/def/dimension/variable> ?value .
        ?areauri <http://publishmydata.com/def/ontology/foi/memberOf> <http://statistics.gov.scot/def/foi/collection/health-boards> .
      ?obs dim:refArea ?areauri .
      ?areauri rdfs:label ?areaname.
      ?obs dim:refPeriod ?perioduri .
    }`;

    function getDateValueClause() {
      const today = Date.now();
      const yesterday = subDays(Date.now(), 1);

      const singleLine = (date) => {
        const dateString = format(date, "yyyy-MM-dd");
        return (
          "( <http://reference.data.gov.uk/id/day/" +
          dateString +
          '> "' +
          dateString +
          '" )'
        );
      };

      return singleLine(today) + singleLine(yesterday);
    };

    const createSeeds = (baseLayer, latLngs, totalCases) => {

      latLngs.apply(({area, lat, lng}) => {
        if (totalCases.has(area)) {
          const value = totalCases.get(area);
          L.circle([lat, lng], {
          color: 'red',
          fillColor: 'red',
          fillOpacity: 0.5,
          radius: calculateRadius(value)
        }).addTo(baseLayer).bindPopup(area + ' - Total Cases: ' + value);
      } else {
        console.error("Can't find " + area);
      }
      });
    };

    if (!dataFetched) {
      console.log(query);
      setDataFetched(true);
    // create map
    const geoHeatMap = L.map('map', {
      center: [57.8907, -4.7026],
      zoom: 7.25,
      doubleClickZoom: false,
      closePopupOnClick: false,
      dragging: false,
      zoomSnap: 0.25,
      zoomDelta: false,
      trackResize: false,
      touchZoom: false,
      scrollWheelZoom: false,
      layers:
      L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        attribution:
          '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
      }),
    });


      const form = new FormData();
      form.append("query", query);
      fetch(queryUrl, {
        method: "POST",
        body: form,
      })
        .then((res) => res.text())
        .then((csvData) => {
          console.log(csvData);
          const totalCases = parseCsvData(csvData);
          // setTotalCases(totalCases);
        createSeeds(geoHeatMap, latLngs, totalCases);
      })
        .catch((error) => {
          console.error(error);
        });
    }

  }, [dataFetched]);

  return (
    <>
      <div id="map-container">
        <div id="map"></div>
      </div>
    </>
  )

}

export default GeoHeatMap;

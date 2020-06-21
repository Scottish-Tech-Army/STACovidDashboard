import React, { useEffect } from 'react';
import L from 'leaflet';
import './GeoHeatMap.css';

const defaultInputData = [
  {
    area: 'Ayrshire and Arran',
    lat: 55.445,
    lng: -4.975,
    totalCases: 1249
  },
  {
    area: 'Borders',
    lat: 57.2869,
    lng: -2.3816,
    totalCases: 345
  },
  {
    area: 'Dumfries and Galloway',
    lat: 55.0701,
    lng: -3.6053,
    totalCases: 284
  },
  {
    area: 'Fife',
    lat: 56.2082,
    lng: -3.1495,
    totalCases: 928
  },
  {
    area: 'Forth Valley',
    lat: 56.0253,
    lng: -3.8490,
    totalCases: 1055
  },
  {
    area: 'Grampian',
    lat: 57.1497,
    lng: -2.0943,
    totalCases: 1400
  },
  {
    area: 'Greater Glasgow and Clyde',
    lat: 55.8836,
    lng: -4.3210,
    totalCases: 4819
  },
  {
    area: 'Highland',
    lat: 57.4596,
    lng: -4.2264,
    totalCases: 373
  },
  {
    area: 'Lanarkshire',
    lat: 55.6736,
    lng: -3.7820,
    totalCases: 2698
  },
  {
    area: 'Lothian',
    lat: 55.9484,
    lng: -3.2121,
    totalCases: 3139
  },
  {
    area: 'Orkney',
    lat: 58.9809,
    lng: -2.9605,
    totalCases: 9
  },
  {
    area: 'Shetland',
    lat: 60.5297,
    lng: -1.2659,
    totalCases: 54
  },
  {
    area: 'Tayside',
    lat: 56.4620,
    lng: -2.970,
    totalCases: 1760
  },
  {
    area: 'Eileanan Siar (Western Isles)',
    lat: 57.1667,
    lng: -7.0194,
    totalCases: 7
  }
]

const GeoHeatMap = ({inputData=defaultInputData}) => {

  const areaComponents = inputData.map((a, id) => (

    <div id='area-component' key={id}>
      <h3 className='name'>{a.area}</h3>
      <h4 className='total'>{a.totalCases}</h4>
    </div>

  ));

  const calculateRadius = (totalCases) => {
    return totalCases * 10;
  };

  const createSeeds = (baseLayer) => {

    const circles = inputData.map((a, id) => (

      L.circle([a.lat, a.lng], {
        color: 'red',
        fillColor: 'red',
        fillOpacity: 0.5,
        radius: calculateRadius(a.totalCases)
      }).addTo(baseLayer)
    ));

  };

  useEffect(() => {

    // create map
    const geoHeatMap = L.map('map', {
      center: [57.4907, -4.7026],
      zoom: 7,
      doubleClickZoom: false,
      closePopupOnClick: false,
      dragging: false,
      zoomSnap: false,
      zoomDelta: false,
      trackResize: false,
      touchZoom: false,
      scrollWheelZoom: false,
      layers: [
        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
          attribution:
            '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        }),
      ]
    });

    createSeeds(geoHeatMap);

  }, []);

  return (
    <>
      <div className="tracker-grid">
        <div className='tracker-header'>
          <h1 id='title'>Scotland Health Boards Covid-19 Tracker</h1>
          <hr></hr>
          <h3>TOTAL CONFIRMED CASES</h3>
          <h1 id='total-cases' className='numbers'>15,428</h1>
          <h3>Fatal Cases:</h3>
          <h1 className='numbers'>4,070</h1>
          <hr></hr>
        </div>
        <div className='scroll-components'>
          {areaComponents}
        </div>
      </div>
      <div id="map"></div>
    </>
  )

}

export default GeoHeatMap;

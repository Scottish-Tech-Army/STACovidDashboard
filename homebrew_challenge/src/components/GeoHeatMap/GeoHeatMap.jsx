import React, { useEffect } from 'react';
import L from 'leaflet';
import './GeoHeatMap.css';

const GeoHeatMap = () => {

  const calculateRadius = () => {
    //to be refactored to create dynamic value for radius: e.g. (area.casesCount * x)
    return 30000;
  };

  const areas = [
    {
      lat: 57.5907,
      lng: -4.7026
    },
    {
      lat: 57.0907,
      lng: -4.7026
    }
  ]

  const createSeeds = (baseLayer) => {

    const radius = calculateRadius();

    const circles = areas.map((a, id) => (
      L.circle([a.lat, a.lng], {
        color: 'red',
        fillColor: 'red',
        fillOpacity: 0.5,
        radius: radius
      }).addTo(baseLayer)
    ));

  };

  useEffect(() => {

    // create map
    const geoHeatMap = L.map('map', {
      center: [57.4907, -4.7026],
      zoom: 7,
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
      <div className="tracker">
        <h1>Covid-19 Tracker</h1>
        <h2>TOTAL CONFIRMED CASES</h2>
        <h3>300K</h3>
        <ul>
          <li>Active Cases 140,000</li>
          <li>Recovered Cases 130,000</li>
          <li>Fatal Cases 30,000</li>
        </ul>
        <div>
          <h3>Aberdeen City</h3>
        </div>
        <div>
          <h3>Aberdeenshire</h3>
        </div>
      </div>
      <div id="map"></div>
    </>
  )

}

export default GeoHeatMap;

import React, { useEffect } from 'react';
import L from 'leaflet';
import './GeoHeatMap.css';

const GeoHeatMap = () => {

  useEffect(() => {
    // create map
    L.map('map', {
      center: [56.4907, -4.2026],
      zoom: 6,
      layers: [
        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
          attribution:
            '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        }),
      ]
    });
  }, []);

  return <div id="map"></div>

}

export default GeoHeatMap;

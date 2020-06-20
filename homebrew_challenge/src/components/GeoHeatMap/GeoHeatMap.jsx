import React, { Fragment, useEffect } from 'react';
import L from 'leaflet';
import './GeoHeatMap.css';

const GeoHeatMap = ({areas}) => {

  // const areasList = areas.map((a, id) => (
  //   <Fragment key={id}>
  //     <div className="area">
  //       <h2>a.areaName</h2>
  //     </div>
  //   </Fragment>
  // ))

  useEffect(() => {
    // create map
    L.map('map', {
      center: [57.4907, -4.7026],
      zoom: 7,
      layers: [
        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
          attribution:
            '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        }),
      ]
    });
  }, []);

  return (
    <>
      <div className="tracker">
        <h1>Covid-19 Tracker</h1>
        <h2>TOTAL CONFIRMED CASES</h2>
        <h3>302K</h3>
        {/*{areasList}*/}
      </div>
      <div id="map"></div>
    </>
  )

}

export default GeoHeatMap;

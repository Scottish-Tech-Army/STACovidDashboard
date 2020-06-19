import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import './GeoHeatMap.css';

const Map = ({ markerPosition }) => {

  // create map
  const mapRef = useRef(null);

  mapRef.current = L.map('map', {
    center: [56.4907, -4.2026],
    zoom: 6,
      layers: [
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }),
      ]
    });

  // add marker
  const markerRef = useRef(null);
  useEffect(
    () => {
      if (markerRef.current) {
        markerRef.current.setLatLng(markerPosition);
      } else {
        markerRef.current = L.marker(markerPosition).addTo(mapRef.current);
      }
    },
    [markerPosition]
  );

  // // update markers
  // useEffect(
  //   () => {
  //     layerRef.current.clearLayers();
  //     markersData.forEach(marker => {
  //       L.marker(marker.latLng, { title: marker.title }).addTo(
  //         layerRef.current
  //       );
  //     });
  //   },
  //   [markersData]
  // );
  //
  // // add layer
  // const layerRef = useRef(null);
  //
  // useEffect(() => {
  //   layerRef.current = L.layerGroup().addTo(mapRef.current);
  // }, []);

  return <div id="map"></div>

}

export default Map;

import React, { useState, useRef, useCallback, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken =
  "pk.eyJ1IjoiYW1pbnVsbGFoMTAxIiwiYSI6ImNrcm5hZTZhODB2NTUycm52OXd1dG80eDUifQ.p9JuLhjKBzkCBCB-MJCqTw";

// console.log("es");
const MapComponent = () => {
  const mapContainer = useRef(null);
  const markerRef = useRef(null); // Add this line to use a ref for the marker
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  useEffect(() => {
    if (map.current) return; // Initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    // Create a draggable marker and add it to the map
    markerRef.current = new mapboxgl.Marker({ draggable: true })
      .setLngLat([lng, lat])
      .addTo(map.current);

    // Listen to the 'dragend' event of the marker to update its position
    markerRef.current.on("dragend", () => {
      const { lng, lat } = markerRef.current.getLngLat();
      setLng(lng);
      setLat(lat);
    });
  }, [lng, lat, zoom]);

  const [viewport, setViewport] = useState({
    latitude: 27.6648,
    longitude: 81.5158,
    zoom: 8,
  });

  const [marker, setMarker] = useState({
    latitude: 27.6648,
    longitude: 81.5158,
  });

  const mapRef = useRef();

  const onMapClick = useCallback((event) => {
    const [longitude, latitude] = event.lngLat;
    setMarker({ latitude, longitude });
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div
        ref={mapContainer}
        className="map-container"
        style={{ height: 750 }}
      ></div>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          padding: "10px",
          backgroundColor: "white",
        }}
      >
        Longitude: {lng.toFixed(4)}, Latitude: {lat.toFixed(4)}
      </div>
    </div>
  );
};

export default MapComponent;

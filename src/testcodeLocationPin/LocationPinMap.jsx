import React, { useState } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYW1pbnVsbGFoMTAxIiwiYSI6ImNrcm5hZTZhODB2NTUycm52OXd1dG80eDUifQ.p9JuLhjKBzkCBCB-MJCqTw";

const initialMarkers = [
  {
    id: "Image1",
    longitude: -120,
    latitude: 40,
    isPinned: false,
    image: "https://t.ly/lBMCf",
  },
  {
    id: "Image2",
    longitude: -90,
    latitude: 45,
    isPinned: false,
    image: "https://t.ly/SkqA_",
  },
  {
    id: "Image3",
    longitude: -70,
    latitude: 50,
    isPinned: false,
    image: "https://t.ly/-3dQt",
  },
];

const DraggableMarker = ({ marker, onDragEnd }) => (
  <Marker
    longitude={marker.longitude}
    latitude={marker.latitude}
    draggable={!marker.isPinned}
    onDragEnd={onDragEnd(marker.id)}
    // anchor="bottom"
  >
    <img
      src={marker.image}
      width="60"
      height="60"
      alt="marker"
      style={{ opacity: 0.6 }}
    />
  </Marker>
);

const LocationPinMap = () => {
  const [viewState, setViewState] = useState({
    longitude: -95,
    latitude: 40,
    zoom: 12,
    projection: "globe",
  });
  const [markers, setMarkers] = useState(initialMarkers);

  const handleDragEnd = (id) => (event) => {
    setMarkers((currentMarkers) =>
      currentMarkers.map((marker) => {
        if (marker.id === id) {
          return {
            ...marker,
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat,
          };
        }
        return marker;
      })
    );
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        {markers.map((marker) => (
          <DraggableMarker
            key={marker.id}
            marker={marker}
            onDragEnd={handleDragEnd}
          />
        ))}
      </Map>
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          backgroundColor: "#fff",
          padding: "10px",
        }}
      >
        {markers.map((marker) => (
          <div key={marker.id}>
            <h3> {marker.id}: Longitude:</h3> {marker.longitude.toFixed(4)},
            Latitude: {marker.latitude.toFixed(4)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationPinMap;

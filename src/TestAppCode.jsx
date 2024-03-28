import React, { useCallback } from "react";
import Map from "react-map-gl";
import mapboxgl from "mapbox-gl";
import Bg from "./bg.png";
import { useState } from "react";

// Set your Mapbox access token
mapboxgl.accessToken =
  "pk.eyJ1IjoiYW1pbnVsbGFoMTAxIiwiYSI6ImNrcm5hZTZhODB2NTUycm52OXd1dG80eDUifQ.p9JuLhjKBzkCBCB-MJCqTw";

const TestAppCode = () => {
  const [viewState, setViewState] = React.useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [draggedElement, setDraggedElement] = useState(null);
  const [position, setPosition] = useState({ top: 200, left: 500 });
  const [positionImg, setPositionImg] = useState({ top: 400, left: 600 });

  const handleViewStateChange = useCallback(({ viewState }) => {
    setViewState(viewState);
  }, []);

  const startDrag = useCallback((element) => {
    setIsDragging(true);
    setDraggedElement(element);
  }, []);

  const onDrag = useCallback(
    (e) => {
      if (isDragging) {
        const newPosition = {
          top: e.clientY - 50, // Adjust these values based on the element's offset for better accuracy
          left: e.clientX - 100,
        };
        const newPositionImg = {
          top: e.clientY - 30, // Adjust these values based on the element's offset for better accuracy
          left: e.clientX - 100,
        };
        if (draggedElement === "button") {
          setPosition(newPosition);
        } else if (draggedElement === "image") {
          setPositionImg(newPositionImg);
        }
      }
    },
    [isDragging, draggedElement]
  );

  const endDrag = useCallback(() => {
    setIsDragging(false);
    setDraggedElement(null);
  }, []);

  return (
    <>
      <div
        style={{ position: "relative", width: "100%", height: "800px" }}
        onMouseMove={onDrag}
        onMouseLeave={endDrag}
        onMouseUp={endDrag}
      >
        <Map
          initialViewState={viewState}
          onMove={handleViewStateChange}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        />
        <button
          onMouseDown={() => startDrag("button")}
          style={{
            position: "absolute",
            top: `${position.top}px`,
            left: `${position.left}px`,
            cursor:
              isDragging && draggedElement === "button" ? "grabbing" : "grab",
            backgroundColor: "gray",
            padding: "10px",
            border: "none",
            zIndex: 1,
          }}
        >
          Hello
        </button>

        <img
          onMouseDown={() => startDrag("image")}
          style={{
            position: "absolute",
            top: `${positionImg.top}px`,
            left: `${positionImg.left}px`,
            cursor:
              isDragging && draggedElement === "image" ? "grabbing" : "grab",
            backgroundColor: "#fff",
            padding: "10px",
            border: "none",
            zIndex: 1,
          }}
          width={100}
          src={Bg}
          alt="img"
        />

        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "10px",
            zIndex: 1,
            background: "#fff",
            padding: "5px",
          }}
        >
          Longitude: {viewState.longitude.toFixed(4)}, Latitude:{" "}
          {viewState.latitude.toFixed(4)}
        </div>
      </div>
    </>
  );
};

export default TestAppCode;

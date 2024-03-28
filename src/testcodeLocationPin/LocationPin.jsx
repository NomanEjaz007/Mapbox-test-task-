import React, { useCallback, useRef, useState } from "react";
import Map from "react-map-gl";
import mapboxgl from "mapbox-gl";
import Bg from "../bg.png";

// Set your Mapbox access token here
mapboxgl.accessToken =
  "pk.eyJ1IjoiYW1pbnVsbGFoMTAxIiwiYSI6ImNrcm5hZTZhODB2NTUycm52OXd1dG80eDUifQ.p9JuLhjKBzkCBCB-MJCqTw";

const DraggableElement = ({ onDragEnd, children, initialPosition, id }) => {
  const [position, setPosition] = useState(initialPosition);
  const [isPinned, setIsPinned] = useState(false);

  const startDrag = (e) => {
    if (isPinned) return; // Prevent dragging if the element is pinned

    e.preventDefault();

    const onMouseMove = (moveEvent) => {
      const newX = moveEvent.clientX - e.clientX + position.left;
      const newY = moveEvent.clientY - e.clientY + position.top;
      setPosition({ top: newY, left: newX });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      if (!isPinned) {
        // Only call onDragEnd if not pinned
        onDragEnd(position, id);
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const handleDoubleClick = () => {
    setIsPinned(!isPinned);
    if (!isPinned) {
      onDragEnd(position, id);
    }
  };

  return (
    <div
      onMouseDown={startDrag}
      onDoubleClick={handleDoubleClick}
      style={{
        cursor: isPinned ? "default" : "grab",
        position: "absolute",
        zIndex: 1,
        backgroundColor: isPinned ? "green" : "transparent",
        ...position,
      }}
    >
      {children}
    </div>
  );
};

const LocationPin = () => {
  const mapRef = useRef(null);
  const [viewState, setViewState] = useState({
    longitude: -100,
    latitude: 40,
    zoom: 3,
  });
  const [buttonCoords, setButtonCoords] = useState(null);
  const [imageCoords, setImageCoords] = useState(null);
  const [cursorCoords, setCursorCoords] = useState({
    longitude: 0,
    latitude: 0,
  });

  const handleDragEnd = useCallback((position, id) => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const lngLat = map.unproject([position.left + 50, position.top + 25]);
      console.log(`Dragged ${id} to:`, lngLat);

      const coords = { longitude: lngLat.lng, latitude: lngLat.lat };
      if (id === "button") {
        setButtonCoords(coords);
      } else if (id === "image") {
        setImageCoords(coords);
      }
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const { lng, lat } = map.unproject([e.point.x, e.point.y]);
      setCursorCoords({ longitude: lng, latitude: lat });
    }
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "90%",
        height: "750px",
        margin: "auto",
        marginTop: "30px",
      }}
    >
      <Map
        ref={mapRef}
        initialViewState={viewState}
        onMouseMove={handleMouseMove}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      />
      <DraggableElement
        onDragEnd={handleDragEnd}
        initialPosition={{ top: 100, left: 800 }}
        id="button"
      >
        <button
          style={{
            backgroundColor: "lightgray",
            padding: "10px",
            border: "none",
            color: "black", // Changed color to ensure readability
          }}
        >
          Hello
        </button>
      </DraggableElement>
      <DraggableElement
        onDragEnd={handleDragEnd}
        initialPosition={{ top: 370, left: 810 }}
        id="image"
      >
        <img
          src={Bg}
          alt="Draggable"
          style={{ width: "100px", opacity: "0.3" }}
        />
      </DraggableElement>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "10px",
          zIndex: 1,
          background: "#fff",
          padding: "5px",
        }}
      >
        {buttonCoords && (
          <div>
            <h4>Button Coords: Longitude:</h4>{" "}
            {buttonCoords.longitude.toFixed(4)}, Latitude:{" "}
            {buttonCoords.latitude.toFixed(4)}
          </div>
        )}
        {imageCoords && (
          <div>
            <h4> Image Coords: Longitude:</h4>{" "}
            {imageCoords.longitude.toFixed(4)}, Latitude:{" "}
            {imageCoords.latitude.toFixed(4)}
          </div>
        )}
        <div>
          <h4> Cursor Coords: Longitude:</h4>{" "}
          {cursorCoords.longitude.toFixed(4)}, Latitude:{" "}
          {cursorCoords.latitude.toFixed(4)}
        </div>
      </div>
    </div>
  );
};

export default LocationPin;

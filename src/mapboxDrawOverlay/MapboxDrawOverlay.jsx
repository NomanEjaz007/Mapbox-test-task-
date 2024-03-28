import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
// import "@mapbox/mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYW1pbnVsbGFoMTAxIiwiYSI6ImNrcm5hZTZhODB2NTUycm52OXd1dG80eDUifQ.p9JuLhjKBzkCBCB-MJCqTw";

const MapboxDrawOverlay = ({ imageUrl }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
      polygon: true,
      trash: true,
    },
    defaultMode: "draw_polygon",
  });

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-91.874, 42.76],
      zoom: 12,
    });

    map.current.on("load", () => {
      map.current.addControl(draw);

      map.current.on("draw.create", updateArea);
      map.current.on("draw.delete", clearArea);
      map.current.on("draw.update", updateArea);
    });
  }, []);

  const clearArea = () => {
    if (map.current.getLayer("overlay")) {
      map.current.removeLayer("overlay");
      map.current.removeSource("overlay");
    }
  };

  const updateArea = () => {
    const data = draw.getAll();
    if (data.features.length > 0) {
      const bounds = getBounds(data.features[0]);

      map.current.loadImage(imageUrl, (error, image) => {
        if (error) throw error;
        if (!map.current.hasImage("overlay-image"))
          map.current.addImage("overlay-image", image);

        if (map.current.getSource("overlay")) {
          map.current.getSource("overlay").setCoordinates(bounds);
        } else {
          map.current.addSource("overlay", {
            type: "image",
            url: imageUrl,
            coordinates: bounds,
          });

          map.current.addLayer({
            id: "overlay",
            source: "overlay",
            type: "raster",
            paint: { "raster-opacity": 0.85 },
          });
        }
      });
    }
  };

  const getBounds = (feature) => {
    const coordinates = feature.geometry.coordinates[0];
    const bounds = coordinates.reduce((bounds, coord) => {
      return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

    return [
      [bounds.getSouthWest().lng, bounds.getNorthEast().lat],
      [bounds.getNorthEast().lng, bounds.getNorthEast().lat],
      [bounds.getNorthEast().lng, bounds.getSouthWest().lat],
      [bounds.getSouthWest().lng, bounds.getSouthWest().lat],
    ];
  };

  return <div ref={mapContainer} style={{ width: "100%", height: "600px" }} />;
};

export default MapboxDrawOverlay;

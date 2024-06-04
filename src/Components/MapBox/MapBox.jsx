import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapBox.css";

mapboxgl.accessToken = "pk.eyJ1IjoibWFub2hhcnB1bGx1cnUiLCJhIjoiY2xyeHB2cWl0MWFkcjJpbmFuYXkyOTZzaCJ9.AUGHU42YHgAPtHjDzdhZ7g";

const MapBox = ({setUserLocation}) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [0, 0],
      zoom: 2,
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
      fitBoundsOptions: { maxZoom: 14 },
    });

    mapInstance.addControl(geolocate);

    mapInstance.on("load", () => {
      geolocate.trigger();
    });

    geolocate.on("geolocate", (position) => {
      const { latitude, longitude } = position.coords;
      setUserLocation({ lat: latitude, lng: longitude });
      mapInstance.flyTo({ center: [longitude, latitude] , zoom : 14 });
    });

    setMap(mapInstance);

    return () => mapInstance.remove();
  }, []);


  return (
    <div
      className="mapBoxMain"
      style={{ height: "100vh", width: "100vw", position: "absolute", top: 0, left: 0 }}
      ref={mapContainerRef}
    ></div>
  );
};

export default MapBox;

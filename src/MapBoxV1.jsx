import React, { useEffect, useRef, useState } from "react";
import ReactDOM from 'react-dom';
import mapboxgl from "mapbox-gl";
import './MapBoxV1.css'; // Import the CSS for the blinking marker
import 'mapbox-gl/dist/mapbox-gl.css';
import Pointer from "./Pointer.png";

mapboxgl.accessToken = "pk.eyJ1IjoibWFub2hhcnB1bGx1cnUiLCJhIjoiY2xyeHB2cWl0MWFkcjJpbmFuYXkyOTZzaCJ9.AUGHU42YHgAPtHjDzdhZ7g";

const MapBoxV1 = ({setUserLocation}) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  // const [userLocation, setUserLocation] = useState(null);
  const [users, setUsers] = useState([
    { name: "Kale", lat: 17.4467, lng: 78.3498 },
    { name: "Alen John", lat: 17.5469, lng: 78.3491 }, 
    { name: "Joy", lat: 17.4469, lng: 78.1491 }
  ]);

  // Step 1: Define the UserMarker component
  const UserMarker = ({ name }) => {
    return (
      <div className="user-marker">
        <div className="markerTitle">
          {name}
        </div>
        <img className="markerPng" src={Pointer} alt="Pointer" />
      </div>
    );
  };

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
      geolocate.on("geolocate", (position) => {
        const { longitude, latitude } = position.coords;
        setUserLocation([longitude, latitude]);
        console.log(`User moved to - Latitude: ${latitude}, Longitude: ${longitude}`);
        mapInstance.flyTo({
          center: [longitude, latitude],
          zoom: 14,
          essential: true,
          speed: 1.5,
        });

        // Add a blinking marker at the user's location
        const el = document.createElement('div');
        el.className = 'blinking-marker';

        new mapboxgl.Marker(el)
          .setLngLat([longitude, latitude])
          .addTo(mapInstance);
      });

      geolocate.trigger();

      // Add user markers
      users.forEach(user => {
        const markerEl = document.createElement('div');
        ReactDOM.render(<UserMarker name={user.name} />, markerEl);

        new mapboxgl.Marker(markerEl)
          .setLngLat([user.lng, user.lat])
          .addTo(mapInstance);
      });

      // Update markers when users state changes
      mapInstance.on('click', (e) => {
        console.log(`Latitude: ${e.lngLat.lat}, Longitude: ${e.lngLat.lng}`);
      });
    });

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  useEffect(() => {
    if (map) {
      document.querySelectorAll('.user-marker').forEach(marker => marker.remove());

      // Add updated markers
      users.forEach(user => {
        const markerEl = document.createElement('div');
        ReactDOM.render(<UserMarker name={user.name} />, markerEl);

        new mapboxgl.Marker(markerEl)
          .setLngLat([user.lng, user.lat])
          .addTo(map);
      });
    }
  }, [users, map]);

  return <div ref={mapContainerRef} style={{ height: "100vh", width: "100vw" }} >

  </div>;
};

export default MapBoxV1;

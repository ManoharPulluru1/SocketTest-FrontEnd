import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapBox.css";
import io from "socket.io-client";
import { port } from "../../port";
import UserIcon from "../../Images/UserIcon.png";

const socket = io(port);

mapboxgl.accessToken = "pk.eyJ1IjoibWFub2hhcnB1bGx1cnUiLCJhIjoiY2xyeHB2cWl0MWFkcjJpbmFuYXkyOTZzaCJ9.AUGHU42YHgAPtHjDzdhZ7g";

const MapBox = ({ setUserLocation,flag, userLocation, lat, lng }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [mobile, setMobile] = useState(localStorage.getItem("liveTracking"));
  const [users, setUsers] = useState([]);
  const markersRef = useRef({});

  useEffect(() => {
    // handleRecenter();
    if(flag){
      handleUserCenter(lat,lng);
    }
  },[flag]);

  useEffect(() => {
    socket.on("users", (users) => {
      setUsers(users);
    });
  }, []);

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
      socket.emit("updateUserLocation", { lat: latitude, lng: longitude, mobile });
      if (initialLoad) {
        mapInstance.flyTo({ center: [longitude, latitude], zoom: 14 });
        setInitialLoad(false);
      }
    });

    setMap(mapInstance);

    return () => mapInstance.remove();
  }, [initialLoad, setUserLocation]);

  useEffect(() => {
    if (!map) return;
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Add new markers
    users.forEach((user) => {
      const { lat, lng, mobile, userName } = user;

      const el = document.createElement("div");
      el.className = "marker";
      el.innerHTML = `<img class="usernameMarkerImg" src="${UserIcon}" alt="${userName}" /><div class="usernameMarker">${userName}</div>`;

      const marker = new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);

      markersRef.current[mobile] = marker;
    });
  }, [users, map]);

  const handleRecenter = () => {
    if (map && userLocation.lat && userLocation.lng) {
      map.flyTo({ center: [userLocation.lng, userLocation.lat], zoom: 14 });
    }
  };

  const handleUserCenter = (lat,lng)=>{
    if (map) {
      map.flyTo({ center: [lng, lat], zoom: 14 });
    }
  }

  return (
    <div className="mapBoxParent">
      <div className="testHello">
        <button onClick={handleRecenter}>Recenter</button>
      </div>
      <div className="mapBoxMain" style={{ height: "100vh", width: "100vw", position: "absolute", top: 0, left: 0 }} ref={mapContainerRef}></div>
    </div>
  );
};

export default MapBox;

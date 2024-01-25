"use client"

import React from "react";
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { mapProps, mapClickProps } from "@/lib/types";
import { userIcon, runningIcon, cyclingIcon } from "@/components/ui/leaflet-icons";

const MapClickHandler = ({ setIsFormVisible, setClickedCoords, setSidebarBody }: mapClickProps) => {
  useMapEvents({
    click: (e) => {
      setSidebarBody("workouts");
      setIsFormVisible(true);
      setClickedCoords({ 
        lat: e.latlng.lat, 
        lng: e.latlng.lng
      });
    },
  });
  return null;
  // this component does not render anything
};

export default function LeafletMap({ userLocation, workouts, setIsFormVisible, setClickedCoords, setSidebarBody }: mapProps) {
  const { lat, lng, zoomLevel } = userLocation;
  return (
    <MapContainer style={{ height: "100%", width: "100%" }} center={[lat, lng]} zoom={zoomLevel} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Put a marker on user's location */}
      <Marker position={[lat, lng]} icon={userIcon}>
          <Popup maxWidth={250} minWidth={100} autoClose={false} closeOnClick={false}>
            Your Location 📍
          </Popup>
      </Marker>
      {/* Put marker for workouts */}
      {workouts.map((workout, index) => (
        <Marker key={index} position={workout.coords} icon={workout.type === "running" ? runningIcon : cyclingIcon}>
          <Popup className={`${workout.type}-popup`} maxWidth={250} minWidth={100} autoClose={false} closeOnClick={false}>
            {workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} {workout.description}
          </Popup>
        </Marker>
      ))}
      <MapClickHandler 
        setIsFormVisible={setIsFormVisible} 
        setClickedCoords={setClickedCoords} 
        setSidebarBody={setSidebarBody}
      />
    </MapContainer>
  );
}

"use client"

import React from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { mapProps } from "@/lib/types";

const MapClickHandler = ({ onMapClick }: any) => {
  useMapEvents({
      click: (e) => {
          onMapClick(e.latlng);
      },
  });
  return null; 
  // this component does not render anything
};

export default function LeafletMap({ userLocation, onMapClick }: mapProps) {
  const { lat, lng, zoomLevel } = userLocation;

  return (
    <MapContainer style={{ height: "100%", width: "100%" }} center={[lat, lng]} zoom={zoomLevel} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onMapClick={onMapClick} />
    </MapContainer>
  );
}

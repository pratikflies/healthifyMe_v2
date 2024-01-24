"use client"

import React, { useState, useEffect } from "react";
import "./globals.css";
import Image from "next/image";
import dynamic from "next/dynamic";
import SidebarHeaderComponent from "@/components/sidebar-header";
import SidebarBodyComponent from "@/components/sidebar-body";
import SidebarFooterComponent from "@/components/sidebar-footer";
import { LatLng, Workout, UserLocationType } from "@/lib/types";

const DEFAULT_LAT = 22.6503867;
const DEFAULT_LNG = 88.434807;
const DEFAULT_ZOOM = 14;

const Map = dynamic(() => import("@/components/ui/map"),
    {
      loading: () => <p>Hold on while we load your map...</p>,
      ssr: false
    }
);

const Page = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userLocation, setUserLocation] = useState<UserLocationType>({
        lat: DEFAULT_LAT,
        lng: DEFAULT_LNG,
        zoomLevel: DEFAULT_ZOOM
    });
    const [isMapReady, setIsMapReady] = useState<boolean>(false);
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
    const [workoutType, setWorkoutType] = useState<string>("running");
    const [clickedCoords, setClickedCoords] = useState<LatLng>({
        lat: DEFAULT_LAT,
        lng: DEFAULT_LNG,
    });
    const [distance, setDistance] = useState<string>("");
    const [duration, setDuration] = useState<string>("");
    const [cadence, setCadence] = useState<string>("");
    const [elevationGain, setElevationGain] = useState<string>("");
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [workoutComponents, setWorkoutComponents] = useState<JSX.Element[]>([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            zoomLevel: DEFAULT_ZOOM
          });
          setIsMapReady(true);
        }, (error) => {
          console.error("Error fetching user's location: ", error);
          setIsMapReady(true);
        });
    }, []);

    return (
        <>
            <div className="sidebar">
                <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    width={500} 
                    height={300} 
                    className="logo"
                />
                <SidebarHeaderComponent />
                <SidebarBodyComponent 
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    isFormVisible={isFormVisible}
                    setIsFormVisible={setIsFormVisible}
                    workoutType={workoutType}
                    setWorkoutType={setWorkoutType}
                    clickedCoords={clickedCoords}
                    distance={distance}
                    setDistance={setDistance}
                    duration={duration}
                    setDuration={setDuration}
                    cadence={cadence}
                    setCadence={setCadence}
                    elevationGain={elevationGain}
                    setElevationGain={setElevationGain}
                    workouts={workouts}
                    setWorkouts={setWorkouts}
                    workoutComponents={workoutComponents}
                    setWorkoutComponents={setWorkoutComponents}
                />
                <SidebarFooterComponent />
            </div>

            <div id="map">
                {!isMapReady ? (
                    <p>Determining your current location, please wait...</p>
                ) : (
                    <Map userLocation={userLocation} onMapClick={(clickedCoords) => {
                        setIsFormVisible(true);
                        setClickedCoords(clickedCoords);
                    }}/>
                )}
            </div>
        </>
    );
};

export default Page;

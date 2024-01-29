"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import SidebarBodyComponent from "@/components/sidebar-body";
import RunningComponent from "@/components/running";
import CyclingComponent from "@/components/cycling";
import SwimmingComponent from "@/components/swimming";
import SidebarFooterComponent from "@/components/sidebar-footer";
import { LatLng, Workout, UserLocationType } from "@/lib/types";
import axiosInstance from "@/lib/axiosInstance";
import "./map.css";

const DEFAULT_LAT = 22.6503867;
const DEFAULT_LNG = 88.434807;
const DEFAULT_ZOOM = 14;

const Map = dynamic(() => import("@/components/ui/leaflet-map"),
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
    const [sidebarBody, setSidebarBody] = useState<string>("workouts");
    const [clickedCoords, setClickedCoords] = useState<LatLng>({
        lat: DEFAULT_LAT,
        lng: DEFAULT_LNG,
    });
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [workoutComponents, setWorkoutComponents] = useState<JSX.Element[]>([]);

    const renderWorkout = (workout: Workout) => {
        if (workout.type === "running") 
            return <RunningComponent 
                workout={workout} 
                isLoggedIn={true} 
                setWorkouts = {setWorkouts}
                setWorkoutComponents = {setWorkoutComponents}
            />
        if (workout.type === "cycling") 
            return <CyclingComponent 
                workout={workout} 
                isLoggedIn={true} 
                setWorkouts = {setWorkouts}
                setWorkoutComponents = {setWorkoutComponents}
            />
        if (workout.type === "swimming") 
            return <SwimmingComponent 
                workout={workout} 
                isLoggedIn={true} 
                setWorkouts = {setWorkouts}
                setWorkoutComponents = {setWorkoutComponents}
            />
        return <></>;
    };

    useEffect(() => {
        // fetch user's workouts
        (async () => {
            try {
                const storedWorkoutsResponse = await axiosInstance.post("http://localhost:3001/fetch");

                if (storedWorkoutsResponse.status === 200) {
                    const storedWorkoutsArray = [];
                    const storedWorkoutsComponentsArray = [];
                    
                    for (const workout of storedWorkoutsResponse.data) {
                        storedWorkoutsArray.push(workout);
                        storedWorkoutsComponentsArray.push(renderWorkout(workout));
                    }
                    
                    setWorkouts([...storedWorkoutsArray]);
                    setWorkoutComponents([ ...storedWorkoutsComponentsArray]);
                } else throw new Error("Bad network response!");
            } catch (error) {
              console.error("Error fetching stored workouts:", error);
            }
        })();

        // set user's current location
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
                <div className="button-container">
                    <button type="submit" className="button">Logout</button>
                    <button type="submit" className="button" id="reset-button" style={{backgroundColor: "#FF0000"}}>Reset</button>
                    <button type="submit" className="button">Dashboard</button>
                </div>
                <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    width={500} 
                    height={300} 
                    className="logo"
                />
                <div className="custom__btns dropdown">
                    <button className="custom__btn btn--filter">Filter By</button>
                    <div className="dropdown-content">
                        <a href="#" data-option="running">Running 🏃‍♂️</a>
                        <a href="#" data-option="cycling">Cycling 🚴</a>
                        <a href="#" data-option="swimming">Swimming 🏊‍♀️</a>
                        <a href="#" data-option="show-all">Show All</a>
                    </div>
                </div>
                <SidebarBodyComponent 
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    isFormVisible={isFormVisible}
                    setIsFormVisible={setIsFormVisible}
                    clickedCoords={clickedCoords}
                    setWorkouts={setWorkouts}
                    workoutComponents={workoutComponents}
                    setWorkoutComponents={setWorkoutComponents}
                    isLoggedIn={true}
                />
                <SidebarFooterComponent />
                <div className="controls">
                    <button className="show__sort__btns">Sort</button>
                </div>
                <div className="sort__buttons__container zero__height">
                    <button data-type ="date" className="sort__button"><span className="workout__icon">&#128198</span>  <span className="arrow">&#129045</span></button>
                    <button data-type ="distance" className="sort__button"><span className="workout__icon">🏃‍♂️</span> <span className="arrow">&#129045</span></button>
                    <button data-type ="duration" className="sort__button"><span className="workout__icon">⏱</span> <span className="arrow">&#129045</span></button>
                </div>
                <hr className="sort__devider"></hr>
            </div>

            <div id="map">
                {!isMapReady ? (
                    <p>Determining your current location, please wait...</p>
                ) : (
                    <Map userLocation={userLocation} 
                        workouts={workouts}
                        setIsFormVisible={setIsFormVisible}
                        setClickedCoords={setClickedCoords}
                        setSidebarBody={setSidebarBody}
                    />
                )}
            </div>
        </>
    );
};

export default Page;

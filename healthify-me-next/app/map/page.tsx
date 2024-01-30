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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
    const [filterType, setFilterType] = useState<string>("Show All");
    const [showSortButtons, setShowSortButtons] = useState<boolean>(false);

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

    const handleLogout = async () => {
        setIsLoading(true);
    
        try {
            const response : any = await axiosInstance.post("http://localhost:3001/logout");
    
            if (response.status === 200) {
                // do stuff
                // router.push("/");
                window.location.href = "/";
            } else throw new Error("Bad network response!");
        } catch (error) {
            console.error("Something went wrong while logging out!", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearAll = async () => {
        setIsLoading(true);
    
        try {
            const response : any = await axiosInstance.post("http://localhost:3001/clearAll");
    
            if (response.status === 200) {
                // do stuff
                // router.push("/");
                window.location.href = "/";
            } else throw new Error("Bad network response!");
        } catch (error) {
            console.error("Something went wrong while clearing all workouts!", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDashboard = () => {
        setIsLoading(true);
    
        try {
            // router.push("/");
            window.location.href = "/";
        } catch (error) {
            console.error("Failed to switch to dashboard!", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterType(e.target.value);
    };

    const handleShowSortButtons = () => {
        setShowSortButtons(!showSortButtons);
    };

   const sortWorkoutsByDate = () => {};

   const sortWorkoutsByDistance = () => {}

   const sortWorkoutsByDuration = () => {};

    return (
        <>
            <div className="sidebar">
                <div className="button-container">
                    <Button className="button" disabled={isLoading} onClick={handleLogout}>
                        {isLoading ? "Please Wait..." : "Logout"}
                    </Button>
                    <Button className="button" disabled={isLoading} id="reset-button" style={{backgroundColor: "#FF0000"}} onClick={handleClearAll}>
                        {isLoading ? "Please Wait..." : "Clear All"}
                    </Button>
                    <Button className="button" disabled={isLoading} onClick={handleDashboard}>
                        {isLoading ? "Please Wait..." : "Dashboard"}
                    </Button>
                </div>
                <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    width={500} 
                    height={300} 
                    className="logo"
                />
                <div className="centered-content">
                    <Label>Filter By</Label>
                    <select value={filterType} disabled={isLoading} onChange={handleFilterTypeChange}>
                        <option value="Running">Running 🏃‍♂️</option>
                        <option value="Cycling">Cycling 🚴</option>
                        <option value="Swimming">Swimming 🏊‍♀️</option>
                        <option value="Show All">Show All</option>
                    </select>
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
                <div className="controls">
                    <Button disabled={isLoading} className="show__sort__btns" onClick={handleShowSortButtons}>
                        {isLoading ? "Please Wait..." : "Sort"}
                    </Button>
                </div>
                {showSortButtons && <div className="sort__buttons__container">
                    <Button disabled={isLoading} data-type ="date" className="sort__button" onClick={sortWorkoutsByDate}>
                        <span className="workout__icon">{'\u{1F4C6}'}</span>  
                        <span className="arrow">{'\u2191'}</span>
                    </Button>
                    <Button disabled={isLoading} data-type ="distance" className="sort__button" onClick={sortWorkoutsByDistance}>
                        <span className="workout__icon">🏃‍♂️</span>
                        <span className="arrow">{'\u2191'}</span>
                    </Button>
                    <Button disabled={isLoading} data-type ="duration" className="sort__button" onClick={sortWorkoutsByDuration}>
                        <span className="workout__icon">⏱</span>
                        <span className="arrow">{'\u2191'}</span>
                    </Button>
                </div>}
                <SidebarFooterComponent />
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

"use client"

import React from "react";
import SidebarFormComponent from "./sidebar-form";
import SidebarWorkoutsComponent from "./sidebar-workouts";
import { SidebarVisibilityProps } from "@/lib/types";

export default function SidebarBodyComponent({
    isLoading, 
    setIsLoading, 
    isFormVisible,
    setIsFormVisible,
    workoutType,
    setWorkoutType,
    clickedCoords,
    distance,
    setDistance,
    duration,
    setDuration,
    cadence,
    setCadence,
    elevationGain,
    setElevationGain,
    workouts,
    setWorkouts,
    workoutComponents,
    setWorkoutComponents }: SidebarVisibilityProps) {
        return (
            <>
                <SidebarFormComponent 
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
                <SidebarWorkoutsComponent 
                    workoutComponents={workoutComponents}
                />
            </>
        );
    };
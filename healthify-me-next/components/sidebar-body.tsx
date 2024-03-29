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
    clickedCoords,
    setWorkouts,
    workoutComponents, 
    setWorkoutComponents,
    isLoggedIn,
    setCenter }: SidebarVisibilityProps) {
        return (
            <>
                <SidebarFormComponent 
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    isFormVisible={isFormVisible}
                    setIsFormVisible={setIsFormVisible}
                    clickedCoords={clickedCoords}
                    setWorkouts={setWorkouts}
                    workoutComponents={workoutComponents}
                    setWorkoutComponents={setWorkoutComponents}
                    isLoggedIn={isLoggedIn}
                    setCenter={setCenter}
                />
                <SidebarWorkoutsComponent 
                    workoutComponents={workoutComponents}
                />
            </>
        );
    };
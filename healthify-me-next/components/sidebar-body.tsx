"use client"

import React, { useState } from "react";
import SidebarFormComponent from "./sidebar-form";
import SidebarWorkoutsComponent from "./sidebar-workouts";
import { SidebarVisibilityProps } from "@/lib/types";

export default function SidebarBodyComponent({
    isLoading,
    setIsLoading,
    isFormVisible,
    setIsFormVisible,
    clickedCoords,
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
                    clickedCoords={clickedCoords}
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
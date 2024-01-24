"use client"

import React from "react";
import { SidebarWorkoutProps } from "@/lib/types";

export default function SidebarWorkoutsComponent({
    workoutComponents,
}: SidebarWorkoutProps) {
    return (
        <ul className="workouts">
            {workoutComponents.map((workoutComponent, index) => (
                <React.Fragment key={index}>
                    {workoutComponent}
                </React.Fragment>
            ))}
        </ul>
    );
};
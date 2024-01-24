"use client"

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IconSpinner } from "@/components/ui/icons";
import RunningComponent from "./running";
import CyclingComponent from "./cycling";
import { SidebarVisibilityProps, Workout } from "@/lib/types";

export default function SidebarFormComponent({ 
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
        const renderWorkout = (workout: Workout) => {
            if (workout.type === "running") return <RunningComponent workout={workout} />
            if (workout.type === "cycling") return <CyclingComponent workout={workout} />
            return <></>;
        };

        const handleWorkoutTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            setWorkoutType(e.target.value);
        };

        const validation = (formData: any) => {
            // setting any data type because: NaN of one/multiple fields is a possibilty
            const validateCadence = isFinite(formData.cadence) && formData.cadence > 0;
            const validateElevationGain = isFinite(formData.elevationGain);

            return (validateCadence || validateElevationGain) 
                && (formData.distance > 0 
                && formData.duration > 0);
        };

        async function onSubmit(event: React.SyntheticEvent) {
            event.preventDefault();
            setIsLoading(true);

            const formData = {
                type: workoutType,
                coords: clickedCoords,
                distance: Number(distance),
                duration: Number(duration),
                cadence: Number(cadence),
                elevationGain: Number(elevationGain),
            };

            // validate form data
            const isValidate = validation(formData);

            if (isValidate) {
                try {
                    const response = await fetch(
                        "http://localhost:3001/add-workout",
                    {
                        method: "POST",
                        body: JSON.stringify(formData),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });

                    if (response.ok) {
                        const responseWorkout: Workout = await response.json();
                        // add object to workout array, the state change automatically renders marker on the map
                        setWorkouts([...workouts, responseWorkout]);
                        const workoutComponent = renderWorkout(responseWorkout); 
                        // add object to workoutComponents array, the state change automatically renders it on sidebar
                        setWorkoutComponents([...workoutComponents, workoutComponent]);
                        // hide the form
                        setIsFormVisible(false);
                    } else throw new Error("Bad network response!");
                } catch (error) {
                    console.error("Something went wrong while processing your request!", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                console.error("Please enter valid details!");
                setIsLoading(false);
            }
        }

        return (
            <>
                {isFormVisible && (<form className="form" onSubmit={onSubmit}>
                    <div className="form__row">
                        <Label className="form__label">Type</Label>
                        <select 
                            className="form__input form__input--type"
                            value={workoutType}
                            onChange={handleWorkoutTypeChange}
                        >
                            <option value="running">Running</option>
                            <option value="cycling">Cycling</option>
                        </select>
                    </div>
                    <div className="form__row">
                        <Label className="form__label">Distance</Label>
                        <Input className="form__input form__input--distance" 
                            id="distance"
                            placeholder="km"
                            required
                            onChange={e => setDistance(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form__row">
                        <Label className="form__label">Duration</Label>
                        <Input className="form__input form__input--duration"
                            id="duration"
                            placeholder="min"
                            required
                            onChange={e => setDuration(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    {workoutType === "running" && (<div className="form__row">
                        <Label className="form__label">Cadence</Label>
                        <Input className="form__input form__input--cadence"
                            id="cadence"
                            placeholder="steps/min"
                            required
                            onChange={e => setCadence(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>)}
                    {workoutType === "cycling" && (<div className="form__row">
                        <Label className="form__label">Elev Gain</Label>
                        <Input
                            className="form__input form__input--elevation"
                            id="elevationGain"
                            placeholder="metres"
                            onChange={e => setElevationGain(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>)}
                    <Button disabled={isLoading}>
                        {isLoading && <IconSpinner className="mr-2 h-4 w-4 animate-spin" />}
                        OK
                    </Button>
                </form>)} 
            </>
        );
    };
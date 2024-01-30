"use client"

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import RunningComponent from "./running";
import CyclingComponent from "./cycling";
import SwimmingComponent from "./swimming";
import { SidebarVisibilityProps, Workout } from "@/lib/types";
import axiosInstance from "@/lib/axiosInstance";

export default function SidebarFormComponent({
    isLoading,
    setIsLoading,
    isFormVisible,
    setIsFormVisible,
    clickedCoords,
    setWorkouts,
    setWorkoutComponents,
    isLoggedIn }: SidebarVisibilityProps) {
        // none of the below states save
        const [workoutType, setWorkoutType] = useState<string>("running");
        const [distance, setDistance] = useState<string>("");
        const [duration, setDuration] = useState<string>("");
        const [cadence, setCadence] = useState<string>("");
        const [elevationGain, setElevationGain] = useState<string>("");
        const [strokes, setStrokes] = useState<string>("");
        const [date, setDate] = useState<string>("");

        const renderWorkout = (workout: Workout) => {
            if (workout.type === "running") {
                return <RunningComponent 
                    workout={workout} 
                    isLoggedIn={isLoggedIn}
                    setWorkouts = {setWorkouts}
                    setWorkoutComponents = {setWorkoutComponents}
                />
            }
            if (workout.type === "cycling") {
                return <CyclingComponent 
                    workout={workout} 
                    isLoggedIn={isLoggedIn}
                    setWorkouts = {setWorkouts}
                    setWorkoutComponents = {setWorkoutComponents}
                />
            }
            if (workout.type === "swimming") {
                return <SwimmingComponent 
                    workout={workout} 
                    isLoggedIn={isLoggedIn}
                    setWorkouts = {setWorkouts}
                    setWorkoutComponents = {setWorkoutComponents}
                />
            }
            return <></>;
        };

        const handleWorkoutTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            setWorkoutType(e.target.value);
        };

        const validation = (formData: any) => {
            // setting any data type because: NaN of one/multiple fields is a possibilty
            const validateCadence = isFinite(formData.cadence) && formData.cadence > 0;
            const validateElevationGain = isFinite(formData.elevationGain);
            const validateStrokes = isFinite(formData.strokes) && formData.strokes > 0;

            return (validateCadence || validateElevationGain || validateStrokes) 
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
                strokes: Number(strokes),
                dateObject: isLoggedIn ? new Date(date) : null,
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

                    const workoutResponse = await response.json();
                    let saveWorkoutResponse;
                    isLoggedIn && 
                        (saveWorkoutResponse = await axiosInstance.post("http://localhost:3001/save", {...formData, id: workoutResponse.id} ));

                    if (response.ok) {
                        if (isLoggedIn && !(saveWorkoutResponse?.status === 201)) {
                            throw new Error("Error while storing workout to database!");
                        }
                        const responseWorkout: Workout = workoutResponse;
                        // add object to workout array, the state change automatically renders marker on the map
                        setWorkouts(currentWorkouts => [...currentWorkouts, responseWorkout]);
                        // add object to workoutComponents array, the state change automatically renders it on sidebar
                        const workoutComponent = renderWorkout(responseWorkout); 
                        setWorkoutComponents(currentComponents => [...currentComponents, workoutComponent]);
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
                            disabled={isLoading}
                        >
                            <option value="running">Running</option>
                            <option value="cycling">Cycling</option>
                            {isLoggedIn && <option value="swimming">Swimming</option>}
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
                    {workoutType === "swimming" && isLoggedIn && (<div className="form__row">
                        <Label className="form__label">Strokes</Label>
                        <Input
                            className="form__input form__input--strokes"
                            id="strokes"
                            placeholder="strokes/min"
                            onChange={e => setStrokes(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>)}
                    {isLoggedIn && <div className="form__row">
                        <Label className="form__label">Date</Label>
                        <Input 
                            type="datetime-local" 
                            id="datetime-input"
                            className="form__input"
                            onChange={e => setDate(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>}
                    <Button disabled={isLoading} className="form__btn">
                        {isLoading ? "..." : "ADD"}
                    </Button>
                </form>)} 
            </>
        );
    };
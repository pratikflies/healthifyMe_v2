"use client"

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IconSpinner } from "@/components/ui/icons";

export default function SidebarLoginComponent() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <div className="login-headline">Login to continue</div>
            <div className="login-form-container">
                <form onSubmit={onSubmit} className="login-form">
                    <div className="form-group">
                        <Input 
                            type="text" 
                            id="username" 
                            className="form-input" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="user@example.com"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <Input 
                            type={showPassword ? "text" : "password"} 
                            id="password" 
                            className="form-input" 
                            value={password} 
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                        <div className="show-password">
                            <Input 
                                type="checkbox" 
                                id="show-password" 
                                checked={showPassword}
                                onChange={togglePasswordVisibility}
                                disabled={isLoading}
                            />
                            <Label htmlFor="show-password" className="show-password-label">Show Password</Label>
                        </div>
                    </div>
                    <div className="form-group">
                        <Button disabled={isLoading} type="submit" className="form-button">
                            {isLoading && <IconSpinner className="mr-2 h-4 w-4 animate-spin" />}
                            Login
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

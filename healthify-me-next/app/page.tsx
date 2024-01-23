"use client"

import React, { useState, useEffect } from "react";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Button } from "@/components/button";
import { IconSpinner } from "@/components/icons";
import RunningComponent from "@/components/running";

type Workout = {
    cadence?: number;
    elevationGain?: number;
    pace?: number;
    speed?: number;
    clicks: number;
    coords: {
        lat: number;
        lng: number;
    };
    date: string;
    description: string;
    distance: number;
    duration: number;
    id: string;
    type: string;
};

const Map = dynamic(() => import("@/components/map"),
    {
      loading: () => <p>Hold on while we load your map...</p>,
      ssr: false
    }
);

const Page = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [userLocation, setUserLocation] = useState({
        lat: 22.6503867,
        lng: 88.434807,
        zoomLevel: 14
    });
    const [isMapReady, setIsMapReady] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [workoutType, setWorkoutType] = useState("running");
    const [clickedCoords, setClickedCoords] = useState({});
    const [distance, setDistance] = useState("");
    const [duration, setDuration] = useState("");
    const [cadence, setCadence] = useState("");
    const [elevationGain, setElevationGain] = useState("");
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [workoutComponents, setWorkoutComponents] = useState<JSX.Element[]>([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            zoomLevel: 14
          });
          setIsMapReady(true);
        }, (error) => {
          console.error("Error fetching user's location: ", error);
          setIsMapReady(true);
        });
    }, []);

    const renderWorkout = (workout: Workout) => {
       if (workout.type === "running") return <RunningComponent workout={workout} />
       return <></>;
    };

    const handleWorkoutTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setWorkoutType(e.target.value);
    };

    const validation = (formData: any) => {
        // setting any data type because: NaN of one/many fields is a possibilty
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
                }
                );

                if (response.ok) {
                    const responseWorkout: Workout = await response.json();
                    setWorkouts([...workouts, responseWorkout]); // Add object to workout array
                    //this._renderWorkoutMarker(workout); // Render workout on map as marker
                    const workoutComponent = renderWorkout(responseWorkout); 
                    setWorkoutComponents([...workoutComponents, workoutComponent]); // render workout on map
                    setIsFormVisible(false); // hide the form
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
            <div className="sidebar">
                <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    width={500} 
                    height={300} 
                    className="logo"
                />
                <div>
                    <p className="intro">
                        {`You are currently using a demo version of the app. To gain access to the full version, `}
                        <Link href="/login" className="Github Link">Login</Link>{` or `}
                        <Link href="/signup" className="Github Link">Signup</Link>.{` In case you are facing problems, `}
                        <Link href="/contact-us" className="Github Link">Contact Us</Link>.
                    </p>
                </div>
                <ul className="workouts">
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

                        <div className="form__row">
                            <Label className="form__label">Cadence</Label>
                            <Input className="form__input form__input--cadence"
                                id="cadence"
                                placeholder="steps/min"
                                required
                                onChange={e => setCadence(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="form__row form__row--hidden">
                            <Label className="form__label">Elev Gain</Label>
                            <Input
                                className="form__input form__input--elevation"
                                id="elevationGain"
                                placeholder="metres"
                                onChange={e => setElevationGain(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <Button disabled={isLoading}>
                            {isLoading && <IconSpinner className="mr-2 h-4 w-4 animate-spin" />}
                            OK
                        </Button>
                    </form>)}
                    {workoutComponents.map((workoutComponent, index) => (
                        <React.Fragment key={index}>
                            {workoutComponent}
                        </React.Fragment>
                    ))}
                </ul>

                <p className="copyright">
                    {`Your personal fitness tracking app built by `}
                    <a className="Github Link"
                        target="_blank"
                        href="https://github.com/SauravM307"
                        >Saurav</a>
                    {` and `}
                    <a className="Github Link"
                        target="_blank"
                        href="https://github.com/pratikflies"
                        >Pratik</a>.
                </p>
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

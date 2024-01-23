"use client"

import React, { useState, useEffect } from "react";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Button } from "@/components/button";

const Map = dynamic(() => import("@/components/map"),
    {
      loading: () => <p>Hold on while we load your map...</p>,
      ssr: false
    }
);

const Page = () => {
    const [userLocation, setUserLocation] = useState({
        lat: 22.6503867,
        lng: 88.434807,
        zoomLevel: 14
    });
    const [isMapReady, setIsMapReady] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [clickedCoords, setClickedCoords] = useState({});
    const [distance, setDistance] = useState("");
    const [duration, setDuration] = useState("");
    const [cadence, setCadence] = useState("");
    const [elevationGain, setElevationGain] = useState("");

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

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        console.log(clickedCoords, distance, duration, cadence);
        // setIsLoading(true);
        // const isValidate = validation(email, password);

        // if (isValidate) {
        // const data = {
        //     email: email,
        //     password: password
        // };

        // try {
        //     const response = await fetch(
        //     `${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/login`,
        //     {
        //         method: "POST",
        //         body: JSON.stringify(data),
        //         headers: {
        //         "Content-Type": "application/json"
        //         }
        //     }
        //     );

        //     if (response.ok) {
        //     const responseData = await response.json();
        //     if (responseData.token) {
        //         setToken(responseData.token);
        //         if (typeof window !== "undefined") {
        //         localStorage.setItem("token", responseData.token);
        //         }

        //         Cookie.set("token", responseData.token);
        //         Cookie.set("isAdmin", responseData.isAdmin);
        //         setAdmin(responseData.isAdmin);

        //         // alert("Login successfully");
        //         // window.location.href = "/";
        //         router.refresh();
        //         router.push("/");

        //     } else {
        //         toast("what?");
        //     }
        //     } else {
        //     throw new Error("Network response was not ok");
        //     }
        // } catch (error) {
        //     console.error("Error fetching data:", error);
        //     toast.error("Account does not exist, please create one.");
        // }

        // setIsLoading(false);
        // } else {
        // alert("Please enter a valid email and password");
        // setIsLoading(false);
        // }
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
                            <select className="form__input form__input--type">
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
                            />
                        </div>
                        <div className="form__row">
                            <Label className="form__label">Duration</Label>
                            <Input className="form__input form__input--duration"
                                id="duration"
                                placeholder="min"
                                required
                                onChange={e => setDuration(e.target.value)}
                            />
                        </div>

                        <div className="form__row">
                            <Label className="form__label">Cadence</Label>
                            <Input className="form__input form__input--cadence"
                                id="cadence"
                                placeholder="steps/min"
                                required
                                onChange={e => setCadence(e.target.value)}
                            />
                        </div>
                        <div className="form__row form__row--hidden">
                            <Label className="form__label">Elev Gain</Label>
                            <Input
                                className="form__input form__input--elevation"
                                id="elevationGain"
                                placeholder="metres"
                                onChange={e => setElevationGain(e.target.value)}
                            />
                        </div>
                        <Button className="form__btn">OK</Button>
                    </form>)}
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

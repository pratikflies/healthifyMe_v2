"use client"

import React from "react";
import Image from "next/image";
import axiosInstance from "@/lib/axiosInstance";
import { RunningComponentProps, LatLng} from "@/lib/types";

export default function RunningComponent({ workout, isLoggedIn, setWorkouts, setWorkoutComponents, setCenter }: RunningComponentProps) {
  let icon, locality = "Kolkata", temperature = "32";
  // we can use external API's to determine locality and temperature

  if (isLoggedIn) {
    icon = workout.type === "running"
        ? "🏃"
        : workout.type === "cycling"
        ? "🚴"
        : "🏊‍♀️";
    
  }
  
  const handleEdit = async (id: string) => {};

  const handleView = async({ lat, lng }: LatLng) => {
    setCenter([lat, lng]);
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await axiosInstance.post("http://localhost:3001/delete", { id });

      if (response.status === 200) {
        setWorkouts(currentWorkouts => currentWorkouts.filter(workout => workout.id !== id));
        setWorkoutComponents(currentComponents => currentComponents.filter(component => component.props.workout.id !== id));
      }
    } catch (error) {
      console.error(`Error deleteing workout with id: ${id}: `, error);
    }
  };

  return isLoggedIn ? (
      <li className={`workout workout--${workout.type}`} data-id={workout.id} onClick={() => handleView(workout.coords)}>
        <h2 className="workout__title">{
          workout.description + ', ' + locality
        }</h2>
        <div className="workout__btns">
          <button className="workout__btn workout__btn--edit" onClick={() => handleEdit(workout.id)}>
            <Image 
                  src="/edit.png" 
                  alt="Edit" 
                  width={100} 
                  height={100} 
                  className="logo-workout"
            />
          </button>
          <button className="workout__btn workout__btn--delete" onClick={() => handleDelete(workout.id)}>
          <Image 
                  src="/delete.png" 
                  alt="Delete" 
                  width={100} 
                  height={100} 
                  className="logo-workout"
            />
          </button>
        </div>
        <div className="workout__details">
          <span className="workout__icon">{icon}</span>
          <span className="workout__value">{workout.distance}</span>
          <span className="workout__unit">km</span>
        </div>
        <div className="workout__details">
          <span className="workout__icon">⏱</span>
          <span className="workout__value">{workout.duration}</span>
          <span className="workout__unit">min</span>
        </div>
        <div className="workout__details">
          <span className="workout__icon">🌡️</span>
          <span className="workout__value">{temperature}</span>
          <span className="workout__unit">&#8451;</span>
        </div>
        <div className="workout__details">
          <span className="workout__icon">⚡️</span>
          <span className="workout__value">{workout.pace?.toFixed(1)}</span>
          <span className="workout__unit">min/km</span>
        </div>
        <div className="workout__details">
          <span className="workout__icon">🦶🏼</span>
          <span className="workout__value">{workout.cadence}</span>
          <span className="workout__unit">spm</span>
        </div>
      </li>
    ) : (
      <li className={`workout workout--${workout.type}`} data-id={workout.id} onClick={() => handleView(workout.coords)}>
        <h2 className="workout__title">{workout.description}</h2>
        <div className="workout__details">
          <span className="workout__icon">
            {workout.type === 'running' ? "🏃‍♂️" : (workout.type === "cycling" ? "🚴" : "🏊‍♀️")}
          </span>
          <span className="workout__value">{workout.distance}</span>
          <span className="workout__unit">km</span>
        </div>
        <div className="workout__details">
          <span className="workout__icon">⏱</span>
          <span className="workout__value">{workout.duration}</span>
          <span className="workout__unit">min</span>
        </div>
        <div className="workout__details">
          <span className="workout__icon">⚡️</span>
          <span className="workout__value">{workout.pace?.toFixed(1)}</span>
          <span className="workout__unit">min/km</span>
        </div>
        <div className="workout__details">
          <span className="workout__icon">🦶🏼</span>
          <span className="workout__value">{workout.cadence}</span>
          <span className="workout__unit">spm</span>
        </div>
      </li>
    );
}
"use client"

import React from "react";

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

type RunningComponentProps = {
    workout: Workout;
};

export default function RunningComponent({ workout }: RunningComponentProps) {
    return (
      <li className={`workout workout--${workout.type}`} data-id={workout.id}>
        <h2 className="workout__title">{workout.description}</h2>
        <div className="workout__details">
          <span className="workout__icon">
            {workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}
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
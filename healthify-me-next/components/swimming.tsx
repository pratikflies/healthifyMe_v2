"use client"

import React from "react";
import { SwimmingComponentProps } from "@/lib/types";

export default function SwimmingComponent({ workout }: SwimmingComponentProps) {
    return (
      <li className={`workout workout--${workout.type}`} data-id={workout.id}>
        <h2 className="workout__title">{workout.description}</h2>
        <div className="workout__details">
          <span className="workout__icon">
            {workout.type === "running" ? "🏃‍♂️" : (workout.type === "cycling" ? "🚴‍♀️" : "🏊🏻")}
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
          <span className="workout__value">{workout.speed?.toFixed(1)}</span>
          <span className="workout__unit">km/h</span>
        </div>
        <div className="workout__details">
          <span className="workout__icon">🏊🏻</span>
          <span className="workout__value">{workout.strokes}</span>
          <span className="workout__unit">/min</span>
        </div>
      </li>
    );
}
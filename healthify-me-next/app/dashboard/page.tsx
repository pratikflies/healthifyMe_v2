"use client";

import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";
import axiosInstance from "@/lib/axiosInstance";
import "./dashboard.css";
import { Workout } from "@/lib/types";

const PieChartComponent = dynamic(() => import("@/components/ui/pie-chart"),
    {
      loading: () => <p>Loading pie-chart...</p>,
      ssr: false
    }
);

const BarChartComponent = dynamic(() => import("@/components/ui/bar-chart"),
    {
      loading: () => <p>Loading bar-chart...</p>,
      ssr: false
    }
);

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export async function getProps() {
    try {
        const [dashboardResponse, profileResponse] = await Promise.all([
            axiosInstance.get(`http://localhost:3001/dashboard`),
            axiosInstance.get(`http://localhost:3001/profile`),
        ]);
        if (!dashboardResponse.data || !profileResponse.data) {
            throw new Error("Invalid response from server!");
        }

        const {
            runningCount, cyclingCount, swimmingCount, // for pie-chart
            completedWorkoutsArray, upcomingWorkoutsArray, distanceCovered, timeSpent, // for statistics
            recommendation, // for recommendation
        } = dashboardResponse.data;

        const { 
            firstName, lastName, age, gender, bmi, target, weight
        } = profileResponse.data;

        const progress = ((distanceCovered / target) * 100).toFixed(2);
        const caloriesBurnt = ((timeSpent * (3.5 * 3.5 * weight)) / 200).toFixed(2);
    
        return {
            props: {
                name: firstName + lastName, age, gender, bmi, target, progress, // for profile
                completedWorkoutsArray, upcomingWorkoutsArray, distanceCovered, timeSpent, caloriesBurnt, // for statistics
                runningCount, cyclingCount, swimmingCount, // for pie-chart
                recommendation, // for recommendation
            }
        };
    } catch (error) {
        console.error("Error fetching dashboard's data: ", error);
        return {
            props: {
              name: "NA NA",
              age: 1,
              gender: "Choose not to disclose",
              bmi: 1,
              target: 1,
              progress: "1",
              completedWorkoutsArray: [],
              upcomingWorkoutsArray: [], 
              distanceCovered: 1,
              timeSpent: 1,
              caloriesBurnt: "1",
              runningCount: 1,
              cyclingCount: 1,
              swimmingCount: 1,
              recommendation: "NA",
            }
        };  
    }
}
  

export default function Dashboard() {
  const [props, setProps] = useState({
    name: "NA NA",
    age: 1,
    gender: "Choose not to disclose",
    bmi: 1,
    target: 1,
    progress: "1",
    completedWorkoutsArray: [],
    upcomingWorkoutsArray: [], 
    distanceCovered: 1,
    timeSpent: 1,
    caloriesBurnt: "1",
    runningCount: 1,
    cyclingCount: 1,
    swimmingCount: 1,
    recommendation: "NA",
  });

  useEffect(() => {
    getProps()
      .then(response => {
        setProps(response.props);
      })
      .catch(error => {
        console.error("Error fetching dashboard's data: ", error);
      });
  }, []);

  const {
      name, age, gender, bmi, target, progress, // for profile
      completedWorkoutsArray, upcomingWorkoutsArray, distanceCovered, timeSpent, caloriesBurnt, // for statistics
      runningCount, cyclingCount, swimmingCount, // for pie-chart
      recommendation, // for recommendation
  } = props;

  return (
    <div className="space-y-8">
      <div className="flex flex-row"> 
        <div className="flex items-start mr-36 justify-between">
            <div>
                <h3 className="text-lg font-medium">Profile</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Explore your tailored profile.
                </p>
                <div className="flex flex-row items-center space-x-2">
                    <p className="mb-1">Name:</p>
                    <p className="mb-1" style={{color: '#ffb545'}}>{name}</p>
                </div>
                <div className="flex flex-row items-center space-x-2">
                    <p className="mb-1">Age:</p>
                    <p className="mb-1" style={{color: '#ffb545'}}>{age}</p>
                </div>
                <div className="flex flex-row items-center space-x-2">
                    <p className="mb-1">Gender:</p>
                    <p className="mb-1" style={{color: '#ffb545'}}>{gender}</p>
                </div>
                <div className="flex flex-row items-center space-x-2">
                    <p className="mb-1">BMI:</p>
                    <p className="mb-1" style={{color: '#ffb545'}}>{bmi}</p>
                </div>
                <div className="flex flex-row items-center space-x-2">
                    <p className="mb-1">Target:</p>
                    <p className="mb-1" style={{color: '#ffb545'}}>{target}</p>
                </div>
                <div className="flex flex-row items-center space-x-2">
                    <p className="mb-1">Progress:</p>
                    <p className="mb-1" style={{color: '#ffb545'}}>{progress}%</p>
                </div>
            </div>
        </div>
        <div className="flex items-start mr-36 justify-between">
            <div>
                <h3 className="text-lg font-medium">Statistics</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Because numbers don't lie.
                </p>
                <div className="flex flex-row items-center space-x-2">
                    <p className="mb-1">Workouts Completed:</p>
                    <p className="mb-1" style={{color: '#ffb545'}}>{completedWorkoutsArray?.length}</p>
                </div>
                <div className="flex flex-row items-center space-x-2">
                    <p className="mb-1">Upcoming Workouts:</p>
                    <p className="mb-1" style={{color: '#ffb545'}}>{upcomingWorkoutsArray?.length}</p>
                </div>
                <div className="flex flex-row items-center space-x-2">
                    <p className="mb-1">Distance Covered:</p>
                    <p className="mb-1" style={{color: '#ffb545'}}>{distanceCovered}</p>
                </div>
                <div className="flex flex-row items-center space-x-2">
                    <p className="mb-1">Time Spent:</p>
                    <p className="mb-1" style={{color: '#ffb545'}}>{timeSpent}</p>
                </div>
                <div className="flex flex-row items-center space-x-2">
                    <p className="mb-1">Calories Burnt:</p>
                    <p className="mb-1" style={{color: '#ffb545'}}>{caloriesBurnt}</p>
                </div>
            </div>
        </div>
        <div className="flex items-start justify-between">
            <div>
                <h3 className="text-lg font-medium">AI-Driven Recommendation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Unlock Your Potential with AI Insights.
                </p>
                {recommendation && (
                    <p className="mb-1">{recommendation}</p>
                )}
            </div>
        </div>
      </div>
      <Separator />
      <div className="space-y-8">
        <div className="flex flex-row">
            <div className="flex items-start mr-36 justify-between">
                <div>
                    <h3 className="text-lg font-medium">Analysis</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Your efforts visualized in a pie-chart.
                    </p>
                    <div className="flex flex-row items-center space-x-2">
                        <PieChartComponent 
                            runningCount={runningCount}
                            cyclingCount={cyclingCount}
                            swimmingCount={swimmingCount}
                        />
                    </div>
                </div>
            </div>
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-medium">Progress</h3>
                    <p className="text-sm text-muted-foreground mb-10">
                        Tracking progress towards your target.
                    </p>
                    <div className="flex flex-row items-center space-x-2">
                        <BarChartComponent 
                            distanceCovered={distanceCovered}
                            target={target}
                        />
                    </div>
                </div>
            </div>
        </div>
      </div>
      <Separator />
      <div className="space-y-8">
        <div className="flex flex-row">
            <div className="flex items-start mr-52 justify-between">
                <div>
                    <h3 className="text-lg font-medium">Workouts Completed</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Past efforts, present pride.
                    </p>
                    <ul className="list-inside list-disc">
                    {completedWorkoutsArray?.map((workout: Workout, index: number) => (
                        <li key={index} className="text-md mb-2">
                            {
                                `${ workout.type[0].toUpperCase() }${ workout.type.slice(1) }, 
                                ${ months[new Date(workout.date).getMonth()] } ${ new Date(workout.date).getDate() }, 
                                ${ new Date(workout.date).getHours() + ":" + new Date(workout.date).getMinutes()} - 
                                ${workout.distance} km, ${workout.duration} minutes`
                            }
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-medium">Upcoming Workouts</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Get! Set! Go!
                    </p>
                    <ul className="list-inside list-disc">
                    {upcomingWorkoutsArray?.map((workout: Workout, index: number) => (
                        <li key={index} className="text-md mb-2">
                            {
                                `${ workout.type[0].toUpperCase() }${ workout.type.slice(1) }, 
                                ${ months[new Date(workout.date).getMonth()] } ${ new Date(workout.date).getDate() }, 
                                ${ new Date(workout.date).getHours() + ":" + new Date(workout.date).getMinutes()} - 
                                ${workout.distance} km, ${workout.duration} minutes`
                            }
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

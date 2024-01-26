"use client";

import { Separator } from "@/components/ui/separator";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import "./dashboard.css";

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

export default function Dashboard() {
    const [name, setName] = useState("Pratik");
    const [workoutsCompleted, setWorkoutsCompleted] = useState("7");
    const [recommendation, setRecommendation] = useState("Keep up the motivation!");
    const [workoutsCompletedArray, setWorkoutsCompletedArray] = useState([
        "Swimming, July 8, 5:46 - 9 km, 8 minutes",
        "Running, July 10, 2:46 - 2 km, 10 minutes",
    ])

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
                    <p className="mb-1">Gender:</p>
                    <p className="mb-1" style={{color: '#ffb545'}}>{}</p>
                </div>
                <div className="flex flex-row items-center space-x-2">
                    <p className="mb-1">BMI:</p>
                    <p className="mb-1" style={{color: '#ffb545'}}>{}</p>
                </div>
                <div className="flex flex-row items-center space-x-2">
                    <p className="mb-1">Target:</p>
                    <p className="mb-1" style={{color: '#ffb545'}}>{}</p>
                </div>
                <div className="flex flex-row items-center space-x-2">
                    <p className="mb-1">Progress:</p>
                    <p className="mb-1" style={{color: '#ffb545'}}>{}</p>
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
                    <p className="mb-1" style={{color: '#ffb545'}}>{Number(workoutsCompleted)}</p>
                </div>
                <div className="flex flex-row items-center space-x-2">
                    <p className="mb-1">Upcoming Workouts:</p>
                    <p className="mb-1" style={{color: '#ffb545'}}>{}</p>
                </div>
                <div className="flex flex-row items-center space-x-2">
                    <p className="mb-1">Distance Covered:</p>
                    <p className="mb-1" style={{color: '#ffb545'}}>{}</p>
                </div>
                <div className="flex flex-row items-center space-x-2">
                    <p className="mb-1">Time Spent:</p>
                    <p className="mb-1" style={{color: '#ffb545'}}>{}</p>
                </div>
                <div className="flex flex-row items-center space-x-2">
                    <p className="mb-1">Calories Burnt:</p>
                    <p className="mb-1" style={{color: '#ffb545'}}>{}</p>
                </div>
            </div>
        </div>
        <div className="flex items-start justify-between">
            <div>
                <h3 className="text-lg font-medium">AI-Driven Recommendation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Unlock Your Potential with AI Insights.
                </p>
                <p className="mb-1">{recommendation}</p>
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
                        <PieChartComponent />
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
                        <BarChartComponent />
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
                    {workoutsCompletedArray.map((workout, index) => (
                        <li key={index} className="text-md mb-2">
                        {workout}
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
                    {workoutsCompletedArray.map((workout, index) => (
                        <li key={index} className="text-md mb-2">
                        {workout}
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

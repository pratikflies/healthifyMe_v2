export type Workout = {
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

export type LatLng = {
    lat: number;
    lng: number;
};

export type mapProps = {
  userLocation: {
    lat: number;
    lng: number;
    zoomLevel: number;
  };
  workouts: Workout[];
  onMapClick: (latlng: { lat: number; lng: number }) => void;
};

export type CyclingComponentProps = {
    workout: Workout;
};

export type RunningComponentProps = {
    workout: Workout;
};

export type SidebarWorkoutProps = {
    workoutComponents: JSX.Element[];
};

export type SidebarVisibilityProps = {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isFormVisible: boolean;
    setIsFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
    workoutType: string;
    setWorkoutType: React.Dispatch<React.SetStateAction<string>>;
    clickedCoords: LatLng;
    distance: string;
    setDistance: React.Dispatch<React.SetStateAction<string>>;
    duration: string;
    setDuration: React.Dispatch<React.SetStateAction<string>>;
    cadence: string;
    setCadence: React.Dispatch<React.SetStateAction<string>>;
    elevationGain: string;
    setElevationGain: React.Dispatch<React.SetStateAction<string>>;
    workouts: Workout[];
    setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
    workoutComponents: JSX.Element[];
    setWorkoutComponents: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
};

export type UserLocationType = {
    lat: number;
    lng: number;
    zoomLevel: number;
};

export type SidebarBodyType = {
    setSidebarBody: React.Dispatch<React.SetStateAction<string>>;
};
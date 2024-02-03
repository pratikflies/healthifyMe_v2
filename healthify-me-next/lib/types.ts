export type LoadingProps = {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export type Workout = {
    cadence?: number;
    elevationGain?: number;
    pace?: number;
    speed?: number;
    strokes?: number;
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

export type LatLngArr = [number, number];

export type UserLocationType = LatLng & {
    zoomLevel: number;
};

export type mapClickProps = {
    setIsFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setClickedCoords: React.Dispatch<React.SetStateAction<LatLng>>;
    setSidebarBody: React.Dispatch<React.SetStateAction<string>>;
};

export type mapProps = mapClickProps & {
    userLocation: {
        lat: number;
        lng: number;
        zoomLevel: number;
    };
    workouts: Workout[];
    theme: boolean;
    center: LatLngArr;
};

export type WorkoutComponentProps = {
    workout: Workout;
    isLoggedIn: boolean;
    setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
    setWorkoutComponents: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
    setCenter: React.Dispatch<React.SetStateAction<LatLngArr>>;
}

export type CyclingComponentProps = WorkoutComponentProps;
export type RunningComponentProps = WorkoutComponentProps;
export type SwimmingComponentProps = WorkoutComponentProps;

export type SidebarWorkoutProps = {
    workoutComponents: JSX.Element[];
};

export type SidebarBodyType = LoadingProps & {
    sidebarBody: string,
    setSidebarBody: React.Dispatch<React.SetStateAction<string>>;
};

export type SidebarVisibilityProps = LoadingProps & {
    clickedCoords: LatLng;
    setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
    isFormVisible: boolean;
    setIsFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
    workoutComponents: JSX.Element[];
    setWorkoutComponents: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
    isLoggedIn: boolean;
    setCenter: React.Dispatch<React.SetStateAction<LatLngArr>>;
};

export type authDataType = {
    email: string;
    password: string;
};

export type SidebarNavItem = {
    title: string;
    route: string;
}
  
export type DashboardSidebarProps = {
    children: React.ReactNode;
    heading: string;
    subHeading: string;
    sidebarNavItems: SidebarNavItem[];
    onClick: (route: string) => void;
}

export type ProfileDataType = {
    firstName: string;
    lastName: string;
    gender: string;
    age: number;
    height: number;
    weight: number;
    target: number;
}

export type PieChartProps = {
    runningCount: number;
    cyclingCount: number;
    swimmingCount: number;
}

export type BarChartProps = {
    distanceCovered: number,
    target: number,
}
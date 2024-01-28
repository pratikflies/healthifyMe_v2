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
};

export type CyclingComponentProps = {
    workout: Workout;
};

export type RunningComponentProps = {
    workout: Workout;
};

export type SwimmingComponentProps = {
    workout: Workout;
};

export type SidebarWorkoutProps = {
    workoutComponents: JSX.Element[];
};

export type SidebarBodyType = LoadingProps & {
    sidebarBody: string,
    setSidebarBody: React.Dispatch<React.SetStateAction<string>>;
};

export type SidebarVisibilityProps = LoadingProps & {
    clickedCoords: LatLng;
    workouts: Workout[];
    setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
    isFormVisible: boolean;
    setIsFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
    workoutComponents: JSX.Element[];
    setWorkoutComponents: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
    isLoggedIn: boolean;
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
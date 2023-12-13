export interface ApproachRequest {
  id?: number;
  param1: string;
  param2: string;
}

export interface ExerciseRequest {
  id?: string;
  type: string;
  name: string;
  combinationParams: string;
  description: string;
  approaches?: ApproachRequest[];
}

export interface ExerciseResponse {
  message: string;
  data: {
    exercises: ExerciseRequest[];
  };
}

export interface WorkoutRequest {
  id?: string;
  name: string;
  date: number;
  type: string;
  comment: string;
  exercises: ExerciseRequest[];
}

export interface MainWorkoutState {
  id?: string;
  date: string;
  name: string;
  type: string;
  comment: string;
}

export interface WorkoutState {
  id: string;
  count: number;
  subtype: string;
  name: string;
  date: string;
  type: string;
  comment: string;
  exercises: ExerciseRequest[];
}

export const workoutStateInitialValues: WorkoutState = {
  id: '',
  count: 0,
  date: '',
  subtype: '',
  name: '',
  type: '',
  comment: '',
  exercises: [],
};

export interface WorkoutResponse {
  message: string;
  data: WorkoutRequest;
}

export interface WorkoutsResponse {
  message: string;
  data: {
    workouts_count: number;
    workouts: WorkoutRequest[];
  };
}

export interface WorkoutsRequest {
  limit: number;
  offset: number;
  sort: string;
  from?: number;
  to?: number;
}

export const combinationParams = [
  { params: 'distant_time', name: 'Distant/Time', param1: 'Distant', param2: 'Time' },
  { params: 'count_weight', name: 'Count/Weight', param1: 'Count', param2: 'Weight' },
  { params: 'count_time', name: 'Count/Time', param1: 'Count', param2: 'Time' },
];

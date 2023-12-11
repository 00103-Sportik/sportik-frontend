export interface ApproachRequest {
  id?: string;
  param1: number;
  param2?: number;
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
  comment?: string;
  exercises?: ExerciseRequest[];
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

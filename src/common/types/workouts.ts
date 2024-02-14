export interface ApproachRequest {
  uuid?: string;
  param1: number;
  param2: number;
}

export interface ApproachState {
  uuid?: string;
  param1: string;
  param2: string;
}

export interface ExerciseRequest {
  uuid?: string;
  user_uuid?: string | null;
  subtype_uuid: string;
  name: string;
  combination_params: string;
  description: string;
  approaches?: ApproachRequest[];
}

export interface ExerciseRequestPost {
  uuid: string;
  name: string;
  combination_params?: string;
  approaches?: ApproachRequest[];
}

export interface ExerciseResponse {
  message: string;
  data: {
    exercises: ExerciseRequest[];
  };
}

export interface OneExerciseResponse {
  message: string;
  data: ExerciseRequest;
}

export interface WorkoutRequest {
  uuid?: string;
  name: string;
  date: string;
  type: string;
  comment: string;
  exercises: ExerciseRequestPost[];
}

export interface MainWorkoutState {
  uuid?: string;
  date: string;
  name: string;
  type: string;
  comment: string;
}

export interface WorkoutState {
  uuid: string;
  count: number;
  subtype: string;
  name: string;
  date: string;
  type: string;
  comment: string;
  exercises: ExerciseRequestPost[];
}

export const workoutStateInitialValues: WorkoutState = {
  uuid: '',
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
  from?: string;
  to?: string;
}

export const combinationParams = [
  { params: 'distant_time', name: 'Distant/Time', param1: 'Distant', param2: 'Time' },
  { params: 'count_weight', name: 'Count/Weight', param1: 'Count', param2: 'Weight' },
  { params: 'count_time', name: 'Count/Time', param1: 'Count', param2: 'Time' },
];

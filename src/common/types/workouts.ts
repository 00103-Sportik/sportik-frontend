export interface Approach {
  id: string;
  param1: number;
  param2?: number;
}

export interface ExerciseRequest {
  id: string;
  name: string;
  combinationParams: string;
  approaches: Approach[];
}

export interface WorkoutRequest {
  id: string;
  name: string;
  date: number;
  type: string;
  comment?: string;
  exercises?: ExerciseRequest[];
}

export interface WorkoutResponse {
  message: string;
  data: WorkoutRequest;
}

export interface WorkoutsResponse {
  message: string;
  data: {
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

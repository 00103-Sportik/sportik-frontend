export interface ExercisesRequest {
  id?: string;
  name: string;
  subtype: string;
}

export interface ExercisesResponse {
  message: string;
  data: {
    exercises: ExercisesRequest[];
  };
}

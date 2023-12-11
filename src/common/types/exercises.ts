export interface ExercisesRequest {
  id: string;
  name: string;
  subtypeId: string;
}

export interface ExercisesResponse {
  message: string;
  data: {
    exercises: ShortExercises[];
  };
}

interface ShortExercises {
  id: string;
  name: string;
}

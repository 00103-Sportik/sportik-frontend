export interface ExerciseRequest {
    id: string;
    name: string;
    subtypeId: string;
}

export interface ExerciseResponse {
    message: string;
    data: {
        exercises: ShortExercise[]
    }
}

interface ShortExercise {
    id: string;
    name: string;
}

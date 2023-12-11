import { AppRootStateType } from '../types.ts';

export const selectWorkoutsCount = (state: AppRootStateType) => state.workouts.count;
export const selectCurrentWorkout = (state: AppRootStateType) => state.workouts.id;
export const selectExercises = (state: AppRootStateType) => state.workouts.exercises;
export const selectFullWorkoutInfo = (state: AppRootStateType) => state.workouts;

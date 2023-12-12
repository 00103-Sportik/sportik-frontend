import { AppRootStateType } from '../types.ts';

export const selectWorkoutsCount = (state: AppRootStateType) => state.workouts.count;
export const selectCurrentWorkout = (state: AppRootStateType) => state.workouts.id;
export const selectType = (state: AppRootStateType) => state.workouts.type;
export const selectSubtype = (state: AppRootStateType) => state.workouts.subtype;

export const selectExercises = (state: AppRootStateType) => state.workouts.exercises;
export const selectFullWorkoutInfo = (state: AppRootStateType) => state.workouts;

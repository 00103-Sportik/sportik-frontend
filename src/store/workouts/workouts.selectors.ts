import { AppRootStateType } from '../types.ts';

export const selectWorkoutsCount = (state: AppRootStateType) => state.workouts.count;

export const selectCurrentWorkout = (state: AppRootStateType) => state.workouts.id;

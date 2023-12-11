import { AppRootStateType } from '../types.ts';

export const selectWorkoutsCount = (state: AppRootStateType) => state.workouts.count;

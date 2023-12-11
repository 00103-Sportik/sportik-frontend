import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { workoutStateInitialValues, WorkoutState } from '../../common/validations/workoutValidationSchema.ts';

export const workoutsSlice = createSlice({
  name: 'workout',
  initialState: workoutStateInitialValues,
  reducers: {
    setCountWorkouts: (state: Draft<WorkoutState>, action: PayloadAction<Pick<WorkoutState, 'count'>>) => {
      const { count } = action.payload;
      state.count = count;
    },
    setCurrentWorkouts: (state: Draft<WorkoutState>, action: PayloadAction<Pick<WorkoutState, 'id'>>) => {
      const { id } = action.payload;
      state.id = id;
    },
  },
});

export const { setCountWorkouts, setCurrentWorkouts } = workoutsSlice.actions;

export const workoutsReducer = workoutsSlice.reducer;

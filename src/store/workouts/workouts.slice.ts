import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { WorkoutCount, workoutsInitialValues } from '../../common/validations/workoutValidationSchema.ts';

export const workoutsSlice = createSlice({
  name: 'workout',
  initialState: workoutsInitialValues,
  reducers: {
    setCountWorkouts: (state: Draft<WorkoutCount>, action: PayloadAction<WorkoutCount>) => {
      const { count } = action.payload;
      state.count = count;
    },
  },
});

export const { setCountWorkouts } = workoutsSlice.actions;

export const workoutsReducer = workoutsSlice.reducer;

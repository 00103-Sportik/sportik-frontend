import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import {
  ExerciseRequest,
  MainWorkoutState,
  WorkoutState,
  workoutStateInitialValues,
} from '../../common/types/workouts.ts';

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
    setExercise: (state: Draft<WorkoutState>, action: PayloadAction<ExerciseRequest>) => {
      const exercise = action.payload;
      state.exercises = [...state.exercises, exercise];
    },
    setSubtype: (state: Draft<WorkoutState>, action: PayloadAction<Pick<WorkoutState, 'subtype'>>) => {
      const { subtype } = action.payload;
      state.subtype = subtype;
    },
    setMainInfo: (state: Draft<WorkoutState>, action: PayloadAction<MainWorkoutState>) => {
      const { id, name, date, type, comment } = action.payload;
      if (id) {
        state.id = id;
      }
      state.name = name;
      state.date = date;
      state.type = type;
      state.comment = comment;
    },
    discardWorkoutInfo: (state: Draft<WorkoutState>) => {
      state.id = '';
      state.subtype = '';
      state.name = '';
      state.date = '';
      state.type = '';
      state.comment = '';
      state.exercises = [];
    },
  },
});

export const { discardWorkoutInfo, setCountWorkouts, setCurrentWorkouts, setMainInfo, setExercise, setSubtype } =
  workoutsSlice.actions;

export const workoutsReducer = workoutsSlice.reducer;

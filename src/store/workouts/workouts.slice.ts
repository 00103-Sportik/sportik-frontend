import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import {
  ApproachRequest,
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
    setApproaches: (
      state: Draft<WorkoutState>,
      action: PayloadAction<{ exerciseId: string; approaches: ApproachRequest[] }>,
    ) => {
      const { exerciseId, approaches } = action.payload;
      state.exercises.filter((exercise) => exercise.id === exerciseId)[0].approaches = approaches;
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

export const {
  discardWorkoutInfo,
  setApproaches,
  setCountWorkouts,
  setCurrentWorkouts,
  setMainInfo,
  setExercise,
  setSubtype,
} = workoutsSlice.actions;

export const workoutsReducer = workoutsSlice.reducer;

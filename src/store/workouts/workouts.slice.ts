import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import {
  ApproachRequest,
  ExerciseRequestPost,
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
    setCurrentWorkouts: (state: Draft<WorkoutState>, action: PayloadAction<Pick<WorkoutState, 'uuid'>>) => {
      const { uuid } = action.payload;
      state.uuid = uuid;
    },
    setExercise: (state: Draft<WorkoutState>, action: PayloadAction<ExerciseRequestPost>) => {
      const exercise = action.payload;
      state.exercises = [...state.exercises, exercise];
    },
    unsetExercise: (state: Draft<WorkoutState>, action: PayloadAction<{ index: number }>) => {
      const { index } = action.payload;
      const toState = [...state.exercises];
      state.exercises = [];
      state.exercises = toState.slice(0, index).concat(toState.slice(index + 1));
    },
    setApproaches: (
      state: Draft<WorkoutState>,
      action: PayloadAction<{ exerciseId: string; approaches: ApproachRequest[] }>,
    ) => {
      const { exerciseId, approaches } = action.payload;
      state.exercises.filter((exercise) => exercise.uuid === exerciseId)[0].approaches = approaches;
    },
    setSubtype: (state: Draft<WorkoutState>, action: PayloadAction<Pick<WorkoutState, 'subtype'>>) => {
      const { subtype } = action.payload;
      state.subtype = subtype;
    },
    setMainInfo: (state: Draft<WorkoutState>, action: PayloadAction<MainWorkoutState>) => {
      const { uuid, name, date, type, comment } = action.payload;
      if (uuid) {
        state.uuid = uuid;
      }
      state.name = name;
      state.date = date;
      state.type = type;
      state.comment = comment;
    },
    discardWorkoutInfo: (state: Draft<WorkoutState>) => {
      state.uuid = '';
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
  unsetExercise,
  discardWorkoutInfo,
  setApproaches,
  setCountWorkouts,
  setCurrentWorkouts,
  setMainInfo,
  setExercise,
  setSubtype,
} = workoutsSlice.actions;

export const workoutsReducer = workoutsSlice.reducer;

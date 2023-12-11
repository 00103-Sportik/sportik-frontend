import { apiSlice } from '../api.slice';
import { EXERCISES_URL } from '../../common/constants/api';
import { ExerciseRequest, ExerciseResponse } from '../../common/types/workouts.ts';

export const exercisesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExercises: builder.query<ExerciseResponse, Pick<ExerciseRequest, 'type'>>({
      query: ({ type }) => ({
        url: `${EXERCISES_URL}?subtype=${type}`,
        method: 'GET',
      }),
      providesTags: ['Exercises'],
    }),
    createExercise: builder.mutation<void, ExerciseRequest>({
      query: (body) => ({
        url: EXERCISES_URL,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Exercises'],
    }),
    updateExercise: builder.mutation<void, ExerciseRequest>({
      query: (body) => ({
        url: EXERCISES_URL,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Exercises'],
    }),
    deleteExercise: builder.mutation<void, Pick<ExerciseRequest, 'id'>>({
      query: ({ id }) => ({
        url: `${EXERCISES_URL}?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Exercises'],
    }),
  }),
});

export const { useGetExercisesQuery, useCreateExerciseMutation, useUpdateExerciseMutation, useDeleteExerciseMutation } =
  exercisesApi;

import { apiSlice } from '../api.slice';
import { EXERCISES_URL } from '../../common/constants/api';
import { ExerciseRequest, ExerciseResponse } from '../../common/types/exercises';

export const exercisesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExercises: builder.query<ExerciseResponse, Pick<ExerciseRequest, 'subtypeId'>>({
      query: (subtypeId) => ({
        url: `${EXERCISES_URL}?subtype=${subtypeId}`,
        method: 'GET',
      }),
      providesTags: ['Exercises'],
    }),
    postExercises: builder.mutation<void, ExerciseRequest>({
      query: (body) => ({
        url: EXERCISES_URL,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Exercises'],
    }),
    updateExercises: builder.mutation<void, ExerciseRequest>({
      query: (body) => ({
        url: EXERCISES_URL,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Exercises'],
    }),
    deleteExercises: builder.mutation<void, Pick<ExerciseRequest, 'id'>>({
      query: (id) => ({
        url: `${EXERCISES_URL}?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Exercises'],
    }),
  }),
});

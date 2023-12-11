import { apiSlice } from '../api.slice';
import { EXERCISES_URL } from '../../common/constants/api';
import { ExercisesRequest, ExercisesResponse } from '../../common/types/exercises';

export const exercisesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExercises: builder.query<ExercisesResponse, Pick<ExercisesRequest, 'subtype'>>({
      query: ({ subtype }) => ({
        url: `${EXERCISES_URL}?subtype=${subtype}`,
        method: 'GET',
      }),
      providesTags: ['Exercises'],
    }),
    postExercises: builder.mutation<void, ExercisesRequest>({
      query: (body) => ({
        url: EXERCISES_URL,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Exercises'],
    }),
    updateExercises: builder.mutation<void, ExercisesRequest>({
      query: (body) => ({
        url: EXERCISES_URL,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Exercises'],
    }),
    deleteExercises: builder.mutation<void, Pick<ExercisesRequest, 'id'>>({
      query: ({ id }) => ({
        url: `${EXERCISES_URL}?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Exercises'],
    }),
  }),
});

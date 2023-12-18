import { apiSlice } from '../api.slice';
import { EXERCISES_URL } from '../../common/constants/api';
import { ExerciseRequest, ExerciseResponse, OneExerciseResponse } from '../../common/types/workouts.ts';

export const exercisesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExercises: builder.query<ExerciseResponse, Pick<ExerciseRequest, 'subtype_uuid'>>({
      query: ({ subtype_uuid }) => ({
        url: `${EXERCISES_URL}?subtype_uuid=${subtype_uuid}`,
        method: 'GET',
      }),
      providesTags: ['Exercises'],
    }),
    getExercise: builder.query<OneExerciseResponse, Pick<ExerciseRequest, 'uuid'>>({
      query: ({ uuid }) => ({
        url: `${EXERCISES_URL}/${uuid}`,
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
      query: ({ uuid, ...body }) => ({
        url: `${EXERCISES_URL}/${uuid}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Exercises'],
    }),
    deleteExercise: builder.mutation<void, Pick<ExerciseRequest, 'uuid'>>({
      query: ({ uuid }) => ({
        url: `${EXERCISES_URL}/${uuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Exercises'],
    }),
  }),
});

export const {
  useGetExercisesQuery,
  useGetExerciseQuery,
  useCreateExerciseMutation,
  useUpdateExerciseMutation,
  useDeleteExerciseMutation,
} = exercisesApi;

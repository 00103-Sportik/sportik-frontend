import { apiSlice } from '../api.slice.ts';
import { WORKOUTS_URL } from '../../common/constants/api.ts';
import { WorkoutRequest, WorkoutResponse, WorkoutsRequest, WorkoutsResponse } from '../../common/types/workouts.ts';

export const workoutsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWorkouts: builder.query<WorkoutsResponse, WorkoutsRequest>({
      query: ({ limit, offset, sort, from, to }) => ({
        url: `${WORKOUTS_URL}?limit=${limit}&offset=${offset}&sort=${sort}${
          from !== to ? '&from=' + from + '&to=' + to : ''
        }`,
        method: 'GET',
      }),
      providesTags: ['Workouts'],
    }),
    getWorkout: builder.query<WorkoutResponse, Pick<WorkoutRequest, 'uuid'>>({
      query: ({ uuid }) => ({
        url: `${WORKOUTS_URL}/${uuid}`,
        method: 'GET',
      }),
      providesTags: ['Workouts'],
    }),
    createWorkout: builder.mutation<WorkoutResponse, WorkoutRequest>({
      query: (body) => ({
        url: WORKOUTS_URL,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Workouts'],
    }),
    updateWorkout: builder.mutation<WorkoutResponse, WorkoutRequest>({
      query: ({ uuid, ...body }) => ({
        url: `${WORKOUTS_URL}/${uuid}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Workouts'],
    }),
    deleteWorkout: builder.mutation<void, Pick<WorkoutRequest, 'uuid'>>({
      query: ({ uuid }) => ({
        url: `${WORKOUTS_URL}/${uuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Workouts'],
    }),
  }),
});

export const {
  useGetWorkoutsQuery,
  useGetWorkoutQuery,
  useCreateWorkoutMutation,
  useUpdateWorkoutMutation,
  useDeleteWorkoutMutation,
} = workoutsApi;

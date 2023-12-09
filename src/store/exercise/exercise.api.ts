import {apiSlice} from "../api.slice";
import {EXERCISES_URL} from "../../common/constants/api";
import {ExerciseRequest, ExerciseResponse} from "../../common/types/exercises";

export const exerciseApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getExercises: builder.query<ExerciseResponse, Pick<ExerciseRequest, 'subtypeId'>>({
            query: (subtypeId) => ({
                url: `${EXERCISES_URL}?subtype=${subtypeId}`,
                method: 'GET'
            }),
            providesTags: ['Exercise']
        }),
        postExercises: builder.query<void, ExerciseRequest>({
            query: (body) => ({
                url: EXERCISES_URL,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Exercise']
        }),
        updateExercises: builder.query<void, ExerciseRequest>({
            query: (body) => ({
                url: EXERCISES_URL,
                method: 'PUT',
                body
            }),
            invalidatesTags: ['Exercise']
        }),
        deleteExercises: builder.query<void, Pick<ExerciseRequest, 'id'>>({
            query: (id) => ({
                url: `${EXERCISES_URL}?id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Exercise']
        })
    })
})


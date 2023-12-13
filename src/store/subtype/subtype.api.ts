import { apiSlice } from '../api.slice';
import { SUBTYPES_URL } from '../../common/constants/api';
import { SubtypesResponse, SubtypesRequest, SubtypeResponse } from '../../common/types/subtypes';

export const subtypeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubtypes: builder.query<SubtypesResponse, Pick<SubtypesRequest, 'type'>>({
      query: ({ type }) => ({
        url: `${SUBTYPES_URL}?type=${type}`,
        method: 'GET',
      }),
      providesTags: ['Subtypes'],
    }),
    createSubtype: builder.mutation<void, SubtypesRequest>({
      query: (body) => ({
        url: SUBTYPES_URL,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subtypes'],
    }),
    updateSubtype: builder.mutation<void, SubtypesRequest>({
      query: (body) => ({
        url: SUBTYPES_URL,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Subtypes'],
    }),
    deleteSubtype: builder.mutation<void, Pick<SubtypeResponse, 'uuid'>>({
      query: ({ uuid }) => ({
        url: `${SUBTYPES_URL}?uuid=${uuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subtypes'],
    }),
  }),
});

export const { useGetSubtypesQuery, useCreateSubtypeMutation, useUpdateSubtypeMutation, useDeleteSubtypeMutation } =
  subtypeApi;

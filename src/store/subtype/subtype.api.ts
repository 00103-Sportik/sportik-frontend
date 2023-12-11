import { apiSlice } from '../api.slice';
import { SUBTYPES_URL } from '../../common/constants/api';
import { SubtypesResponse, SubtypesRequest } from '../../common/types/subtypes';

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
    deleteSubtype: builder.mutation<void, Pick<SubtypesRequest, 'id'>>({
      query: ({ id }) => ({
        url: `${SUBTYPES_URL}?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subtypes'],
    }),
  }),
});

export const { useGetSubtypesQuery, useCreateSubtypeMutation, useUpdateSubtypeMutation, useDeleteSubtypeMutation } =
  subtypeApi;

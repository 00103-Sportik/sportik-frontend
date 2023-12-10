import { apiSlice } from '../api.slice';
import { SUBTYPES_URL } from '../../common/constants/api';
import { SubtypeResponse, SubtypeRequest } from '../../common/types/subtypes';

export const subtypeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubtypes: builder.query<SubtypeResponse, Pick<SubtypeRequest, 'typeId'>>({
      query: (typeId) => ({
        url: `${SUBTYPES_URL}?type=${typeId}`,
        method: 'GET',
      }),
      providesTags: ['Subtypes'],
    }),
    postSubtypes: builder.mutation<void, SubtypeRequest>({
      query: (body) => ({
        url: SUBTYPES_URL,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subtypes'],
    }),
    updateSubtypes: builder.mutation<void, SubtypeRequest>({
      query: (body) => ({
        url: SUBTYPES_URL,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Subtypes'],
    }),
    deleteSubtypes: builder.mutation<void, Pick<SubtypeRequest, 'id'>>({
      query: (id) => ({
        url: `${SUBTYPES_URL}?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subtypes'],
    }),
  }),
});

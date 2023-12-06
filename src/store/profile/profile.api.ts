import { apiSlice } from '../api.slice.ts';
import { GET_PROFILE_URL, UPDATE_PROFILE_URL } from '../../common/constants/api.ts';
import { ProfileResponse } from '../../common/types/profile.ts';

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: `${GET_PROFILE_URL}`,
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<ProfileResponse, ProfileResponse>({
      query: (body) => ({
        url: UPDATE_PROFILE_URL,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;

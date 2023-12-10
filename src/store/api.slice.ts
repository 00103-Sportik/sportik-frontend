import { BaseQueryApi, BaseQueryFn, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AUTHENTICATION_URL, BASE_URL } from '../common/constants/api.ts';
import { AppRootStateType } from './types.ts';
import { setLoading } from './loading/loading.slice.ts';
import { setCredentials } from './auth/auth.slice.ts';
import { AuthResponse } from '../common/types/auth.ts';
import { ErrorResponse } from 'react-router-dom';

const baseQuery = fetchBaseQuery({
  mode: 'cors',
  baseUrl: BASE_URL,
  credentials: 'include',
  prepareHeaders(headers, api) {
    const { accessToken } = (api.getState() as AppRootStateType).auth;
    if (accessToken) {
      headers.set('authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});
// @ts-ignore
export const query: BaseQueryFn<FetchArgs, unknown, ErrorResponse> = async (
  args: FetchArgs,
  api: BaseQueryApi,
  extraOptions,
) => {
  try {
    api.dispatch(setLoading(true));

    const result = await baseQuery(args, api, extraOptions);
    let credentials;

    if (result?.meta?.request.url === `${BASE_URL}${AUTHENTICATION_URL}`) {
      if (result.data) {
        credentials = (result.data as { data: AuthResponse }).data;
        api.dispatch(setCredentials(credentials));
      }
    }
    if (result.data) {
      return {
        data: result.data,
      };
    }
  } finally {
    api.dispatch(setLoading(false));
  }
};

export const apiSlice = createApi({
  reducerPath: 'splitApi',
  baseQuery: query,
  tagTypes: ['Profile', 'Workouts', 'Exercises', 'Subtypes'],
  refetchOnMountOrArgChange: true,
  endpoints: () => ({}),
});

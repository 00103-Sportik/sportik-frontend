import { BaseQueryApi, BaseQueryFn, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AUTHENTICATION_URL, BASE_URL, ResponseCodes, UPDATE_TOKENS_URL } from '../common/constants/api.ts';
import { AppRootStateType } from './types.ts';
import { setLoading } from './loading/loading.slice.ts';
import { logout, setCredentials } from './auth/auth.slice.ts';
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

    let refreshTokenResult;
    let resultAfterUpdatingToken;
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
    switch (result?.error?.status) {
      case ResponseCodes.UNAUTHORIZED:
        refreshTokenResult = await baseQuery(UPDATE_TOKENS_URL, api, extraOptions);
        if (refreshTokenResult.error) {
          api.dispatch(logout());

          return {
            error: {
              message: 'Failed attempt to update tokens',
              status: 1,
            },
          };
        }
        credentials = (refreshTokenResult.data as { data: AuthResponse }).data;
        api.dispatch(setCredentials(credentials as AuthResponse));
        resultAfterUpdatingToken = await baseQuery(args, api, extraOptions);

        if (resultAfterUpdatingToken.error) {
          return {
            error: {
              message:
                (
                  resultAfterUpdatingToken.error as {
                    data: any;
                    status: number;
                  }
                ).data.message || 'Unexpected error. Try again later',
              status: 0,
            },
          };
        }

        return {
          data: resultAfterUpdatingToken.data,
        };

      case ResponseCodes.INVALID_REQUEST:
        return {
          error: {
            message:
              // @ts-ignore
              result.error.data.message || 'Invalid request. Try changing your request details',
            status: ResponseCodes.INVALID_REQUEST,
          },
        };

      case ResponseCodes.INTERNAL_SERVER_ERROR:
        return {
          error: {
            message:
              // @ts-ignore
              result.error.data.message || 'Error on the server. Please try again later',
            status: ResponseCodes.INTERNAL_SERVER_ERROR,
          },
        };
      default:
        return {
          error: {
            message: 'Unexpected error',
            status: 0,
          },
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

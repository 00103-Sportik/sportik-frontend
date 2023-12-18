import { BaseQueryApi, BaseQueryFn, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL, ResponseCodes } from '../common/constants/api.ts';
import { AppRootStateType } from './types.ts';
import { setLoading } from './loading/loading.slice.ts';
import { logout, setCredentials } from './auth/auth.slice.ts';
import { AuthResponse, SuccessAuthResponse } from '../common/types/auth.ts';
import { ErrorResponse } from 'react-router-dom';

const baseQuery = fetchBaseQuery({
  mode: 'cors',
  baseUrl: BASE_URL,
  credentials: 'include',
  prepareHeaders(headers, api) {
    const { access_token } = (api.getState() as AppRootStateType).auth;
    if (access_token) {
      headers.set('authorization', `Bearer ${access_token}`);
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

    if (result?.meta?.request.url === `${BASE_URL}auth/signin`) {
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
        // @ts-ignore
        const refreshToken = JSON.parse(JSON.parse(window.localStorage.getItem('persist:redux')).auth).refresh_token;
        const refreshTokenResult = await (
          await fetch(`${BASE_URL}auth/update-token`, {
            mode: 'cors',
            credentials: 'include',
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              refresh_token: refreshToken,
            }),
          })
        ).json();
        if (refreshTokenResult.error) {
          api.dispatch(logout());

          return {
            error: {
              message: 'Failed attempt to update tokens',
              status: 1,
            },
          };
        }
        credentials = (refreshTokenResult as SuccessAuthResponse).data;
        api.dispatch(setCredentials(credentials as AuthResponse));
        const resultAfterUpdatingToken = await baseQuery(args, api, extraOptions);

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

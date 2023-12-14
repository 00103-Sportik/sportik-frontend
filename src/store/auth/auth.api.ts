import { ActivateRequest, AuthRequest, SuccessAuthResponse, UpdateRequest } from '../../common/types/auth.ts';
import {
  ACTIVATION_URL,
  AUTHENTICATION_URL,
  REGISTRATION_URL,
  RESEND_EMAIL_URL,
  UPDATE_TOKEN_URL,
} from '../../common/constants/api.ts';
import { apiSlice } from '../api.slice.ts';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    authentication: builder.mutation<SuccessAuthResponse, AuthRequest>({
      query: (body) => ({
        url: AUTHENTICATION_URL,
        method: 'POST',
        body,
      }),
    }),
    registration: builder.mutation<SuccessAuthResponse, AuthRequest>({
      query: (body) => ({
        url: REGISTRATION_URL,
        method: 'POST',
        body,
      }),
    }),
    updateToken: builder.mutation<SuccessAuthResponse, UpdateRequest>({
      query: (body) => ({
        url: UPDATE_TOKEN_URL,
        method: 'PUT',
        body,
      }),
    }),
    resendEmail: builder.mutation<SuccessAuthResponse, Pick<AuthRequest, 'email'>>({
      query: (body) => ({
        url: RESEND_EMAIL_URL,
        method: 'PUT',
        body,
      }),
    }),
    activation: builder.mutation<SuccessAuthResponse, ActivateRequest>({
      query: (body) => ({
        url: ACTIVATION_URL,
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const {
  useAuthenticationMutation,
  useActivationMutation,
  useUpdateTokenMutation,
  useRegistrationMutation,
  useResendEmailMutation,
} = authApi;

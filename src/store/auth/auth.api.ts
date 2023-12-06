import { AuthRequest, SuccessAuthResponse } from '../../common/types/auth.ts';
import { AUTHENTICATION_URL, REGISTRATION_URL, RESEND_EMAIL_URL } from '../../common/constants/api.ts';
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
    resendEmail: builder.mutation<SuccessAuthResponse, Pick<AuthRequest, 'email'>>({
      query: (body) => ({
        url: RESEND_EMAIL_URL,
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const { useAuthenticationMutation, useRegistrationMutation, useResendEmailMutation } = authApi;

export const BASE_URL = 'http://localhost:8080/api/v1/';
export const AUTHENTICATION_URL = '/auth/signin';
export const REGISTRATION_URL = '/auth/signup';
export const RESEND_EMAIL_URL = '/auth/resend-email';
export const UPDATE_TOKENS_URL = '/auth/update-token';
export const GET_PROFILE_URL = '/profile';
export const UPDATE_PROFILE_URL = GET_PROFILE_URL;
export const WORKOUTS_URL = '/workouts';

export const EXERCISES_URL = '/exercises';

export const SUBTYPES_URL = '/subtypes';

export const APPROACHES_URL = '/approaches';

export enum ResponseCodes {
  OK = 200,
  INVALID_REQUEST = 400,
  UNAUTHORIZED = 401,
  INTERNAL_SERVER_ERROR = 500,
}

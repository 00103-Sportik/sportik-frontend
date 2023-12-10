export const BASE_URL = 'http://localhost:8080/';
export const AUTHENTICATION_URL = '/auth/signin';
export const REGISTRATION_URL = '/auth/signup';
export const RESEND_EMAIL_URL = '/auth/resend-email';
export const GET_PROFILE_URL = '/profile';
export const UPDATE_PROFILE_URL = GET_PROFILE_URL;
export const WORKOUTS_URL = '/workouts';

export enum ResponseCodes {
  OK = 200,
  INVALID_REQUEST = 400,
  UNAUTHORIZED = 401,
  INTERNAL_SERVER_ERROR = 500,
}

export const BASE_URL = 'http://localhost:5000/';
export const AUTHENTICATION_URL = '/auth/signin';
export const REGISTRATION_URL = '/auth/signup';
export enum ResponseCodes {
  OK = 200,
  INVALID_REQUEST = 400,
  UNAUTHORIZED = 401,
  INTERNAL_SERVER_ERROR = 500,
}

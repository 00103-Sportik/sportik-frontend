import { AppRootStateType } from '../types.ts';

export const selectIsAuthenticated = (state: AppRootStateType) => state.auth.accessToken !== null;

export const selectUserAuth = (state: AppRootStateType) => state.auth.refreshToken;

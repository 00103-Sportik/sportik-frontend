import { AppRootStateType } from '../types.ts';

export const selectIsAuthenticated = (state: AppRootStateType) => state.auth.access_token !== null;

export const selectRefreshToken = (state: AppRootStateType) => state.auth.refresh_token;

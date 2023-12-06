import { AppRootStateType } from '../types.ts';

export const selectIsAuthenticated = (state: AppRootStateType) => state.auth.accessToken !== null;

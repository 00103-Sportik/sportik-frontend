import { AppRootStateType } from '../types.ts';

export const selectIsAuthenticated = (state: AppRootStateType) => state.auth.access_token !== null;

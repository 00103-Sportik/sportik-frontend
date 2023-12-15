import { AppRootStateType } from '../types.ts';

export const selectAvatar = (state: AppRootStateType) => state.profile.image;
export const selectAge = (state: AppRootStateType) => state.profile.age;

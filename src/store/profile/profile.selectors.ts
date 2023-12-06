import { AppRootStateType } from '../types.ts';

export const selectAvatar = (state: AppRootStateType) => state.profile.avatar;

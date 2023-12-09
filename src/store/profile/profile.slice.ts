import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { AvatarUpdate, ProfileRequest } from '../../common/types/profile.ts';
import { profileInitialValues } from '../../common/validations/profileValidationSchema.ts';

export const profileSlice = createSlice({
  name: 'profile',
  initialState: profileInitialValues,
  reducers: {
    updateAvatar: (state: Draft<ProfileRequest>, action: PayloadAction<AvatarUpdate>) => {
      const { avatar } = action.payload;
      state.avatar = avatar;
    },
  },
});

export const { updateAvatar } = profileSlice.actions;

export const profileReducer = profileSlice.reducer;

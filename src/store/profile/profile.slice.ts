import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { AvatarUpdate } from '../../common/types/profile.ts';
import { ProfileFields, profileInitialValues } from '../../common/validations/profileValidationSchema.ts';

export const profileSlice = createSlice({
  name: 'profile',
  initialState: profileInitialValues,
  reducers: {
    updateAvatar: (state: Draft<ProfileFields>, action: PayloadAction<AvatarUpdate>) => {
      const { avatar } = action.payload;
      state.avatar = avatar;
    },
  },
});

export const { updateAvatar } = profileSlice.actions;

export const profileReducer = profileSlice.reducer;

import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { AvatarUpdate, ProfileResponse } from '../../common/types/profile.ts';

const initialState: ProfileResponse = {
  email: '',
  name: '',
  surname: '',
  sex: '',
  age: '',
  height: '',
  weight: '',
  avatar: '',
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateAvatar: (state: Draft<ProfileResponse>, action: PayloadAction<AvatarUpdate>) => {
      const { avatar } = action.payload;
      state.avatar = avatar;
    },
  },
});

export const { updateAvatar } = profileSlice.actions;

export const profileReducer = profileSlice.reducer;

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
    setProfile: (state: Draft<ProfileFields>, action: PayloadAction<ProfileFields>) => {
      const { email, name, surname, age, weight, height, sex, avatar } = action.payload;
      state.email = email;
      state.name = name;
      state.surname = surname;
      state.age = age;
      state.weight = weight;
      state.height = height;
      state.sex = sex;
      state.avatar = avatar;
    },
  },
});

export const { updateAvatar, setProfile } = profileSlice.actions;

export const profileReducer = profileSlice.reducer;

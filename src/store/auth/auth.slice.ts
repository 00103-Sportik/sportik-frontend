import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { AuthResponse } from '../../common/types/auth.ts';

const initialState: AuthResponse = {
  accessToken: null,
  refreshToken: null,
  id: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state: Draft<AuthResponse>,
      action: PayloadAction<AuthResponse>,
    ) => {
      const { accessToken, refreshToken, id } = action.payload;
      if (accessToken !== null) {
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.id = id;
      }
    },
  },
});

export const { setCredentials } = authSlice.actions;

export const authReducer = authSlice.reducer;

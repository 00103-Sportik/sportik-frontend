import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { AuthResponse } from '../../common/types/auth.ts';

const initialState: AuthResponse = {
  accessToken: null,
  refreshToken: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state: Draft<AuthResponse>, action: PayloadAction<AuthResponse>) => {
      const { accessToken, refreshToken } = action.payload;
      if (accessToken !== null) {
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
      }
    },
    logout: (state: Draft<AuthResponse>) => {
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const authReducer = authSlice.reducer;

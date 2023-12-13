import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { AuthResponse } from '../../common/types/auth.ts';

const initialState: AuthResponse = {
  access_token: null,
  refresh_token: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state: Draft<AuthResponse>, action: PayloadAction<AuthResponse>) => {
      const { access_token, refresh_token } = action.payload;
      if (access_token !== null) {
        state.access_token = access_token;
        state.refresh_token = refresh_token;
      }
    },
    logout: (state: Draft<AuthResponse>) => {
      state.access_token = null;
      state.refresh_token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const authReducer = authSlice.reducer;

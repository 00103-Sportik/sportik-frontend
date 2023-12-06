import storage from 'redux-persist/lib/storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { authReducer } from './auth/auth.slice.ts';
import { loadingReducer } from './loading/loading.slice.ts';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import { apiSlice } from './api.slice.ts';
import { profileReducer } from './profile/profile.slice.ts';

const persistConfig = {
  key: 'redux',
  storage,
  whitelist: ['auth', 'profile'],
};

export const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  profile: profileReducer,
  loading: loadingReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware, thunk),
  devTools: true,
});

export default store;

export const persistor = persistStore(store);

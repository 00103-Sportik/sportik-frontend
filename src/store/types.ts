import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { rootReducer } from './store';

export type AppRootStateType = ReturnType<typeof rootReducer>;

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>;

import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import { AppDispatch, AppRootStateType } from './types';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> =
  useSelector;

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import gigReducer from './slice/gigSlice';
import messageReducer from './slice/messageSlice';
import orderReducer from './slice/orderSlice';
import ratingReducer from './slice/ratingSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      gigs: gigReducer,
      messages: messageReducer,
      orders: orderReducer,
      ratings: ratingReducer,
    },
    
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    })
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch = () => useDispatch<AppDispatch>(); 
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

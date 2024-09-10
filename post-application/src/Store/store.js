import { configureStore } from '@reduxjs/toolkit';
import postReducer from 'slice/PostSlice';

const store = configureStore({
  reducer: {
    post: postReducer,
  },
});

export default store;

// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authslice';
import sidebarReducer from './slices/sidebarslice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sidebar: sidebarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

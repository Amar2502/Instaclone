// redux/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  username: string | null;
  isLoggedIn: boolean;
  user_id: number | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  username: null,
  isLoggedIn: false,
  user_id: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserInfo: (
      state,
      action: PayloadAction<{ username: string; isLoggedIn: boolean; user_id: number }>
    ) => {
      state.username = action.payload.username;
      state.isLoggedIn = action.payload.isLoggedIn;
      state.user_id = action.payload.user_id;
      state.isLoading = false;
    },
    logout: (state) => {
      state.username = null;
      state.isLoggedIn = false;
      state.user_id = null;
      state.isLoading = false;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUserInfo, logout, setIsLoading } = authSlice.actions;
export default authSlice.reducer;

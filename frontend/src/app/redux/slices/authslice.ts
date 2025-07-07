// redux/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  username: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  username: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserInfo: (
      state,
      action: PayloadAction<{ username: string; isLoggedIn: boolean }>
    ) => {
      state.username = action.payload.username;
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    logout: (state) => {
      state.username = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUserInfo, logout } = authSlice.actions;
export default authSlice.reducer;

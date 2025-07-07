// redux/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SidebarState {
  activeTab: string;
}

const initialState: SidebarState = {
  activeTab: 'home',
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setActiveTab: (
      state,
      action: PayloadAction<{ activeTab: string }>
    ) => {
      state.activeTab = action.payload.activeTab;
    },
  },
});

export const { setActiveTab } = sidebarSlice.actions;
export default sidebarSlice.reducer;

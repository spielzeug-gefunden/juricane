import { createSlice } from '@reduxjs/toolkit';

export type AdminState = {
  adminMode: boolean;
  openAdminOnStart: boolean;
};

const initialState: AdminState = {
  adminMode: false,
  openAdminOnStart: false,
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    toggleAdminMode(state) {
      state.adminMode = !state.adminMode;
    },
    // Nach dem Anlegen einer neuen Konfiguration: Admin freischalten und anzeigen
    startInAdminPage(state) {
      state.adminMode = true;
      state.openAdminOnStart = true;
    },
    adminPageOpened(state) {
      state.openAdminOnStart = false;
    },
  },
});

export const { toggleAdminMode, startInAdminPage, adminPageOpened } =
  adminSlice.actions;

export default adminSlice.reducer;

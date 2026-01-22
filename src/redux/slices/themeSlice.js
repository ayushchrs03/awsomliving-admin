import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
  sidebarClassName: "",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeInStore: (state, action) => {
      state.theme = action.payload;
    },
    setSidebarClassName: (state, action) => {
      state.sidebarClassName = action.payload;
    },
  },
});

export const { setThemeInStore, setSidebarClassName } = themeSlice.actions;

export default themeSlice.reducer;

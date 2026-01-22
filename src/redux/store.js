import { configureStore } from "@reduxjs/toolkit";

import themeSlice from "./slices/themeSlice";
import appSlice from "./slices/appSlice";

import authSlice from "./slices/authSlice";
import userSlice from "./slices/userSlice";
import homeSlice from "./slices/homeSlice";
import deviceSlice from "./slices/deviceSlice";
import alertSlice from "./slices/alertSlice";
import residentSlice from "./slices/residentSlice";


export const store = configureStore({
  reducer: {
    app: appSlice,
    theme: themeSlice,
    alert : alertSlice,
    resident : residentSlice,
    auth: authSlice,
    user:userSlice,
    home:homeSlice,
    device:deviceSlice
  },
});

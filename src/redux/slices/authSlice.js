import { createSlice } from "@reduxjs/toolkit";
import { compareOtp, loginUser, resendOtp } from "../actions/userAuth-action";


const initialState = {
  loading: false,
  user: null,
  token: localStorage.getItem("token") || null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(compareOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(compareOtp.fulfilled, (state, action) => {
        state.loading = false;

        const token = action.payload?.data?.token;
        const user = action.payload?.data?.user;

        if (!token) {
          state.error = "Token missing in response";
          return;
        }

        state.token = token;
        state.user = user;
        localStorage.setItem("token", token);
      })
      .addCase(compareOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});


export const { logout } = authSlice.actions;
export default authSlice.reducer;

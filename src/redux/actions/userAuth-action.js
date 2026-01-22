import { createAsyncThunk } from "@reduxjs/toolkit";
import client from "../axios-baseurl";
import axios from "axios";
import { handleError } from "../../utils";

export const loginUser = createAsyncThunk(
  "loginUser",
  async (authInfo, { rejectWithValue }) => {
    try {
      const response = await client.post(
        "/auth/request-otp",
        {
          ...authInfo,   
          is_admin: true
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const compareOtp = createAsyncThunk(
  "compareOtp",
  async (otpInfo, { rejectWithValue }) => {
    try {
      const response = await client.post(
        "/auth/verify-otp",
        { 
          otp: otpInfo.otp,
          is_admin: true
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${otpInfo.token}`
          },
        }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const resendOtp = createAsyncThunk(
  "resendOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await client.post(
        "/auth/resend-otp",
        {
          reason: "resend",
          email: email,
          is_admin: true
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

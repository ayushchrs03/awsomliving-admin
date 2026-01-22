
import { createAsyncThunk } from "@reduxjs/toolkit";
import client from "../axios-baseurl";
import { getAuthToken, handleError } from "../../utils";

export const getUserDetails = createAsyncThunk("users/fetchUserDetails",   async ({ limit, cursor, search }, { rejectWithValue }) => {
    try {
    const token = localStorage.getItem("token");
      const { data } = await client.get("/user/all", {
        params: {
  limit,
  last_id: cursor || undefined,
  search: search || undefined,
},
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    if (!data?.success) {
      return rejectWithValue(data?.message || "Failed to fetch users");
    }

   return {
        data: data.data.data,
        pagination: data.data.pagination,
      };
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);


export const addUserDetails = createAsyncThunk("users/addUserDetails", async (body, { rejectWithValue, getState }) => {
  // const token = getAuthToken(getState);
  try {
    const { data } = await client.post(`/user/add`,body)
    if (!data?.success) {
      return rejectWithValue(result?.message || "Something went wrong");
    }

    return data?.data;
  } catch (error) {
    return handleError(error, rejectWithValue);
  }
})

export const editUserDetails = createAsyncThunk("users/editUserDetails", async (body, { rejectWithValue, getState }) => {
  // const token = getAuthToken(getState);
  try {
    const { data } = await client.put(`/user/update/`+body._id,body)
    if (!data?.success) {
      return rejectWithValue(result?.message || "Something went wrong");
    }

    return data?.data;
  } catch (error) {
    return handleError(error, rejectWithValue);
  }
})

export const viewUserDetails = createAsyncThunk("users/viewUserDetails", async (id, { rejectWithValue, getState }) => {
  // const token = getAuthToken(getState);
  try {
    const { data } = await client.get(`/user/`+id)
    if (!data?.success) {
      return rejectWithValue(result?.message || "Something went wrong");
    }

    return data?.data;
  } catch (error) {
    return handleError(error, rejectWithValue);
  }
})
export const updateUserStatus = createAsyncThunk(
  "user/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await client.patch(
        `user/update-status/${id}`,
        { status }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!data?.success) {
        return rejectWithValue(data?.message || "Failed to update status");
      }

      return { id, status };
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

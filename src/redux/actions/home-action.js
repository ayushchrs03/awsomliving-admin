
import { createAsyncThunk } from "@reduxjs/toolkit";
import client from "../axios-baseurl";
import { getAuthToken, handleError } from "../../utils";

export const getHomeDetails = createAsyncThunk("home/fetchHomeDetails",  async ({ limit, cursor, search }, { rejectWithValue }) => {
  try {
    const { data } = await client.get("/home", {
        params: {
          limit,
          last_id: cursor || undefined,
          search: search || undefined,
        },
      });

      if (!data?.success) {
        return rejectWithValue(data?.message || "Failed to fetch homes");
      }

      return {
        data: data.data,              
        pagination: data.pagination,  
      };
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);


export const addHomeDetails = createAsyncThunk("home/addHomeDetails", async (body, { rejectWithValue, getState }) => {
  // const token = getAuthToken(getState);
  try {
    const { data } = await client.post(`home`,body)

    return data?.data;
  } catch (error) {
    return handleError(error, rejectWithValue);
  }
})

export const editHomeDetails = createAsyncThunk("home/editHomeDetails", async (body, { rejectWithValue, getState }) => {
  // const token = getAuthToken(getState);
  try {
    const { data } = await client.put(`home/update/`+body._id,body)

    return data?.data;
  } catch (error) {
    return handleError(error, rejectWithValue);
  }
})

export const viewHomeDetails = createAsyncThunk("home/viewHomeDetails", async (id, { rejectWithValue, getState }) => {
  try {
    const { data } = await client.get(`home/`+id)
    if (!data?.success) {
      return rejectWithValue(result?.message || "Something went wrong");
    }

    return data?.data;
  } catch (error) {
    return handleError(error, rejectWithValue);
  }
})


export const updateHomeStatus = createAsyncThunk(
  "home/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await client.patch(
        `home/update-status/${id}`,
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
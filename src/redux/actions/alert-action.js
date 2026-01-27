import { createAsyncThunk } from "@reduxjs/toolkit";
import client from "../axios-baseurl";
import { handleError } from "../../utils";

export const getAlertDetails = createAsyncThunk(
  "alert/getAll",
  async ({ limit, cursor, search }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await client.get(`/alert`, {
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
        return rejectWithValue(data?.message || "Failed to fetch alerts");
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

export const addAlertDetails = createAsyncThunk(
  "alert/add",
  async (body, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await client.post(`/alert`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      return data.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const editAlertDetails = createAsyncThunk(
  "alert/update",
  async (body, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await client.put(
        `/alert/update/${body._id}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const updateAlertStatus = createAsyncThunk(
  "alert/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await client.patch(
        `/alert/update-status/${id}`,
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

export const viewAlertDetails = createAsyncThunk(
  "alert/view",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await client.get(`/alert/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data?.success) {
        return rejectWithValue(data?.message || "Failed to fetch alert details");
      }

      return data.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

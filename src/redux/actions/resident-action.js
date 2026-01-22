import { createAsyncThunk } from "@reduxjs/toolkit";
import client from "../axios-baseurl";
import { handleError } from "../../utils";

export const getResidentDetails = createAsyncThunk(
  "resident/getAll",
  async ({ limit, cursor, search }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await client.get(`resident/get_all_residents`, {
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
        return rejectWithValue(data?.message || "Failed to fetch residents");
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

export const addResidentDetails = createAsyncThunk(
  "resident/add",
  async (body, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await client.post(`resident/create_resident`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data?.success) {
        return rejectWithValue(data?.message || "Failed to add alert");
      }

      return data.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const editResidentDetails = createAsyncThunk(
  "resident/update",
  async (body, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await client.put(
        `resident/update_resident/${body._id}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!data?.success) {
        return rejectWithValue(data?.message || "Failed to update alert");
      }

      return data.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const updateResidentStatus = createAsyncThunk(
  "resident/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await client.put(
        `resident/update_resident_status/${id}`,
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

export const viewResidentDetails = createAsyncThunk(
  "resident/view",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await client.get(`resident/get_resident_by_id/${id}`, {
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

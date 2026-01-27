import { createAsyncThunk } from "@reduxjs/toolkit";
import client from "../axios-baseurl";
import { handleError } from "../../utils";

// export const getDeviceDetails = createAsyncThunk(
//   "Device/fetchDeviceDetails",
//   async ({ limit = 10, cursor, search }, { rejectWithValue }) => {
//     try {
//       let url = `devices?limit=${limit}`;
//       if (cursor) url += `&cursor=${cursor}`;
//       if (search) url += `&search=${search}`;

//       const { data } = await client.get(`/alert`, {
//         params: {
//           limit,
//           last_id: cursor || undefined,
//           search: search || undefined,
//         },
//       if (!data?.success) {
//         return rejectWithValue(
//           data?.message || "Failed to fetch devices"
//         );
//       }

//       return {
//         data: data.data || [],
//         hasNextPage: data.hasNextPage || false,
//         nextCursor: data.nextCursor || null,
//       };
//     } catch (error) {
//       return handleError(error, rejectWithValue);
//     }
//   }
// );

export const getDeviceDetails = createAsyncThunk(
  "Device/fetchDeviceDetails",
  async ({ limit, cursor, search }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await client.get(`/devices`, {
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


export const addDeviceDetails = createAsyncThunk(
  "Device/addDeviceDetails",
  async (body, { rejectWithValue }) => {
    try {
      const { data } = await client.post("devices", body);

      if (!data?.success) {
        return rejectWithValue(
          data?.message || "Something went wrong"
        );
      }

      return data.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const editDeviceDetails = createAsyncThunk(
  "Device/editDeviceDetails",
  async (body, { rejectWithValue }) => {
    try {
      const { data } = await client.put(
        `devices/update/${body._id}`,
        body
      );

      if (!data?.success) {
        return rejectWithValue(
          data?.message || "Something went wrong"
        );
      }

      return data.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const viewDeviceDetails = createAsyncThunk(
  "Device/viewDeviceDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await client.get(`devices/${id}`);

      if (!data?.success) {
        return rejectWithValue(
          data?.message || "Something went wrong"
        );
      }

      return data.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const updateDeviceStatus = createAsyncThunk(
  "Device/updateDeviceStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await client.patch(
        `devices/update-status/${id}`,
        { status }
      );

      if (!data?.success) {
        return rejectWithValue(
          data?.message || "Failed to update status"
        );
      }

      return { id, status };
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);
export const createDeviceToken = createAsyncThunk(
  "Device/createDeviceToken",
  async (deviceId, { rejectWithValue }) => {
    try {
      const { data } = await client.post(
        `devices/create-token/${deviceId}`
      );

      if (!data?.success) {
        return rejectWithValue(
          data?.message || "Failed to create device token"
        );
      }

      return data.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);


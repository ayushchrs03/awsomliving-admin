import { createSlice } from "@reduxjs/toolkit";
import {
  addDeviceDetails,
  editDeviceDetails,
  getDeviceDetails,
  viewDeviceDetails,
  updateDeviceStatus,
  createDeviceToken,
} from "../actions/device-action";

const deviceSlice = createSlice({
  name: "device",
  initialState: {
    data: [],
    details: null,
    loading: false,
    error: null,
    formStatues: false,
    token: null,
    hasNextPage: false,
    nextCursor: null,
    searchText: "",
    isFirstLoad: true,
     counts: {
    active: 0,
    inactive: 0,
    total: 0,
  },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearDetails: (state) => {
      state.details = null;
      state.formStatues = false;
      state.token = null; 
    },
    clearDeviceState: (state) => {
      state.data = [];
      state.details = null;
      state.loading = false;
      state.error = null;
      state.formStatues = false;
      state.token = null;
      state.hasNextPage = false;
      state.nextCursor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDeviceDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDeviceDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
     .addCase(getDeviceDetails.fulfilled, (state, action) => {
  state.loading = false;
  state.error = null;

  const { data, hasNextPage, nextCursor, counts } = action.payload;
  const search = action.meta.arg.search || "";

  const normalizedData = data.map((item) => ({
    ...item,
    status: item.status === "active",
  }));

  if (state.searchText !== search) {
    state.data = normalizedData;
    state.searchText = search;
    state.isFirstLoad = false;
  } else {
    if (state.isFirstLoad) {
      state.data = normalizedData;
      state.isFirstLoad = false;
    } else {
      state.data = [...state.data, ...normalizedData];
    }
  }

  state.hasNextPage = hasNextPage;
  state.nextCursor = nextCursor;

  if (counts) {
    state.counts = counts;
  }
})


      .addCase(viewDeviceDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(viewDeviceDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(viewDeviceDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.details = action.payload;
      })

      .addCase(editDeviceDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editDeviceDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editDeviceDetails.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.formStatues = true;
      })

      .addCase(addDeviceDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDeviceDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addDeviceDetails.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.formStatues = true;
      })

      .addCase(updateDeviceStatus.fulfilled, (state, action) => {
  const { id, status } = action.payload;

  const index = state.data.findIndex(
    (item) => item._id === id
  );

  if (index !== -1) {
    const previousStatus = state.data[index].status;

    // update row
    state.data[index].status = status === "active";

    // update counts
    if (previousStatus === true && status === "inactive") {
      state.counts.active -= 1;
      state.counts.inactive += 1;
    }

    if (previousStatus === false && status === "active") {
      state.counts.inactive -= 1;
      state.counts.active += 1;
    }

    // safety clamp
    state.counts.active = Math.max(0, state.counts.active);
    state.counts.inactive = Math.max(0, state.counts.inactive);
  }
})

      .addCase(createDeviceToken.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.token = null; 
      })
      .addCase(createDeviceToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createDeviceToken.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.token = action.payload?.token;
      });
  },
});

export const {
  clearError,
  clearDetails,
  clearDeviceState,
} = deviceSlice.actions;

export default deviceSlice.reducer;

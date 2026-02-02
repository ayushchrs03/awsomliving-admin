import { createSlice } from "@reduxjs/toolkit";
import {
  getAlertDetails,
  addAlertDetails,
  editAlertDetails,
  viewAlertDetails,
  updateAlertStatus, 
} from "../actions/alert-action";

const alertSlice = createSlice({
  name: "alert",
  initialState: {
    data: [],
    details: null,
    loading: false,
    error: null,
    formStatus: false,
    nextCursor: null,
    hasNextPage: false,
    isFirstLoad: true,
    searchText: "",
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
      state.formStatus = false;
    },
    clearAlertState: (state) => {
      state.data = [];
      state.nextCursor = null;
      state.hasNextPage = false;
      state.isFirstLoad = true;
      state.loading = false;
      state.error = null;
      state.formStatus = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAlertDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAlertDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAlertDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const { data, pagination, counts } = action.payload;

     const search = action.meta.arg.search || "";

  const normalizedData = data.map((item) => ({
    ...item,
    status: item.status === "active",
  }));

  if (state.searchText !== search) {
    state.data = normalizedData;
    state.isFirstLoad = false;
    state.searchText = search;
  } else {
    if (state.isFirstLoad) {
      state.data = normalizedData;
      state.isFirstLoad = false;
    } else {
      state.data = [...state.data, ...normalizedData];
    }
  }

  state.nextCursor = pagination.next_cursor;
  state.hasNextPage = pagination.has_next_page;

  if (counts) {
    state.counts = counts;
  }
})


      .addCase(viewAlertDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(viewAlertDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(viewAlertDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
      })
      .addCase(addAlertDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.formStatus = false;
      })
      .addCase(addAlertDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAlertDetails.fulfilled, (state) => {
        state.loading = false;
        state.formStatus = true;
      })

      .addCase(editAlertDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.formStatus = false;
      })
      .addCase(editAlertDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editAlertDetails.fulfilled, (state) => {
        state.loading = false;
        state.formStatus = true;
      })

      .addCase(updateAlertStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAlertStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
.addCase(updateAlertStatus.fulfilled, (state, action) => {
  state.loading = false;

  const { id, status } = action.payload;

  const index = state.data.findIndex(
    (item) => item._id === id
  );

  if (index !== -1) {
    const previousStatus = state.data[index].status;

    state.data[index].status = status === "active";

    if (previousStatus === true && status === "inactive") {
      state.counts.active -= 1;
      state.counts.inactive += 1;
    }

    if (previousStatus === false && status === "active") {
      state.counts.inactive -= 1;
      state.counts.active += 1;
    }
  }
});
  },
});

export const { clearError, clearDetails, clearAlertState } = alertSlice.actions;
export default alertSlice.reducer;

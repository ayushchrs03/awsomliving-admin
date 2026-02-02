import { createSlice } from "@reduxjs/toolkit";
import {
  getResidentDetails,
  addResidentDetails,
  editResidentDetails,
  viewResidentDetails,
  updateResidentStatus,
} from "../actions/resident-action";

const residentSlice = createSlice({
  name: "resident",
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

    clearFormStatus: (state) => {
      state.formStatus = false;
    },
   resetResidentList: (state) => {
      state.data = [];
      state.nextCursor = null;
      state.formStatus = false;
      state.hasNextPage = false;
      state.isFirstLoad = true;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getResidentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getResidentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    .addCase(getResidentDetails.fulfilled, (state, action) => {
  state.loading = false;
  state.error = null;

  const { data, pagination, counts } = action.payload;
  const search = action.meta.arg.search || "";
  const cursor = action.meta.arg.cursor || null;

  const normalizedData = data.map((item) => ({
    ...item,
    status: item.status === "active",
  }));

  // Replace on new search OR first page
  if (state.searchText !== search || !cursor) {
    state.data = normalizedData;
    state.searchText = search;
  } else {
    // Append on load more
    state.data = [...state.data, ...normalizedData];
  }

  state.nextCursor = pagination?.next_cursor || null;
  state.hasNextPage = pagination?.has_next_page || false;

  if (counts) {
    state.counts = counts;
  }
})

      .addCase(viewResidentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(viewResidentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(viewResidentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
      })

      .addCase(addResidentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
          state.formStatus = false; 
      })

      .addCase(addResidentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addResidentDetails.fulfilled, (state) => {
        state.loading = false;
        state.formStatus = true;
      })

      .addCase(editResidentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.formStatus = false;
      })

      .addCase(editResidentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        
      })

      .addCase(editResidentDetails.fulfilled, (state) => {
        state.loading = false;
        state.formStatus = true;
      })

      .addCase(updateResidentStatus.pending, (state) => {
        state.error = null;
      })

      .addCase(updateResidentStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateResidentStatus.fulfilled, (state, action) => {
  const { id, status } = action.payload;

  if (Array.isArray(state.data)) {
    const resident = state.data.find((item) => item._id === id);

    if (resident) {
      const previousStatus = resident.status;

      // update row
      resident.status = status === "active";

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
  }
});

  },
});

export const {
  clearError,
  clearDetails,
  clearFormStatus,
  resetResidentList,
} = residentSlice.actions;

export default residentSlice.reducer;

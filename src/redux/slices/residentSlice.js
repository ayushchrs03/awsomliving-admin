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

  const { data, pagination } = action.payload;
  const search = action.meta.arg.search || "";
  const cursor = action.meta.arg.cursor || null;

  // If search text changed OR fetching first page (cursor is null), replace data
  if (state.searchText !== search || !cursor) {
    state.data = data; // replace old data with new search results
    state.searchText = search; // store current search text
  } else {
    // Otherwise append data for "load more"
    state.data = [...state.data, ...data];
  }

  // Update pagination
  state.nextCursor = pagination?.next_cursor || null;
  state.hasNextPage = pagination?.has_next_page || false;
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
            resident.status = status;
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

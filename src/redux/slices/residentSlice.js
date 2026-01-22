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
    
      if (state.searchText !== search) {
        state.data = data;
        state.isFirstLoad = false;
        state.searchText = search;
      } else {
        if (state.isFirstLoad) {
          state.data = data;
          state.isFirstLoad = false;
        } else {
          state.data = [...state.data, ...data];
        }
        }

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

import { createSlice } from "@reduxjs/toolkit";
import {
  addUserDetails,
  editUserDetails,
  getUserDetails,
  viewUserDetails,
  updateUserStatus,
} from "../actions/user-action";

const homeSlice = createSlice({
  name: "user",
  initialState: {
    data: [],
    details: null,
    loading: false,
    error: null,
    formStatues: false,
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
      state.formStatues = false;
    },

    clearUserState: (state) => {
      state.data = [];
      state.details = null;
      state.loading = false;
      state.error = null;
      state.formStatues = false;
      state.nextCursor = null;
      state.hasNextPage = false;
      state.isFirstLoad = true;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
     .addCase(getUserDetails.fulfilled, (state, action) => {
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

  state.nextCursor = pagination.next_cursor;
  state.hasNextPage = pagination.has_next_page;
})

      .addCase(viewUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(viewUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(viewUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.details = action.payload;
      })

      .addCase(addUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.formStatues = false;
      })
      .addCase(addUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addUserDetails.fulfilled, (state) => {
        state.loading = false;
        state.formStatues = true;
      })

      .addCase(editUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.formStatues = false;
      })
      .addCase(editUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editUserDetails.fulfilled, (state) => {
        state.loading = false;
        state.formStatues = true;
      })

      .addCase(updateUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const { id, status } = action.payload;

        const index = state.data.findIndex(
          (item) => item._id === id
        );

        if (index !== -1) {
          state.data[index].status = status;
        }
      });
  },
});

export const {
  clearError,
  clearDetails,
  clearUserState,
} = homeSlice.actions;

export default homeSlice.reducer;

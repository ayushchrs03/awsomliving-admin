import { createSlice } from "@reduxjs/toolkit";
import { addHomeDetails, editHomeDetails, getHomeDetails, viewHomeDetails,updateHomeStatus  } from "../actions/home-action";


const homeSlice = createSlice({
    name:"home",
    initialState:{
        data:[],
        details:null,
        loading:false,
        error:null,
        formStatus:false,
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

    clearHomeState: (state) => {
      state.data = [];
      state.details = null;
      state.loading = false;
      state.error = null;
      state.formStatus = false;
      state.nextCursor = null;
      state.hasNextPage = false;
      state.isFirstLoad = true;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getHomeDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHomeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getHomeDetails.fulfilled, (state, action) => {
  state.loading = false;
  state.error = null;

  const data = action.payload?.data || [];
  const counts = action.payload?.counts || {};
  const pagination = action.payload?.pagination || {};

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

  state.nextCursor = pagination.next_cursor || null;
  state.hasNextPage = pagination.has_next_page || false;

  if (counts) {
    state.counts = counts;
  }
})


      .addCase(viewHomeDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(viewHomeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(viewHomeDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
      })

      .addCase(addHomeDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.formStatus = false;
      })
      .addCase(addHomeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addHomeDetails.fulfilled, (state) => {
        state.loading = false;
        state.formStatus = true;
      })

      /* ================= EDIT HOME ================= */
      .addCase(editHomeDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.formStatus = false;
      })
      .addCase(editHomeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editHomeDetails.fulfilled, (state) => {
        state.loading = false;
        state.formStatus = true;
      })

      .addCase(updateHomeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHomeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
     .addCase(updateHomeStatus.fulfilled, (state, action) => {
  state.loading = false;
  state.error = null;

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

  // keep details in sync
  if (state.details && state.details._id === id) {
    state.details.status = status === "active";
  }
});

  },
});

export const {
  clearError,
  clearDetails,
  clearHomeState,
} = homeSlice.actions;

export default homeSlice.reducer;

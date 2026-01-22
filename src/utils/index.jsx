export const iconSize = 22;

/**
 * Convert pixels → grid units (height) in React Grid Layout
 *
 * @param {number} heightPx - Measured height in pixels
 * @param {number} [rowHeight=10] - Height of one row in pixels (from RGL config)
 * @param {number} [marginY=10] - Vertical margin between rows in pixels (from RGL config)
 * @returns {number} Height in grid units (rows)
 */
export function pxToGridUnits(heightPx, rowHeight = 10, marginY = 10) {
  if (heightPx <= 0) return 0;
  return (heightPx + marginY) / (rowHeight + marginY);
}

/**
 * Convert pixel width → grid cols (w) in React Grid Layout
 * @param {number} widthPx - measured pixel width
 * @param {number} containerWidth - grid container width in px
 * @param {number} cols - number of columns in grid
 * @param {number} marginX - horizontal margin from RGL config
 * @returns {number} w (grid width units)
 */
export function pxToGridCols(widthPx, containerWidth, cols = 6, marginX = 10) {
  if (containerWidth <= 0 || cols <= 0) return 0;
  const colWidth = (containerWidth - (cols + 1) * marginX) / cols;
  return (widthPx + marginX) / (colWidth + marginX);
}

// Centralized helper for token retrieval
export const getAuthToken = (getState) =>
  localStorage.getItem("token") || getState().auth?.token || null;

// Utility to build query strings safely
export const buildQueryString = (queries = []) =>
  queries
    .filter(
      ({ field, value }) => field && value !== undefined && value !== null
    )
    .map(
      ({ field, value }) =>
        `${encodeURIComponent(field)}=${encodeURIComponent(value)}`
    )
    .join("&");

// Common error handler
export const handleError = (error, rejectWithValue) =>
  rejectWithValue(
    error?.response?.data?.message || error?.message || "Unknown error"
  );

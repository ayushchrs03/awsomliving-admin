import * as yup from "yup";

// Standard URL regex pattern for general URL validation
const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

// Regex patterns
const cssLengthRegex = /^(\d+(\.\d+)?)(px|em|rem|%|vh|vw)?$/;
const colorRegex =
  /^(#(?:[0-9a-fA-F]{3}){1,2}|rgba?\((\s*\d+\s*,){2,3}\s*[\d.]+\))$/;
const apiEndpointRegex = /^\/[a-zA-Z0-9/_-]*$/;

// Example widget ids (replace with your actual widget IDs)
// const allowedWidgetIds = [
//   "line_chart",
//   "bar_chart",
//   "pie_chart",
//   "table",
//   "stat_card",
// ];

export const sectionSchema = yup.object().shape({
  sectionName: yup
    .object()
    // .max(100, "Section name must be at most 100 characters")
    .required("Section name is required"),

  sectionOrder: yup
    .number()
    .typeError("Section order must be a number")
    .min(1, "Section order must be at least 1")
    .max(100, "Section order must be at most 100")
    .required("Section order is required"),

  // isCollapsible: yup.boolean().required(),

  // height: yup
  //   .number()
  //   .typeError("Height must be a number")
  //   .min(50, "Height must be at least 50 pixels")
  //   .max(2000, "Height must be at most 2000 pixels")
  //   .nullable(),

  // backgroundColor: yup
  //   .string()
  //   .matches(colorRegex, "Must be a valid HEX or RGB color")
  //   .nullable(),

  // padding: yup
  //   .string()
  //   .matches(
  //     cssLengthRegex,
  //     "Padding must be a valid CSS length (e.g., 10px, 1rem)"
  //   )
  //   .nullable(),

  // borderRadius: yup
  //   .string()
  //   .matches(cssLengthRegex, "Border radius must be a valid CSS length")
  //   .nullable(),

  apiEndpoint: yup
    .string()
    .matches(
      apiEndpointRegex,
      "API endpoint must start with '/' and contain only valid path characters"
    )
    .nullable(),

  requestMethod: yup
    .object()
    // .oneOf(["GET", "POST"], "Invalid request method")
    .nullable(),

  refreshInterval: yup
    .number()
    .typeError("Refresh interval must be a number")
    .min(1, "Refresh interval must be at least 1 second")
    .max(86400, "Refresh interval must be less than 86400 seconds (24 hours)")
    .required(),

  // params: yup.array().nullable(),

  widget: yup
    .array()
    // .of(yup.string().oneOf(allowedWidgetIds, "Invalid widget selected"))
    .min(1, "At least one widget is required")
    .required("Widget(s) are required"),
});

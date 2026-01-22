import * as yup from "yup";

export const regexSchema = yup.object().shape({
    name: yup
        .string()
        .required("Name is required")
        .max(100, "Name cannot exceed 100 characters"),
    type: yup
        .string(),
    // .array()
    // .of(yup.string().oneOf(["email", "phoneNumber", "text"]))
    // .min(1, "At least one type must be selected")
    // .required("Type is required"),
    maxLength: yup
        .number()
        .typeError("Max Length must be a number")
        .integer("Max Length must be an integer")
        .positive("Max Length must be a positive number")
        .required("Max Length is required"),
    isRequired: yup.boolean(),
});

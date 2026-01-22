import * as Yup from "yup";
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const fieldValidation = {
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(passwordRegex, "Must include one uppercase letter,one lowercase letter,one special character,and a number"),
  email: Yup.string()
    .trim()
    .required("Email is required")
    .matches(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/, "Please enter valid email ID")
    .email().min(8),
  name: Yup.string()
    .matches(/^[a-zA-Z']+(?: [a-zA-Z']+)*$/, "Name can only contain letters and spaces")
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long")
    .required("Name is required"),
  query: Yup.object().required("Query is required").shape({
    label: Yup.string().required("Query is required"),
    value: Yup.string().required('Please select a query')
  }),
  message: Yup.string()
    .min(10, "Message must be at least 10 characters long")
    .max(300, "Message can't be more than 300 characters long")
    .required("Message is required"),
  companyName: Yup.string()
    .trim()
    .required("Company name is required")
    .matches(
      /^[a-zA-Z0-9'-]+(?: [a-zA-Z0-9'-]+)*$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    )
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long"),
  contact: Yup.string().trim().matches(/^\d{12}$/, "Invalid Number").required("Mobile number is required"),
  gstNumber: Yup.string().trim().matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[0-9A-Z]{1}$/, "Invalid GST number").required("GST number is required"),
  designation: Yup.string().trim().matches(/^[a-zA-Z0-9'-]+(?: [a-zA-Z0-9'-]+)*$/, "Invalid designation").required("Designation is required"),
  oldPassword: Yup.string().required("Required").min(8, "Must have atleast 8 Characters"),
  confirmPassword: Yup.string()
    .required("Required")
    .min(8, "Must have atleast 8 Characters")
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  rePassword: Yup.string()
    .required("Required")
    .min(8, "Must have atleast 8 Characters")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
};

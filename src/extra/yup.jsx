import * as Yup from "yup";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const email = (Yup, email) => {
  return Yup.string().email().required(`${email} is required`).trim();
};

const numberOnly = (Yup, name) => {
  return Yup.number().required(`${name} is required`);
};

const notRequired = (Yup) => {
  return Yup.string().trim();
};

const phone = (Yup, phone) => {
  return Yup.string()
    .matches(phoneRegExp, `${phone} number is not valid`)
    .max(10, "to long")
    .required(`${phone} is required`);
};

const name = (Yup, name) => {
  return Yup.string()
    .required(`${name} is required`)
    .max(80, "too long")
    .matches(/[^@]+/, "At least one non-'@' character is required");
  // .trim();
};
const objects = (Yup, name) => {
  return Yup.object().required(`${name} is required`);
};

const mixed = (Yup, name) => {
  return Yup.mixed().required(`${name} is required`);
};

const image = (Yup, name) => {
  return Yup.string().required(`${name} is required`);
};

const description = (Yup, name) => {
  return Yup.string()
    .required(`${name} is required`)
    .max(20000, "to long")
    .trim();
};

const requiredDescription = (Yup, name) => {
  return Yup.string()
    .trim()
    .required(`${name} is required`)
    .max(20000, "to long");
};

export const userSchema = Yup.object().shape({
  first_name: name(Yup, "First Name"),
  last_name: name(Yup, "Last Name"),
  email: email(Yup, "email"),
  phone: phone(Yup, "phone"),
});


export const homeSchema = Yup.object().shape({
  name: name(Yup, "Home Name"),
  user_id: name(Yup, "User"),
});

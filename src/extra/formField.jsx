export const userFields = (store, errors, isView) => {
  return [
    {
      name: "first_name",
      label: "First Name",
      disabled: isView,
      error: store?.errorType == "first_name" || (errors.first_name && true) || false,
      helperText:
        (store?.errorType == "first_name" && store?.fieldErrorMessage) ||
        errors?.first_name?.message ||
        null,
    },
    {
      name: "last_name",
      label: "Last Name",
      disabled: isView,
      error: store?.errorType == "last_name" || (errors.last_name && true) || false,
      helperText:
        (store?.errorType == "last_name" && store?.fieldErrorMessage) ||
        errors?.last_name?.message ||
        null,
    },
    {
      name: "email",
      label: "Email",
      disabled: isView,
      error: store?.errorType == "email" || (errors.email && true),
      helperText:
        (store?.errorType == "email" && store?.fieldErrorMessage) ||
        errors?.email?.message,
    },
    {
      name: "phone",
      label: "Phone",
      disabled: isView,
      error: store?.errorType == "phone" || (errors.phone && true),
      helperText:
        (store?.errorType == "phone" && store?.fieldErrorMessage) ||
        errors?.phone?.message,
    },
  ];
};

export const homeFields = (store, errors, isView) => {
  return [
    {
      name: "name",
      label: "Home Name",
      disabled: isView,
      error: store?.errorType == "name" || (errors.name && true) || false,
      helperText:
        (store?.errorType == "name" && store?.fieldErrorMessage) ||
        errors?.name?.message ||
        null,
    },
    // {
    //   name: "user",
    //   label: "User Name",
    //   disabled: isView,
    //   error: store?.errorType == "user" || (errors.user && true) || false,
    //   helperText:
    //     (store?.errorType == "user" && store?.fieldErrorMessage) ||
    //     errors?.user?.message ||
    //     null,
    // },

  ];
};
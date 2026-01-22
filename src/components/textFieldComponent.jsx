// import PropTypes from "prop-types";

// form
import { useFormContext, Controller } from "react-hook-form";

// @mui
import { TextField } from "@mui/material";

// -------------------------------------------------------------------

export default function TextFieldComponent({ name, setShrink, textArea, ...other }) {
  const { control } = useFormContext();
  return (
   
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const value = field?.value ?? "";

        return (
          <>
            <TextField
              {...field}
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "black",
                },
              }}
              multiline={textArea}
              rows={textArea ? 3 : 1}
              InputLabelProps={{ shrink: value || setShrink ? true : false }}
              fullWidth
              error={!!error}
              helperText={error?.message ? error?.message : ""}
              {...other}
            />
          </>
        );
      }}
    />
  );
}

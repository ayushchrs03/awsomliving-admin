import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useFormContext, Controller } from "react-hook-form";

export default function RHFAutoComplete({
  list,
  name,
  isMultiSelect,
  defaultValue,
  label,
  ...other
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        let selectedValues;

        if (isMultiSelect) {
          // Ensure field.value is always an array for multi-select
          selectedValues = Array.isArray(field.value) ? field.value : [];
        } else {
          // For single-select, use null as the initial value
          selectedValues = defaultValue || field.value || null;
        }
        return (
          <Autocomplete
            freeSolo
            id="free-solo-2-demo"
            disableClearable
            multiple={isMultiSelect} // Enable multi-select
            options={list.map((option) => option)}
            getOptionLabel={(option) => `${option.first_name}`}
            value={selectedValues}
            onChange={(_, newValues) => {
              field.onChange(newValues); // Update the selected values
            }}
            {...other}
            renderInput={(params) => (
              <TextField
                {...params}
                label={`Search ${label}`}
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                }}
                fullWidth
                {...other}
              />
            )}
          />
        );
      }}
    />
  );
}
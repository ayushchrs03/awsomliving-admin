
import React from "react";
import Grid from "@mui/material/Grid";
import TextFieldComponent from "./textFieldComponent";

const TextFieldFormComponent = ({ fields, textArea }) => {
  return (
    <>
      {fields?.map((field, index) => (
        <Grid item xs={12} md={6} mt={4} key={index}>
          <TextFieldComponent {...field} textArea={textArea} />
        </Grid>
      ))}
    </>
  );
};

export default TextFieldFormComponent;

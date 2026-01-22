import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import RHFAddButton from "./addButton";
import RHFCancelButton from "./cancelButton";

const ButtonComponent = ({ store, link, isView, editLink }) => {
  return (
    <Grid item xs={12}>
      <Box
        sx={{
          marginTop: "10px",
          gap: 5,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "revert",
        }}
      >
        {!isView ? (
          <>
            <RHFAddButton
              loading={store.loading}
              title={"Submit"}
              type="submit"
            />
            <RHFCancelButton title={"Cancel"} link={link} />
          </>
        ) : (
          <>
            <RHFCancelButton title={"Edit"} link={editLink} />
          </>
        )}
      </Box>
    </Grid>
  );
};

export default ButtonComponent;

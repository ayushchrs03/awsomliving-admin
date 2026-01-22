import Button from "@mui/material/Button";
import { Create } from "@mui/icons-material";

const RHFAddButton = ({ loading, title }) => {
  return (
    <Button
      disabled={loading}
      type="submit"
      color="primary"
      variant="outlined"
      startIcon={<Create />}
    >
      {loading ? "Loading" : title}
    </Button>
  );
};

export default RHFAddButton;

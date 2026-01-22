import Button from "@mui/material/Button";
import {Link} from "react-router-dom";
import {Cancel} from '@mui/icons-material'

const RHFCancelButton = ({ title, link }) => {
  return (
    <Link to={link} >
      <Button
        type="reset"
        color="secondary"
        variant="outlined"
        startIcon={<Cancel />}
      >
        {" "}
        {title}
      </Button>
    </Link>
  );
};

export default RHFCancelButton;

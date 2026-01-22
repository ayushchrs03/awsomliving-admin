import { Tooltip as ReactTooltip } from "react-tooltip";
import "./react-tooltip.css";

export const Tooltip = ({ id, place, variant, content }) => {
  return (
    <ReactTooltip
      id={id}
      place={place ? place : "top"}
      variant={variant ? variant : "light"}
      content={content}
      disableStyleInjection
      border={false}
    />
  );
};

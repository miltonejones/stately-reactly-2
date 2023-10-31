import { IconButton } from "@mui/material";
import TextIcon from "../../../styled/TextIcon";

export const RyIconButton = ({ icon = "Error", invokeEvent, ...props }) => {
  const handleClick = (event) => {
    invokeEvent(event, "onClick", {});
  };
  return (
    <IconButton {...props} onClick={handleClick}>
      <TextIcon icon={icon} />
    </IconButton>
  );
};

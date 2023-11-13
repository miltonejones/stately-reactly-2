import { Button } from "@mui/material";
import TextIcon from "../../../styled/TextIcon";

export const RyButton = ({ endIcon, Label, invokeEvent, ...props }) => {
  const handleClick = (event) => {
    invokeEvent(event, "onClick", {});
  };

  let iconProps = {};
  if (endIcon) {
    iconProps = {
      endIcon: <TextIcon icon={endIcon} />,
    };
  }
  return (
    <Button {...props} {...iconProps} onClick={handleClick}>
      {Label}
    </Button>
  );
};

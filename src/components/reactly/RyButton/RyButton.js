import { Button } from "@mui/material";
import TextIcon from "../../../styled/TextIcon";

export const RyButton = ({ end, Label, invokeEvent, ...props }) => {
  const handleClick = (event) => {
    invokeEvent(event, "onClick", {});
  };

  let iconProps = {};
  if (end) {
    iconProps = {
      endIcon: <TextIcon icon={end} />,
    };
  }
  return (
    <Button {...props} {...iconProps} onClick={handleClick}>
      {Label}
    </Button>
  );
};

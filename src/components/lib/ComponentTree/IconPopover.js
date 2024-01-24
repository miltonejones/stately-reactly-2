import { Box, Popover } from "@mui/material";
import { useMenu } from "../../../machines/menuMachine";
import { TinyButton } from "../../../styled";

export default function IconPopover({ icon, children, onClick }) {
  const menu = useMenu();
  return (
    <>
      <TinyButton
        icon={icon}
        onClick={(e) => {
          menu.handleClick(e);
          onClick && onClick();
        }}
      />
      <Popover {...menu.menuProps}>
        <Box
          sx={{
            p: 2,
            width: 400,
            maxWidth: 400,
            minWidth: 400,
            minHeight: 240,
          }}
        >
          {children}
        </Box>
      </Popover>
    </>
  );
}

import { Box, Collapse } from "@mui/material";

export default function TabBody({
  minWidth = 400,
  fullWidth,
  in: open,
  children,
  ...props
}) {
  return (
    <Collapse orientation="horizontal" in={open}>
      <Box
        sx={{ width: "100%", minWidth: fullWidth ? "100%" : minWidth }}
        {...props}
      >
        {children}
      </Box>
    </Collapse>
  );
}

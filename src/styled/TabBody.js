import { Box, Collapse } from "@mui/material";

export default function TabBody({
  minWidth = 400,
  fullWidth,
  in: open,
  children,
  tabProps,
  ...props
}) {
  return (
    <Collapse orientation="horizontal" {...tabProps} in={open}>
      <Box
        sx={{ width: "100%", minWidth: fullWidth ? "100%" : minWidth }}
        {...props}
      >
        {children}
      </Box>
    </Collapse>
  );
}

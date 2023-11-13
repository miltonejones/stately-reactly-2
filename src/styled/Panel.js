import { Box } from "@mui/material";

export default function Panel({ children, ...props }) {
  return (
    <Box
      className="panel"
      sx={{
        m: 0,
        p: 1,
        width: (theme) => `calc(100vw - ${theme.spacing(2)})`,
        height: (theme) => `calc(100vh - ${theme.spacing(2)})`,
        backgroundColor: (theme) => theme.palette.primary.dark,
        overflow: "auto",
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

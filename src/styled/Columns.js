import { styled, Box } from "@mui/material";

const Columns = styled(Box)(({ theme, spacing = 1, columns = "1fr 1fr" }) => ({
  display: "grid",
  gridTemplateColumns: `${columns}`,
  gap: theme.spacing(spacing),
  alignItems: "center",
  transition: "all 0.4s ease-in",
}));

export default Columns;

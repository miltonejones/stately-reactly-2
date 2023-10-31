// import React from 'react';
import { styled, Box } from "@mui/material";

const Flex = styled(Box)(({ theme, between, spacing = 0, baseline }) => ({
  gap: theme.spacing(spacing),
  cursor: "pointer",
  display: "flex",
  alignItems: baseline ? "flex-start" : "center",
  justifyContent: between ? "space-between" : "flex-start",
}));

export default Flex;

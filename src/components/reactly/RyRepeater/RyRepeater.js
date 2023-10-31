import React from "react";
import { Box } from "@mui/material";

export const RyRepeater = (props) => {
  if (!props.bindings) return <>no bindings detected</>;
  return <Box {...props}>{props.children}</Box>;
};

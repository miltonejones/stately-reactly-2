import { Box, Typography } from "@mui/material";
import statePath from "../util/statePath";
import Nowrap from "./Nowrap";

export default function StateBar({ state }) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: (theme) => theme.palette.grey[300],
        borderRadius: 2,
        p: (theme) => theme.spacing(0.5, 1),
      }}
    >
      <Nowrap variant="caption">
        <b>State:</b> {statePath(state.value)}
      </Nowrap>
    </Box>
  );
}

import { Box, Chip, Typography } from "@mui/material";
import statePath from "../util/statePath";
import Nowrap from "./Nowrap";

export default function StateBar({ state }) {
  const alias = state.context.machineName;
  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: (theme) => theme.palette.grey[300],
        borderRadius: 2,

        p: (theme) => theme.spacing(0.5, 1),
      }}
    >
      {/* {!!alias && (
        <Chip sx={{ mr: 1 }} size="small" variant="outlined" label={alias} />
      )} */}
      <Nowrap variant="caption">
        <b>State:</b> {statePath(state.value)}
      </Nowrap>
    </Box>
  );
}

import { Dialog, Button, Typography, Stack } from "@mui/material";
import Flex from "../../../styled/Flex";
import Spacer from "../../../styled/Spacer";
import StateBar from "../../../styled/StateBar";

export default function DropModal({ machine }) {
  if (!machine) return <i />;
  return (
    <Dialog open={machine.state.can("yes")}>
      <Stack spacing={1} sx={{ width: 500, p: 2 }}>
        <Flex>
          <Typography variant="body2">Confirm action</Typography>
        </Flex>
        <StateBar state={machine.state} />
        <Typography variant="body2">{machine.message}</Typography>
        {!!machine.caption && (
          <Typography color="error" variant="caption">
            <b>{machine.caption}</b>
          </Typography>
        )}
        <Flex spacing={1}>
          <Spacer />
          <Button size="small" onClick={() => machine.send("no")}>
            cancel
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={() => machine.send("yes")}
          >
            delete
          </Button>
        </Flex>
      </Stack>
    </Dialog>
  );
}

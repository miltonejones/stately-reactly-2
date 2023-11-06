import { Dialog, Button, TextField, Typography, Stack } from "@mui/material";
import Flex from "../../../styled/Flex";
import Spacer from "../../../styled/Spacer";
import StateBar from "../../../styled/StateBar";
import SubmitField from "../../../styled/SubmitField";

export default function AddModal({ submachine }) {
  if (!submachine) return <i />;
  return (
    <Dialog open={submachine.state.can("save")}>
      <Stack spacing={1} sx={{ width: 500, p: 2 }}>
        <StateBar state={submachine.state} />
        <Flex>
          <Typography variant="body2">
            Add new {submachine.candidateType || submachine.machineName}
          </Typography>
        </Flex>
        <SubmitField
          fullWidth
          onSubmit={() => submachine.send("save")}
          size="small"
          label={`Enter a ${
            submachine.candidateType || submachine.machineName
          } name`}
          value={submachine.state.context.name}
          onChange={(e) =>
            submachine.send({
              type: "change",
              name: e.target.value,
            })
          }
        />
        <Flex spacing={1}>
          <Spacer />
          <Button size="small" onClick={() => submachine.send("cancel")}>
            close
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={() => submachine.send("save")}
          >
            save
          </Button>
        </Flex>
      </Stack>
    </Dialog>
  );
}

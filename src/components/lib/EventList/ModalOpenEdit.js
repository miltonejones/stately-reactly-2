import { Card, Switch, Typography } from "@mui/material";
import EditBlock from "../../../styled/EditBlock";
import SearchInput from "../../../styled/SearchInput";
import Flex from "../../../styled/Flex";

const ModalOpenEdit = ({ editor, modalTags }) => {
  const { currentEvent } = editor;
  const { target, open } = currentEvent.action;
  return (
    <Card sx={{ p: 2 }}>
      <Typography>
        <b>Open/close modal component</b>
      </Typography>
      <EditBlock
        title="Open modal"
        description=" Choose a component to open or close."
      >
        <SearchInput
          label="choose component"
          field="ComponentName"
          id="ID"
          options={modalTags}
          name="target"
          value={target}
          onChange={(e) => {
            editor.send({
              type: "set event action",
              name: e.target.name,
              value: e.target.value,
            });
          }}
        />
        <Flex>
          <Switch
            checked={!!open}
            onChange={(e) => {
              editor.send({
                type: "set event action",
                name: "open",
                value: e.target.checked,
              });
            }}
          />
          <Typography variant="caption">Open modal component</Typography>
        </Flex>
      </EditBlock>
    </Card>
  );
};

export default ModalOpenEdit;

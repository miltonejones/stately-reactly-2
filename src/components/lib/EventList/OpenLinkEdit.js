import { Card, Stack, Switch, Typography } from "@mui/material";
import EditBlock from "../../../styled/EditBlock";
import SearchInput from "../../../styled/SearchInput";
import ParamSelect from "../ComponentEditor/ParamSelect";
import Flex from "../../../styled/Flex";

const OpenLinkEdit = ({ editor, machine }) => {
  const { currentEvent } = editor;
  const { target, open = false } = currentEvent.action;
  return (
    <Card sx={{ p: 2 }}>
      <Typography>
        <b>Open external URL</b>
      </Typography>
      <EditBlock title="Open path" description=" Choose a link to open.">
        <ParamSelect
          eventType={currentEvent.event}
          label="URL"
          name="target"
          onChange={(e) => {
            editor.send({
              type: "set event action",
              name: e.target.name,
              value: e.target.value,
            });
          }}
          value={target}
          machine={machine}
        />
      </EditBlock>
      <Flex
        onClick={(e) => {
          editor.send({
            type: "set event action",
            name: "open",
            value: !open,
          });
        }}
      >
        <Switch size="small" checked={open} /> Open in new window
      </Flex>
    </Card>
  );
};

export default OpenLinkEdit;

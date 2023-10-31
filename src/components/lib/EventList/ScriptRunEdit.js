import { Card, Typography } from "@mui/material";
import EditBlock from "../../../styled/EditBlock";
import SearchInput from "../../../styled/SearchInput";

const ScriptRunEdit = ({ editor, applicationScripts }) => {
  const { currentEvent } = editor;
  const { target } = currentEvent.action;
  return (
    <Card sx={{ p: 2 }}>
      <Typography>
        <b>Choose script</b>
      </Typography>
      <EditBlock
        title="Script name"
        description=" Choose a script that will run when the event fires."
      >
        <SearchInput
          label="choose script"
          field="name"
          id="ID"
          options={applicationScripts}
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
      </EditBlock>
    </Card>
  );
};

export default ScriptRunEdit;

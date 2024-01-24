import { Card, Stack, Typography } from "@mui/material";
import EditBlock from "../../../styled/EditBlock";
import SearchInput from "../../../styled/SearchInput";
import ParamSelect from "../ComponentEditor/ParamSelect";
import Warning from "../../../styled/Warning";

const ExecRefEdit = ({ editor, machine }) => {
  const { appData, componentReference, clientLib } = machine;
  const { currentEvent } = editor;
  const { target, method } = currentEvent.action;
  const page = appData.pages.find((f) => f.ID === target);
  if (!componentReference) return <>no components found</>;
  if (!clientLib.setups)
    return <Warning>No components have supported events</Warning>;

  const items = Object.keys(clientLib.setups).map((key) => ({
    ID: key,
    name: componentReference[key],
  }));

  const setup = clientLib.setups[target];
  return (
    <Card sx={{ p: 2 }}>
      <Typography>
        <b>Execute component method</b>
      </Typography>
      <EditBlock title="Select component" description=" Choose a component.">
        <SearchInput
          label="choose component"
          field="name"
          id="ID"
          options={items}
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

      {!!setup && (
        <EditBlock
          title="Choose method"
          description="Choose the component method to execute"
        >
          <SearchInput
            label="choose component"
            options={Object.keys(setup)}
            name="method"
            value={method}
            onChange={(e) => {
              editor.send({
                type: "set event action",
                name: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </EditBlock>
      )}
    </Card>
  );
};

export default ExecRefEdit;

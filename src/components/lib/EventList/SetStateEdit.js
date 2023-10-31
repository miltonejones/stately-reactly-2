import { Card, Stack, Switch, TextField, Typography } from "@mui/material";
import EditBlock from "../../../styled/EditBlock";
import ParamSelect from "../ComponentEditor/ParamSelect";
import Nowrap from "../../../styled/Nowrap";
import ChipMenu from "../../../styled/ChipMenu";
import Flex from "../../../styled/Flex";
import Spacer from "../../../styled/Spacer";

const SetStateEdit = ({ editor, machine, repeaterBindings }) => {
  const { currentEvent } = editor;
  const { target, value } = currentEvent.action;

  const update = (name, value) => {
    editor.send({
      type: "set event action",
      name,
      value,
    });
  };

  const presets = [
    {
      label: "boolean",
      action: () => update("value", true),
    },
    {
      label: "variable",
      action: () => update("value", ""),
    },
  ];

  return (
    <Card sx={{ p: 2 }}>
      <Stack spacing={1}>
        <Typography>
          <b>Set client state value</b>
        </Typography>
        <EditBlock
          title="Target value"
          description="Sets the client state variable that will be updated by the event."
        >
          <ParamSelect
            machine={machine}
            stateOnly
            name="target"
            onChange={(e) => {
              update(e.target.name, e.target.value);
            }}
            size="small"
            value={target}
          />
        </EditBlock>
        <EditBlock
          title="Source value"
          description="Sets the value that the client state variable will be changed to."
        >
          {typeof value === "boolean" ? (
            <Switch
              name="value"
              size="small"
              checked={value}
              onChange={(e) => update("value", e.target.checked)}
            />
          ) : (
            <ParamSelect
              name="value"
              size="small"
              value={value}
              machine={machine}
              repeaterBindings={repeaterBindings}
              onChange={(e) => {
                update(e.target.name, e.target.value);
              }}
              eventType={currentEvent.event}
            />
          )}
        </EditBlock>

        <Flex>
          <Spacer />
          <ChipMenu
            onChange={(index) => presets[index].action()}
            value={typeof value === "boolean" ? 0 : 1}
            options={presets.map((p) => p.label)}
          />
        </Flex>
      </Stack>
    </Card>
  );
};

export default SetStateEdit;

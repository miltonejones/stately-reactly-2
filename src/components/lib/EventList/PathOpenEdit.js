import { Card, Stack, Typography } from "@mui/material";
import EditBlock from "../../../styled/EditBlock";
import SearchInput from "../../../styled/SearchInput";
import ParamSelect from "../ComponentEditor/ParamSelect";

const PathOpenEdit = ({ editor, repeaterBindings, machine }) => {
  const { appData } = machine;
  const { currentEvent } = editor;
  const { target, data = {} } = currentEvent.action;
  const page = appData.pages.find((f) => f.ID === target);
  return (
    <Card sx={{ p: 2 }}>
      <Typography>
        <b>Open page path</b>
      </Typography>
      <EditBlock title="Open path" description=" Choose a path to open.">
        <SearchInput
          label="choose path"
          field="PageName"
          id="ID"
          options={appData.pages}
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

      {!!page?.parameters && (
        <EditBlock
          title="Parameters"
          description="Set the parameter values to pass to the page"
        >
          <Stack spacing={1}>
            {Object.keys(page.parameters).map((term) => (
              <Stack key={term}>
                <Typography variant="caption">
                  Set value for <b>{term}</b>
                </Typography>

                <ParamSelect
                  eventType={currentEvent.event}
                  label={term}
                  name="data"
                  onChange={(e) => {
                    editor.send({
                      type: "set event action",
                      name: e.target.name,
                      value: {
                        ...data,
                        [term]: e.target.value,
                      },
                    });
                  }}
                  repeaterBindings={repeaterBindings}
                  value={data[term]}
                  machine={machine}
                />
              </Stack>
            ))}
          </Stack>
        </EditBlock>
      )}
    </Card>
  );
};

export default PathOpenEdit;

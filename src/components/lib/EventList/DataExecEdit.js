import { Card, Stack, TextField, Typography } from "@mui/material";
import EditBlock from "../../../styled/EditBlock";
import SearchInput from "../../../styled/SearchInput";
import Spacer from "../../../styled/Spacer";
import Flex from "../../../styled/Flex";
import ParamSelect from "../ComponentEditor/ParamSelect";
import React from "react";
import ChipMenu from "../../../styled/ChipMenu";
import Json from "../../../styled/Json";
import Warning from "../../../styled/Warning";

const DataExecEdit = ({ machine, editor, appData }) => {
  const ref = React.useRef();
  const { resources } = appData;
  const { currentEvent } = editor;
  const { target, terms = {} } = currentEvent.action;

  const resource = resources.find((f) => f.ID === target);

  const isJSON = !resource?.bodyType || resource?.bodyType === "JSON";

  return (
    <Card sx={{ p: 2 }}>
      <Typography>
        <b>Choose data resource</b>
      </Typography>
      <Stack spacing={1}>
        <EditBlock
          title="Resource name"
          description=" Select the data resource that will refresh when the event fires."
        >
          <SearchInput
            label="Choose Resource"
            field="name"
            id="ID"
            options={resources}
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
        {!!resource?.values.length && (
          <>
            <EditBlock
              title="Parameters"
              description="Set the parameter values to fulfill the data request"
            >
              <Stack spacing={1}>
                {resource.values.map((term) => (
                  <Stack key={term.key}>
                    <Typography variant="caption">
                      Set value for <b>{term.key}</b>
                    </Typography>

                    <ParamSelect
                      eventType={currentEvent.event}
                      label={term.key}
                      name="terms"
                      onChange={(e) => {
                        editor.send({
                          type: "set event action",
                          name: e.target.name,
                          value: {
                            ...terms,
                            [term.key]: e.target.value,
                          },
                        });
                      }}
                      value={terms[term.key]}
                      machine={machine}
                    />
                  </Stack>
                ))}
              </Stack>
            </EditBlock>
          </>
        )}

        {resource?.method === "POST" && (
          <>
            <Flex spacing={1}>
              <Typography variant="body2">
                <b>{resource.name}</b> post body
              </Typography>
              <ChipMenu
                options={["JSON", "State variable"]}
                value={isJSON ? 0 : 1}
              />
            </Flex>
            <EditBlock
              title="Request body"
              description="specify the body of the POST request"
            >
              <Json
                style={{
                  height: 100,
                  outline: "dotted 1px gray",
                  padding: 4,
                  overflow: "auto",
                }}
              >
                {resource.body}
              </Json>
              <Warning sx={{ fontSize: "0.8rem" }}>
                Configure request body in the connections panel
              </Warning>
            </EditBlock>
          </>
        )}
      </Stack>
    </Card>
  );
};

export default DataExecEdit;

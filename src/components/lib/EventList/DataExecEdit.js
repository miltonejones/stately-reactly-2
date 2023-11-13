import { Card, Stack, Typography } from "@mui/material";
import EditBlock from "../../../styled/EditBlock";
import SearchInput from "../../../styled/SearchInput";
import Flex from "../../../styled/Flex";
import ParamSelect from "../ComponentEditor/ParamSelect";
import React from "react";
import ChipMenu from "../../../styled/ChipMenu";
import Json from "../../../styled/Json";
import Warning from "../../../styled/Warning";
import CommonForm from "../CommonForm/CommonForm";
import Columns from "../../../styled/Columns";
import Nowrap from "../../../styled/Nowrap";

const DataExecEdit = ({ machine, editor, appData }) => {
  const { resources } = appData;
  const { currentEvent } = editor;
  const { target, terms = {}, predicates = [], pageNum } = currentEvent.action;

  const resource = resources.find((f) => f.ID === target);

  const isJSON = !resource?.bodyType || resource?.bodyType === "JSON";

  const formProps = [
    {
      title: "page",
      xs: 6,
    },
    {
      title: "size",
      alias: "Page size",
      xs: 6,
    },
  ];

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

        {resource?.method === "SELECT" && (
          <>
            <EditBlock title="Page" description="Page number of the request">
              <ParamSelect
                eventType={currentEvent.event}
                label="Page"
                name="pageNum"
                onChange={(e) => {
                  editor.send({
                    type: "set event action",
                    name: e.target.name,
                    value: e.target.value,
                  });
                }}
                value={pageNum}
                machine={machine}
              />
            </EditBlock>

            {!!resource?.predicates.length && (
              <>
                <EditBlock
                  title="Conditions"
                  description="Set the conditions to fulfill the data request"
                >
                  <Stack spacing={1}>
                    {resource.predicates.map((pred, k) => (
                      <Stack key={k}>
                        <Columns columns="20% 20% 1fr">
                          <Nowrap>{pred.property}</Nowrap>
                          <Nowrap>{pred.condition}</Nowrap>

                          <ParamSelect
                            eventType={currentEvent.event}
                            name="predicates"
                            onChange={(e) => {
                              editor.send({
                                type: "set event action",
                                name: e.target.name,
                                value: predicates.some(
                                  (f) => f.property === pred.property
                                )
                                  ? predicates.map((f) =>
                                      f.property === pred.property
                                        ? { ...f, operand: e.target.value }
                                        : f
                                    )
                                  : predicates.concat({
                                      ...pred,
                                      operand: e.target.value,
                                    }),
                              });
                            }}
                            value={
                              !predicates[k]
                                ? pred.operand
                                : predicates[k].operand
                            }
                            machine={machine}
                          />
                        </Columns>
                        {/* {pred.operand} */}
                      </Stack>
                    ))}
                  </Stack>
                </EditBlock>
                {/* <pre>{JSON.stringify(currentEvent.action, 0, 2)}</pre> */}
              </>
            )}
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

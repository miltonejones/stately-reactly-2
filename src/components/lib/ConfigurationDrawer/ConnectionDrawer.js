import {
  Box,
  Button,
  Card,
  Collapse,
  Divider,
  Grid,
  LinearProgress,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Flex from "../../../styled/Flex";
import Nowrap from "../../../styled/Nowrap";
import Spacer from "../../../styled/Spacer";
import { TinyButton } from "../../../styled/TinyButton";
import { Add, Close } from "@mui/icons-material";
import resolveNode from "../../../util/resolveNode";
import EventList from "../EventList/EventList";
import React from "react";
import TabMenu from "../../../styled/TabMenu";
import TabBody from "../../../styled/TabBody";
import Warning from "../../../styled/Warning";
import ChipMenu from "../../../styled/ChipMenu";
import Json from "../../../styled/Json";
import SearchInput from "../../../styled/SearchInput";
import EditBlock from "../../../styled/EditBlock";
import PredicateList, { clauseDef } from "./PredicateList";
import generateGuid from "../../../util/generateGuid";
import Columns from "../../../styled/Columns";
import decrypt from "../../../util/decrypt";

const connectionProps = [
  {
    title: "type",
    type: ["rest", "dynamo", "mysql"],
    chip: true,
  },
  {
    title: "name",
    alias: "Connection Name",
  },
  {
    title: "root",
    alias: "Root URL",
    when: (c) => c.type === "rest",
  },
  {
    title: "secretkey",
    alias: "Secret Key",
    password: true,
    when: (c) => c.type === "dynamo",
  },
  {
    title: "accesskey",
    alias: "Access Key",
    password: true,
    when: (c) => c.type === "dynamo",
  },
  {
    title: "region",
    when: (c) => c.type === "dynamo",
  },
  {
    title: "host",
    encrypt: true,
    when: (c) => c.type === "mysql",
  },
  {
    alias: "user name",
    encrypt: true,
    title: "user",
    when: (c) => c.type === "mysql",
  },
  {
    title: "password",
    encrypt: true,
    when: (c) => c.type === "mysql",
    password: true,
  },
  {
    title: "database",
    encrypt: true,
    when: (c) => c.type === "mysql",
  },
];

function BodyForm({ resource, machine, stateList, stateAttr }) {
  const ref = React.useRef();
  const isJSON = !resource.bodyType || resource.bodyType === "JSON";
  return (
    <Box sx={{ p: 1, height: "calc(40vh - 60px)", overflow: "auto" }}>
      <Stack spacing={2}>
        <Flex spacing={1}>
          <Typography variant="body2">
            <b>{resource.name}</b> post body
          </Typography>
          <ChipMenu
            options={["JSON", "State variable"]}
            value={isJSON ? 0 : 1}
            onChange={(value) => {
              machine.send({
                type: "update",
                name: "bodyType",
                value: ["JSON", "State variable"][value],
              });
            }}
          />
        </Flex>

        {!isJSON && (
          <>
            <EditBlock
              title="State variable"
              description="Select the state variable that will act as the body of this request."
            >
              <SearchInput
                exclusive
                options={stateList}
                label={`Binding for "${resource.name}"`}
                value={resource.body}
                onChange={(e) => {
                  machine.send({
                    type: "update",
                    name: "body",
                    value: e.target.value,
                  });
                }}
              />
            </EditBlock>
            <Json
              style={{
                height: "calc(40vh - 200px)",
                outline: "dotted 1px gray",
                overflow: "auto",
              }}
            >
              {JSON.stringify(stateAttr[resource.body], 0, 2)}
            </Json>
          </>
        )}

        {isJSON && (
          <Stack>
            <pre
              ref={ref}
              contentEditable
              style={{
                height: "calc(40vh - 180px)",
                outline: "dotted 1px gray",
              }}
            >
              {isJSON ? resource.body : stateAttr[resource.body]}
            </pre>
            <Flex>
              <Button
                variant="contained"
                onClick={() => {
                  machine.send({
                    type: "update",
                    name: "body",
                    value: ref.current.innerText,
                  });
                }}
              >
                save
              </Button>
            </Flex>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

function ParameterForm({ resource, machine, stateAttr, hasRecords }) {
  return (
    <Box sx={{ p: 1, height: "calc(40vh - 60px)", overflow: "auto" }}>
      <Flex sx={{ mb: 2 }}>
        <Typography variant="body2">
          {" "}
          Fields in <b>{resource.name}</b>
        </Typography>
        <Spacer />
        <TinyButton icon={Add} onClick={() => machine.send("add")} />
      </Flex>

      <Stack spacing={1}>
        {!resource.values.length && (
          <Warning>No parameters have been set for {resource.name}</Warning>
        )}
        {resource.values.map((value) => (
          <Flex key={value.key}>
            <Typography
              variant="body2"
              onClick={() => {
                machine.send({
                  type: "update",
                  name: "values",
                  value: resource.values.filter((f) => f.key !== value.key),
                });
              }}
            >
              {value.key}
            </Typography>
            <Spacer />
            <TextField
              size="small"
              label="value"
              value={value.value}
              onChange={(e) => {
                machine.send({
                  type: "update",
                  name: "values",
                  value: resource.values.map((val) =>
                    val.key === value.key
                      ? {
                          ...val,
                          value: e.target.value,
                        }
                      : val
                  ),
                });
              }}
            />
          </Flex>
        ))}
        <Flex spacing={1}>
          <Spacer />

          <Button
            disabled={!machine.testResponse}
            onClick={() => {
              machine.send("clear");
            }}
          >
            clear
          </Button>
          <Button
            disabled={hasRecords}
            variant="contained"
            color="error"
            onClick={() => {
              machine.send({
                type: "test",
                attr: stateAttr,
              });
            }}
          >
            test
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
}

function TextorChip({ prop, ...props }) {
  const type = prop.password ? "password" : "text";
  if (prop.chip) {
    return (
      <Flex spacing={1}>
        <Typography sx={{ textTransform: "capitalize" }} variant="body2">
          {prop.title}
        </Typography>
        <ChipMenu
          options={prop.type}
          value={prop.type.indexOf(props.value)}
          onChange={(index) =>
            props.onChange({
              target: {
                value: prop.type[index],
              },
            })
          }
        />
      </Flex>
    );
  }
  return (
    <TextField {...props} type={type}>
      {!!prop.type &&
        prop.type.map((key) => <MenuItem value={key}>{key}</MenuItem>)}
    </TextField>
  );
}

function CommonForm({
  fields,
  record,
  disabled,
  onChange,
  onSave,
  onCancel,
  title,
  buttons,
}) {
  return (
    <Stack
      spacing={1}
      sx={{ width: (theme) => `calc(100% - ${theme.spacing(2)})` }}
    >
      {!!title && <PanelHeader onClose={onCancel}>{title}</PanelHeader>}

      <Grid container spacing={1}>
        {fields
          .filter((prop) => !prop.when || !!prop.when(record))
          .map((prop) => (
            <Grid item xs={prop.xs || 12}>
              <TextorChip
                prop={prop}
                fullWidth
                select={!!prop.type}
                size="small"
                key={prop.title}
                label={prop.alias || prop.title}
                value={
                  prop.encrypt && !!record.config && !!record.config[prop.title]
                    ? decrypt(record.config[prop.title])
                    : record[prop.title]
                }
                onChange={(e) =>
                  onChange(
                    prop.title,
                    e.target.value,
                    prop.encrypt ? "secret" : "update"
                  )
                }
              />
            </Grid>
          ))}
      </Grid>

      <Flex spacing={1}>
        <Spacer />
        <Button onClick={onCancel}>cancel</Button>
        <Button disabled={disabled} variant="contained" onClick={onSave}>
          save
        </Button>
        {buttons}
      </Flex>
    </Stack>
  );
}

function ResourceForm({ resource, connection, stateAttr, machine }) {
  const resourceProps = [
    {
      title: "method",
      type: ["GET", "POST", "PUT", "DELETE"],
      chip: true,
      xs: 6,
    },
    {
      title: "format",
      type: ["rest", "querystring"],
      chip: true,
      xs: 6,
    },
    {
      title: "name",
    },
    {
      title: "path",
      when: (item) => item.method === "POST",
    },
    {
      title: "path",
      xs: 6,
      when: (item) => item.method !== "POST",
    },
    {
      title: "node",
      xs: 6,
      when: (item) => item.method !== "POST",
    },
    // {
    //   title: "transform",
    // },
  ];

  const dynamoProps = [
    {
      title: "method",
      type: ["GET", "SCAN", "PUT", "DELETE"],
      chip: true,
      xs: 6,
    },
    {
      title: "range",
      type: ["all rows", "filter"],
      chip: true,
      xs: 6,
      when: (item) => item.method === "SCAN",
    },
    {
      title: "name",
    },
    {
      type: machine.tableList || [],
      title: "tablename",
      alias: "Table Name",
      xs: 6,
    },
    {
      title: "node",
      xs: 6,
    },
  ];

  const mysqlProps = [
    {
      title: "method",
      type: ["SELECT", "INSERT", "UPDATE", "DELETE"],
      chip: true,
      xs: 8,
    },
    {
      title: "range",
      type: ["all rows", "filter"],
      chip: true,
      xs: 4,
      when: (item) => item.method === "SELECT",
    },
    {
      title: "name",
      xs: 4,
    },
    {
      type: machine.tableList || [],
      title: "tablename",
      alias: "Table Name",
      xs: 4,
    },
    {
      type: machine.columnList || resource.columns || [],
      title: "order",
      alias: "Order by",
      xs: 4,
    },
    {
      type: ["asc", "desc"],
      title: "direction",
      alias: "Direction",
      xs: 4,
    },
    {
      title: "page",
      alias: "Page",
      xs: 4,
    },
    {
      title: "size",
      alias: "Page Size",
      xs: 4,
      type: [25, 50, 100, 250],
    },
  ];

  const types = {
    rest: resourceProps,
    dynamo: dynamoProps,
    mysql: mysqlProps,
  };

  const props = {
    title: (
      <>
        <b>{resource.name}</b> settings
      </>
    ),
    buttons:
      connection.type !== "rest" ? (
        <>
          <Button
            disabled={!machine.testResponse}
            onClick={() => {
              machine.send("clear");
            }}
          >
            clear
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={() => {
              machine.send({
                type: "test",
                attr: stateAttr,
              });
            }}
          >
            test
          </Button>
        </>
      ) : null,
    fields: types[connection.type],
    record: resource,
    disabled: !machine.dirty,
    onChange: (name, value) => {
      machine.send({
        type: "update",
        name,
        value,
      });
    },
    onSave: () => {
      machine.send("commit");
    },
    onCancel: () => {
      machine.send("close resource");
    },
  };

  return <CommonForm {...props} />;
}

export default function ConnectionDrawer(props) {
  const { submachine, machine } = props;
  const [tab, setTab] = React.useState(0);
  const [col, setCol] = React.useState(0);

  if (!submachine) return <i />;
  const { resourceID, connectionID, chosenConnection, chosenResource } =
    submachine.state.context;
  const { resources, connections } = submachine.connectionProps;
  // const chosenConnection = connections.find((c) => c.ID === connectionID);
  // const chosenResource = resources.find((c) => c.ID === resourceID);

  // derive candidate column list from latest test response
  // TODO: this should be a useEffect/useState thing
  let candidateColumns = submachine.testResponse;
  if (chosenResource?.node && candidateColumns) {
    candidateColumns = resolveNode(
      candidateColumns,
      chosenResource.node.split("/")
    );
  }

  // TRUE if records are present and machine is in the correct state
  const hasRecords =
    !!submachine.testResponse && submachine.state.can("close resource");

  // set grid size based on presence of records (ratchet!)
  const xs = 4; // hasRecords ? 3 : 4;

  // labels for the resource tabs
  const tabs = [{ label: "settings" }, { label: "events" }];

  const isFilteredRequest =
    !!chosenResource &&
    chosenResource.range === "filter" &&
    ["SCAN", "SELECT"].some((f) => chosenResource.method === f);

  const isPostRequest = ["POST", "PUT"].some(
    (f) => chosenResource?.method === f
  );

  if (chosenConnection?.type === "rest" || isPostRequest) {
    tabs.push({ label: "parameters" });
  }

  if (isPostRequest) {
    tabs.push({ label: "body" });
  }

  if (isFilteredRequest) {
    tabs.push({ label: "SQL" });
  }

  const includeColumn = (col) => {
    submachine.send({
      type: "update",
      name: "columns",
      value:
        chosenResource.columns.indexOf(col) > -1
          ? chosenResource.columns.filter((f) => f !== col)
          : chosenResource.columns.concat(col),
    });
  };

  const appendPredicate = (predicate) => {
    const pred = {
      ...predicate,
      ID: generateGuid(),
    };
    submachine.send({
      type: "update",
      name: "predicates",
      value: (chosenResource.predicates || []).concat(pred),
    });
  };

  const updatePredicate = (predicate, key, value) => {
    const pred = {
      ...predicate,
      [key]: value,
    };
    submachine.send({
      type: "update",
      name: "predicates",
      value: chosenResource.predicates.map((f) =>
        f.ID === predicate.ID ? pred : f
      ),
    });
  };

  const dropPredicate = (predicate) => {
    submachine.send({
      type: "update",
      name: "predicates",
      value: chosenResource.predicates.filter((f) => f.ID !== predicate.ID),
    });
  };

  const formProps = {
    fields: connectionProps,
    record: chosenConnection,
    disabled: false,
    onChange: (name, value, event = "update") => {
      submachine.send({
        type: event,
        name,
        value,
      });
    },
    onSave: () => {
      submachine.send("commit");
    },
    onCancel: () => {
      submachine.send("close connection");
    },
  };
  return (
    <Grid spacing={1} container sx={{ p: 1 }}>
      <Grid item xs={xs}>
        <Stack sx={{ p: 1, height: "40vh", overflow: "auto" }}>
          <PanelHeader>
            <b>Connections</b>
          </PanelHeader>
          {connections.map((connection) => (
            <Stack>
              <Flex
                key={connection.name}
                sx={{
                  p: 0.5,
                  borderLeft: (theme) =>
                    `solid 8px ${
                      connection.ID === connectionID
                        ? theme.palette.warning.dark
                        : theme.palette.grey[300]
                    }`,
                  backgroundColor: (theme) =>
                    connection.ID === connectionID
                      ? "#FFFFCC"
                      : theme.palette.grey[100],
                }}
              >
                <Nowrap
                  hover
                  onClick={() => {
                    submachine.send({
                      type: "set connection",
                      ID: connection.ID,
                    });
                  }}
                  variant="body2"
                >
                  {connection.name}
                </Nowrap>
                <Spacer />
                <TinyButton
                  onClick={() => submachine.send("drop")}
                  hidden={
                    connectionID !== connection.ID ||
                    !submachine.state.can("close connection") ||
                    !!resourceID
                  }
                  icon="Delete"
                />
                <TinyButton
                  onClick={() => submachine.send("close connection")}
                  hidden={
                    connectionID !== connection.ID ||
                    !submachine.state.can("close connection")
                  }
                  icon="Close"
                />
              </Flex>
              {connectionID === connection.ID && (
                <Stack>
                  <Flex sx={{ ml: 2 }}>
                    <TinyButton icon="ExpandMore" />
                    <Nowrap bold variant="body2">
                      Resources
                    </Nowrap>
                  </Flex>
                  {resources
                    .filter((r) => r.connectionID === chosenConnection?.ID)
                    .map((resource) => (
                      <Flex sx={{ ml: 6 }} key={resource.name}>
                        <Nowrap
                          bold={resourceID === resource.ID}
                          hover
                          onClick={() => {
                            submachine.send({
                              type: "set resource",
                              ID: resource.ID,
                            });
                          }}
                          variant="body2"
                        >
                          {resource.name}
                        </Nowrap>
                        <Spacer />
                        <TinyButton
                          onClick={() => submachine.send("drop")}
                          hidden={resourceID !== resource.ID}
                          icon="Delete"
                        />
                        <TinyButton
                          onClick={() => submachine.send("close resource")}
                          hidden={resourceID !== resource.ID}
                          icon="Close"
                        />
                      </Flex>
                    ))}

                  {!resources.filter(
                    (r) => r.connectionID === chosenConnection?.ID
                  ).length && (
                    <Warning>{connection.name} has no resources</Warning>
                  )}
                </Stack>
              )}
            </Stack>
          ))}

          {!connections.length && (
            <Warning>No connections have been created.</Warning>
          )}
        </Stack>
      </Grid>

      {!!chosenConnection && (
        <Grid item xs={xs}>
          {!submachine.state.can("add") && <LinearProgress />}
          <Card sx={{ p: 1, height: "40vh", overflow: "auto" }}>
            <Collapse in={submachine.state.can("close resource")}>
              <>
                <TabMenu tabs={tabs} value={tab} onClick={setTab} />

                {!!chosenResource && (
                  <Stack sx={{ mt: 2 }} direction="row">
                    <TabBody minWidth={500} in={tab === 0}>
                      <Stack>
                        <ResourceForm
                          stateAttr={machine.stateAttr}
                          machine={submachine}
                          resource={chosenResource}
                          connection={chosenConnection}
                          connections={connections}
                        />

                        <Collapse
                          in={
                            chosenResource.method === "DELETE" &&
                            chosenConnection.type === "dynamo"
                          }
                        >
                          <EditBlock
                            title="Select record"
                            description="Choose the column and value of the record that you want to delete"
                          >
                            <Columns>
                              {!!submachine.columnList && (
                                <SearchInput
                                  options={submachine.columnList}
                                  value={chosenResource.filterKey}
                                  onChange={(e) => {
                                    submachine.send({
                                      type: "update",
                                      name: "filterKey",
                                      value: e.target.value,
                                    });
                                  }}
                                />
                              )}
                              <SearchInput
                                value={chosenResource.filterValue}
                                onChange={(e) => {
                                  submachine.send({
                                    type: "update",
                                    name: "filterValue",
                                    value: e.target.value,
                                  });
                                }}
                                options={Object.keys(machine.stateAttr)}
                              />
                            </Columns>
                          </EditBlock>
                        </Collapse>
                        <Collapse in={isFilteredRequest}>
                          <Card sx={{ m: 1, p: 2 }}>
                            <EditBlock
                              title="Filter"
                              description="Specify the filter(s) for your query"
                              action={
                                <TinyButton
                                  onClick={() => {
                                    appendPredicate({
                                      property: "",
                                      operator: "",
                                      condition: "",
                                    });
                                  }}
                                  icon={Add}
                                />
                              }
                            >
                              <PredicateList
                                onDrop={dropPredicate}
                                onChange={updatePredicate}
                                resource={chosenResource}
                              />
                            </EditBlock>
                          </Card>
                        </Collapse>
                      </Stack>
                    </TabBody>
                    <TabBody minWidth={500} in={tab === 3}>
                      <BodyForm
                        hasRecords={hasRecords}
                        resource={chosenResource}
                        machine={submachine}
                        stateAttr={machine.stateAttr}
                        stateList={machine.stateList}
                      />
                    </TabBody>
                    <TabBody
                      minWidth={500}
                      in={tab === 2 && chosenConnection.type === "rest"}
                    >
                      <ParameterForm
                        hasRecords={hasRecords}
                        resource={chosenResource}
                        machine={submachine}
                        stateAttr={machine.stateAttr}
                        stateList={machine.stateList}
                      />
                    </TabBody>
                    <TabBody
                      minWidth={500}
                      in={tab === 2 && chosenConnection.type === "mysql"}
                    >
                      {isFilteredRequest && (
                        <>
                          <pre>
                            SELECT {chosenResource.columns.join("\n , ")}
                            {"\n"}FROM {chosenResource.tablename}
                          </pre>
                          {!!chosenResource.predicates?.length && (
                            <>
                              <pre>
                                WHERE
                                <br />
                                {chosenResource.predicates.map((pred) => {
                                  const transformer = clauseDef[pred.condition];
                                  if (!transformer) return <i>undefined...</i>;
                                  const transformText = transformer(
                                    pred.property,
                                    pred.operand
                                  );
                                  return (
                                    <>
                                      {" "}
                                      {pred.operator} {transformText}
                                      <br />
                                    </>
                                  );
                                })}
                              </pre>
                            </>
                          )}
                          {!!chosenResource.size && (
                            <pre>LIMIT {chosenResource.size}</pre>
                          )}
                        </>
                      )}
                    </TabBody>
                    <TabBody minWidth={500} in={tab === 1}>
                      <EventList
                        componentEvents={"dataLoaded,loadStarted"}
                        title={
                          <>
                            Events in <b>{chosenResource.name}</b>
                          </>
                        }
                        resourceID={chosenResource.ID}
                        machine={props.machine}
                        events={chosenResource.events}
                      />
                    </TabBody>
                  </Stack>
                )}
              </>
            </Collapse>

            {submachine.state.matches(
              "connection modal is open.editing connection"
            ) && (
              <>
                <PanelHeader>Edit connection</PanelHeader>
                <CommonForm {...formProps} />
              </>
            )}
          </Card>
        </Grid>
      )}

      {hasRecords && (
        <>
          <Grid item xs={xs}>
            <Card sx={{ p: 1, height: "40vh", overflow: "auto" }}>
              <TabMenu
                tabs={[{ label: "Columns" }, { label: "Data" }]}
                value={col}
                onClick={setCol}
              />

              <Stack direction="row">
                <TabBody in={col === 0}>
                  <Flex sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      Choose columns to include
                    </Typography>
                    <Spacer />
                    <TinyButton
                      icon={Close}
                      onClick={() => submachine.send("close connection")}
                    />
                  </Flex>
                  {!!candidateColumns && !!candidateColumns.columns && (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                      }}
                    >
                      {candidateColumns.columns.map((col) => (
                        <Flex>
                          <Switch
                            onChange={() => includeColumn(col)}
                            checked={chosenResource.columns.indexOf(col) > -1}
                            size="small"
                          />
                          <Typography variant="body2">{col}</Typography>
                        </Flex>
                      ))}
                    </Box>
                  )}
                </TabBody>
                <TabBody in={col === 1}>
                  <Json>{JSON.stringify(candidateColumns, 0, 2)}</Json>
                </TabBody>
              </Stack>
            </Card>
          </Grid>
        </>
      )}

      {!hasRecords &&
        submachine.state.can("close resource") &&
        !!chosenResource.columns && (
          <Grid item xs={xs}>
            <Card sx={{ p: 1, height: "40vh", overflow: "auto" }}>
              <Flex sx={{ mb: 2 }}>
                <Typography variant="body2">Selected columns</Typography>
                <Spacer />
                <TinyButton
                  icon={Close}
                  onClick={() => submachine.send("close connection")}
                />
              </Flex>
              <Columns columns="1fr 1fr 1fr">
                {chosenResource.columns.map((col) => (
                  <Flex>
                    <Switch
                      onChange={() => includeColumn(col)}
                      checked
                      size="small"
                    />
                    <Typography variant="body2">{col}</Typography>
                  </Flex>
                ))}
              </Columns>

              {/* <pre>{JSON.stringify(chosenResource, 0, 2)}</pre> */}
            </Card>
          </Grid>
        )}
    </Grid>
  );
}

export const PanelHeader = ({ children, onClose, onAdd }) => {
  return (
    <Flex sx={{ mb: 2 }}>
      <Typography sx={{ textTransform: "capitalize" }} variant="body2">
        {children}
      </Typography>
      <Spacer />
      {!!onClose && <TinyButton icon={Close} onClick={onClose} />}
      {!!onAdd && <TinyButton icon={Add} onClick={onAdd} />}
    </Flex>
  );
};

import { Close, CopyAll, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Flex from "../../../styled/Flex";
import Spacer from "../../../styled/Spacer";
import React from "react";
import SearchInput from "../../../styled/SearchInput";
import Warning from "../../../styled/Warning";
import Json from "../../../styled/Json";
import { TabBody, TabMenu, TinyButton } from "../../../styled";

export default function ClientStateDrawer(props) {
  const [tabIndex, setTabIndex] = React.useState(0);
  const ref = React.useRef();

  const { submachine, machine } = props;

  if (!submachine) return <i />;

  const { stateProps, pagedProps, scope, pageNum } = submachine;

  const propJSON = stateProps[scope].reduce((out, prop) => {
    out[prop.Key] = prop.Type === "number" ? Number(prop.Value) : prop.Value;
    if (prop.Type === "boolean") out[prop.Key] = Boolean(prop.Value);
    if (prop.Type === "object") {
      try {
        out[prop.Key] = JSON.parse(prop.Value);
      } catch (ex) {}
    }
    return out;
  }, {});

  const height = submachine.expanded ? "80vh" : "40vh";

  return (
    <>
      <Dialog open={submachine.state.can("done")} maxWidth="xl">
        <Stack spacing={1} sx={{ width: 500, height: 500, p: 2 }}>
          <Flex>
            <Typography variant="body2">Edit JSON</Typography>
            <Spacer />
            <Chip
              size="small"
              onClick={() => {
                submachine.send("copy");
              }}
              icon={<CopyAll />}
              color="success"
              label={`Copy '${submachine.jsonKey}' from current state`}
            />
            <TinyButton
              onClick={() => {
                submachine.send({
                  type: "done",
                });
              }}
              icon="Close"
            />
          </Flex>
          <Card
            sx={{
              width: (theme) => `calc(532px - ${theme.spacing(4)})`,
              height: (theme) => `calc(500px - ${theme.spacing(4)})`,
              overflow: "auto",
            }}
          >
            <pre className="code" contentEditable ref={ref}>
              {submachine.json}
            </pre>
          </Card>
          <Flex>
            <Spacer />
            <Button
              variant="contained"
              onClick={() => {
                submachine.send({
                  type: "done",
                  json: ref.current.innerText,
                });
              }}
            >
              Done
            </Button>
          </Flex>
        </Stack>
      </Dialog>

      <Grid container sx={{ m: 1 }}>
        <Grid item xs={6}>
          <Stack spacing={1} sx={{ p: 1, height, overflow: "auto" }}>
            {!!pagedProps[scope] && pagedProps[scope].page_count > 1 && (
              <Pagination
                onChange={(_, page) => {
                  submachine.send({
                    type: "page",
                    page,
                  });
                }}
                count={pagedProps[scope].page_count}
                page={pageNum}
              />
            )}

            {!!pagedProps[scope] &&
              !!pagedProps[scope].visible &&
              pagedProps[scope].visible.map((prop) => (
                <Box
                  key={prop.Key}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "24px 1fr 1fr 1fr",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <TinyButton
                    icon="Delete"
                    onClick={(e) => {
                      submachine.send({
                        type: "drop variable",
                        key: prop.Key,
                      });
                    }}
                  />

                  <TextField
                    size="small"
                    readOnly
                    label="Key"
                    value={prop.Key}
                  />

                  <SearchInput
                    options={["string", "object", "boolean", "number"]}
                    size="small"
                    onChange={(e) => {
                      submachine.send({
                        type: "update",
                        key: prop.Key,
                        datatype: e.target.value,
                        value: prop.Value,
                      });
                    }}
                    label="Type"
                    value={prop.Type}
                  />

                  {prop.Type === "boolean" ? (
                    <Switch
                      onChange={(e) => {
                        submachine.send({
                          type: "update",
                          key: prop.Key,
                          datatype: prop.Type,
                          value: e.target.checked,
                        });
                      }}
                      checked={Boolean(prop.Value)}
                    />
                  ) : (
                    <TextField
                      disabled={prop.Type === "object"}
                      size="small"
                      onChange={(e) => {
                        submachine.send({
                          type: "update",
                          key: prop.Key,
                          datatype: prop.Type,
                          value: e.target.value,
                        });
                      }}
                      InputProps={{
                        endAdornment:
                          prop.Type === "object" ? (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => {
                                  submachine.send({
                                    type: "json",
                                    key: prop.Key,
                                    json: JSON.stringify(prop.Value, 0, 2),
                                  });
                                }}
                              >
                                <Edit />
                              </IconButton>
                            </InputAdornment>
                          ) : null,
                      }}
                      label="Value"
                      value={
                        prop.Type === "object"
                          ? JSON.stringify(prop.Value)
                          : prop.Value
                      }
                    />
                  )}
                </Box>
              ))}
            {!stateProps[scope].length && (
              <Warning spacing={1}>
                No variables in {scope} scope.{" "}
                <Button
                  variant="contained"
                  disabled={!submachine.state.can("add")}
                  onClick={() => submachine.send("add")}
                >
                  add
                </Button>
              </Warning>
            )}
          </Stack>
        </Grid>

        <Grid item xs={6}>
          <TabMenu
            value={tabIndex}
            onClick={setTabIndex}
            tabs={[
              {
                label: "Definitions",
              },
              {
                label: "Live",
              },
            ]}
          />
          <Card
            sx={{ height: `calc(${height} - 40px)`, overflow: "auto", p: 1 }}
          >
            <Stack direction="row">
              <TabBody in={tabIndex === 0}>
                <Json>{JSON.stringify(propJSON, 0, 2)}</Json>
              </TabBody>
              <TabBody in={tabIndex === 1}>
                <Json>{JSON.stringify(machine.clientLib[scope], 0, 2)}</Json>
              </TabBody>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

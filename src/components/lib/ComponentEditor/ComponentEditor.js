import {
  Box,
  Button,
  Card,
  Collapse,
  Dialog,
  Grid,
  IconButton,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Flex from "../../../styled/Flex";
import Spacer from "../../../styled/Spacer";
import {
  Add,
  ArrowBack,
  Bolt,
  CheckCircle,
  CheckCircleOutline,
  Close,
  Code,
  Palette,
  Settings,
} from "@mui/icons-material";
import { TabList } from "../../../styled/TabList";
import { TabButton } from "../../../styled/TabButton";
import TabBody from "../../../styled/TabBody";
import { ComponentStylesEditor } from "./ComponentStylesEditor";
import { ComponentSettingsEditor } from "./ComponentSettingsEditor";
import StyleConfigureModal from "./StyleConfigureModal";
import { MachineButton, TinyButton } from "../../../styled/TinyButton";
import PageEditor from "../PageEditor/PageEditor";
import Nowrap from "../../../styled/Nowrap";
import EventList from "../EventList/EventList";
import ChipMenu from "../../../styled/ChipMenu";
import Warning from "../../../styled/Warning";
import SearchInput from "../../../styled/SearchInput";
import EditBlock from "../../../styled/EditBlock";
import useBinding from "../../../hooks/useBinding";
import StateBar from "../../../styled/StateBar";

const ComponentTabs = ({ machine }) => {
  const tabs = [
    { label: "settings", icon: <Settings sx={{ width: 16, height: 16 }} /> },
    { label: "styles", icon: <Palette sx={{ width: 16, height: 16 }} /> },
    {
      label: "events",
      icon: <Bolt sx={{ width: 16, height: 16 }} />,
    },
    {
      label: "JSON",
      icon: <Code sx={{ width: 16, height: 16 }} />,
    },
  ];

  return (
    <TabList value={machine.state.context.componentTab} variant="scrollable">
      {tabs.map((tab) => (
        <TabButton
          key={tab.label}
          {...tab}
          onClick={() => machine.send(`open ${tab.label}`)}
          iconPosition="end"
        />
      ))}
    </TabList>
  );
};

const ComponentEventsEditor = (props) => {
  const { component, machine, repeaterBindings } = props;

  return (
    <EventList
      title={
        <>
          Events in <b>{component.ComponentName}</b>
        </>
      }
      machine={machine}
      owner={component}
      repeaterBindings={repeaterBindings}
      componentID={component.ID}
      pageID={machine.page?.ID}
      events={component.events}
    />
  );
};

function BindingDialog(props) {
  const { machine } = props;
  const { binder, appData, stateList } = machine;
  const { resources } = appData;
  const { resourceID, bindings = {}, typeMap, stateName } = binder.bindingData;
  const currentResource = resources.find((res) => res.ID === resourceID);

  if (!bindings) return <i />;

  // return <pre>{JSON.stringify(binder.bindingData, 0, 2)}</pre>;

  const unusedProps = !currentResource
    ? []
    : currentResource.columns.filter(
        (f) => !Object.keys(bindings).some((key) => key === f)
      );

  const toggle = (field) => {
    binder.send({
      type: "toggle field",
      field,
    });
  };

  const edit = (prop) => {
    binder.send({
      type: "edit",
      prop,
    });
  };

  // const selectedType = typeMap[binder.selectedProp];
  const presets = [
    {
      label: "data resource",
      message: "resource",
    },
    {
      label: "client state",
      message: "client",
    },
  ];

  return (
    <Dialog maxWidth="lg" open={binder.state.matches("ready")}>
      <Stack sx={{ p: 2, width: 640 }}>
        <Collapse in={binder.state.can("close")}>
          <Stack>
            <Flex>
              <IconButton onClick={() => binder.send("close")}>
                <ArrowBack />
              </IconButton>
              <Nowrap variant="body2">
                <b>Edit prop "{binder.selectedProp}"</b>
              </Nowrap>
            </Flex>

            {!!typeMap && (
              <pre>{JSON.stringify(typeMap[binder.selectedProp], 0, 2)}</pre>
            )}

            <pre>{JSON.stringify(bindings[binder.selectedProp], 0, 2)}</pre>
          </Stack>
        </Collapse>
        <Collapse in={binder.state.can("edit")}>
          <Stack spacing={2}>
            <Flex>
              <Nowrap variant="body2">
                <b>Edit bindings</b>
              </Nowrap>
              <Spacer />
              <TinyButton icon={Close} onClick={() => binder.send("quit")} />
            </Flex>

            <StateBar state={binder.state} />

            <Flex spacing={2}>
              <Typography variant="body2">Bind to:</Typography>
              <ChipMenu
                options={presets.map((f) => f.label)}
                onChange={(i) => binder.send(presets[i].message)}
                value={binder.state.can("resource") ? 1 : 0}
              />
            </Flex>

            {binder.state.can("resource") && (
              <EditBlock
                title="Client state value"
                description="Select a client state value to bind the component to"
              >
                <SearchInput
                  options={stateList}
                  label={`Binding to "`}
                  value={stateName}
                  onChange={(e) =>
                    binder.send({
                      type: "set state",
                      state: e.target.value,
                    })
                  }
                />
              </EditBlock>
            )}

            {binder.state.can("client") && (
              <>
                {!!resources.length && (
                  <TextField
                    label="Bind to resource"
                    value={resourceID}
                    select
                    size="small"
                    onChange={(e) => {
                      binder.send({
                        type: "set resource",
                        ID: e.target.value,
                      });
                    }}
                  >
                    {resources.map((resource) => (
                      <MenuItem value={resource.ID}>{resource.name}</MenuItem>
                    ))}
                  </TextField>
                )}
                {/* {JSON.stringify(binder.bindingData)} */}
                {!resources.length && (
                  <Warning>
                    No data resources have been added to the application.
                  </Warning>
                )}
                {!!currentResource && (
                  <Grid container>
                    <Grid item xs={4}>
                      <Flex>
                        <Nowrap variant="body2">
                          <b>Available fields</b>
                        </Nowrap>
                      </Flex>

                      {unusedProps.map((key) => (
                        <Flex spacing={1}>
                          <TinyButton
                            icon={CheckCircleOutline}
                            onClick={() => toggle(key)}
                          />
                          <Typography variant="body2">{key}</Typography>
                        </Flex>
                      ))}
                    </Grid>
                    {!!bindings && (
                      <Grid item xs={8}>
                        <Flex>
                          <Nowrap variant="body2">
                            <b>Bound fields</b>
                          </Nowrap>
                        </Flex>
                        <Stack spacing={1}>
                          {Object.keys(bindings).map((key) => (
                            <Flex between>
                              <Flex spacing={1}>
                                <TinyButton
                                  icon={CheckCircle}
                                  onClick={() => toggle(key)}
                                />
                                <Nowrap
                                  hover
                                  onClick={() => edit(key)}
                                  variant="body2"
                                >
                                  {key}
                                </Nowrap>
                              </Flex>

                              <TextField
                                size="small"
                                onChange={(e) => {
                                  binder.send({
                                    type: "alias",
                                    field: key,
                                    alias: e.target.value,
                                  });
                                }}
                                value={bindings[key].title || bindings[key]}
                                label="alias"
                              />
                            </Flex>
                          ))}
                        </Stack>
                      </Grid>
                    )}
                  </Grid>
                )}
              </>
            )}
          </Stack>
        </Collapse>
      </Stack>
    </Dialog>
  );
}

const ComponentEditor = (props) => {
  const { machine, component } = props;
  const { repeaterBindings } = useBinding(
    machine,
    component,
    false,
    "ComponentEditor"
  );
  if (!component) return <PageEditor {...props} />;
  const { componentTab } = machine;
  const { selectedSetting, componentData } = machine.state.context;
  const Component = machine.state.can("no") ? Dialog : Snackbar;

  return (
    <>
      <StyleConfigureModal {...props} />
      <BindingDialog machine={machine} />
      <Dialog open={machine.state.can("cancel")}>
        <Stack spacing={2} sx={{ p: 2, width: 300 }}>
          <Flex>
            <Typography variant="subtitle2">Edit Setting</Typography>
            <Spacer />
            <IconButton onClick={() => machine.send("cancel")}>
              <Close />
            </IconButton>
          </Flex>
          {!!selectedSetting &&
            Object.keys(selectedSetting).map((key) => (
              <Flex>
                <TextField
                  fullWidth
                  size="small"
                  key={key}
                  label={key}
                  onChange={(e) => {
                    machine.send({
                      type: "update",
                      name: key,
                      value: e.target.value,
                    });
                  }}
                  value={selectedSetting[key]}
                />
              </Flex>
            ))}
          {/* <pre>{JSON.stringify(selectedSetting, 0, 2)}</pre> */}
          <Flex spacing={1}>
            <Spacer />
            {machine.state.can("cancel") && (
              <Button onClick={() => machine.send("cancel")}>cancel</Button>
            )}
            <Button variant="contained" onClick={() => machine.send("save")}>
              save
            </Button>
          </Flex>
        </Stack>
      </Dialog>

      <Component open={machine.state.can("yes")}>
        <Card>
          <Stack direction="column" spacing={2} sx={{ p: 2, width: 300 }}>
            <Flex>
              <Typography variant="subtitle2">Confirm action</Typography>
              <Spacer />
              <IconButton onClick={() => machine.send("no")}>
                <Close />
              </IconButton>
            </Flex>
            <Box>{machine.state.context.message}</Box>
            <Flex spacing={1}>
              <Spacer />
              {machine.state.can("no") && (
                <Button onClick={() => machine.send("no")}>cancel</Button>
              )}
              <Button variant="contained" onClick={() => machine.send("yes")}>
                {machine.state.context.action}
              </Button>
            </Flex>
          </Stack>
        </Card>
      </Component>
      <Flex baseline>
        <Stack
          sx={{
            backgroundColor: (theme) => theme.palette.grey[100],
            width: "100%",
            p: 0.5,
            borderRadius: 1,
          }}
        >
          <Typography variant="body2">
            <b>{component.ComponentName}</b>
          </Typography>
          <Flex>
            {!!componentData?.Icon && <TinyButton icon={componentData.Icon} />}
            <Typography variant="caption">{component.ComponentType}</Typography>
          </Flex>
        </Stack>

        <Spacer />

        <Flex>
          {machine.state.can("configure style") && (
            <MachineButton
              icon="Settings"
              machine={machine}
              message="configure style"
            />
          )}
          <MachineButton
            icon={Add}
            machine={machine}
            message="configure"
            payload={{
              setting: {
                title: "newsetting",
                type: "",
                default: "",
                description: "Add a description",
                category: "General",
              },
            }}
          />

          <MachineButton icon="Close" machine={machine} message="close" />
        </Flex>
      </Flex>

      <Flex sx={{ mb: 2, pt: 1, borderBottom: 1, borderColor: "divider" }}>
        <ComponentTabs machine={machine} />

        <Spacer />
      </Flex>
      <Stack direction="row">
        <TabBody in={componentTab === 0}>
          <ComponentSettingsEditor
            {...props}
            repeaterBindings={repeaterBindings}
          />
        </TabBody>
        <TabBody in={componentTab === 1}>
          <ComponentStylesEditor
            {...props}
            repeaterBindings={repeaterBindings}
          />
        </TabBody>
        <TabBody in={componentTab === 2}>
          <ComponentEventsEditor
            {...props}
            repeaterBindings={repeaterBindings}
          />
        </TabBody>
        <TabBody in={componentTab === 3}>
          <pre> {JSON.stringify(component, 0, 2)}</pre>
        </TabBody>
      </Stack>
    </>
  );
};

export default ComponentEditor;

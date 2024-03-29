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
import CommonForm from "../CommonForm/CommonForm";
import React from "react";
import JsonTree from "../../../styled/JsonTree";
import ComponentEditorMenu from "./ComponentEditorMenu";
import ComponentSettingsModal from "./ComponentSettingsModal";
import { Columns } from "../../../styled";
import IconPopover from "../ComponentTree/IconPopover";

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
const textTypes =
  "body1,body2,button,caption,h1,h2,h3,h4,h5,h6,inherit,overline,subtitle1,subtitle2,string".split(
    ","
  );
const bindingTypes = {
  Image: [
    {
      of: "settings",
      title: "Width",
      xs: 4,
    },
    {
      of: "settings",
      title: "Height",
      xs: 4,
    },
    {
      of: "settings",
      title: "Radius",
      xs: 4,
    },
  ],
  Time: [
    {
      of: "settings",
      title: "format",
      description: "Text format to present time value",
      xs: 6,
    },
    {
      of: "settings",
      title: "multiplier",
      description: "Multiply by this factor to get milliseconds",
      xs: 6,
    },
  ],
  Text: [
    {
      of: "settings",
      title: "variant",
      type: textTypes,
    },
  ],
  Link: [
    {
      of: "settings",
      title: "variant",
      type: textTypes,
    },
  ],
};

function BindingDialog(props) {
  const { machine } = props;
  const { binder, appData, stateList } = machine;
  const { resources } = appData;
  const { resourceID, bindings = {}, typeMap, stateName } = binder.bindingData;
  const currentResource = resources.find((res) => res.ID === resourceID);

  if (!bindings) return <i />;

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

  const selectedBinding = typeMap?.[binder.selectedProp];

  const update = (field, name, value) => {
    binder.send({
      type: "update field",
      field,
      name,
      value,
    });
  };

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

  const formProps = bindingTypes[selectedBinding?.type];
  const bindingKeys = Object.keys(bindingTypes);
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
                <b>Edit column settings for "{binder.selectedProp}"</b>
              </Nowrap>
            </Flex>
            <StateBar state={binder.state} />

            {!!typeMap && formProps && (
              <Stack sx={{ p: 2 }}>
                <EditBlock
                  title="Data type"
                  description="Set the component type that should be rendered for this column"
                >
                  <SearchInput
                    onChange={(e) =>
                      update(binder.selectedProp, "type", e.target.value)
                    }
                    options={bindingKeys}
                    value={selectedBinding.type}
                  />
                </EditBlock>

                <CommonForm
                  fields={formProps}
                  onChange={(name, value) =>
                    update(binder.selectedProp, "settings", {
                      ...selectedBinding.settings,
                      [name]: value,
                    })
                  }
                  record={selectedBinding}
                />
              </Stack>
            )}
            {/* {!!typeMap && <pre>{JSON.stringify(selectedBinding, 0, 2)}</pre>} */}
            {/* [ <pre>{JSON.stringify(selectedBinding, 0, 2)}</pre>] */}
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
                            <Columns columns="1fr 1fr 100px">
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

                              {!!typeMap && (
                                <TextField
                                  onChange={(e) =>
                                    update(key, "fr", e.target.value)
                                  }
                                  size="small"
                                  value={typeMap[key].fr || `1fr`}
                                  label="size"
                                />
                              )}
                            </Columns>
                          ))}
                        </Stack>
                        {/* <pre>{JSON.stringify(typeMap, 0, 2)}</pre> */}
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
  const ref = React.useRef(null);
  const [open, setOpen] = React.useState({});
  const { machine, component } = props;
  const { repeaterBindings } = useBinding(
    machine,
    component,
    false,
    "ComponentEditor"
  );
  if (!component) return <PageEditor {...props} />;
  const { componentTab } = machine;
  const Component = machine.state.can("no") ? Dialog : Snackbar;

  const expanded = Boolean(machine.columnsOpen & 2);

  const tabItems = {
    settings: {
      icon: "Settings",
      component: ComponentSettingsEditor,
    },
    styles: {
      icon: "Palette",
      component: ComponentStylesEditor,
    },
    events: {
      icon: "Bolt",
      component: ComponentEventsEditor,
    },
  };

  return (
    <>
      <StyleConfigureModal {...props} />
      <BindingDialog machine={machine} />
      <ComponentSettingsModal machine={machine} />
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
        {expanded && (
          <>
            <ComponentEditorMenu machine={machine} component={component} />

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
            </Flex>
          </>
        )}

        <MachineButton
          icon={expanded ? "ChevronRight" : "ChevronLeft"}
          machine={machine}
          payload={{
            name: "columnsOpen",
            value: expanded
              ? machine.columnsOpen - 2
              : Number(machine.columnsOpen) + 2,
          }}
          message="set context"
        />
      </Flex>
      {!expanded && (
        <Stack sx={{ mt: 1 }} spacing={1}>
          {Object.keys(tabItems).map((tab) => {
            const Tag = tabItems[tab].component;
            return (
              <IconPopover
                key={tab}
                icon={tabItems[tab].icon}
                onClick={() => machine.send(`open ${tab}`)}
              >
                <Tag
                  machine={machine}
                  {...props}
                  repeaterBindings={repeaterBindings}
                />
              </IconPopover>
            );
          })}

          <MachineButton icon="Close" machine={machine} message="close" />
        </Stack>
      )}

      {expanded && (
        <>
          <Flex sx={{ mb: 2, pt: 1, borderBottom: 1, borderColor: "divider" }}>
            <ComponentTabs machine={machine} />

            <Spacer />
            <MachineButton icon="Close" machine={machine} message="close" />
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
              <Stack sx={{ width: "100%", overflow: "auto" }}>
                <JsonTree open={open} setOpen={setOpen} value={component} />
              </Stack>
            </TabBody>
          </Stack>
        </>
      )}
    </>
  );
};

export default ComponentEditor;

import React from "react";
import {
  Box,
  Button,
  Card,
  Collapse,
  Dialog,
  Divider,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ComponentEditor from "../ComponentEditor/ComponentEditor";
import Nowrap from "../../../styled/Nowrap";
import Flex from "../../../styled/Flex";
import { commitApplication } from "../../../connector/commitApplication";
import Spacer from "../../../styled/Spacer";
import ComponentNav from "./ComponentNav";
import PageNav from "./PageNav";
import { cleanApp } from "../../../util/cleanApp";
import { MachineButton, TinyButton } from "../../../styled/TinyButton";
import { Add, Home, List, Task } from "@mui/icons-material";
import ComponentPreview from "./ComponentPreview";
import ComponentToolbar from "./ComponentToolbar";
import InvokeErrorModal from "../InvokeErrorModal/InvokeErrorModal";
import ComponentModal from "../ComponentModal/ComponentModal";
import ConfigurationDrawer from "../ConfigurationDrawer/ConfigurationDrawer";
import findMaxNumber from "../../../util/findMaxNumber";
import Warning from "../../../styled/Warning";
import PageModal from "../PageModal/PageModal";
import EditBlock from "../../../styled/EditBlock";
import stateRead from "../../../util/stateRead";
import ChipMenu from "../../../styled/ChipMenu";
import PageTitle from "../PageTitle/PageTitle";
import SubmitField from "../../../styled/SubmitField";
import Columns from "../../../styled/Columns";
import JsonTree from "../../../styled/JsonTree";
import AppGrid from "../ConfigurationDrawer/AppGrid";
import AppList from "../ConfigurationDrawer/AppList";
import { StateBar } from "../../../styled";
import IconPopover from "./IconPopover";

function ApplicationList({ machine }) {
  const { appKeys } = machine.state.context;
  const options = [
    {
      label: "View as List",
      icon: "List",
    },
    {
      label: "View as Grid",
      icon: "Apps",
    },
  ];
  if (machine.recycledApps.length) {
    options.push("Recycle Bin");
  }
  return (
    <Stack
      spacing={1}
      sx={{
        backgroundColor: (theme) => theme.palette.primary.dark,
        p: 1,
        height: "100vh",
        width: "100vw",
      }}
    >
      <Box
        sx={{
          width: (theme) => `calc(100vw - ${theme.spacing(2)})`,
        }}
      >
        <ComponentToolbar machine={machine} />
      </Box>

      <Card
        sx={{
          height: (theme) => `calc(100vh - ${theme.spacing(9)})`,
          width: (theme) => `calc(100vw - ${theme.spacing(2)})`,
        }}
      >
        {!machine.state.can("open") && <LinearProgress />}
        <Collapse in={!machine.state.can("cancel new app")}>
          <>
            <Flex sx={{ p: 2 }} spacing={1}>
              <Typography variant="h5">My apps</Typography>
              <Spacer />
              <ChipMenu
                value={machine.view}
                options={options}
                onChange={(value) => {
                  machine.send({
                    type: "set context",
                    name: "view",
                    value,
                  });
                }}
              />
            </Flex>

            {!!appKeys && machine.view === 0 && (
              <AppList appKeys={appKeys} machine={machine} />
            )}
            {!!appKeys && machine.view === 1 && (
              <AppGrid appKeys={appKeys} machine={machine} />
            )}
            {!!appKeys && machine.view === 2 && (
              <Card sx={{ p: 2, m: 1, width: 500 }}>
                <Nowrap variant="body2">
                  <b>Recycled apps</b>
                </Nowrap>
                <Divider />
                {machine.recycledApps.map((f) => (
                  <Flex sx={{ m: 1 }}>
                    <TinyButton icon="Delete" /> {f.Name}
                  </Flex>
                ))}
              </Card>
            )}
          </>
        </Collapse>

        <Collapse in={machine.state.can("cancel new app")}>
          <Card sx={{ width: 500, p: 2, m: 4 }}>
            <Stack spacing={2}>
              <EditBlock
                title="Application Name"
                description="Enter a name for the new application"
              >
                <SubmitField
                  onSubmit={() => machine.send("done")}
                  autoComplete="off"
                  size="small"
                  value={machine.state.context.name}
                  onChange={(e) => {
                    machine.send({
                      type: "change",
                      name: e.target.value,
                    });
                  }}
                />
              </EditBlock>
              <Flex>
                <Spacer />
                <Button onClick={() => machine.send("cancel new app")}>
                  cancel
                </Button>
                <Button
                  onClick={() => machine.send("done")}
                  variant="contained"
                >
                  save
                </Button>
              </Flex>
            </Stack>
          </Card>
        </Collapse>
      </Card>
    </Stack>
  );
}

export default function ComponentTree({ machine }) {
  const { expandedNodes: expanded } = machine;
  const [open, setOpen] = React.useState({});

  const expand = (name) => {
    machine.send({
      type: "expand node",
      name,
    });
  };

  // method to create a new component
  const create = (componentID, order) => {
    machine.send({
      type: "create",
      componentID,
      order,
    });
  };

  // send message to bind a state value
  const bindText = (name, value) => {
    machine.send({
      type: "bind state",
      name,
      value,
    });
  };

  // if appData is not present, show the home screen view
  if (machine.state.can("open") || !machine.appData) {
    return <ApplicationList machine={machine} />;
  }

  // extract useful properties from the state machine
  const {
    page: currentPage,
    appData,
    selectedComponent,
    iconList,
    clientLib,
  } = machine;

  const height = "calc(100vh - 88px)";

  // get list of components from the currently loaded page, or application if no page is detected
  const componentItems = !currentPage
    ? appData.components
    : currentPage.components;

  // sort items by their order property
  const items = componentItems?.sort((a, b) => (a.order > b.order ? 1 : -1));
  const applicationComponents = appData.components.sort((a, b) =>
    a.order > b.order ? 1 : -1
  );

  // editMode is ON if machine is in a state where 'configure' is available
  const isEditMode = machine.state.can("configure");

  // global method to get property values based on current context
  const getStateValue = (value) =>
    stateRead({
      value,
      page: currentPage,
      application: appData,
      clientLib,
    });

  // global method to register components with the platform
  const register = (key, setup) => {
    machine.send({
      type: "register",
      key,
      setup,
    });
  };

  // method to persist the app data to s3
  const handleSave = async () => {
    await commitApplication(cleanApp(machine.appData));
    machine.send("resetclean");
  };

  // send EDIT message to move app to edit more for a selected component
  const selectComponent = (ID) => {
    const found = componentItems.find((f) => f.ID === ID);
    if (!found) {
      // in case a app scope item is clicked when in page scope
      return alert(`Item ${ID} is not on the current page.`);
    }
    machine.send({
      type: "edit",
      ID,
    });
  };

  // find the parent component of this component
  const parentComponents = !items
    ? []
    : items.filter((f) => !items.find((p) => p.ID === f.componentID));

  // get this highest ORDER prop from the component list
  const highest = !items
    ? 100
    : findMaxNumber(parentComponents.map((f) => f.order));

  const componentNavProps = {
    components: parentComponents,
    expand,
    highest,
    expanded,
    create, //: () => create(null, highest + 50),
    iconList,
    componentList: items,
    // reference to the currently selected component
    component: selectedComponent,
  };

  // properties based into the component previewer
  const previewProps = {
    // reference to the applicaion state machine
    machine,

    // reference to the current applicaion
    application: appData,

    // reference to the current page
    page: currentPage,

    // helper method to get state value from current context
    getStateValue,

    // helper method to invoke component events
    invoke: (events, eventType, options, e) =>
      machine.invokeEvent(events, eventType, options, e, machine.setupData),

    // helper method to register component DOM references
    register,

    // DEPRECATED: reference to machine modal data
    modalData: machine.modalData,

    // DEPRECATED: reference to machine resource data
    resourceData: machine.resourceData,

    // helper method to bind component settings
    bindText,

    // reference to the currently selected component
    component: selectedComponent,

    // helper method to create a new component
    create,

    // helper list of icons for component navigation
    iconList,

    // TRUE when the component is being edited
    isEditMode,

    // helper method to select a component
    selectComponent,
  };

  const left = machine.columnsOpen & 1 ? "380px" : "72px";
  const right = machine.columnsOpen & 2 ? "420px" : "32px";
  const expandLeft = Boolean(machine.columnsOpen & 1);

  const maxWidth = "30vw";

  return (
    <>
      <PageTitle machine={machine} />
      <InvokeErrorModal invoker={machine.invoker} />
      <ComponentModal machine={machine} />
      <ConfigurationDrawer machine={machine} />
      <PageModal machine={machine} />

      {!!selectedComponent && (
        <Dialog open={machine.state.can("cancel drop")}>
          <Stack sx={{ p: 2, width: 400 }} spacing={1}>
            <Flex>
              <Typography variant="subtitle2">Confirm delete</Typography>
              <Spacer />
              <TinyButton
                icon="Close"
                onClick={() => machine.send("cancel drop")}
              />
            </Flex>
            <Typography variant="body2">
              Do you want to delete component{" "}
              <b>{selectedComponent.ComponentName}</b>?
            </Typography>
            <Flex>
              <Spacer />
              <Button onClick={() => machine.send("cancel drop")} size="small">
                cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => machine.send("drop confirm")}
              >
                delete
              </Button>
            </Flex>
          </Stack>
        </Dialog>
      )}

      <Box
        sx={{
          m: 0,
          p: 1,
          width: (theme) => `calc(100vw - ${theme.spacing(2)})`,
          height: (theme) => `calc(100vh - ${theme.spacing(2)})`,
          backgroundColor: (theme) => theme.palette.primary.dark,
        }}
      >
        <Stack spacing={1}>
          <ComponentToolbar handleSave={handleSave} machine={machine} />

          <Columns
            sx={{ alignItems: "flex-start" }}
            columns={[left, "2fr", right].join(" ")}
          >
            {/* right sidebar */}
            <Box sx={{ maxWidth, overflow: "auto" }}>
              <Flex baseline spacing={1}>
                <Card
                  sx={{
                    p: 1,
                    height,
                    overflow: "hidden",
                  }}
                >
                  <Stack
                    sx={{ height: "100%", justifyContent: "space-between" }}
                  >
                    <TinyButton
                      onClick={() => machine.send("home")}
                      icon={Home}
                    />
                    <Stack spacing={1}>
                      {Object.keys(machine.configMachines).map((key) => (
                        <TinyButton
                          key={key}
                          onClick={() => {
                            machine.configureApp(key);
                          }}
                          icon={machine.configMachines[key].icon}
                        />
                      ))}
                    </Stack>
                  </Stack>
                </Card>

                <Stack
                  sx={{
                    width: `calc(100% - 40px)`,
                  }}
                  spacing={1}
                >
                  {/* page navigation */}
                  <Card
                    sx={{
                      p: 1,
                      height: expandLeft ? 300 : "calc(100vh - 88px)",
                      overflow: "auto",
                    }}
                  >
                    <Flex>
                      {expandLeft && (
                        <Nowrap bold variant="caption">
                          Pages
                        </Nowrap>
                      )}

                      <MachineButton
                        icon={expandLeft ? "ChevronLeft" : "ChevronRight"}
                        machine={machine}
                        payload={{
                          name: "columnsOpen",
                          value: expandLeft
                            ? machine.columnsOpen - 1
                            : Number(machine.columnsOpen) + 1,
                        }}
                        message="set context"
                      />
                    </Flex>

                    {!expandLeft && (
                      <Stack sx={{ mt: 1 }} spacing={1}>
                        <IconPopover icon="Task">
                          <PageNavigation machine={machine} />
                        </IconPopover>
                        <IconPopover icon="Apps">
                          <ComponentNavigation
                            {...componentNavProps}
                            machine={machine}
                          />
                        </IconPopover>
                      </Stack>
                    )}

                    {/* page navigation */}
                    {expandLeft && <PageNavigation machine={machine} />}
                  </Card>

                  {/* component navigation */}
                  {expandLeft && (
                    <ComponentNavigation
                      {...componentNavProps}
                      machine={machine}
                    />
                  )}
                </Stack>
              </Flex>
            </Box>

            {/* workspace */}
            <Stack spacing={1}>
              <StateBar state={machine.state} />

              <Card
                sx={{ p: 1, height: `calc(100vh - 126px)`, overflow: "auto" }}
              >
                {!machine.preview && (
                  <JsonTree open={open} setOpen={setOpen} value={appData} />
                  // <Json>{JSON.stringify(appData, 0, 2)}</Json>
                )}

                {/* application scope components are displayed on the current page
              since the main component previewer is not displaying page components */}
                {!!currentPage && !!machine.preview && (
                  <>
                    <ComponentPreview
                      {...previewProps}
                      componentList={applicationComponents}
                      components={applicationComponents.filter(
                        (f) =>
                          !applicationComponents.find(
                            (p) => p.ID === f.componentID
                          )
                      )}
                    />
                  </>
                )}

                {/* page scope components, or application components if there is no page */}
                {!!items && !!machine.preview && (
                  <ComponentPreview
                    {...previewProps}
                    componentList={items}
                    components={items.filter(
                      (f) => !items.find((p) => p.ID === f.componentID)
                    )}
                  />
                )}

                {!currentPage && (
                  <Warning>You are editing in application scope.</Warning>
                )}
              </Card>
            </Stack>

            {/* left sidebar */}
            <Box sx={{ maxWidth, overflow: "auto" }}>
              <Card sx={{ p: 1, height, overflow: "auto" }}>
                <ComponentEditor
                  getStateValue={getStateValue}
                  machine={machine}
                  component={selectedComponent}
                  handleSave={handleSave}
                />
              </Card>
            </Box>
          </Columns>
        </Stack>
      </Box>
    </>
  );
}

function ComponentNavigation({ machine, ...props }) {
  return (
    <Card
      sx={{
        p: 1,
        height: "calc(100vh - 412px)",
        overflow: "auto",
      }}
    >
      <TextField
        size="small"
        label="Search"
        fullWidth
        onChange={(e) => {
          machine.send({
            type: "set context",
            name: "searchParam",
            value: e.target.value,
          });
        }}
      />
      {machine.state.can("merge") &&
        !props.componentList?.length &&
        !!machine.page && (
          <Warning spacing={1}>
            Page has no components.
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                machine.send("merge");
              }}
            >
              download
            </Button>
          </Warning>
        )}
      {!machine.state.can("edit") && <LinearProgress />}

      <Nowrap bold variant="caption">
        Components
      </Nowrap>
      {!!props.componentList && (
        <ComponentNav {...props} machine={machine} send={machine.send} />
      )}

      <Flex sx={{ ml: 1 }}>
        <TinyButton icon={Add} />
        <Nowrap
          onClick={() => props.create(null, props.highest + 50)}
          hover
          variant="caption"
        >
          Add component
        </Nowrap>
      </Flex>
    </Card>
  );
}

function PageNavigation({ machine }) {
  return (
    <>
      <Flex sx={{ ml: 1 }}>
        <TinyButton icon={Task} />
        <Nowrap
          variant="body2"
          hover
          bold={!machine.page}
          onClick={() => {
            machine.send("navigate");
          }}
        >
          {machine.appData.Name}
        </Nowrap>
      </Flex>

      <PageNav
        onClick={(p) => {
          machine.send({
            type: "navigate",
            path: p.PagePath,
          });
        }}
        page={machine.page}
        pages={machine.appData.pages.filter((f) => !f.pageID)}
        pageList={machine.appData.pages}
        send={machine.send}
      />

      {machine.state.can("new page") && (
        <Flex sx={{ ml: 1 }}>
          <TinyButton icon={Add} />
          <Nowrap
            variant="body2"
            hover
            onClick={() => machine.send("new page")}
          >
            Add page
          </Nowrap>
        </Flex>
      )}
    </>
  );
}

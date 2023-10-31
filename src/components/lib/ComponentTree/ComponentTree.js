import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Collapse,
  Dialog,
  Grid,
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
import { TinyButton } from "../../../styled/TinyButton";
import { Add, Home, Task } from "@mui/icons-material";
import ComponentPreview from "./ComponentPreview";
import moment from "moment";
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
import Json from "../../../styled/Json";
import PageTitle from "../PageTitle/PageTitle";

function AppGrid({ appKeys, machine }) {
  return (
    <Stack sx={{ p: 2 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
          alignItems: "center",
          gap: 1,
        }}
      >
        {appKeys
          .filter((item) => !!item.content)
          .map((item) => (
            <Card
              sx={{ cursor: "pointer" }}
              onClick={() =>
                machine.send({
                  type: "open",
                  key: item.Key,
                })
              }
            >
              <CardMedia
                sx={{ height: 180 }}
                image={item.content.Photo}
                title={item.content.Name}
              />
              <CardContent>
                <Typography gutterBottom variant="body2">
                  {item.content.Name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Last changed:{" "}
                  {moment(item.LastModified).format("DD MMM yyyy HH:mm")}
                </Typography>
              </CardContent>
            </Card>
          ))}
      </Box>
    </Stack>
  );
}

function AppList({ appKeys, machine }) {
  return (
    <Stack sx={{ p: 2 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "40px 240px 400px 1fr 1fr ",
          alignItems: "center",
          padding: "1px",
        }}
      >
        <Box />
        <Box>Name</Box>
        <Box>File</Box>
        <Box>Size</Box>
        <Box>Date</Box>
      </Box>
      {appKeys
        .filter((item) => !!item.content)
        .map((item) => (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "40px 240px 400px 1fr 1fr ",
              alignItems: "center",
              padding: "1px",
            }}
          >
            <Box
              sx={{
                backgroundColor: "white",
              }}
            >
              <Avatar src={item.content.Photo} alt={item.content.Name} />
            </Box>
            <Nowrap
              hover
              onClick={() =>
                machine.send({
                  type: "open",
                  key: item.Key,
                })
              }
            >
              {item.content.Name}
            </Nowrap>

            <Typography>{item.Key}</Typography>
            <Typography>{item.Size}</Typography>
            <Typography>
              {moment(item.LastModified).format("DD MMM yyyy HH:mm")}
            </Typography>
          </Box>
        ))}
    </Stack>
  );
}

function ApplicationList({ machine }) {
  const { appKeys } = machine.state.context;
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
                options={["View as List", "View as Grid"]}
                onChange={(value) => {
                  machine.send({
                    type: "set context",
                    name: "view",
                    value,
                  });
                }}
              />
            </Flex>
            {!!appKeys && machine.view !== 1 && (
              <AppList appKeys={appKeys} machine={machine} />
            )}
            {!!appKeys && machine.view === 1 && (
              <AppGrid appKeys={appKeys} machine={machine} />
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
                <TextField
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
  // an object to represent expanded nodes in the treeview
  const [expanded, setExpanded] = React.useState({});
  const expand = (key) => {
    setExpanded((old) => ({
      ...old,
      [key]: !old[key],
    }));
  };

  // method to create a new component
  const create = (componentID, order) =>
    machine.send({
      type: "create",
      componentID,
      order,
    });

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
  const { page: currentPage, appData, selectedComponent, iconList } = machine;

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
  const parentComponent = !items
    ? []
    : items.filter((f) => !items.find((p) => p.ID === f.componentID));

  // get this highest ORDER prop from the component list
  const highest = !items
    ? 100
    : findMaxNumber(parentComponent.map((f) => f.order));

  // properties based into the component previewer
  const previewProps = {
    application: appData,
    bindText,
    component: selectedComponent,
    create,
    getStateValue,
    iconList,
    invoke: machine.invokeEvent,
    isEditMode,
    machine,
    modalData: machine.modalData,
    page: currentPage,
    register,
    resourceData: machine.resourceData,
    selectComponent,
  };

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
          width: "100vw",
          height: "100vh",
          backgroundColor: (theme) => theme.palette.primary.dark,
        }}
      >
        <Grid
          sx={{
            width: (theme) => `calc(100vw - ${theme.spacing(1)})`,
          }}
          container
          spacing={1}
        >
          {/* toolbar */}
          <Grid item xs={12}>
            <ComponentToolbar handleSave={handleSave} machine={machine} />
          </Grid>

          {/* right sidebar */}
          <Grid item xs={3}>
            <Flex baseline spacing={1}>
              <Card
                sx={{
                  p: 1,
                  height,
                  overflow: "hidden",
                }}
              >
                <Stack sx={{ height: "100%", justifyContent: "space-between" }}>
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
                    height: 300,
                    overflow: "auto",
                  }}
                >
                  <Nowrap bold variant="caption">
                    Pages
                  </Nowrap>
                  <Flex sx={{ ml: 1 }}>
                    <TinyButton icon={Task} />
                    <Nowrap
                      variant="body2"
                      hover
                      bold={!currentPage}
                      onClick={() => {
                        machine.send("navigate");
                      }}
                    >
                      {appData.Name}
                    </Nowrap>
                  </Flex>

                  <PageNav
                    onClick={(p) => {
                      machine.send({
                        type: "navigate",
                        path: p.PagePath,
                      });
                    }}
                    page={currentPage}
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
                </Card>

                {/* component navigation */}
                <Card
                  sx={{
                    p: 1,
                    height: "calc(100vh - 412px)",
                    overflow: "auto",
                  }}
                >
                  {machine.state.can("merge") &&
                    !items?.length &&
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
                  {!!items && (
                    <ComponentNav
                      expand={expand}
                      create={create}
                      expanded={expanded}
                      iconList={iconList}
                      components={parentComponent}
                      component={selectedComponent}
                      componentList={items}
                      machine={machine}
                      send={machine.send}
                    />
                  )}

                  <Flex sx={{ ml: 1 }}>
                    <TinyButton icon={Add} />
                    <Nowrap
                      onClick={() => create(null, highest + 50)}
                      hover
                      variant="caption"
                    >
                      Add component
                    </Nowrap>
                  </Flex>
                </Card>
              </Stack>
            </Flex>
          </Grid>

          {/* workspace */}
          <Grid item xs={6}>
            <Card sx={{ p: 1, height, overflow: "auto" }}>
              {!machine.preview && <Json>{JSON.stringify(appData, 0, 2)}</Json>}

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
          </Grid>

          {/* left sidebar */}
          <Grid item xs={3}>
            <Card sx={{ p: 1, height, overflow: "auto" }}>
              <ComponentEditor
                getStateValue={getStateValue}
                machine={machine}
                component={selectedComponent}
                handleSave={handleSave}
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

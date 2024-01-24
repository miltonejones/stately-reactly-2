import {
  Avatar,
  Box,
  Button,
  Collapse,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Flex from "../../../styled/Flex";
import {
  Bolt,
  Code,
  Delete,
  Description,
  Palette,
  Settings,
} from "@mui/icons-material";
import Spacer from "../../../styled/Spacer";
import { MachineButton, TinyButton } from "../../../styled/TinyButton";
import CommonForm from "../CommonForm/CommonForm";
import { TabList } from "../../../styled/TabList";
import { TabButton } from "../../../styled/TabButton";
import EventList from "../EventList/EventList";
import TabBody from "../../../styled/TabBody";
import Warning from "../../../styled/Warning";
import DropModal from "../ComponentTree/DropModal";
import { ComponentStylesEditor } from "../ComponentEditor/ComponentStylesEditor";
import JsonTree from "../../../styled/JsonTree";
import React from "react";
import IconPopover from "../ComponentTree/IconPopover";

const AppEditor = (props) => {
  const [open, setOpen] = React.useState({});
  const { machine } = props;
  if (!machine.appData) return <>no app</>;

  const appFields = [
    {
      title: "Name",
      description: "Name of the application as it appears in the title bar.",
    },
    {
      title: "path",
      description: "Path of the application as it appears in the address bar.",
    },
    {
      title: "HomePage",
      alias: "Home Page",
      description: "Start page of the application.",
      type: machine.appData.pages.map((p) => ({
        value: p.ID,
        label: p.PageName,
      })),
    },
    {
      title: "Photo",
      description: "Icon to be used in the application manifest.",
    },
  ];

  const formProps = {
    fields: appFields,
    record: machine.appData,
    disabled: false,
    onDelete: () => machine.send("drop app"),
    onChange: (field, value) => {
      machine.send({
        type: "update",
        field,
        value,
      });
    },
  };

  const expanded = Boolean(machine.columnsOpen & 2);

  const eventProps = {
    componentEvents: "onApplicationLoad",
    events: machine.appData.events,
    machine,
    title: (
      <>
        Events in <b>{machine.appData.Name}</b>
      </>
    ),
  };

  return (
    <>
      <DropModal machine={machine} />
      <Flex baseline>
        {expanded && (
          <>
            <Flex>
              <TinyButton icon={Description} />
              <Typography>{machine.appData.Name}</Typography>
            </Flex>
            <Spacer />
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
          <IconPopover icon="Settings">
            <CommonForm {...formProps} />
          </IconPopover>
          <IconPopover icon="Bolt">
            <EventList {...eventProps} />
          </IconPopover>
          <MachineButton machine={machine} message="home" icon="Close" />
        </Stack>
      )}

      {expanded && (
        <>
          <Flex sx={{ mb: 2, pt: 1, borderBottom: 1, borderColor: "divider" }}>
            <PageTabs
              machine={machine}
              value={machine.appTab}
              tabType="appTab"
            />
            <Spacer />
            <MachineButton machine={machine} message="home" icon="Close" />
          </Flex>
          {!!machine.appData.Photo && (
            <Avatar src={machine.appData.Photo} alt={machine.appData.Name} />
          )}

          <Stack direction="row">
            <Collapse orientation="horizontal" in={machine.appTab === 0}>
              <Box sx={{ width: "100%", minWidth: 400 }}>
                <CommonForm {...formProps} />
              </Box>
            </Collapse>
            <Collapse orientation="horizontal" in={machine.appTab === 1}>
              <Box sx={{ width: "100%", minWidth: 400 }}>
                <EventList {...eventProps} />
              </Box>
            </Collapse>
            <Collapse orientation="horizontal" in={machine.appTab === 2}>
              <Box sx={{ width: "100%" }}>
                {/* <Json>{JSON.stringify(machine.appData, 0, 2)}</Json> */}
                <JsonTree
                  open={open}
                  setOpen={setOpen}
                  value={machine.appData}
                />
              </Box>
            </Collapse>
          </Stack>
        </>
      )}
    </>
  );
};

const PageTabs = ({ machine, value = 0, tabType = "pageTab" }) => {
  const tabs = [
    { label: "settings", icon: <Settings sx={{ width: 16, height: 16 }} /> },
    { label: "styles", icon: <Palette sx={{ width: 16, height: 16 }} /> },
    { label: "events", icon: <Bolt sx={{ width: 16, height: 16 }} /> },
    { label: "JSON", icon: <Code sx={{ width: 16, height: 16 }} /> },
  ].filter(tabType === "pageTab" ? Boolean : (f) => f.label !== "styles");
  if (!machine) {
    return <>Machine required to configure</>;
  }
  return (
    <TabList value={value} variant="scrollable">
      {tabs.map((tab, i) => (
        <TabButton
          key={tab.label}
          {...tab}
          iconPosition="end"
          onClick={() => machine.setContext(tabType, i)}
        />
      ))}
    </TabList>
  );
};

const PageEditor = (props) => {
  const [open, setOpen] = React.useState({});
  const { machine } = props;
  if (!machine.page) return <AppEditor {...props} />;

  const fields = [
    {
      title: "PageName",
      description: "Name of the page as it appears in the title bar.",
    },
    {
      title: "PagePath",
      description: "Path of the page as it appears in the address bar.",
    },
    {
      title: "pageID",
      alias: "Parent Page",
      description: "Parent of this page in the site hierarchy.",
      type: machine.appData.pages
        .filter((f) => f.ID !== machine.page.ID)
        .map((p) => ({
          value: p.ID,
          label: p.PageName,
        })),
    },
  ];

  const formProps = {
    fields,
    record: machine.page,
    disabled: !machine.state.can("update"),
    onChange: (field, value) => {
      machine.send({
        type: "update",
        field,
        value,
      });
    },
  };

  const eventProps = {
    componentEvents: "onPageLoad",
    pageID: machine.page.ID,
    events: machine.page.events,
    machine,
    title: (
      <>
        Events in <b>{machine.page.PageName}</b>
      </>
    ),
  };

  const expanded = Boolean(machine.columnsOpen & 2);
  return (
    <>
      <Flex baseline>
        {expanded && (
          <>
            <Flex>
              <TinyButton icon={Description} />
              <Typography>{machine.page.PageName}</Typography>
            </Flex>
            <Spacer />
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
          <IconPopover icon="Settings">
            <PageSettings machine={machine} />
          </IconPopover>
          <IconPopover icon="Palette">
            <ComponentStylesEditor
              {...props}
              bit={1 + 16 + 32 + 64}
              component={machine.page}
            />
          </IconPopover>
          <IconPopover icon="Bolt">
            <EventList {...eventProps} />
          </IconPopover>
          <MachineButton machine={machine} message="navigate" icon="Close" />
        </Stack>
      )}

      {expanded && (
        <>
          <Flex sx={{ mb: 2, pt: 1, borderBottom: 1, borderColor: "divider" }}>
            <PageTabs value={machine.pageTab} machine={props.machine} />
            <Spacer />
            <MachineButton machine={machine} message="navigate" icon="Close" />
          </Flex>
          <Stack direction="row">
            <TabBody in={machine.pageTab === 0}>
              <PageSettings machine={machine} />
            </TabBody>

            <TabBody in={machine.pageTab === 1}>
              <ComponentStylesEditor
                {...props}
                bit={1 + 16 + 32 + 64}
                component={machine.page}
              />
            </TabBody>

            <TabBody in={machine.pageTab === 2}>
              <EventList {...eventProps} />
            </TabBody>

            <TabBody in={machine.pageTab === 3}>
              <JsonTree open={open} setOpen={setOpen} value={machine.page} />
            </TabBody>
          </Stack>
        </>
      )}
    </>
  );
};

export default PageEditor;

function PageSettings({ machine }) {
  const pageProps = [
    {
      title: "PageName",
      description: "Name of the page as it appears in the title bar.",
    },
    {
      title: "PagePath",
      description: "Path of the page as it appears in the address bar.",
    },
    {
      title: "pageID",
      alias: "Parent Page",
      description: "Parent of this page in the site hierarchy.",
      type: machine.appData.pages
        .filter((f) => f.ID !== machine.page.ID)
        .map((p) => ({
          value: p.ID,
          label: p.PageName,
        })),
    },
  ];

  const formProps = {
    fields: pageProps,
    record: machine.page,
    disabled: !machine.state.can("update"),
    onChange: (field, value) => {
      machine.send({
        type: "update",
        field,
        value,
      });
    },
  };

  return (
    <>
      <CommonForm {...formProps} />

      <Flex sx={{ p: 1 }}>
        <Typography sx={{ textTransform: "capitalize" }} variant="caption">
          <b> parameters</b>
        </Typography>
        <Spacer />
        <TinyButton
          icon="Add"
          onClick={() => machine.send("add")}
          disabled={!machine.state.can("add")}
        />
      </Flex>

      {!machine.page.parameters && (
        <Warning>Page contains no parameters</Warning>
      )}

      <Collapse in={machine.state.can("ok")}>
        <Stack spacing={1}>
          <TextField
            size="small"
            onChange={(e) => {
              machine.send({
                type: "change",
                name: e.target.value,
              });
            }}
          />
          <Flex>
            <Button
              disabled={!!machine.state.context.name}
              onClick={() => machine.send("ok")}
            >
              cancel
            </Button>
            <Button
              disabled={!machine.state.context.name}
              variant="contained"
              onClick={() => machine.send("ok")}
            >
              ok
            </Button>
          </Flex>
        </Stack>
      </Collapse>

      {!!machine.page.parameters && (
        <Stack sx={{ m: 1 }}>
          <Typography variant="caption">
            Parameters to be passed into the page
          </Typography>

          {!(
            !!machine.page.parameters &&
            !!Object.keys(machine.page.parameters).length
          ) && <Warning>No parameters for {machine.page.PageName}.</Warning>}

          {Object.keys(machine.page.parameters).map((key) => (
            <TextField
              size="small"
              key={key}
              label={key}
              value={machine.page.parameters[key]}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        const parameters = {
                          ...machine.page.parameters,
                        };
                        delete parameters[key];
                        machine.send({
                          type: "update",
                          field: "parameters",
                          value: parameters,
                        });
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                machine.send({
                  type: "update",
                  field: "parameters",
                  value: {
                    ...machine.page.parameters,
                    [key]: e.target.value,
                  },
                });
              }}
            />
          ))}
        </Stack>
      )}
    </>
  );
}

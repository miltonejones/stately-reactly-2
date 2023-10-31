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
  Close,
  Code,
  Delete,
  Description,
  Save,
  Settings,
} from "@mui/icons-material";
import Spacer from "../../../styled/Spacer";
import { TinyButton } from "../../../styled/TinyButton";
import CommonForm from "../CommonForm/CommonForm";
import { TabList } from "../../../styled/TabList";
import { TabButton } from "../../../styled/TabButton";
import EventList from "../EventList/EventList";
import TabBody from "../../../styled/TabBody";
import Warning from "../../../styled/Warning";
import Json from "../../../styled/Json";

const fields = [
  {
    title: "PageName",
    description: "Name of the page as it appears in the title bar.",
  },
  {
    title: "PagePath",
    description: "Path of the page as it appears in the address bar.",
  },
];

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
    title: "Photo",
    description: "Icon to be used in the application manifest.",
  },
];

const AppEditor = (props) => {
  const { machine, component, handleSave } = props;
  if (!machine.appData) return <>no app</>;

  const formProps = {
    fields: appFields,
    record: machine.appData,
    disabled: false,
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
      <Flex baseline>
        <Flex>
          <TinyButton icon={Description} />
          <Typography>{machine.appData.Name}</Typography>
        </Flex>
        <Spacer />

        {/* <IconButton disabled={!machine.appData.dirty} onClick={handleSave}>
          <Save />
        </IconButton> */}
        <IconButton disabled>
          <Close />
        </IconButton>
      </Flex>
      <Flex sx={{ mb: 2, pt: 1, borderBottom: 1, borderColor: "divider" }}>
        <PageTabs machine={machine} value={machine.appTab} tabType="appTab" />
        <Spacer />
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
            <EventList
              componentEvents={"onApplicationLoad"}
              events={machine.appData.events}
              machine={machine}
              title={
                <>
                  Events in <b>{machine.appData.Name}</b>
                </>
              }
            />
          </Box>
        </Collapse>
        <Collapse orientation="horizontal" in={machine.appTab === 2}>
          <Box sx={{ width: "100%" }}>
            <Json>{JSON.stringify(machine.appData, 0, 2)}</Json>
          </Box>
        </Collapse>
      </Stack>
    </>
  );
};

const PageTabs = ({ machine, value = 0, tabType = "pageTab" }) => {
  const tabs = [
    { label: "settings", icon: <Settings sx={{ width: 16, height: 16 }} /> },
    { label: "events", icon: <Bolt sx={{ width: 16, height: 16 }} /> },
    { label: "JSON", icon: <Code sx={{ width: 16, height: 16 }} /> },
  ];
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
  const { machine, component, handleSave } = props;
  if (!machine.page) return <AppEditor {...props} />;

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

  return (
    <>
      <Flex baseline>
        <Flex>
          <TinyButton icon={Description} />
          <Typography>{machine.page.PageName}</Typography>
        </Flex>
        <Spacer />

        {/* <IconButton disabled={!machine.page.dirty} onClick={handleSave}>
          <Save />
        </IconButton> */}
        <IconButton onClick={() => machine.send("navigate")}>
          <Close />
        </IconButton>
      </Flex>
      <Flex sx={{ mb: 2, pt: 1, borderBottom: 1, borderColor: "divider" }}>
        <PageTabs value={machine.pageTab} machine={props.machine} />
        <Spacer />
      </Flex>
      <Stack direction="row">
        <TabBody in={machine.pageTab === 0}>
          <CommonForm {...formProps} />

          {!!machine.page.parameters && (
            <Stack>
              <Flex>
                <Typography
                  sx={{ textTransform: "capitalize" }}
                  variant="caption"
                >
                  <b> parameters</b>
                </Typography>
                <Spacer />
                <TinyButton
                  icon="Add"
                  onClick={() => machine.send("add")}
                  disabled={!machine.state.can("add")}
                />
              </Flex>
              <Typography variant="caption">
                Parameters to be passed into the page
              </Typography>

              {!(
                !!machine.page.parameters &&
                !!Object.keys(machine.page.parameters).length
              ) && (
                <Warning>No parameters for {machine.page.PageName}.</Warning>
              )}

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
                            const parameters = { ...machine.page.parameters };
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
            </Stack>
          )}
        </TabBody>

        <TabBody in={machine.pageTab === 1}>
          {" "}
          <EventList
            componentEvents={"onPageLoad"}
            pageID={machine.page.ID}
            events={machine.page.events}
            machine={machine}
            title={
              <>
                Events in <b>{machine.page.PageName}</b>
              </>
            }
          />
        </TabBody>

        <TabBody in={machine.pageTab === 2}>
          <Json>{JSON.stringify(machine.page, 0, 2)}</Json>
        </TabBody>
      </Stack>
    </>
  );
};

export default PageEditor;

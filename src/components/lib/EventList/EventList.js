import { Box, Button, Card, Chip, Stack, Typography } from "@mui/material";
import Flex from "../../../styled/Flex";
import Nowrap from "../../../styled/Nowrap";
import Spacer from "../../../styled/Spacer";
import { Add, ArrowBack, Close, Save } from "@mui/icons-material";
import { useEventEdit } from "../../../machines/eventEditMachine";
import SearchInput from "../../../styled/SearchInput";
import SetStateEdit from "./SetStateEdit";
import TabBody from "../../../styled/TabBody";
import EditBlock from "../../../styled/EditBlock";
import ScriptRunEdit from "./ScriptRunEdit";
import ModalOpenEdit from "./ModalOpenEdit";
import EventCard from "./EventCard";
import { TinyButton } from "../../../styled/TinyButton";
import DataExecEdit from "./DataExecEdit";
import PathOpenEdit from "./PathOpenEdit";
import StateBar from "../../../styled/StateBar";

const EventList = ({
  title,
  events,
  machine,
  pageID,
  componentID,
  resourceID,
  componentEvents,
  repeaterBindings,
}) => {
  const { applicationScripts, appData, page, modalTags, componentData } =
    machine;
  const editor = useEventEdit(
    (ID) => {
      machine.send({
        type: "drop event",
        ID,
        pageID,
        componentID,
        resourceID,
      });
    },
    (step, options) => {
      machine.send({
        type: "commit event action",
        step,
        ...options,
      });
    }
  );

  const configure = () => machine.send("configure style");
  if (!events) return <i />;

  const cardProps = {
    editor,
    applicationScripts,
    appData,
    page,
    modalTags,
    configure,
    supported: componentEvents || componentData?.Events,
    pageID,
    componentID,
    resourceID,
    repeaterBindings,
  };

  const upsert = () => {
    editor.send({
      type: "commit",
      step: editor.currentEvent,
      pageID,
      componentID,
      resourceID,
    });
  };

  const handlerEditors = {
    setState: SetStateEdit,
    scriptRun: ScriptRunEdit,
    modalOpen: ModalOpenEdit,
    dataExec: DataExecEdit,
    pathOpen: PathOpenEdit,
  };

  const EditForm = !editor.currentEvent
    ? null
    : handlerEditors[editor.currentEvent.action.type];
  // "setState", "dataExec", "scriptRun", "modalOpen"

  const actions = [
    {
      ID: "setState",
      name: "Set a client state value",
    },
    {
      ID: "dataExec",
      name: "Refresh data resource",
    },
    {
      ID: "scriptRun",
      name: "Run a script",
    },
    {
      ID: "modalOpen",
      name: "Open or close a modal component",
    },
    {
      ID: "pathOpen",
      name: "Open a path within the application",
    },
  ];

  const addEventHandler = () => {
    if (!cardProps.supported) return configure();
    editor.send({
      type: "create",
      supported: cardProps.supported,
    });
  };
  return (
    <Box>
      <Flex sx={{ p: 1 }}>
        {editor.state.can("close") && (
          <TinyButton icon={ArrowBack} onClick={() => editor.send("close")} />
        )}
        <Nowrap hover onClick={() => editor.send("close")} variant="body2">
          {title}
        </Nowrap>

        <Spacer />
        <Chip
          variant="outlined"
          color="primary"
          label="Add event handler"
          disabled={!editor.state.can("create")}
          onClick={addEventHandler}
          icon={<Add />}
          size="small"
        />
      </Flex>
      {/* {statePath(editor.state.value)} */}
      <StateBar state={editor.state} />
      {/* <Divider /> */}

      <Stack sx={{ p: 1 }} direction="row">
        <TabBody in={editor.state.can("cancel")}>
          <Card sx={{ p: 2 }}>
            Really delete item {editor.ID}
            <Flex spacing={1}>
              <Spacer />
              <Button onClick={() => editor.send("cancel")}>cancel</Button>
              <Button
                onClick={() => editor.send("confirm")}
                variant="contained"
                color="error"
              >
                delete
              </Button>
            </Flex>
          </Card>
        </TabBody>

        <TabBody in={editor.state.can("close")}>
          {!!editor.currentEvent && (
            <Stack spacing={1}>
              <Card sx={{ p: 2 }}>
                <Typography>
                  <b>Define Event handler</b>
                </Typography>
                <EditBlock
                  description="Name of the event that will trigger the selected action."
                  title="Event trigger"
                >
                  <SearchInput
                    label="Event trigger"
                    onChange={(e) => {
                      editor.send({
                        type: "set event trigger",
                        handler: e.target.value,
                      });
                    }}
                    options={editor.supported}
                    value={editor.currentEvent.event}
                  />
                </EditBlock>

                <EditBlock
                  description="Select which action will occur when the event fires."
                  title="Event action"
                >
                  <SearchInput
                    name="type"
                    onChange={(e) => {
                      editor.send({
                        type: "set event action",
                        name: e.target.name,
                        value: e.target.value,
                      });
                    }}
                    label="Event action"
                    field="name"
                    id="ID"
                    options={actions}
                    value={editor.currentEvent.action.type}
                  />
                </EditBlock>
              </Card>
              {!!EditForm && <EditForm {...cardProps} machine={machine} />}

              <Flex spacing={1}>
                <Spacer />
                <Button
                  size="small"
                  color="primary"
                  variant="outlined"
                  onClick={() => editor.send("close")}
                  endIcon={<Close />}
                >
                  Close
                </Button>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={upsert}
                  disabled={!editor.dirty}
                  endIcon={<Save />}
                >
                  Save
                </Button>
              </Flex>
            </Stack>
          )}
        </TabBody>

        <TabBody in={editor.state.can("open")}>
          <Stack spacing={1}>
            {!events.length && (
              <Flex>
                No events in this component.
                <Spacer />
                <Button
                  variant="contained"
                  onClick={addEventHandler}
                  startIcon={<Add />}
                >
                  add
                </Button>
              </Flex>
            )}
            {events.map((e) => (
              <EventCard key={e.ID} handler={e} {...cardProps} />
            ))}
          </Stack>
        </TabBody>
      </Stack>
    </Box>
  );
};

export default EventList;

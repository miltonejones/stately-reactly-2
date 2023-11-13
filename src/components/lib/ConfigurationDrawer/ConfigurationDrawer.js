import { Card, Divider, Typography, Stack } from "@mui/material";
import {
  Add,
  Close,
  CloseFullscreen,
  Delete,
  OpenInFull,
  Save,
  SortByAlpha,
} from "@mui/icons-material";
import { MachineButton, TinyButton } from "../../../styled/TinyButton";
import ChipMenu from "../../../styled/ChipMenu";
import AddModal from "../ComponentTree/AddModal";
import ClientStateDrawer from "./ClientStateDrawer";
import ClientScriptrawer from "./ClientScriptDrawer";
import ConnectionDrawer from "./ConnectionDrawer";
import Flex from "../../../styled/Flex";
import BacklessDrawer from "../../../styled/BacklessDrawer";
import DropModal from "../ComponentTree/DropModal";
import StateBar from "../../../styled/StateBar";

export default function ConfigurationDrawer({ machine }) {
  const submachine = machine.configMachines[machine.configurationType];
  if (!submachine) return <i />;

  const ConfigComponents = {
    clientState: ClientStateDrawer,
    clientScript: ClientScriptrawer,
    connection: ConnectionDrawer,
  };

  const ConfigComponent = ConfigComponents[machine.configurationType];
  const chipProps = ["page", "application"];

  const chipSx = {
    backgroundColor: (theme) => theme.palette.grey[400],
    borderRadius: (theme) => theme.spacing(2),
    padding: 0.25,
  };

  const menuProps = Object.keys(machine.configMachines).map((key, index) => ({
    label: machine.configMachines[key].machineName,
    icon: <TinyButton icon={machine.configMachines[key].icon} />,
    index,
    key,
  }));

  const toolbarBtn = {
    sort: {
      icon: SortByAlpha,
      props: {
        color: submachine.sortResults ? "primary" : "inherit",
      },
    },
    add: {
      icon: Add,
    },
    drop: {
      icon: Delete,
    },
    commit: {
      icon: Save,
      props: {
        disabled: !submachine.dirty,
      },
    },
    close: {
      icon: Close,
    },
    expand: {
      icon: submachine.expanded ? CloseFullscreen : OpenInFull,
    },
  };

  return (
    <>
      <DropModal machine={submachine} />
      <AddModal submachine={submachine} />
      <BacklessDrawer anchor="bottom" open={submachine.state.can("close")}>
        <Card>
          <Stack>
            {!!submachine && (
              <Flex sx={{ p: 1 }} spacing={1}>
                <Flex spacing={0.5} sx={chipSx}>
                  <ChipMenu
                    value={menuProps
                      .map((i) => i.key)
                      .indexOf(machine.configurationType)}
                    onChange={(i) => machine.configureApp(menuProps[i].key)}
                    options={menuProps}
                  />
                </Flex>

                {!!submachine.scope && (
                  <>
                    <Typography variant="caption">Scope</Typography>
                    <ChipMenu
                      value={chipProps.indexOf(submachine.scope)}
                      options={chipProps}
                      onChange={(value) => {
                        submachine.send({
                          type: "set scope",
                          scope: chipProps[value],
                        });
                      }}
                    />
                  </>
                )}

                <StateBar state={submachine.state} />
                {/* <Spacer
                  sx={{
                    backgroundColor: (theme) => theme.palette.grey[300],
                    borderRadius: 2,
                    p: (theme) => theme.spacing(0.5, 1),
                  }}
                >
                  <Typography variant="caption">
                    <b>State: </b> {statePath(submachine.state.value)}
                  </Typography>
                </Spacer> */}

                {/* {submachine.state.can("add") && (
                  <Chip
                    size="small"
                    color="success"
                    variant="outlined"
                    label={`Add ${
                      submachine.candidateType || submachine.machineName
                    }`}
                    icon={<Add />}
                  />
                )} */}

                {Object.keys(toolbarBtn)
                  .filter((btn) => submachine.state.can(btn))
                  .map((btn) => (
                    <MachineButton
                      icon={toolbarBtn[btn].icon}
                      machine={submachine}
                      message={btn}
                    />
                  ))}
              </Flex>
            )}
            <Divider />
            {!!submachine && !!ConfigComponent && (
              <ConfigComponent submachine={submachine} machine={machine} />
            )}
          </Stack>
        </Card>
      </BacklessDrawer>
    </>
  );
}

import React from "react";
import {
  Box,
  Button,
  Card,
  Collapse,
  Dialog,
  Divider,
  LinearProgress,
  Snackbar,
  Stack,
} from "@mui/material";
import Flex from "../../../styled/Flex";
import Spacer from "../../../styled/Spacer";
import Nowrap from "../../../styled/Nowrap";
import statePath from "../../../util/statePath";
import { StateTree } from "../StateTree/StateTree";
import ChipMenu from "../../../styled/ChipMenu";
import { TabList } from "../../../styled/TabList";
import { TabButton } from "../../../styled/TabButton";
import Json from "../../../styled/Json";
import { useCode } from "../../../machines/codeMachine";
import { TinyButton } from "../../../styled/TinyButton";
import CodeModal from "./CodeModal";
import { Code, ExpandLess, ExpandMore, Info } from "@mui/icons-material";

export default function MachineDebugger({ machines }) {
  const [info, setInfo] = React.useState("");
  const [state, setState] = React.useState("");
  const [show, setShow] = React.useState(false);

  const coder = useCode();

  const machineKeys = Object.keys(machines);
  const actor = machines[state];

  const controls = [
    {
      icon: <Info />,
      label: "Info",
      onClick: () => setInfo(state),
    },
    {
      label: "Actions",
      icon: <Code />,
      disabled: !actor?.actions,
      onClick: () =>
        coder.send({
          type: "load",
          actions: actor.actions,
        }),
    },
    {
      label: show ? "Collapse" : "Expand",
      icon: !show ? <ExpandMore /> : <ExpandLess />,
      onClick: () => setShow(!show),
    },
  ];

  return (
    <>
      {!!coder.machineActions && <CodeModal name={state} coder={coder} />}

      <Dialog open={!!info} onClose={() => setInfo("")}>
        <Box sx={{ p: 2, height: 480, overflow: "auto" }}>
          {!!machines[info] && (
            <StateTree
              root
              machine={{
                ...machines[info],
                id: state,
              }}
            />
          )}
        </Box>
      </Dialog>
      <Snackbar open={!coder.state.can("close") && !info}>
        <Card sx={{ p: 1, minWidth: 400, maxWidth: 700 }}>
          <Stack spacing={1}>
            <Flex spacing={1}>
              <ChipMenu
                limit={3}
                onChange={(val) => setState(machineKeys[val])}
                options={machineKeys}
                value={machineKeys.indexOf(state)}
              />
              {!!state && (
                <>
                  <ChipMenu value={2} options={controls} />
                </>
              )}
            </Flex>

            {!!state && <StatePanel show={show} attr={actor} />}
          </Stack>
        </Card>
      </Snackbar>
    </>
  );
}

function StatePanel({ attr, show }) {
  const { state, send } = attr;
  const [pre, setPre] = React.useState(null);
  const activities = state.nextEvents.filter((name) => name.indexOf(".") > 0);
  return (
    <>
      <Dialog open={!!pre}>
        <Stack sx={{ p: 2 }}>
          <Box sx={{ width: 400, height: 400, overflow: "auto" }}>
            <Json>{JSON.stringify(pre, 0, 2)}</Json>
          </Box>
          <Flex>
            <Spacer />
            <Button onClick={() => setPre(null)}>Close</Button>
          </Flex>
        </Stack>
      </Dialog>
      <Divider />
      <Collapse in={show}>
        <Box sx={{ maxHeight: 400, overflow: "auto" }}>
          {Object.keys(state.context).map((key) => (
            <Flex sx={{ mb: 1 }}>
              <Nowrap variant="subtitle2">{key}</Nowrap>
              <Spacer />
              <Nowrap
                hover
                onClick={() => setPre(state.context[key])}
                variant="caption"
                width={300}
              >
                {JSON.stringify(state.context[key])}
              </Nowrap>
            </Flex>
          ))}
        </Box>
      </Collapse>
      {/* <pre>{JSON.stringify(Object.keys(attr.actions), 0, 1)}</pre> */}
      <Nowrap variant="caption">
        Events in <b>{statePath(state.value)}</b> state:
      </Nowrap>
      {!!activities.length && (
        <Stack spacing={1}>
          <Nowrap variant="subtitle2">Invoking actions</Nowrap>
          {activities.map((activity) => (
            <Nowrap variant="caption">{activity}</Nowrap>
          ))}
          <LinearProgress />
        </Stack>
      )}

      <TabList variant="scrollable">
        {state.nextEvents
          .filter((name) => name.indexOf(".") < 0)
          .map((eventName) => (
            <TabButton
              onClick={() => send(eventName)}
              key={eventName}
              label={eventName}
              size="small"
              variant="outlined"
            />
          ))}
      </TabList>
    </>
  );
}

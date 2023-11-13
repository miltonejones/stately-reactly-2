import React from "react";
import {
  Button,
  Card,
  Collapse,
  Link,
  Snackbar,
  Stack,
  Typography,
  Switch,
} from "@mui/material";
import Flex from "../../../styled/Flex";
import Spacer from "../../../styled/Spacer";
import { TinyButton } from "../../../styled/TinyButton";
import statePath from "../../../util/statePath";
import { TabList } from "../../../styled/TabList";
import { TabButton } from "../../../styled/TabButton";
import TabBody from "../../../styled/TabBody";
import Json from "../../../styled/Json";

export default function InvokeErrorModal({ invoker }) {
  const [open, setOpen] = React.useState(false);
  const [tab, setTab] = React.useState(0);
  const { currentEvent } = invoker;
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={!invoker.state.can("load")}
      >
        <Card sx={{ p: 2, width: 400 }}>
          {" "}
          <Flex>
            {!!currentEvent && (
              <Typography variant="subtitle2">
                Invoking event "{currentEvent.event} 🡒{" "}
                {currentEvent.action.type}"
              </Typography>
            )}
            <Spacer />
            <TinyButton icon="Close" onClick={() => invoker.send("cancel")} />
          </Flex>
          <Typography variant="caption">
            <b>State:</b> {statePath(invoker.state.value)}
          </Typography>
        </Card>
      </Snackbar>
      <Snackbar open={invoker.state.can("recover")}>
        <Card>
          <TabList value={tab} variant="scrollable">
            <TabButton
              label="Event"
              onClick={() => setTab(0)}
              iconPosition="end"
            />
            <TabButton
              label="History"
              onClick={() => setTab(1)}
              iconPosition="end"
            />
            {!!invoker.script && (
              <TabButton
                label="Code"
                onClick={() => setTab(2)}
                iconPosition="end"
              />
            )}
          </TabList>
          <Stack sx={{ p: 2, width: 400 }} spacing={1}>
            <Flex>
              {!!currentEvent && (
                <Typography variant="subtitle2">
                  Error invoking event "{currentEvent.event} 🡒{" "}
                  {currentEvent.action.type}"
                </Typography>
              )}
              <Spacer />
              <TinyButton icon="Close" onClick={() => invoker.send("cancel")} />
            </Flex>

            <Stack direction="row">
              <TabBody in={tab === 2}>
                {!!invoker.script && (
                  <Stack sx={{ height: 300, overflow: "auto" }}>
                    <Typography>
                      {invoker.script.page}.{invoker.script.name}
                    </Typography>
                    <pre>{invoker.script.code}</pre>
                  </Stack>
                )}
              </TabBody>
              <TabBody in={tab === 1}>
                <Stack sx={{ height: 300, overflow: "auto" }}>
                  <pre>{JSON.stringify(invoker.memory, 0, 2)}</pre>
                </Stack>
              </TabBody>
              <TabBody in={tab === 0}>
                <Json>{JSON.stringify(invoker.currentEvent, 0, 2)}</Json>
              </TabBody>
            </Stack>

            <pre>
              {" "}
              Current index: {JSON.stringify(
                invoker.event_index + 1,
                0,
                2
              )} of {invoker.events.length}
            </pre>

            <Typography variant="body2">
              {invoker.error}{" "}
              <Link
                underline="hover"
                sx={{ cursor: "pointer" }}
                variant="caption"
                onClick={() => setOpen(!open)}
              >
                stack
              </Link>
            </Typography>

            <Typography variant="caption">
              <b>State:</b> {statePath(invoker.state.value)}
            </Typography>
            <Collapse in={open}>
              <Typography variant="caption" color="text.secondary">
                {invoker.stack}
              </Typography>
            </Collapse>

            <Flex>
              <Switch
                size="small"
                color="error"
                checked={invoker.ignore}
                onChange={(e) =>
                  invoker.send({
                    type: "toggle",
                    ignore: e.target.checked,
                  })
                }
              />{" "}
              Ignore future errors
              <Spacer />
              <Button onClick={() => invoker.send("cancel")}>cancel</Button>
              <Button
                variant="contained"
                onClick={() => invoker.send("recover")}
              >
                next
              </Button>
            </Flex>
          </Stack>
        </Card>
      </Snackbar>
    </>
  );
}

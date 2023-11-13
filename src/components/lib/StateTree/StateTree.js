import { Box, Stack, styled } from "@mui/material";
import Nowrap from "../../../styled/Nowrap";

const Li = styled(Box)(({ theme, offset }) => ({
  marginLeft: theme.spacing(offset),
}));

const capitalize = (str) => str?.replace(/_/g, " ");

export const StateTree = ({ machine, root, offset = 0 }) => {
  const stateKeys = machine.states;
  const eventKeys = !machine.on ? [] : Object.keys(machine.on);
  console.log({ machine: machine.machine });

  const { initial } = machine.machine ?? {};

  return (
    <Li offset={offset}>
      {!root && (
        <Stack sx={{ mb: 2 }}>
          <Nowrap wrap>
            <b>{machine.key}</b>: {machine.description}
          </Nowrap>
          <Nowrap small muted>
            Path: {machine.id}
          </Nowrap>

          {!!machine.onEntry?.length &&
            machine.onEntry
              .filter((entry) => entry.type?.indexOf(".") < 0)
              .map((entry) => (
                <Nowrap small>
                  Entry action: "<b>{entry.type}</b>"
                </Nowrap>
              ))}

          {!!machine.invoke?.length &&
            machine.invoke.map((invoke) => (
              <Nowrap small>
                Invokes service method: "<b>{invoke.src}</b>"
              </Nowrap>
            ))}
        </Stack>
      )}

      {!!root && (
        <Stack sx={{ mb: 2, mt: 2 }}>
          <Nowrap
            sx={{
              textTransform: "capitalize",
            }}
            variant="h6"
            wrap
          >
            <b>{capitalize(machine.id)}</b>
          </Nowrap>
          <Nowrap small muted>
            Machine ID: {machine.id}
          </Nowrap>
          <Nowrap small muted>
            Initial state: <b>{initial}</b>
          </Nowrap>
          <Nowrap wrap>{machine.description}</Nowrap>
        </Stack>
      )}

      {!!eventKeys.length && (
        <Box sx={{ mt: 1, ml: offset + 1 }}>
          <Stack sx={{ mb: 1 }}>
            <Nowrap color="info" bold variant="subtitle2">
              Events in "{machine.id}"
            </Nowrap>
            <Nowrap>
              The "{machine.key}" state supports the following events
            </Nowrap>
          </Stack>

          <Box sx={{ mb: 1 }}>
            {eventKeys.map((s) => (
              <Li>
                <Stack sx={{ mb: 2 }}>
                  <Nowrap bold>{s}</Nowrap>
                  {machine.on[s].map((act) => (
                    <Box sx={{ mb: 1 }}>
                      <Nowrap small muted>
                        Path: {act.event}
                      </Nowrap>
                      {!!act.cond && (
                        <Nowrap small color="error">
                          Condition: {act.cond?.name}
                        </Nowrap>
                      )}
                      {!!act.target?.length && (
                        <Nowrap muted small>
                          Destination:{" "}
                          {act.target.map((act) => (
                            <>
                              "<b>{JSON.stringify(act.id)}</b>"
                            </>
                          ))}
                        </Nowrap>
                      )}
                      {!!act.actions?.length && (
                        <Nowrap small>
                          Invokes machine action:{" "}
                          {act.actions.map((act) => (
                            <>
                              "<b>{act.type}</b>"
                            </>
                          ))}
                        </Nowrap>
                      )}
                      <Nowrap sx={{ mt: 1 }}>{act.description}</Nowrap>
                    </Box>
                  ))}
                </Stack>
              </Li>
            ))}
          </Box>
        </Box>
      )}

      {!!Object.keys(stateKeys).length && (
        <Box sx={{ mt: 1, ml: offset }}>
          <Stack sx={{ mb: 1 }}>
            <Nowrap bold color="info" variant="subtitle2">
              States in "{machine.id}"
            </Nowrap>
            {/* <Nowrap>
              The "{machine.key}" {root ? "state machine" : "state"} has these
              child states
            </Nowrap> */}
          </Stack>

          {Object.keys(stateKeys).map((s) => (
            <StateTree key={s} offset={offset + 1} machine={stateKeys[s]} />
          ))}
        </Box>
      )}
    </Li>
  );
};

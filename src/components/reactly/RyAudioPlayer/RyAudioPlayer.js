import React from "react";
import { PauseCircle, PlayCircle, VolumeOff } from "@mui/icons-material";
import { Box, Chip } from "@mui/material";
import Nowrap from "../../../styled/Nowrap";
import Flex from "../../../styled/Flex";
import { useAudio } from "../../../machines/audioMachine";
import StateBar from "../../../styled/StateBar";

export const RyAudioPlayer = ({
  src,
  register,
  invokeEvent,
  children,
  debug,
  ...props
}) => {
  const machine = useAudio(invokeEvent);

  const PAUSE_STATE = "active.pause player";

  React.useEffect(() => {
    machine.send({
      type: "set source",
      src,
    });
  }, [src]);

  React.useEffect(() => {
    console.log("Registering audio player");
    register({
      ref: null,
      paused: machine.state.matches(PAUSE_STATE),
      stop: () => machine.send("stop"),
      play: () => machine.send("play"),
      seek: (value) =>
        machine.send({
          type: "seek",
          value,
        }),
      pause: () => machine.send("pause"),
    });

    machine.send("init");
  }, []);
  const chipProps = {
    variant: "filled",
    color: "primary",
    size: "small",
    sx: { m: 1 },
  };
  return (
    <Box {...props}>
      {children}
      {!!debug && <StateBar state={machine.state} />}
      {!!debug && (
        <Flex>
          <Chip
            label="AudioPlayer"
            variant="filled"
            color="success"
            size="small"
            sx={{ m: 1 }}
            icon={<VolumeOff />}
          />

          {!!src && (
            <Flex>
              <Nowrap width={500} variant="caption">
                src - {machine.source}
              </Nowrap>

              <Chip
                label="pause"
                disabled={!machine.state.can("pause")}
                {...chipProps}
                onClick={(e) => {
                  machine.send("pause");
                }}
                icon={<PauseCircle />}
              />
              <Chip
                label="play"
                disabled={machine.state.can("pause")}
                {...chipProps}
                onClick={(e) => {
                  machine.send("play");
                }}
                icon={<PlayCircle />}
              />
            </Flex>
          )}
        </Flex>
      )}
    </Box>
  );
};

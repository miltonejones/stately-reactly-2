import React from "react";
import { PauseCircle, VolumeOff } from "@mui/icons-material";
import { Chip } from "@mui/material";
import Nowrap from "../../../styled/Nowrap";
import moment from "moment";
import Flex from "../../../styled/Flex";

export const RyAudioPlayer = ({ src, register, invokeEvent, ...props }) => {
  const ref = React.useRef();
  React.useEffect(() => {
    register({
      ref,
      play: () => {
        try {
          console.log("Play was requested");
          //  ref.current.play();
        } catch (ex) {
          console.log("Error occured %c%s", ex.message);
        }
      },
      pause: () => ref.current.pause(),
    });

    const loadAudio = (audio) => {
      // audio.addEventListener("play", (event) => {
      //   invokeEvent(event, "onPlayerStart", {});
      //   console.log("%cPLAY", "color: yellow;text-transform: capitalize");
      // });

      audio.addEventListener("pause", (event) => {
        invokeEvent(event, "onPlayerStop", {});
        console.log("%cpause", "color: yellow;text-transform: capitalize");
      });

      audio.addEventListener("ended", (event) => {
        console.log("%cended", "color: yellow;text-transform: capitalize");
        invokeEvent(event, "onPlayerEnded", {});
      });

      ["abort", "stalled", "suspend", "error"].map((type) => {
        audio.addEventListener(type, () => {
          console.log(
            "%cerror",
            "color: yellow;text-transform: capitalize",
            type
          );
        });
      });

      audio.addEventListener("timeupdate", (event) => {
        invokeEvent(event, "onProgress", {
          type: "PROGRESS",
          currentTime: audio.currentTime,
          duration: audio.duration,
          progress: 100 * (audio.currentTime / audio.duration),
          current_time_formatted: moment(audio.currentTime * 1000).format(
            "mm:ss"
          ),
        });
      });

      return audio;
    };

    loadAudio(ref.current);
  }, []);
  return (
    <Flex>
      <Chip
        label="AudioPlayer"
        variant="filled"
        color="success"
        size="small"
        sx={{ m: 1 }}
        icon={<VolumeOff />}
      />
      <audio src={src} autoPlay ref={ref}>
        {/* <source src={src} type="audio/mpeg" />
        Your browser does not support the audio element. */}
      </audio>
      {!!src && (
        <Flex>
          <Nowrap width={500} variant="caption">
            src: {src}
          </Nowrap>

          <Chip
            label="pause"
            variant="filled"
            color="primary"
            size="small"
            sx={{ m: 1 }}
            onClick={(e) => {
              ref.current.pause();
              invokeEvent(e, "onPlayerStop", {});
            }}
            icon={<PauseCircle />}
          />
        </Flex>
      )}
    </Flex>
  );
};

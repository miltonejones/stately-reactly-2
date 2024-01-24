import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
import moment from "moment";
import React from "react";
const audioMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEMCuECWB7AxLMALgASxaoBOAxmANoAMAuoqAA5awYHYB2zIAHogBMAFgBsAOjoB2IQGZZIoXQCsdABxyhAGhABPRAFoRARhMSxATi0n1J6SrUKAvs91pMufGADW9JkggbBxcWLyBgghmWhLSJkKKKlZyWnK6BghydEISdvFCYnJi6pbS0iKu7ujYEhgQADZgOCz1yHr+fMGcPHyRBdISQpZ0w1lCKlqW6iLpRmW5dGIqdgpC6tIy0pUgHjV1jRJgALYsBHo4EGFgtdwAblg+17tYtQ3Xx6d6CBh3WJTIoW4-g6gS6gN6Ri0OWklhMw3EdmkxR0+kQ4gksOk00cjhE6iEohU22erwO5DAyAgeiIBCwRBabWaaHwINY7G6YQhCBUlkk5S0eMsEzhslmCCEJhEUjkJjo9ksIkWohMxOqL1gBGQ5GIDL0YHIFyuN3ujwkJI1Wp1rT15G+v3+gOBjE67PBEUQ6jodAswzEhVUmgJaVRCHxuTiXpMKhEWUc6nUqs8ZsoXFu111PygN3p5CwUHJsFgeFpLFZQVdPXdUVKg2slksyrEEo0MxDkvRDZkdgm6mjckTNWQKYwaYkGe4WZ+ObzBaLLGZtGdoIrnKrYijEhlJjEi00Mlh6jFZjhm+SsLk8Z52QHLyHqfT1szEm8Pkzhu41x+JqeauT97Hj4Ts+YC+Jmdr3A6PBOgEbIhJWoCRGU3obMs1gTFi0Yohk7bqBISgaGoJQqA4lg3n+I7pguEDNNaZZgvBAiIPWkjrJ2dDiDysImGKmiSOI0gykUYgxtkCZuDsv53hRY4LvS1r6u+n6-KaJJSaO86oPgcltPq4F-ACUGMHRK7hAhiBYpYm5lDK-JiDC4xirI5hOOxFlYsoYlVEmanXAWqBHGA2k2opxoPD+3nDqOfkBUFulfvpjpGUusEcqZjEIKUkjZA4TYiDyIjlIebYmDKFhekokpxPWIgVOJJL1FglKxeQJBkFQTSXB+oUqb+DVNbq+qtRQ1B6ZBYTQS6cGrmZCBNuYsgqPIwyOCVDhioY0wSDy0aKn6BXyCVZGUI0WrNSF8U9Umx0Ui1A22vFY1AklMHllNaWRIYMq4cieJqCVkqOI5GxSPixRxH6SI8q44ncFgEBwHwzyTalXLGOMUjDAkciLZ6tiSutaxSttHEBjCKRkfsYDI26M2ffMIzZdjaxynYrYZIYIoY32hRrPIEMU28hwnGc1MMR9kwY4zOMs-jIYcyMW1CoqJFIp6qgC2SFJUjSdK6qL03pZ9J7RryvblFVgMhsoUp+nQWQyCkIhCnbZEWtqzX6+95nrBItiEyV67oUV7OypZxOiOoVjiDKYhkT5ntck75jTFMBRXtYAnSGKO6WV6WSenl8YaEIceRQ+bSZgnVYTJZKeg+nChs4g-05DycISlGMqE6X-7jpO3DTvmcDwMub1cssAx12nwwZ03UQ1ZInZYp3vYxj30l98BoETlXM3HnIW0jPWyyN7IWHN4q3ojHCRRKAUUax3VkllzJmmQLv6VTFf7HxIReKqHPWQ38hgYV2uxUiT8Iq91kndD+kRlg5GyBHMGMZSjB0QFYSQLkCjCTMIUdeUU4D+UCrA0eKMqxChyLYYoCowZJAbGKawUosSFBqsRbEj8vI1D6hAZqQ12pwLRNuaU546wILkDVdaodFaYTxFHQo9gjonVuvJcggiECfTkLnO+xQ7LKHXNxNsysLAbDsASLinoiTQyAA */
    id: "audio",

    initial: "idle",

    states: {
      idle: {
        states: {
          empty: {
            invoke: {
              src: "initialize",
              onDone: [
                {
                  target: "ready to play",

                  actions: ["assignPlayer"],

                  // cond: "no source is loaded",
                },
                // "#audio.start player",
              ],
            },
          },

          "ready to play": {
            on: {
              pause: "#audio.active.pause player",
            },

            description: `Machine may end up in this state from component refresh even if track is playing`,
          },
        },

        initial: "empty",

        on: {
          play: "load player source",
        },
      },

      "start player": {
        invoke: {
          src: "play",
          onDone: "active",
        },
      },

      active: {
        states: {
          playing: {
            states: {
              "in progress": {
                on: {
                  stop: {
                    target: "#audio.clear player",
                    // actions: assign(() => {
                    //   alert("Moving to stop " + audio.currentTime);
                    // }),
                  },

                  pause: "#audio.active.pause player",
                },
              },

              seeking: {
                invoke: {
                  src: "seek",
                  onDone: "in progress",
                },
              },
            },

            initial: "in progress",
          },

          paused: {
            on: {
              play: "resume player",
            },
          },

          "pause player": {
            invoke: {
              src: "pause",
              onDone: "paused",
            },
          },

          "resume player": {
            invoke: {
              src: "play",
              onDone: "playing",
            },
          },
        },

        initial: "playing",
      },

      "load player source": {
        invoke: {
          src: "load",
          onDone: "start player",
        },
      },

      "clear player": {
        invoke: {
          src: "reset",
          onDone: {
            target: "idle.ready to play",
            actions: "assignReset",
          },
        },

        description: `Pause and reset player for next track`,
      },
    },

    on: {
      "set source": {
        target: "#audio",
        internal: true,
        actions: "assignSource",
      },

      seek: {
        target: ".active.playing.seeking",
        actions: "assignSeek",
      },
    },
  },
  {
    guards: {
      "no source is loaded": (context) => !context.source,
    },
    actions: {
      assignPlayer: assign((_, event) => ({
        player: event.ref,
      })),
      assignSeek: assign((_, event) => ({
        seekValue: event.value,
      })),
      assignReset: assign((_, event) => ({
        source: null,
      })),
      assignSource: assign((_, event) => {
        return {
          source: event.src,
        };
      }),
    },
  }
);
const audio = new Audio();
export const useAudio = (invokeEvent) => {
  const [state, send] = useMachine(audioMachine, {
    services: {
      reset: async () => {
        invokeEvent(null, "onPlayerEnded", {});
        audio.currentTime = 0;
      },
      load: async (context) => {
        audio.src = context.source;
      },
      play: async () => {
        audio.play();
      },
      pause: async () => {
        invokeEvent({}, "onPlayerStop", {});
        audio.pause();
      },
      seek: async (context) => {
        const currentTime = audio.duration * context.seekValue;
        audio.currentTime = currentTime;
      },
      initialize: async (context) => {
        if (context.player) return;
        return loadAudio(audio, invokeEvent);
      },
    },
  });
  const loadAudio = (audio, invokeEvent) => {
    // Remove existing event listeners
    // audio.removeEventListener("play", handlePlay);
    // audio.removeEventListener("pause", handlePause);
    // audio.removeEventListener("ended", handleEnded);
    // audio.removeEventListener("abort", handleError);
    // audio.removeEventListener("stalled", handleError);
    // audio.removeEventListener("suspend", handleError);
    // audio.removeEventListener("error", handleError);
    // audio.removeEventListener("timeupdate", handleTimeUpdate);

    // Add new event listeners
    // audio.addEventListener("play", handlePlay);
    audio.onplay = handlePlay;
    audio.onpause = handlePause;
    audio.onended = handleEnded;
    audio.onabort = handleError;
    audio.onstalled = handleError;
    audio.onsuspend = handleError;
    audio.onerror = handleError;
    audio.ontimeupdate = handleTimeUpdate;
    // audio.addEventListener("pause", handlePause);
    // audio.addEventListener("ended", handleEnded);
    // audio.addEventListener("abort", handleError);
    // audio.addEventListener("stalled", handleError);
    // audio.addEventListener("suspend", handleError);
    // audio.addEventListener("error", handleError);
    // audio.addEventListener("timeupdate", handleTimeUpdate);

    function handlePlay(event) {
      console.log(
        "%cstart",
        "color: magenta;border:dotted 1px red;text-transform: capitalize"
      );
      invokeEvent(event, "onPlayerStart", {});
    }

    function handlePause(event) {
      console.log("%cpause", "color: yellow;text-transform: capitalize");
    }

    function handleEnded(event) {
      console.log(
        "%cended",
        "color: yellow;text-transform: capitalize",
        audio.currentTime
      );
      audio.currentTime > 2 && send("stop");
    }

    function handleError(event) {
      console.log(
        "%cerror",
        "color: yellow;text-transform: capitalize",
        event.type
      );
    }

    function handleTimeUpdate(event) {
      invokeEvent(event, "onProgress", {
        type: "PROGRESS",
        currentTime: audio.currentTime,
        duration: audio.duration,
        progress: 100 * (audio.currentTime / audio.duration),
        current_time_formatted: moment(audio.currentTime * 1000).format(
          "mm:ss"
        ),
      });
    }

    return audio;
  };

  return {
    state,
    send,
    ...state.context,
    states: audioMachine.states,
  };
};

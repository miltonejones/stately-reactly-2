import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
import moment from "moment";
import React from "react";
const audioMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEMCuECWB7AxLMALgASxaoBOAxmANoAMAuoqAA5awYHYB2zIAHogBMAZgAsAOgBsQqQA4AjAoCcUgOwaArGrkAaEAE9EAWhFS6EhXMWqFIuULpqxAXxf60mXPjABrekxIIGwcXFi8QYIISiJCEmoKQmpCYppSyiKxIvpGCCJ0cYqJsmZyyhqu7iCe2BIYEAA2YDgsDcgGAXwhnDx8UbJqEkLKdCP5QpqxynJiOSYaEnJ0UpqKIslyak5qbh7otfVNEmAAtiwEBjgQ4WB13ABuWL63NVh1jben5wYIGA9YlGQYW4AU6QW6wL6JlicTUyhUdDE8gUankQjmCCREnhOlSmnxYgcKU0u2q+zeh1u5DAyAgBiIBCwRFa7RaaHwYNY7B64ShCE0qniYlihOUkxUyQxQgUkjoIgUdBRyjEyxSClJrwksAIyHIxBZBjA5CuNzuj2eEk12t1+rahvIv3+gOBoMYXW5kMiiCWFnSyyk+VWMOyhm9hQSdEVmmFdHx1g15MtlC491uBr+UDuzPIWCg1NgsDwjJYnOCHt6Xv5UmxImjW0R6gF5k0GJlKUsyuJYoUUiklT2XiTKbTdozWZYObzcELLHZtDd4PLvMrUgUmgk8p7yzk+ThVlbSmUG-SInh9jkAoKCcHyGTGFTEnT3EzPl8GZN3Fuf3NL0Tt+Hj6js+WpgH4GaOo8zo8K6gRcqEFagFEGgWFsqwZJMOjRuiobRGIhISGIjgXnQZTaAK161P+95pnOEAtHapYQghAiIMogqbMojgNgK8IKBiO7VkiajymYfbjHIFFvFRD6zqg+DMnaRofl+-wWpq0k0XJYAKe0RoQQCQLQYwjFLhEiGIDoR7rMJKLCuonEtjhyQKBImhyoilk6ERklDtREj5qgJzaQaSnXJ+ZpPL+N53g+AVBTp9r6VB4Qwe68HLuZCDlNWBRqGkXZiM4eg4TELnmIi0qFSoyr9mSg4NFgtIJUaJBkFQzRhSpP6WomDVNSF5CtRQ1BJYZKXGQucE8mZLEIDILnJJoogjPidh5RixgzK5Yp4f6hWiHYPmUE0urNcanURWpibHTSg0DaNLoTbBZbpTNUSmFY0gOISbl2DK+IYshEgkbImw9uoKzKG4VTcFgEBwHwrxpdNfLGHh66JJGiKxO5kazDhxgpCh0z4pufZLasPmUsjnqZaY5SWFx2OOPkeMbWuIhDCT6iJLEfbqlUmqUscZwXDTzHveIR6Y3jOOs4iG0rPEJNmE2ZS9gLA4HB8-k0nSDJMga4sZbNH1HtGqgXs4CRio5uSOJIva48JUtuSIPnWnqZ3G29FmbJYDgzHYq4YcVuTGAq5s7SkcjpEi8pSD5Gk+3yYjwosacOJDozrOsGLmEekb5MRSg6MkScxSO7QZinlaTEeMzTLIl4ZM4rbynEApWCimRwmUtXqZXgHV8BfzZrm+bwIur18qsgyN1nLfrPjuQylinFOIokwXsKFcAU+L6gW+z615lSh2K5oxsUG1tCNhq8qhYowqGYhGyGuieC3+Q+yfgECn7NaYT9ESJDcjMJY0ZAaOGBgUcoO9liIihl-aK+85ze2nijOuDhgZ30JPIZwp4dD50FG7AovYxBKADHvPycVgqKXIAAqIYo4hWHkMqfBaROIYgyJIHQAZ0a4jSD5PqEAzpDXaowxAFCcqnjsBkMUDhxArxMJHbaWE8HsPlDsZBtQbqnQGpIhAphTzAzfvIdQjhVx8RKiqQY6gSLFF4hA6GLggA */
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

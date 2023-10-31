import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
const swapMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SwO4EMAOA6AlhANmAMQ4B2OALgNoAMAuoqBgPayU7OmMgAeiAtAHZBWAJzjRAVgBs0gEzSAjIrkBmSQBoQATwEAOGljkLJgtXtUAWeXMEBfO1tSYsAJzBoI2os4y0GSCAsbBQcXIF8CMqWWEp6ipZqqsZyilq6UYlGqoI0KoKiBmY0lg5O6Ni+GGRQRDywFGgUYFhoAGbNrgAUkjR9AJQ+FVhVNf7cweyc3JHqeljCcpIKJYqyspo6AoLzZtKmqmuWigY0cg6OIKTMEHDcvhOsU+GgkfwqkmISMvJKKurpARrER7GR6OQ0QpSVTSMogXy4AhgR4hMIzATSeaWUSpSR6SxWcHxPSAqLSGKiaTqcmqdRyPTCUqXBHuTwZJhPULTCKIRTqLCSSSWQSqGgM1R6Bn7Un8UwCvp5Sx6cR46SCSySOEI0akKAo57ohDqEQ0HZ9GR84WQ6Sko5iKkyAl0hnqi52IA */
    id: "swap",
    initial: "idle",
    context: {
      mainPic: null,
      swapPic: null,
    },
    states: {
      idle: {
        on: {
          init: {
            target: "ready",
            actions: "assignMain",
          },
        },
      },

      ready: {
        on: {
          swap: {
            target: "swapping",
            actions: "assignSwap",
          },
        },
      },

      swapping: {
        after: {
          5000: {
            target: "ready",
            actions: "resetSwap",
          },
        },
      },
    },
  },
  {
    actions: {
      assignMain: assign((_, event) => ({
        mainPic: event.pic,
      })),
      assignSwap: assign((_, event) => ({
        swapPic: event.pic,
      })),
      resetSwap: assign((context) => ({
        mainPic: context.swapPic,
        swapPic: null,
      })),
    },
  }
);

export const useImageSwap = () => {
  const [state, send] = useMachine(swapMachine);

  return {
    state,
    send,
    ...state.context,
    states: swapMachine.states,
  };
};

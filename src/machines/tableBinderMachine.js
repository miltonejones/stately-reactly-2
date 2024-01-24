import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
import { binderActions } from "./actions/binder";
const tableBinderMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBcCGAjANmAQgSwDsIwAnAOjwmwGJMB7VCAbQAYBdRUABztj2Tx0CnEAA9EAFgBMEsiwCMU+QDYAHPICcG5QHYdAVgA0IAJ6IpZKco0SJqlspYGp+gMzSAvh+NosuQsTklDT0jEzyHEggPHwCQiLiCBKuqmSuMhr6Klks6ixGpojy+hYaUrmuZfKqLhLyEl4+GNj4RKRkJGCMJtQAjgCu-KyR3Lz8gsJRiXYsZDOa9a7W6brGZggAtErKZG4OrtU61hIsDd4gvi0B7Z3dZAC2qIQABLAAxp1gBNTIdFBQ2GeADM8GBMMx2CIYuN4lNEBpXDo5nodOkbK4WNo1og3Bpdk4sgiJG5bFJGhdmv42uRbhATA8ngRXh8wF9qKhMHhULBhlCxnFJqBEopHGQNKpdCpEVJXPp9BpsQhcfiDJp3CTPOdLlTAh0unSGS93p9vpAhpCotCBQkisoZGRHMpZVZii5XIrbPJLLp0lJVIjVBINDpydrWrrafTHkaWV8yBBUGhnp1YHR+iQ3mBqG9OV9kLzLfyJjaEIp9DtdCisnYNCopIr5JoHXpFDIpDorAZlKHKeGbvqo4zmSb44nUMm4GmM1nYGBkBPU+nMwXRrFi3DS8UvblVKjMRJlMkJIrETt3CcSqpd0sJd2tb3rjSB4amcbWQQyDnQQR57A0MgsxTKdlwtVcYUFMR4QlMg61sSoMXyFh60KBA-QreV9D0TD3CvYoez8PsnzuaNX1jD8vzzV5-xnOcqMTMAV2iItYSFeEdDxGwr2kFgFDtTDFS2PEVC0C9rGUSU7Hwq5qT1O43iEEEoHTQgoGBUFwVgbN6FnRirXXViEDKCw1UrP0dEbcyBIxHZg3kWVg3sMt5BDe8CMfWS6WofouATAC1LBCERiYtcWMg0sdBYVwyFUNwVB48VrPdFCNjcfQ5hcOzbH0OpIqknV2hzMYCCgagICEMAKAIAA3OgAGsKrDdzCr4YqEEIGq3kTCZhl05iIOFdi5n0ewFGG9RA2SAT5B45t9AULi7As-QvHOAg6GIeAoka6k+RC-qimcsU5vKBwFD0SKCnWDY7VKDLXHPFx5Rcpo3Jk4IwF28CS3KKLFHFLCRMcHRFXtLRHHKca4p0Xc8sIjz1jA60N13WQTL0MyLPkKybGROzlGGjQHDsMlXOkiNnxI4d30+pGDIRL1OMDE66345KVC9YSbFRPGnCkEmXrJ-tiKHN84188cgKXD7Cz2ktFAcMVD07TFeaS9Y0IdDCsNROx1Fh9zIxfKm4won86IAmn9LC6aZvMqw+cDRscIbeoyHY8UZRkcsbGDfWZMN+SCEU5Tiv8jTLdC4V5S9GsVFRcyD2PZLrMsV1PU4mVXD93VmpUiP9tLfGjqQnjHGciLZQEmRZkiomjnxqQyglFaPCAA */
    id: "tableBinder",
    initial: "idle",
    context: {
      machineName: "Data Binder",
      bindingData: {},
    },
    states: {
      idle: {
        on: {
          load: [
            {
              target: "ready",
              actions: "assignBindings",
              cond: "not bound to state",
            },
            {
              target: "ready.main screen.client state",
              actions: "assignBindings",
            },
          ],
        },
      },

      ready: {
        states: {
          "main screen": {
            on: {
              "toggle field": {
                actions: "assignFieldBinding",
              },

              alias: {
                target: "main screen",
                internal: true,
                actions: "assignFieldAlias",
              },

              edit: {
                target: "configuring fields",
                actions: "assignSelectedProp",
              },
            },

            description: `User is on the main screen changing basic settings`,

            states: {
              "data resource": {
                on: {
                  client: "client state",

                  "set resource": {
                    target: "data resource",
                    internal: true,
                    actions: "assignResourceData",
                  },
                },
              },

              "client state": {
                on: {
                  resource: "data resource",

                  "set state": {
                    target: "client state",
                    internal: true,
                    actions: "assignStateBinding",
                  },
                },

                description: `Binding to a client state variable`,
              },
            },

            initial: "data resource",
          },

          "configuring fields": {
            description: `User is configuring a selected field`,

            on: {
              close: "main screen",
            },
          },
        },

        initial: "main screen",

        on: {
          quit: "closing",

          "update field": {
            actions: "assignTypeMap",
            internal: true,
          },
        },
      },

      closing: {
        invoke: {
          src: "sendClose",
          onDone: "idle",
        },
      },
    },
  },
  {
    guards: {
      "not bound to state": (_, event) => {
        const bindingData = JSON.parse(event.bindings);
        return !bindingData.stateName;
      },
    },
    actions: binderActions.actions,
  }
);

export const useTableBinder = (handleClose, handleUpdate) => {
  const [state, send] = useMachine(tableBinderMachine, {
    services: {
      sendClose: async (context) =>
        handleClose(JSON.stringify(context.bindingData)),
    },
  });

  return {
    state,
    send,
    ...state.context,
    actions: binderActions.actions,
    states: tableBinderMachine.states,
  };
};

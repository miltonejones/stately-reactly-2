import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
import { binderActions } from "./actions/binder";
const tableBinderMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBcCGAjANmAQgSwDsIwAnAOjwmwGJMB7VCAbQAYBdRUABztj2Tx0CnEAA9EAFgBMEsiwCMU+QDYAHPICcG5QHYdAVgA0IAJ6IpZKco0SJqlspYGp+gMzSAvh+NosuQsTklDT0jEzyHEggPHwCQiLiCBKuqmSuMhr6Klks6ixGpojy+hYaUrmuZfKqLhLyEl4+GNj4RKRkJGCMJtQAjgCu-KyR3Lz8gsJRiXYsZDOa9a7W6brGZggAtErKZG4OrtU61hIsDd4gvi0B7Z3dZAC2qIQABLAAxp1gBNTIdFBQ2GeADM8GBMMx2CIYuN4lNEBpXDo5nodOkbK4WNo1og3Bpdk4sgiJG5bFJGhdmv42uRbhATA8ngRXh8wF9qKhMHhULBhlCxnFJqBEoplLIdOVUSx3Do6lIpNiEFkdmp9MdpaoJDLyZcqYEOl06QyXu9Pt9IENIVFoQKEkVlDIyI5lK4Sspii5XArbPJLLp0lJVIiNRodNrKa09bT6Y9jSyvmQIKg0M9OrA6P0SG8wNQ3pyvsheVb+RNbQhFKrHSiDPVVBoVPLCmXNJWdIoZFJxbpVWG-BGbgbo4zmaaE0nUCm4OnM9nYGBkBO0xms4XRrES3Cm1k5KpVJKbKL3ArETt3CcSjvUWplMoe1dqfq7jGmSbWQQyLnQQR57A0Mhs6mp2XS1VxhQUxHhVQdnrWxKgxfIWAbdYA2VfRMj0fRUTsdR9FvXV+0fIcX3jD981eX8ZznMikzAFdomLWEhXhHQ8RsHdpBYBR7QwhUtjxFQtDPaxr1bOxcL7GkB3fIQQSgDNCCgYFQXBWAc3oWdaOtddGIQMoLE0JY9ADVt5FbHiMR2EN5BdEN7HLEyxOuchczGAgoGoCAhDACgCAANzoABrLydXE981PkhBCD8t4kwmYYNPosDhWYuZ9HsBRUvUDVkh4+QOMrfQFDYux5BMnDzmCxyH0NN5pLwWSSHkxSwQgFT+i4RM-ya8F4rXBjwLLVELBmRx8lRS8NB45IkUxRwtBRe1Ki8c4CDoYh4CiCrqT5XrEqKEyyEyBCOMcEydClAp1g2N0LBmzFdzcF17PK8NKuCMBttA0tylcMhFA0XcDAExwdAVB0tEccpMpUJxdwc+8ow+m0N13WR9N0cVdxK0zGw2EpZFQ2adBqcplG7Z7e0qqMjWfOMwM0vrEgRH1WI1cpOJcEGcZUH1+MyXKOxsLC4cjSSn2HV9R2TACl3eosdtLRQHAO0UrDOjQnCkT1G2Qx1UIwgxMJ3eRhfww0xaIt8SK-Ki-0RrT+tyvLWysOUNRK9xVAVEqxS0Gp0mJY4QxNiS7hqggZLk1yupau2GaKVCfTsOs-RE0UzKVpQ8bqVjNdcYPQpcqBY92stSYOgq2ZOvRzp4mRZilBxNWvEoykgpaPCAA */
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

              "update field": {
                target: "configuring fields",
                internal: true,
                actions: "assignTypeMap",
              },
            },
          },
        },

        initial: "main screen",

        on: {
          quit: "closing",
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

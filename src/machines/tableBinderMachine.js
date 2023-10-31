import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
const tableBinderMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBcCGAjANmAQgSwDsIwAnAOjwmwGJMB7VCAbQAYBdRUABztj2Tx0CnEAA9EAFgBMEsiwCMU+QDYAHPICcG5QHYdAVgA0IAJ6IpZKco0SJqlspYGp+gMzSAvh+NosuQsTklDT0jEzyHEggPHwCQiLiCBKuqmSuMhr6Klks6ixGpojy+hYaUrmuZfKqLhLyEl4+GNj4RKRkJGCMJtQAjgCu-KyR3Lz8gsJRiXYsZDOa9a7W6brGZggAtErKZG4OrtU61hIsDd4gvi0B7Z3dZAC2qIQABLAAxp1gBNTIdFBQ2GeADM8GBMMx2CIYuN4lNEBpXDo5nodOkbK4WNo1og3Bpdk4sgiJG5bFJGhdmv42uRbhATA8ngRXh8wF9qKhMHhULBhlCxnFJqBEoplLIdOVUSx3Do6lIpNiEFkdmp9MdpaoJDLyZcqYEOl06QyXu9Pt9IENIVFoQKEkVlJoyKp9HkdKoZaLVMoFVJtHNiU6ahIbPIFPptZTWnrafTHsaWV8yBBUGhnp1YHR+iQ3mBqG9OV9kLyrfyJraEIpVWRdCisnYNCp5YVyw7q4oZFJxbpVeG-JGbgaY4zmaayHnQQRkK80Mgc2mM1mwEXRrFS3CEBpPWQG7ZKhj8ixG+spJvlPpMnp9Ki7Oow+cdX2aQOjUyTayCKP8xOp8mc7AwJPYGnRdLWXGFBTEeEdDxGxVA1coFGUFwdAVLY8RULQTlVbRdHqVQeyual9TuN4hBBKBM0IKBgVBcFYFzeg-yXaIS1hIV4TlLcEWrY8dHkeReJQjEdg0XjXDPV0FBcfj8N1do8zGAgoGoCAhDACgCAANzoABrNT72uch5L4RSEEILS3mTCZhiY61VzY8soLmZ0WFDWDqh3FCQ1mLsFFg2x1H428ml7AyiMNWMX3jd8kxTOdM2zag-0nOKFxsljwOFYp5DkWDJRsUV3AVREdncTDjzdJZPWULxzgIOhiHgKJ9OpPkV1YiDmyRTIDxcxx+J0KUCnWDY7GykT5DEtQ1AyN0ZIfCgqDAVqwLLcpXC3H03QMDDHGQpsZDILRHHKdR1F22a7wjULo2Wm01zdWRNCWPQeL4gSmw2SpZE1CasOUSoDzJS6QsI6Nn2HN9brsjqETG69pBchtL08+0t2sbQFFyf6Qx0ObrqfCKIYTGLUFTOB52zKH2uFcphNFKwBo0JwpFcb0TzPS8DCvNy8dBgmh1fBMxwLb8ZypjKihc2ZeKsOUNT49xVAVPixS0Gp0mJY4RN5qMnxIggyIoxTqLBCBGtAu77OKBxdmPYklCWFnrEEqUtzclUTqlXHgYIvUjMo8Wy2yQ79B6hwFD0QaUJkWYpQcTVlFPH1j2qmqgA */
    id: "tableBinder",
    initial: "idle",
    context: { bindingData: {} },
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
    actions: {
      assignResourceData: assign((_, event) => ({
        bindingData: {
          resourceID: event.ID,
          bindings: {},
          typeMap: {},
          columnMap: [],
        },
      })),
      assignBindings: assign((_, event) => ({
        bindingData: JSON.parse(event.bindings),
      })),
      assignFieldAlias: assign((context, event) => {
        const { field, alias } = event;
        const { bindingData } = context;
        const { bindings } = bindingData;
        Object.assign(bindings, { [field]: alias });

        const updatedData = {
          ...bindingData,
          bindings,
        };

        return {
          bindingData: updatedData,
        };
      }),
      assignSelectedProp: assign((_, event) => ({
        selectedProp: event.prop,
      })),
      assignStateBinding: assign((key_index, event) => {
        return {
          bindingData: {
            stateName: event.state,
          },
        };
      }),
      assignFieldBinding: assign((context, event) => {
        const { field } = event;
        const { bindingData } = context;
        const { bindings, columnMap, typeMap } = bindingData;

        if (bindings[field]) {
          delete bindings[field];
          delete typeMap[field];
          const updatedMap = columnMap.filter((f) => f !== field);
          const updatedData = {
            ...bindingData,
            columnMap: updatedMap,
            bindings,
            typeMap,
          };

          return {
            bindingData: updatedData,
          };
        }
        Object.assign(bindings, { [field]: field });
        Object.assign(typeMap, {
          [field]: {
            type: "Text",
            settings: {},
          },
        });
        const updatedMap = columnMap.concat(field);
        const updatedData = {
          ...bindingData,
          columnMap: updatedMap,
          bindings,
          typeMap,
        };

        return {
          bindingData: updatedData,
        };
      }),
    },
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
    states: tableBinderMachine.states,
  };
};

import { RecentActors } from "@mui/icons-material";
import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
const clientStateMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGMA2BLMA7ALgZRwEMcwBiVAe0IgG0AGAXUVAAcLZ0d0KtmQAPRACYAnAHYAdABYAbFKkBmABxKArEroKAjABoQAT0QBaLXRGqJCujLHitCkSKFapAX1d60mXAWJlYYDgABLDIFCxg9ExIIGwcXDx8gghidHTSSmIyMspKikIySnqGCCaiIpbKBdZ0UlpO7p4Y2PhEJKQBwaHhkVrRrOyc3LwxyTJCklIiWpkzUipiecXGpmJallkKzlpaqllCqo0gXi2+JBKQQ1hQIW1kaOyRjHxxQ4mjiLJK0nQTSoX1GSaETLBDqKQSOj2GTqJRWcwKQ4eY7NHx3C4QK43WB3UgAVxYED8URegwSI1AyTUMgkWkKqikYm0IkK5lBihpYgKmX+DjpQiEbmRJzRfgxWNuflILEIMBJMVe5KSiFMU0hWVsUgZGnUQlBJl+QgkQiUAphqhNQm0SKa3laYsuXGukvaYH4MqwtGeCrJw2VCBpdFNMhcZlUIikQfE+sUCgkai2W3ktSZqhkRxF9vOjvQzpxYoATmBqPpSGEALblzjygbxP0fBBSCbxpkFcOCrL-UGCmlpxm-VIh6wKDOorNgcVO7HoosljoUAs4GuxX3vSnCU3G8YuQGqVRbQUxlnxg4HBxKXYzQWju1nCc5vMz4sQUvUL39Fd1tcCRCqOgWPIFC5EQ4SDPZZBjIEW2cKwbD7G9TnRB9p0LZ9SwAK1gHhl0Vet1xSDQJAjGEFBhEC-zpfUAXjIE5FTOlrCUBDRWzTEpxdCdZxfUgIALcIggAN0IAt0EIAAjVAng-XDv2SSN0j3TQ6FsC8bC0PUDGMCZ1n3bckwFeoxGY8dJ1zFDzgrKtgkzDigmQAALQhrjgHieAnXMBIoABrCdMzvUzHzFSzODssdbIcpyYFgBAPIoZBiGGKIcNXCkfxSeYiMFOE9yUERERkEFNNKA4KhEWoBQORk8qbIVbUQh02LMjiJE6dj8xIIIsEIct7kc5zkq-VKxitY1VB2OkQwmsQxH1MQMojWRlLqRQVCEYz-OQ5rWqa9qwE67r7ic5AwFQAa3iGz4nAkNYzCAvKhBTNkiqMLkaWcDRpsRKEDnTYUxw2xrAvObagb2rqeo6QgBKk0lBv9PYLFSX4mwmTQHpm56GXSZS010+o4RmdakMB8z7xJoJMJ4IIKDE9CwGQHBXKwGGfThhtTB2a7ETKmqfsRfUHAhTI5AekNcpNfciYaiVdokXj+KEkTxMk0h9DgM6lQbBlJCtFxpjTbQL10Z6tDWH4NC1VJ1HqLQpdYmX0XllhBOE0SJLILAKA1vC0phGlSK5M1SIUICime0jrp2U0SrUUWFFqlFb3RB4OGuJn3KwTyfIkPzk8oVOoBizO4oS7DGG92TjG+LksnkwUVqhDGSlsI1yhNMqnDEC07bJh3pfYymsGp2n6cZsIWH0CuLoQHYcgkfd1OcNMcgjDSShevJIVN3J9cRNZ3GRT2IDgPhc78WHzv9Iw02uiY5DSevlF+fV7H+eMqkWLG00Jv6k7FdAICSQvprfCD0X5qHnlaJsCJzTWDWr-eq9s2p3GAT7ZIUCtzODqCyPcB4pD6lmPPU2kZ6SmwKEZBBLFe7INQiWVBldGyMlvlMMqQEZjaAmALC8tJWziDkHUC8LIe4BVJjnCglYQo2V2nZPqUV6HT0WBCCM-5-xwiyOGbsZhaQFDvl3IE9hTbCM2rLEGpN9o9XkfDX489SImm3PIbIigqL2FpKaLu6i0iyFtpQkyxjiYSkHsPOmDNLENnEKVOEjg0h0kHDIKi4ZaTxzMACLuSYjHk1lk7F2St3ahPwn+SYTJCi1DMKUhQoIdhxjIUCWw+5pozF+nVKhOd85mTyWlWQEJ7B5XBJqFQcSipd2+E2NYhtTSZHmAfVwQA */
    id: "clientState",

    initial: "idle",

    context: {
      scope: "page",
      sortResults: false,
      pageNum: 1,
      pageSize: 10,
      stateProps: {
        page: [],
        application: [],
      },
      machineKey: "clientState",
      machineName: "Client State Variable",
      icon: RecentActors,
    },

    states: {
      idle: {},

      "editing state": {
        on: {
          close: "closing",

          update: {
            actions: ["updateState", "statePaginate"],
          },

          page: {
            target: "editing state",
            internal: true,
            actions: ["assignPage", "statePaginate"],
          },

          expand: {
            target: "editing state",
            internal: true,
            actions: ["assignExpanded", "statePaginate"],
          },
        },

        states: {
          ready: {
            on: {
              commit: "commit client state changes",

              sort: {
                actions: ["assignSort", "statePaginate"],
              },

              add: "setting state name",

              json: {
                target: "editing json object",
                actions: "assignJSON",
              },

              "drop variable": {
                target: "drop variable",
                actions: "assignClientStateDropMessage",
              },
            },

            description: `Modal is open and idle. All actions are handled by the modal logic.`,
          },

          "commit client state changes": {
            invoke: {
              src: "sendClientStateUpdate",
              onDone: {
                target: "ready",
                actions: "assignClean",
              },
            },
          },

          "setting state name": {
            on: {
              change: {
                internal: true,
                actions: "assignNewName",
              },

              cancel: "#clientState.editing state",
              save: {
                target: "ready",
                actions: ["appendState", "statePaginate"],
              },
            },
          },

          "editing json object": {
            on: {
              done: {
                target: "ready",
                actions: "updateJSON",
              },

              copy: {
                target: "editing json object",
                internal: true,
                actions: "copyJson",
              },
            },
          },

          "drop variable": {
            description: `Confirm action before dropping variable.`,

            on: {
              yes: {
                target: "ready",
                actions: ["dropClientStateVariable", "statePaginate"],
              },
              no: {
                target: "ready",
                actions: "clearClientStateDropMessage",
              },
            },
          },
        },

        initial: "ready",
      },

      closing: {
        invoke: {
          src: "sendClose",
          onDone: {
            target: "idle",
            actions: "clearState",
          },
        },
      },
    },

    on: {
      load: {
        target: ".editing state",
        actions: ["assignState", "statePaginate"],
      },

      "set scope": [
        {
          actions: "assignScope",
          cond: "scope is valid",
          target: ".editing state",
          description: `Ignore scope request if this no state viariables for it exist`,
        },
        {
          target: ".editing state",
          actions: () => alert("Scope is not valid for this state"),
        },
      ],
    },
  },
  {
    guards: {
      "scope is valid": (context, event) => !!context.stateProps[event.scope],
    },
    actions: {
      assignJSON: assign((_, event) => ({
        json: event.json,
        jsonKey: event.key,
      })),

      dropClientStateVariable: assign((context, event) => {
        const updatedProps = context.stateProps[context.scope].filter(
          (prop) => prop.Key !== context.selectedKey
        );
        return {
          dirty: true,
          internalProps: {
            ...context.internalProps,
            [context.scope]: updatedProps,
          },
          stateProps: {
            ...context.stateProps,
            [context.scope]: updatedProps,
          },
        };
      }),
      clearClientStateDropMessage: assign({
        selectedKey: null,
      }),

      copyJson: assign((context) => ({
        json: JSON.stringify(context.clientLib.page[context.jsonKey], 0, 2),
      })),

      assignClientStateDropMessage: assign((_, event) => ({
        message: `Are you sure you want to delete variable${event.key}?`,
        caption: "This action cannot be undone!",
        selectedKey: event.key,
      })),

      updateJSON: assign((context, event) => {
        if (!event.json) {
          return;
        }
        const updatedProps = context.stateProps[context.scope].map((prop) =>
          prop.Key === context.jsonKey
            ? { ...prop, Value: JSON.parse(event.json) }
            : prop
        );
        return {
          dirty: true,
          stateProps: {
            ...context.stateProps,
            [context.scope]: updatedProps,
          },
        };
      }),
      assignScope: assign((_, event) => ({
        scope: event.scope,
      })),
      assignNewName: assign((_, event) => ({
        name: event.name,
      })),
      // assignDirty: assign({
      //   dirty: true,
      // }),
      assignClean: assign({
        dirty: false,
      }),
      assignSort: assign((context) => {
        const fn = (a, b) => (a.Key > b.Key ? 1 : -1);
        const { sortResults: oldSetting, internalProps } = context;
        const sortResults = !oldSetting;
        if (!sortResults)
          return {
            stateProps: internalProps,
            sortResults,
          };
        const { page, application } = internalProps;
        const sortedPage = !page ? null : [...page].sort(fn);
        const sortedApp = [...application].sort(fn);
        return {
          sortResults,
          stateProps: {
            page: sortedPage,
            application: sortedApp,
          },
        };
      }),
      assignPage: assign((_, event) => ({
        pageNum: event.page,
      })),
      statePaginate: assign((context) => {
        const { pageNum, pageSize, stateProps } = context;

        const paginate = (array) => {
          if (!array) return {};
          const page_count = Math.ceil(array.length / pageSize);
          const slice_start = (pageNum - 1) * pageSize;
          const visible = array.slice(slice_start, slice_start + pageSize);
          return {
            page_count,
            visible,
          };
        };

        const page = paginate(stateProps.page);
        const application = paginate(stateProps.application);

        // alert(JSON.stringify(application));

        return {
          pagedProps: {
            page,
            application,
          },
        };
      }),
      updateState: assign((context, event) => {
        const { key: Key, datatype: Type, value: Value } = event;
        const updatedProps = context.stateProps[context.scope].map((prop) =>
          prop.Key === Key ? { ...prop, Key, Type, Value } : prop
        );
        return {
          dirty: true,
          stateProps: {
            ...context.stateProps,
            [context.scope]: updatedProps,
          },
        };
      }),
      appendState: assign((context) => {
        const prop = context.name.split(",").map((name) => ({
          Key: name,
          Value: "",
          Type: "string",
        }));
        const updatedProps = context.stateProps[context.scope].concat(prop);

        return {
          dirty: true,
          name: "",
          internalProps: {
            ...context.internalProps,
            [context.scope]: updatedProps,
          },
          stateProps: {
            ...context.stateProps,
            [context.scope]: updatedProps,
          },
        };
      }),
      assignState: assign((_, event) => ({
        scope: !!event.state?.length ? "page" : "application",
        pageNum: 1,
        clientLib: event.clientLib,
        internalProps: {
          page: event.state,
          application: event.appState,
        },
        stateProps: {
          page: event.state,
          application: event.appState,
        },
      })),
      assignExpanded: assign((context) => ({
        expanded: !context.expanded,
        pageSize: context.expanded ? 10 : 20,
        pageNum: 1,
      })),
      clearState: assign({
        stateProps: {
          page: [],
          application: [],
        },
      }),
    },
  }
);

export const useClientState = (handleClose, handleUpdate) => {
  const [state, send] = useMachine(clientStateMachine, {
    services: {
      sendClose: async () => handleClose(),
      sendClientStateUpdate: async (context) => {
        const { scope, stateProps } = context;
        handleUpdate("state", stateProps[scope], scope);
      },
    },
  });

  return {
    state,
    send,
    ...state.context,
    states: clientStateMachine.states,
  };
};

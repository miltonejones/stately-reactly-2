import { TableRowsOutlined } from "@mui/icons-material";
import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
import invokeResource from "../connector/invokeResource";
import generateGuid from "../util/generateGuid";
import { findMatches } from "../util/findMatches";
import invokeDynamo from "../connector/invokeDynamo";
import describeDynamo from "../connector/describeDynamo";
import resolveNode from "../util/resolveNode";
const connectionMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGMD2A7dZkBcCWGAxADaoCGEA2gAwC6ioADqrHvhgyAB6IDMAnAFYAdACYA7KMHiB46gDZRvXgBYANCACeiALQBGPfL3DBK3qL3VxADlFTq1gL6ONaTNnboS5KnvpIQZlZPTh4EZXFhSVVRfkVBfmpTDW0EHX5eEUN5XmorFUFRW15nVwwsXAJ0YTcKzwACAFtUCDJierxYetRGMC9kUlgwGn8mFjYq0MQ9XmFrfmtzaxUzUTzBPVEU3X44qItFFRyjW0FSkFqPKpryq4wmlraOrp6+4TwIYjBCIZx6y8qGBGnCCEw4ATCOjss12iz0tmi1CK2zSKmo-DmuUEgjyRT0BXOAM8N3cgPQD1a7U63V61Q+X0IFCodBB4xCEN0kkiOUW8nEenEcWx4hROg2kRUdg2kvkBQkJRcF1uZJJdSqFKe1Ne1UgE3QUH+ys8hAGLDAhtJnmBAVB7NAkJs1DEhXE8n4Kk2R2kKJkwkM4lMGSKjv5hKN1yJ6ualOeNLeuvw+otaqIv3qACc4KgAK7p5DDFk2tmTDkIax6DG7HKiD2u2IyUVSYwqcSSQTHIwVzJhy0R8P3aOal604QJvBJyNEbOMVo4AujQLF8H23TKJ2xJIGQoCXg5FHw0TCXd6HHyUzyYoZHsp6qT8mDqnD+MQPUGu+MiDMhe2ksrhDxYQkTiQwinbHFrFFFRbEAwx214awHBUXZeHEa87lvft70eR84x1F9EzfTDhEzChNBNVBGkaNhrTGYJf24Vdd2EXZxBWeRZXdQRrBFLQ+BUI9uKggxVDRax5DQlU7w1HDtVHfDx0I3sMBuSi2GTdD-gACzIfU4EICAMDAd50AAN1QABrIy71VDSH1jWSxwnIi0FUv4pOQbTdNgBBxzM5AyCtOgaMXOjlwY8J2OEI5LEFVt+TWBRRRPQ90QFC90Wscsa1ECTiSkuytRHRyDUzWAczzb5TSGDMs1zfNgp-MKwgPYQLzPZYNkEWQMhRfh8RMawupkKQaz63K+yUrCY0K59Xxqsq6u+adZ3nVlQvQKYEAyJ03WoAoEi4wpFH3FYRFEC8FkyagKxA8blPy7D7KK+Sk1K8r8xNL4yHTBqlw20tNhyEwlFMRZqEyFD1F4hB8UsI8zwERQZFsBQ7owybpKe2aCPm97vjTN7Ft+9bNrWQaooDIxzAsbjeBRUCTCg90tzA1s0ZsslMZmvC5sJiriLAUjyNc4mwX+v94T5I8JGxeEuPmFYfRbP18QvfkL1PdmHump8eZxvn8wFoW51gHBRbtcK4gxNdIasa6Mjp6G4KiIRpBQ9jBtsLXMK53W5N52r+ZIiAyKZc36OagURAWSx2yUPJrpRI5+KKXJXSj+YpG9jGCr94rccWo2Q5qTTsHMguKvqHBNF6Qhw6a6ZeHhGDlBQk8oOkQQUXmYxJGutq08FPRs5vX3cP9-XA8N4PNGEGA-hD9AyGaQ1iGzRp0FgfTDOMszLI5vKfdz8f84NoyZ7nsAF80JeV7QNeN+83zUH8wLaHr8XwsMXJWocPlMriDTfg+5rqRF2O2MwVguLnScIqay2shwnxeiVKeVkKJUT+GfLSOkYBbwMlgXeFk0GTQPlGR63MJ4KQrobFyGDqHmg8jguAPlTIvwClUEYH9NoZAxDMHEBRWzSFYnofcdh5DSyrHIdsfI+Qj1suQvOyD6HCBNpg1B9RfgETwTvZ++94FHwUUggOC1+aqPoRoq+WiWF+XYUCIKhZaJi24XkQC6tFhNwugIFEuR+LzB8TubiigcpwOcgYnWRjJ4mMNkyKhc50yNBNJ5GAXCAbnVmFYSwWI0RxC8dDf0cxFjujMPwOQUEUJyM5sfBySiz7CBiUmOJCTYBkBMqtIsJNUkrDmHkSUTMlDIidlBP0koIgSDRODcSISSEIJks9YxeM6mfliWAeJJodL5mICkiWmxrCM0Qj0vIQh5D7kSK1SwSFWKCkyIcCpDQqkjnqYpG8az0AbK2ZbWYsokhrHGa6N0XdoY6D5GdKCCsUL8grLcsh4TZKPPUmSRJTD3lhCkLslYsQEICgrOiKGqQgVujEEUcGlg4hyHYlCgchjYVLKcpNH4LS2mOIts1X0mT+nYmih6UUKFdmxGxCUwBSgZAUqmog6lL5XqoMRbpZFiB1ZiHgpKQB8gkQnlFDISI8F8RKCMB6JQCoyjTLCWKh5NKUFRMqussAmyHEhScaWQoIgxIaz7lYABkEPTMUgRCxI-AazDymTeUhlKYWmoleavG9LWmyphmYXxvJpACj9QCvFnY-S7Q2JsWIFYVAirHrJLBjBMw6A8mXEuZd4UNGrrXGNhh+oKwyG7FYitAXnWMPLQU8xtxojZoG9CwbRWzLeIW4tpbkDmXLeOyt6pq3fEoH4Na9qJaKHES2XIZ5CgTO4qKLi6aTjHh4fqs4fbJLGqHdUEdYAS2l3HZfa+t9UBVzIAAIy+NoghujiFBpmVjC96ii1XrHRO+e9RF7L0fTgF9b7rFsLfrW7ih4UJCClIYOEWxAXllapKSQsoOoIRrFrQYClt4ftYXo5yRH9Qwdfhw+x34-qbShJIKK50PQFE9HtCCgKDDg1aqoBw2UtW5vOOgFocBOB3kXcy3QgTnQSDdHqr0PE8WegxHtcwe0rAruxOzekYApMR10G7P0eRWJJDEkhJISUcVRGUGeGwcgTywMNd+s9v6DMNzSLYXlLoFOens6KWw8b8RHCbgoNueb7lvD0x5z+DopB8cWJKBwO5kiAvgpETJCx5gnDiselz-af0UPzpJ9pS7wo6CODtIae0kLOpKY2AQJg+p8iboNNcphItUrmTjayM9Yuk0ynMKQu4ELwWy8AwFTo6sXgSruVssIxJddDdjKh+jXLTvuIwryA3SyVc2K1GrKwFjsQa9xtEgFJTljPCeBQqLlsmtW5Ki1u2-y2AxEhJCXEm4JHgsc6GmQCkCDlAkCQe1JkFdPTnbrT2I2F362V6TW0hBHgSB6fI12Cg+mUMxOQ5n0RKG4gGyHh9ocrb1lQ2pF8gPmNna9r+6nUfMwx4YLH0MAEU37kKYpLYHvnsoc9hZF8QNgbvqgB+m96fNV+16w5SFWud27meXHoCoJokMFYPnv6Bdw6DoLYupAKCQCl43NYJhWwWHitxTcICmt2DsFYXIRSZha+KzU1BKk6FYO27gk3MMh5HlYhuNE0guOpE2AdmwRzsr8iEKhE9pPR5RYp4LwuZisGaIUvARHhmyytiiu6IQcJftiSThdmw67XRgVlLzhPE0k8w5T7r6JZqq4rMaH7gwcNThdXmPFC8Ye+C8bEkIIQnHsO15J-X+R5PFnhs25-RqcXEBSx+RYBQaIzx+v+3ijYuywaiUUCJc6ru-ZwrPn7woh5XQBjMG6AwYjRQqv4rud0WqTykoh0qI1ZPHt-otfUABtemXJ3liHMFBHIBpq2I7HipkMYMoJlHYCeKDkiKfuPJesAbejTlJHTjnp5nwrMMsNblAQ2K2kDIsNxLsAUO6BvmgQWv+qOjesBlfKBjfOBk+q+uJngcvjDJ7HMOrEYGrLkPiI2OQRljYHBNIGYPlt-t+pRlAJ3tbGSgGPiJIBuCmroMJE6PyoKBYNuP8s4M4EAA */
    id: "connection",

    initial: "idle",

    context: {
      machineKey: "connection",
      machineName: "Connection",
      candidateType: "Connection",
      icon: TableRowsOutlined,
      connectionProps: { resources: [], connections: [] },
    },

    states: {
      idle: {},

      "connection modal is open": {
        states: {
          idle: {
            on: {
              "set connection": {
                target: "editing connection",
                actions: "assignSelectedConnection",
              },

              add: {
                target: "adding connection",
                actions: assign({
                  candidateType: "connection",
                }),
              },
            },
          },

          "editing connection": {
            on: {
              "close connection": {
                target: "idle",
                actions: "clearSelectedConnection",
              },

              "set resource": {
                target: "resource pre-check",
                actions: "assignSelectedResource",
              },

              update: {
                target: "editing connection",
                internal: true,
                actions: "updateSelectedConnection",
              },

              add: {
                target: "adding resource",
                actions: assign({
                  candidateType: "resource",
                }),
              },
            },

            states: {
              ready: {
                on: {
                  commit: "commit connection changes",
                },

                description: `Form is idle and accepting changes to the connection`,
              },

              "commit connection changes": {
                invoke: {
                  src: "sendConnectionUpdate",
                  onDone: "ready",
                },
              },
            },

            initial: "ready",
          },

          "editing resource": {
            on: {
              "close resource": {
                target: "editing connection",
                actions: ["clearSelectedResource", "clearTestResult"],
              },

              update: {
                actions: "updateSelectedResource",
              },

              clear: {
                target: "editing resource",
                internal: true,
                actions: "clearTestResult",
              },

              "set resource": {
                target: "editing resource",
                internal: true,
                actions: "assignSelectedResource",
              },
            },

            description: `A resource is selected and being edited or tested.`,

            states: {
              ready: {
                on: {
                  commit: "commit resource changes",
                  test: {
                    target: "test resource settings",
                    actions: "assignStateProps",
                  },
                  add: {
                    target: "adding term",
                    actions: assign({
                      candidateType: "parameter",
                    }),
                  },
                },

                description: `Form is idle and accepting changes to the resource`,

                states: {
                  "check resource type": {
                    always: {
                      target: "get dynamo columns",
                      cond: "columns needed",
                    },
                  },

                  "get dynamo columns": {
                    invoke: {
                      src: "describeTable",
                      onDone: {
                        target: "loaded",
                        actions: "assignColumns",
                      },
                    },
                  },

                  loaded: {},
                },

                initial: "check resource type",
              },

              "commit resource changes": {
                invoke: {
                  src: "sendResourceUpdate",
                  onDone: {
                    target: "ready",
                    actions: "assignClean",
                  },
                },
              },

              "test resource settings": {
                invoke: {
                  src: "testResource",
                  onDone: {
                    target:
                      "#connection.connection modal is open.editing resource",
                    actions: "assignTestResult",
                  },
                },
              },

              "adding term": {
                description: `User is adding a new term to the resource`,

                on: {
                  change: {
                    target: "adding term",
                    internal: true,
                    actions: "assignNewName",
                  },

                  save: {
                    target: "ready",
                    actions: "appendTerm",
                  },
                  cancel:
                    "#connection.connection modal is open.editing resource",
                },
              },
            },

            initial: "ready",
          },

          "adding connection": {
            on: {
              cancel: "#connection.connection modal is open",

              change: {
                target: "adding connection",
                internal: true,
                actions: "assignNewName",
              },

              save: {
                target: "editing connection",
                actions: "appendConnection",
              },
            },

            description: `User is adding a new connection to the application`,
          },

          "adding resource": {
            description: `User is adding a resource to the selected connection`,

            on: {
              change: {
                target: "adding resource",
                internal: true,
                actions: "assignNewName",
              },

              cancel: "editing connection",
              save: {
                target: "resource pre-check",
                actions: "appendResource",
              },
            },
          },

          "resource pre-check": {
            states: {
              "check connection type": {
                always: [
                  {
                    target: "get dynamo tables",
                    cond: "tables needed",
                  },
                  "#connection.connection modal is open.editing resource",
                ],
              },

              "get dynamo tables": {
                invoke: {
                  src: "describeResource",
                  onDone: {
                    target:
                      "#connection.connection modal is open.editing resource",
                    actions: "assignTables",
                  },
                },
              },
            },

            initial: "check connection type",
          },
        },

        initial: "idle",

        on: {
          close: {
            target: "closing",
            actions: "clearSelectedConnection",
          },
        },
      },

      closing: {
        invoke: {
          src: "sendClose",
          onDone: {
            target: "idle",
            actions: "assignClose",
          },
        },
      },
    },

    on: {
      load: [
        {
          target: ".connection modal is open",
          actions: "assignConnections",
          cond: "no connections are present",
        },
        {
          target: ".connection modal is open.editing connection",
          actions: "assignConnections",
        },
      ],
    },
  },
  {
    guards: {
      "tables needed": (context) => {
        const { connections } = context.connectionProps;

        const chosenConnection = connections.find(
          (c) => c.ID === context.connectionID
        );

        return chosenConnection.type === "dynamo" && !context.tableList;
      },
      "columns needed": (context) => {
        const { connections } = context.connectionProps;

        const chosenConnection = connections.find(
          (c) => c.ID === context.connectionID
        );

        return chosenConnection.type === "dynamo" && !context.columnList;
      },
      "no connections are present": (_, event) => !event.connections?.length,
    },
    actions: {
      assignConnections: assign((_, event) => {
        const connectionProps = {
          resources: event.resources,
          connections: event.connections,
        };
        const firstConnection = event.connections[0];
        return {
          connectionProps,
          connectionID: firstConnection?.ID,
        };
      }),
      assignSelectedConnection: assign((_, event) => ({
        connectionID: event.ID,
      })),
      assignStateProps: assign((_, event) => ({
        stateProps: event.attr,
      })),
      assignSelectedResource: assign((_, event) => ({
        resourceID: event.ID,
      })),
      updateSelectedConnection: assign((context, event) => {
        const { connections } = context.connectionProps;

        const chosenConnection = connections.find(
          (c) => c.ID === context.connectionID
        );

        const updatedConnection = {
          ...chosenConnection,
          [event.name]: event.value,
        };

        return {
          dirty: true,
          connectionProps: {
            ...context.connectionProps,
            connections: context.connectionProps.connections.map((res) =>
              res.ID === chosenConnection.ID ? updatedConnection : res
            ),
          },
        };
      }),
      updateSelectedResource: assign((context, event) => {
        const { resources } = context.connectionProps;
        const chosenResource = resources.find(
          (c) => c.ID === context.resourceID
        );

        const updatedResource = {
          ...chosenResource,
          [event.name]: event.value,
        };

        return {
          dirty: true,
          connectionProps: {
            ...context.connectionProps,
            resources: context.connectionProps.resources.map((res) =>
              res.ID === chosenResource.ID ? updatedResource : res
            ),
          },
        };
      }),
      clearSelectedConnection: assign({
        connectionID: null,
        resourceID: null,
        tableList: null,
      }),
      clearSelectedResource: assign({ resourceID: null, tableList: null }),
      assignClose: assign({
        connectionProps: { resources: [], connections: [] },
      }),
      assignClean: assign({
        dirty: false,
      }),
      clearTestResult: assign({
        testResponse: null,
      }),
      assignTables: assign((_, event) => ({
        tableList: event.data,
      })),
      assignColumns: assign((_, event) => ({
        columnList: event.data,
      })),
      assignTestResult: assign((_, event) => ({
        testResponse: event.data,
      })),
      appendConnection: assign((context) => {
        const ID = generateGuid();
        const newConnection = {
          ID,
          type: "rest",
          root: "",
          name: context.name,
        };
        return {
          dirty: true,
          connectionID: ID,
          connectionProps: {
            ...context.connectionProps,
            connections:
              context.connectionProps.connections.concat(newConnection),
          },
        };
      }),
      appendResource: assign((context) => {
        const ID = generateGuid();
        const newResource = {
          ID,
          connectionID: context.connectionID,
          name: context.name,
          path: "",
          method: "GET",
          format: "rest",
          node: "",
          appID: "",
          transform: "",
          body: null,
          values: [],
          columns: [],
          events: [],
        };
        return {
          dirty: true,
          resourceID: ID,
          connectionProps: {
            ...context.connectionProps,
            resources: context.connectionProps.resources.concat(newResource),
          },
        };
      }),
      appendTerm: assign((context, event) => {
        const { resources } = context.connectionProps;
        const chosenResource = resources.find(
          (c) => c.ID === context.resourceID
        );
        const updatedResource = {
          ...chosenResource,
          values: chosenResource.values.concat({
            key: context.name,
            value: "",
          }),
        };
        return {
          dirty: true,
          connectionProps: {
            ...context.connectionProps,
            resources: context.connectionProps.resources.map((res) =>
              res.ID === chosenResource.ID ? updatedResource : res
            ),
          },
        };
      }),
      assignNewName: assign((_, event) => ({
        name: event.name,
      })),
    },
  }
);

export const useConnection = (handleClose, handleUpdate) => {
  const [state, send] = useMachine(connectionMachine, {
    services: {
      sendClose: async () => handleClose(),
      testResource: async (context) => {
        const { resourceID, connectionID, stateProps, connectionProps } =
          context;
        const { resources, connections } = connectionProps;
        const chosenConnection = connections.find((c) => c.ID === connectionID);
        const chosenResource = resources.find((c) => c.ID === resourceID);

        if (chosenConnection.type === "dynamo") {
          return invokeDynamo(
            chosenConnection,
            chosenResource,
            stateProps[chosenResource.body]
          );
        }

        let body;

        if (!chosenResource.bodyType || chosenResource.bodyType === "JSON") {
          let json = chosenResource.body;
          const regex = /"{([^}]+)}"/g;
          const matches = findMatches(regex, json);

          if (matches) {
            matches.map((term) => {
              const [fullText, innerText] = term;
              const param = stateProps[innerText];
              json = json.replace(fullText, JSON.stringify(param));
            });
          }

          body =
            chosenResource.bodyType === "JSON"
              ? json
              : stateProps[chosenResource.body];
        }

        return await invokeResource(
          chosenConnection,
          chosenResource,
          null,
          body
        );
      },

      describeTable: async (context) => {
        const { resourceID, connectionID, connectionProps } = context;
        const { resources, connections } = connectionProps;
        const chosenConnection = connections.find((c) => c.ID === connectionID);
        const chosenResource = resources.find((c) => c.ID === resourceID);
        if (chosenConnection.type === "dynamo") {
          const res = await invokeDynamo(chosenConnection, chosenResource);
          const items = resolveNode(res, ["Items"]);
          return items.columns;
        }
      },
      describeResource: async (context) => {
        const { connections } = context.connectionProps;
        const chosenConnection = connections.find(
          (c) => c.ID === context.connectionID
        );
        return await describeDynamo(chosenConnection);
      },
      sendConnectionUpdate: async (context) =>
        handleUpdate("connections", context.connectionProps.connections),
      sendResourceUpdate: async (context) =>
        handleUpdate("resources", context.connectionProps.resources),
    },
  });

  return {
    state,
    send,
    ...state.context,
    states: connectionMachine.states,
  };
};

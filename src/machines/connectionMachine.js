import { TableRowsOutlined } from "@mui/icons-material";
import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
import invokeResource from "../connector/invokeResource";
import generateGuid from "../util/generateGuid";
import { findMatches } from "../util/findMatches";
import invokeDynamo from "../connector/invokeDynamo";
const connectionMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGMD2A7dZkBcCWGAxADaoCGEA2gAwC6ioADqrHvhgyAB6IDMAnAFYAdACYA7KMHiB46gDZRvXgBYANCACeiALQBGPfL3DBK3qL3VxADlFTq1gL6ONaTNnboS5KnvpIQZlZPTh4EZXFhSVVRfkVBfmpTDW0EHX5eEUN5XmorFUFRW15nVwwsXAJ0YTcKzwACAFtUCDJierxYetRGMC9kUlgwGn8mFjYq0MQ9XmFrfmtzaxUzUTzBPVEU3X44qItFFRyjW0FSkFqPKpryq4wmlraOrp6+4TwIYjBCIZx6y8qGBGnCCEw4ATCOjss12iz0tmi1CK2zSKmo-DmuUEgjyRT0BXOAM8N3cgPQD1a7U63V61Q+X0IFCodBB4xCEN0kkiOUW8nEenEcWx4hROg2kRUdg2kvkBQkJRcF1uZJJdSqFKe1Ne1UgE3QUH+ys8hAGLDAhtJnmBAVB7NAkJs1DEhXE8n4Kk2R2kKJkwkM4lMGSKjv5hKN1yJ6ualOeNLeuvw+otaqIv3qACc4KgAK7p5DDFk2tmTDkIITGI56QTmBS2L2i0QFYS7IQCXhyRT4pyKyMYVV3cnRzUvWnCBN4JO9rzZxitHAF0aBYvg+26ZRO2JJAyFNs5FHw0TCXhGHHyUzyYoZMOWiPh+5Dqkj+MQPUGqeMiDMxe2kurhDxYQkTiQwikEM8HFFFRbEAwwwN4awHBUXZ22vFNqinDVHzjHUX0TN872qTMKE0E1UEaRo2GtMZgl-bg12PZt+HEFZ5Fld1BGsEUtD4FQj04qCDFUNFrHkVCB37MlMNjbUx1wid8JvPs0HIthkwHf4AAsyH1OBCAgDAwHedAADdUAAa0MqcJIaB9pNHcdJwIm4VL+DDkC0nTYAQCdTOQMgrToKilxolc6PCVjhErKwmPEfk1gUUUq0PdEBQvdFrGsT1RDElUMNsrV7LkpNM1gHM82+U0hgzLNc3zIKf1CsID2EC8z2WDZqyYjIUX4fETGsasZCkRtepy4k8seLCZIcg0SrK-NCBnOcF1ZEL0CmMtqz9ISEiUKU3X3BxZgQxtqBY+FzDG29FMHSa7OfV9qtK2qKq+Mh03q5d1tLTYpH2XhNgFdspA9Q7esixtYjihwkmynsnImmMCoevCnvm740zml7PrWjb8ViyKkKRPkDgg7i0j2Qp4T0fgimoAGhFE+GbusqM7uRnDHqx8rhCIiASOUiicBxsFvr-eEAyPfkUvmM7NhRC8MT2mwBAyjKjiupSCKkjnZK5mqeb5kj51gYXC2o0WNriDF13bNE5Bp5QUTgqIhGkdtWIG2xNfQ7X8qfTnUe5-NebAYiPy-VbLZ+gURAWSwwKUPJqD0FEjl4opcldWP5ikH3WfvdmA71oODZDwXVOD813O0mBYD0gyjNMiyC99m6deLma0Ze5yhe78rNNruBvJM1A-IC2gRbtMLGaPSUMpps8AZsFFOKdV0mLO1iA2YhUyhZxHh2wkv5P7kOTb+Kv6l+PD6-0rAm-MyyEb9ovj67qvhAvs-zRv+SvJ8mPfyVQRhT1omERITorCGEWADRWAgUS5F4vMJBbZOKKDhvvNCrcO7vyKrNMuhkmSn3nOmRoJoPIwDAY1aYogciAWlliNEcQEHk39HMRY7ozCbygihZm2DD5TUKvrZ6PNiFJlIeQ2AZBjIrSLLjH6jZkF5ElFBWmSxnZQT9JKCIEg0T0yZlg8Sgj7qB1Pp-cRBpJEmm0vmYg1CxZhQMEUEwwl9H6MZvuRILVLBIWYoKTIhx84mN1pYtSZIbHoDsQ4q2sxZSwzOnkV0bpBCij5CIRsGV3Ttn5DTYJr8kbFzCe+GuOkYmlikNYQmsQEIChpuidQ5MdCsSVnTAG6I+QKEMUqA+BSj4yWKQRH4Mi5EW2nk1X0lhzDmGxJWUGTT2xVNiNiLqGD2x7x6QIvpQi3hhKrhQoe5S-z8nkGIeCko4h0KRFWUUMhIjwXxEoIwHolAbKsiEopn5zGEMidE82wVo5-kKCIESF5pDxRsPMSCHpmxmGgfU2mHp8nt39sfPZPzpGyKOU4mwpzbBumYjMWEGU0l5DEDMIw-IGZKHEMEwY8kG4P0AS3d59L9Qj18sAoEgV-kNUcZCCQh4ZQegKJ6M61hEpTJaqoBwkMHkqGcIqdALQ4CcCnFHcZuh0HOgkG6F5XouKpH0CNQCqwUoWBGvnekYANXgN0O7P0SS0QcTYkkRKDSojKDPDYB2HFkVoVwdqW1NC0i2CWS6PVnpvWijrBw-Ey8XQ6P9epVFMlrXBv5ZyP6PIYhHQyMkBZnFHWq3mCcWKAZk2SVTcI1G6r5GArCjoI4Tol5yBWAsFphrdBKAxAkAUSE3QzGGpgzZxjtmmJPo5FmRsM0bSKFU04x4ELwQWFCppTokIiVsHkY8sViXdPeeO3WXdD0uXCQ0UpddZ2libZsFqg0zqbs7YlNEpq8RnirAoSplabJv2mvgn+16-y2AxEhJCHEAYJHgvIRBILOG5AyCBrJP62aFLwSI9GodiJAacbiQmbpEiSAyJKLt-5wYzFOPyasigbAocLmh-9GGe4V0voQwenkcMTIvM2XIwYh1nVpqvLRcQzpgUkHyeE-A6O3QYzW75ojz5wFYwp3+YAcC3044gTiEp3RCDhFBkSadX0qwUK6MCYEVi0v4WOlFf65PFUIcIMJkjNMIAMJYOYUhqzzDiheCV5NcjHRSUIcVJGVBWaMblI9nyXxTrQq5vkYgzoWAUGiM8tMYNNI2AupBDhFBCTodJwNo50Uqdc4UQ8roAxmEHb9TLRr5BnSPHqh5VY4iujpeMfUrmaZS1M9KSQm5UlNMEk6FZgoLA7hSYqxwQA */
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
                target: "editing resource",
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
                target: "editing resource",
                actions: "appendResource",
              },
            },
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
      clearSelectedConnection: assign({ connectionID: null, resourceID: null }),
      clearSelectedResource: assign({ resourceID: null }),
      assignClose: assign({
        connectionProps: { resources: [], connections: [] },
      }),
      assignClean: assign({
        dirty: false,
      }),
      clearTestResult: assign({
        testResponse: null,
      }),
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
          return invokeDynamo(chosenConnection, chosenResource);
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
              : stateProps[chosenResource.bodyType];
        }

        return await invokeResource(
          chosenConnection,
          chosenResource,
          null,
          body
        );
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

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
    /** @xstate-layout N4IgpgJg5mDOIC5QGMD2A7dZkBcCWGAxADaoCGEA2gAwC6ioADqrHvhgyAB6IDMAnAFYAdACYA7KMHiB46gDZRvXgBYANCACeiALQBGPfL3DBK3qL3VxADlFTq1gL6ONaTNnboS5KnvpIQZlZPTh4EZXFhSVVRfkVBfmpTDW0EHX5eEUN5XmorFUFRW15nVwwsXAJ0YTcKzwACAFtUCDJierxYetRGMC9kUlgwGn8mFjYq0MQ9XmFrfmtzaxUzUTzBPVEU3X44qItFFRyjW0FSkFqPKpryq4wmlraOrp6+4TwIYjBCIZx6y8qGBGnCCEw4ATCOjss12iz0tmi1CK2zSKmo-DmuUEgjyRT0BXOAM8N3cgPQD1a7U63V61Q+X0IFCodBB4xCEN0kkiOUW8nEenEcWx4hROg2kRUdg2kvkBQkJRcF1uZJJdSqFKe1Ne1UgE3QUH+ys8hAGLDAhtJnmBAVB7NAkJs1DEhXE8n4Kk2R2kKJkwkM4lMGSKjv5hKN1yJ6ualOeNLeuvw+otaqIv3qACc4KgAK7p5DDFk2tmTDkIax6DG7HKiD2u2IyUVSYwqcSSQTHIwVzJhy0R8P3aOal604QJvBJyNEbOMVo4AujQLF8H23TKJ2xJIGQoCXg5FHw0TCXd6HHyUzyYoZHsp6qT8mDqnD+MQPUGu+MiDMhe2ksrhDxYQkTiQwinbHFrFFFRbEAwx214awHBUXZeHEa87lvft70eR84x1F9EzfTDhEzChNBNVBGkaNhrTGYJf24Vdd2EXZxBWeRZXdQRrBFLQ+BUI9uKggxVDRax5DQlU7w1HDtVHfDx0I3sMBuSi2GTdD-gACzIfU4EICAMDAd50AAN1QABrIy71VDSH1jWSxwnIi0FUv4pOQbTdNgBBxzM5AyCtOgaMXOjlwY8J2OEI5LEFVt+TWBRRRPQ90QFC90Wscsa1ECTiSkuytRHRyDUzWAczzb5TSGDMs1zfNgp-MKwnxDFFkEnJ2zdN1eH3GtrBMeCBAKcwjADXK+yUrCY0K59Xxqsq6u+adZ3nVlQvQKYEAyJ03WoAoEi4wpFH3FYRFEC8FkyagKxA8blPy7D7KK+Sk1K8r8xNL4yHTBqlw20tNhyEwlFMRZqEyFD1F4hB8UsI8zwERQZFsBQ7owybpKe2aCPm97vjTN7Ft+9bNqlYxBERxZ+BmBxMhRMxZl3SVNjEhZNhyxVrIe6anzwubCYq4iwFI8jXOJsF-r-CsrCi1jEjiRC0p9VQjzRF1MoKdinE55zMMxma+ZxgX8yFkW51gHBxbtcK4gxNdIasa6Mh66G4KiIRpBQrWuI5spJpssl9d5uT+dqwWSIgMimSt+jmoFEQ2aSRRcjyPR6dlMQwddeP5ikNGA4aArg+K3HFtNyOak07BzNLir6hwTRekIGOmumXh4Rg5QUJPKDpEEFF5mMSRrovHIrEFPR8+5odcJDo2w5NiPNGEGA-kj9AyGaQ1iGzRp0FgfTDOMszLILiabyD2eS+Noyl5XsA180Det7QHe9+83zUH8wLaBbyXwsMLkYQ8gHB8kynECw8x9zXUiLsdsZgrA+wvFPPWRcr4vRKgvKyFEqJ-BvlpHSMAD4GSwMfCy2D-bTxks9UOC1BYuVwbXfMBCvI+VMl-AKVQRh-02hkDEMwcQFFbNIViadobs3kEeWIcQ5CdVdKhHWlDUGPQNnPBSTCjLmzwVg+ovwCLEKPp-U+XNlE83QbQvGwgtEaN0Q-fRbC-KcKBEFQstEJa8LyIBfkF5lCGHmAIFEuR+L+L2jubiihfZKiURjNBDkMEaOEEydRc50yNBNJ5GAPCAbnVmFYSwWI0RxACeIvkcwqYrFkHtRYCi-Y3jPgOFRxd4k30SZ+ZJYBUk-DICZVaRYSbZJWHMPIkooL8CUMiV2UE-SSgiBINE4NxKKLqVQrGht1EtKSUmFJaT-LoHzMQLJUsWYmFEvM+ZQh5D7kSMAywSFWKCkyIcFBMTGmz02YpG8JodL7MOTbWYsokhrHma6N0-doY6D5GdKC8wzCtgMPwZ5F9YkjneepMk6TCG9LcdbMIUh+orFiAhAU0t3SinYhiOwCF27oj5AoRZtT0L1KmjPWSqL3ywG6VikK7iAa+nyeM7E0UPSihQv1WI2J+CCgiShBUDLJKmJZSitpr0sEYt0r8sI3ixDwUlBAkBFgwWpB0DISI8F8RKCMB6JQsqonLIVdQt4qKb5fL2WAA5rjuU4sQIUEQYkLzSASjYKB4KVjGHdLkfkJKayTyWYylZqinWqo5T0jV0wzDBN5NIAUYzDW6E7H6XaGx2bU3dIi2yrzZL4MYJmHQHlq6V2rmihoDcm6pphpauY7oMiexWCsRsRgTCZUFPMbcaJWxlsDsit4Vaa11uQOZBt86m3qhbd8Sgfg1o8qlooSRLZchnkKAs7ioouIFpOMePh1qzixvlS8sxladHVrALWqu8776P2fqgeuZAABGXwDGkKMRQu1d7FXTsfbO19C7V71HXpvL9OBf3-ocRwn+bb4SSCPIKQoTYfGbFFOWYBkpJCymWFxJEKgp6DAUofQD7DjHOWo-qFD38uEuO-H9TaUJMMyg9AUT0VSkr5OAaoBw2UzWUfOOgFocBOB3k3V6tI4TnQSDdFar0PEjWegxKEwwhgjhgPzvSMACnY66E9n6PIrEkhiSQkkJK6J+IyF3NIbi10uITsLhW2kpnW5KaKCp107pPRnk07oWwGb8S5EMO6M8km5V5Xtas94nwTN9K3eFY1UgROLElLTbtUMjXwUiPkhY8wThxWvQl8+5b700JxvJ9LimdBHB2hTOQKwFjkrC2kJQGIEgClYnFnuZ5PNRm89jdR1kl6+f-rizKcwpC7ipfMcBoonRITEijBZrZYRiTGw0urk2nJKNcsu+4HlMXwCa2Z1EmxgHtb2pt7rSU0SAUlOWM8J4FB4oO8yh1ayVV0PzLNzatgMRISQlxduCR4KXOhpkMpQ0jpVKDX9y+cSLFlxmzdvzcCjwJA9PkT7BRlYwjkPHOQu5U7o6nYDzBwPb7CwrnOmu+DV2g4BqEgnwXif6dzWWeYssR5CjMO6Gptq41JdUdfLB5dl4wbgy-VAb996c6lrD5i5ykJ8kyAGAeZ5mIU9YssEeVhacTfpwku+pAKCQHVwA8wToREWHim5jY0CBBiDsGsGQjmPQ2pMaBgHaigeWIYWpfBl2vIO+ahPLDuq9pJBsL1e7NgLnZX5EICXQekWW9Dwzyx1j8F6IUtd7Ft3uISi7dDk8GQxL0zezYfdrowKyhbBbo7VuNnKoNNs2P0wDBOlOBTeY8ULwQQR+DOYoKhBVOIx3m9iXg-JbZZhAf-5IhAosAoNEZ4xnw6NRsfqYNRLJwJfSyXt689d9aS+MPi0N84aiJCswboDB2EP3mva8Nw3ljr3yJfrnrVmBtUDOs+qzhvjTL6lBFTr7g2OCpkMYMoFXp9mMtTJEsAZOvnuAS+vWqzuduSBzrjnNm3BTHMLAeDPAS7EajkpiNxLsAUO6Lvp3qAULIzvUE+ngW+ork-PBt+n+rJiQZtPCKetxNkH4n7viP2rMG1K2NYHBNIGYFVlfnlExlAFAXbHIJCviJIBuALvoDTCYAkIKAahakIM4M4EAA */
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

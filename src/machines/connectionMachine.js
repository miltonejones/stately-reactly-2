import { TableRowsOutlined } from "@mui/icons-material";
import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
import invokeResource from "../connector/invokeResource";
import generateGuid from "../util/generateGuid";
import { findMatches } from "../util/findMatches";
import invokeDynamo from "../connector/invokeDynamo";
import describeDynamo from "../connector/describeDynamo";
import resolveNode from "../util/resolveNode";
import invokeMySQL, { getTable, getTables } from "../connector/invokeMySQL";
import objectKeys from "../util/objectKeys";
import encrypt from "../util/encrypt";
const connectionMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGMD2A7dZkBcCWGAxADaoCGEA2gAwC6ioADqrHvhgyAB6IAsAjADYAdAE4ArONEBmQdN6SATP0XiANCACeiALT9xADhH8A7OJOLpEk9PmKAvvY1pM2duhLkq-ekhDNWd04eBGkpYV5qQRNRRWp4g2pbDW0EPWl+A2FLUSTBJPF+Xl5BR2cMLFwCdGEXSvcAAgBbVAgyYga8WAbURjAPZFJYMBpfJhY2auDEWWF+ahkVGMVBWOpFFN0VTLETfIMDURMDg3FSpxA6t2raiuuMZtb2zu7e-sJhnAarqoxRzgCkw4fhCikUojmgmUhyMJ3kvE2aUKigixWoZyiolEAhMZUud1+NR+jRabQ6XR6fRqeAgxDAhAoVDoAImQRBugy1DEUME-FEcl44Ns0kROhMJi5vAsvLyUpOeOJN0VD1JzwpbxqkEm6Cg3wJ7kIgxYYD1rkJ-z8gLZoBCOlsIhM8wMJRkSWxElFkWkwhiRSMvFEiXEqnO5TN7lu4eqjzJL0p-WEWvwOtN9WqHzAXwATnBUABXLPIEbMy2sqbshAGPlifnSRQ4qFHEVaXSqfgRcUh2S8vlhBX6pUDlVPcmvKmJiDa3XKjx5xhtHDFsb+MvAm2IcEiaGnXjSRJQoyIvniH11orxcTowSnftRjCRtPD2Pq8dJvApmcMiBM5dW8vrhAoRPdZ+SERRTkES8DE9AwUWoIQzj3ahnSxaRcQuGcH3udAYzVMcEzfD8hw8YZkBzHALXGQJ-24RAzi3KVg1EXtilUI8JFPZRInRK8bww4isMJXDR3jTVJ2TadiMICAs16SiV2otdaLSfQ92EcQFEEAMBCEGRoJbBAzGEa9zGoGIBAOagFFvR8iWI4S4w1Ccp1TbDhBzChNENVAmiaNh5L-JTbXtGsTGKQQtOxQwTEReRhD3MKq34eFkNDfE7zsjKHJfAjxPfSSMtuXy2FcoTkAACzIHU4GkjAwGEd8ADdUAAa3qzCZ2y-CxJcjqfL8r5OoqqqYFgBAmtQZAyHcUYAtXdBplCCKIhlGJxUdOIolFfQ4OYvZEkDKt6wcfjCs61URKcwjdRzWB80LekjWGBpbvuos5sUhaKzCuZ62YowgOFI9rwhIxMgsY5VCkUQbLc86R0c188pTV6CyLQg5wXJcWU+xbYN4H0rPmKV62KGKDIEAmijMOtkRsAwwthwlBJJBGcp6iSXtzNHHrpMgsw+oEvoArSTzOWJwXrPdlHUAzjhMYR1j5SJHSiPZ0LDWyWejC7EdylzUYejNs25h7BetZTLEsH1+SlcVicDREwq5Cw92iFZVexJmI3h59uucznDaLdywE87ziooksqKFxbla5OxAz2fYmyPcCT2UdbDl4BnogMb3Byy3X2YD-KubunmQ7DxdYEj395tj+IUT5Z1gxUD3m1Sfgu4J938YMTkpBOzW4fsov-eusu3vqjyIC8xlzZokIVGQ4QUOSwU+7Mo94JPIQkkUCxuJkNK+sLtnx+Rm7TeDmfNFqcrsBayeeYaHBND6QgF6CxBksvVeqwEMGMythyad1YupI4Ah+TujzqdLWvs8KiRLija+09Q6z2EDAL4s90BkBaHqYgeYmjoFgLVLADV0DNTatre8CDLpIwNqgyuGCsENBwXg1ABCiEkPGpQya01qizSjgpGOFYhByA7NEcW2dVinCPGcLIDNwLYnPOscU+daGj3PkgieQd2r9RKno74lVqqkIgHVChVD9FnS0X7HRl9n4PSKgNRxRZjEjTgLw5qU0Zp0C-sLZSRw4JJBUNLWC4g0JHnWtkMy0Jl4M2OBozKtkur2MYeXJx1cTYZLcZ8CSZiLETWoafFJY80mByYVk1xJo8n5TGhNHxgi-HCMCgEkIMgUQyCOLyWQMgbCy1SKcE84oQKXhAnIaQSSaE4TKVdBxejhCMlLouLMTRDQmJgP42O4ITxdKdFIeEYQnY7D2F3CQJQVDaSmXQvWHNS4LKWSmFZazYBkEatjUsuMxEHwVhFU4IFiiJD2NvLEitjwHFsLBKyJ8BI3OLrophjzdTPMNFVIsxAtliKEO2SIhxMgLFUDTJ2AgIgJOzhpMI5gh7pXgbYxBTkkWlQNFNdA6LMUAR0IkVelgwh9PgnyGIopDgKylJCwBRQKXXLpfQhMjLPzDWquy5SMQ5iXkMFYKISQ9wd10BIEQ2c9hxEdPoQovApVnzsQy78pdPyvPeUqpeWR8jiz5FifQgLQG6GKATfuCVojogUIkuBI8LX0vHIyvR6yPEOsQI6Lce5BT8hWErAZugbAKz3EUSwvIBA8vNaU7RVrJwoJyY9NFYAMUtPrhWYMJ4AanAsPEY4hxPQkuxNIMyZyCUCHzdhVJRb7moI+G8j50cLZL13D6-ukFHTLFTWkHskJciFDbsxL2wbmZwv9kYxgOYdAVUfvfR+TLoxvw-jGhA2KfXujCDYb1CIDI6BWO2QwDNAwSEsCrDWNKQ0FsteOHde6D3IBakekDJ6HhnvpJQHwONREATAvqmwUQlB5AZqKQwkJeTTt7LEWw4he1CVmQB1BDRd1gH3Q-EDmDMxsM0Lg-BOAyAACM6QFPIUU6xtLQ0ypqIBijwHQOsPYYxljbGvH8N8bQC94MURoQ-W2a8GQNiPqrMZQU0ps4KESPWQjrN-0JhcAAMzwKsnozGABWbg2GyUYIQTQcAL16EKLvCUEUogKFyOsUUthJQrtyAfMyuR+R6Z1oW8cxnTNNHM1Z3ANneiEHQKgJz-TuX91gqcX++lUjOe9FIUwGI9h1ixGajdPtpW3OEJjaaJoZzdCqhAapsBhDDHQI1oaGyarmI43w4psKKvF2q4uCDJCGgNaay1-o7X7IKtGhJxpfxml1y+Ry5KKqYgdt3GFbEqgH05fMGLdERR5CmqUaFp8YaExDdq8RerbWJutca0Y2bXXCm9a47+vtxGrvzhqyNu7T3UHNce9U9xpj5sCMW9JqtK3lI6ChFyd9Kh+SISTRhiUYhJDHHc9EM51yhj5TIfVTj0zagE51BDqTTnwSSgkBC-QVYInbQie2Sy2cOmJClPwc7Mzwv6wqaW6StmZM7XUvEZCYJdvMXnWiYyl5ih1nCrenn-aIsYBM2ZoxMkEsOdgDJ46xljg7fyJSyQiJViryOMdpIzpkowzKwXP9l2ajXaa0TyxrUPuboG-7V3ej6l8IW+gIRy34PKVOFkKytb8verCqKCRx9Mhc4PlSkLDvNE8cq5FzXpHtd2aSzJ2Q3oqw2HbUINC3mDLyG9FbyCjFAyrD7On5JX2+d3JLVPZhd9BOg6g5-WDnyw9L16TE0wdZjhJGAfI+CqJGdWC7gsMwjgLhJYgHATgM44Pjq2AcYZ6azi7jBlvR9QgbCG6pZ+g4Lopk0jpFvxeuhJAiHS9udEGRHTM+rFZWQZh9DExWCrt9gEq0otHoP3ArOKGhAfm7PMJ6ipN-mIAzIPJli3KVsPN7pnsXLfmAPft-GkB2u2I6IGPPjLNqnAToBpBCBYGsNEDYD2N+iUq3gZu3gVLZLgW0l6vkHLhXsUA3qsOQTkBAqYKsGtr5ruIAW3sgqwW5LfOwYtOBIoqoLIIkHuIdKIKKLTrCJtD-jEIdDCjYpgRfL1P1hHCNmDqNHIRWDoLmtwRKLwQDEcNtJEIrBvAhPoFEKoLAugeVoYeUoOqWpYQBEYHJnIHkMoRZCpqkIYA6LyOBOBJOs6BIcwVIdUl3oEcpPMOBNkAfNnJZB5ntj-PEavIxMlOBJBGnt4Y7kwc7ikQsrfGBk-EYlBukUvGZFuDkScPEFpAUZerLvIGFEapkFIJIEkTUQiqWl3jRtgvRhwlwsQvAIPtvpejyKvMhGPvBMQXAUUEIMUQMVIN-jmqMbxrUUwvUaQBQJAC0T-GEN6MUExIUElM6FsfsYrCVuqnQYKGgT+hgU7sceMZ3mgKYc9p1gsWOg-pevjNkIKOEYYKoB6AZMId6BFNeOvMxFYBFEcZVv8RXFUkYrUjqKCSIkscxPHKEUXteBEYiG6sZCbrJm0SMc3tMqrvzv4Z3oys8lcZesdsZInhKJYIlD0TuD6CUM6D2CsGnJicXHKsRJyXoDsQcHELCMGOBPBOQYaj6BEvWEGCZEcJKf7BGqgpycqT6FIruCIW3IIPHlZPFKsIfl3FINEPodxr8ZVvxpRo-JyclOiMUQzPvGZDYD5oUPFHuIkFZEcLEMUHqUgm6YJg0WYc0YseCb-MXgan6ZAaKCsMXglG8diB5lGU5DGVRkJrRiJpwkxqxuvomXgUMYonGryNeMhkUBmRIuluKBBLeruARoyVukgtntFqgJZtZnnrKTtBCMmUUJBJYFWNtMtHyPWfEMlI3nIPmeOK7nVmNvdv7iOUbj6PvlpDAcfjlteFyHyMdCdhpBHiuT9ljP9huYDqWsDlNmYS9oSSAVYaYCSpAWYPuUfuQYPDyX9DINnGtleS7r9sNuueNv7pNpuaRi+SOWoqvI2iqWUf3OoY+v+asIBfIFWGhPjhMDqJydnBEFEFmpeP0QAszoKOpGaZ2GYImtSowURpIX2aDsOVWRwZevWPHMhF5nIGFNnJERuCoHLmcPLteNEHWJMt2T7kgn7kDp6foArFmpBM6jmlKEKlkLyUcDECcIYMvvYEAA */
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

              secret: {
                target: "editing connection",
                internal: true,
                actions: "assignEncryptedProp",
              },

              drop: {
                target: "confirm object drop",
                actions: "assignConnectionDropMessage",
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

              drop: {
                target: "confirm resource drop",
                actions: "assignResourceDropMessage",
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
                    always: [
                      {
                        target: "get dynamo columns",
                        cond: "columns needed",
                      },
                      "loaded",
                    ],
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

          "confirm object drop": {
            on: {
              yes: {
                target: "update connections and resources",
                actions: "dropCurrentConnection",
              },

              no: "editing connection",
            },
          },

          "update connections and resources": {
            states: {
              "send connection changes": {
                invoke: {
                  src: "sendConnectionUpdate",
                  onDone: "send resource changes",
                },
              },

              "send resource changes": {
                invoke: {
                  src: "sendResourceUpdate",
                  onDone: {
                    target: "#connection.connection modal is open.idle",
                    actions: "assignFirstConnection",
                  },
                },
              },
            },

            initial: "send connection changes",
          },

          "confirm resource drop": {
            on: {
              yes: {
                target: "update resources",
                actions: "dropCurrentResource",
              },

              no: "editing resource",
            },
          },

          "update resources": {
            invoke: {
              src: "sendResourceUpdate",
              onDone: "editing connection",
            },
          },
        },

        initial: "idle",

        on: {
          close: {
            target: "closing",
            actions: "clearSelectedConnection",
          },

          "set connection": {
            target: ".editing connection",
            actions: "assignSelectedConnection",
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
          actions: ["assignConnections", "assignFirstConnection"],
          cond: "no connections are present",
        },
        {
          target: ".connection modal is open.editing connection",
          actions: ["assignConnections", "assignFirstConnection"],
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

        return (
          ["dynamo", "mysql"].some((f) => chosenConnection.type === f) &&
          !context.tableList
        );
      },
      "columns needed": (context) => {
        const { connections } = context.connectionProps;

        const chosenConnection = connections.find(
          (c) => c.ID === context.connectionID
        );

        return (
          ["dynamo", "mysql"].some((f) => chosenConnection.type === f) &&
          !context.columnList
        );
      },
      "no connections are present": (_, event) => !event.connections?.length,
    },
    actions: {
      assignConnections: assign((_, event) => {
        const connectionProps = {
          resources: event.resources,
          connections: event.connections,
        };
        // const firstConnection = event.connections[0];
        // const connectionID = firstConnection?.ID;
        return {
          connectionProps,
          // connectionID,
          // chosenConnection: firstConnection,
        };
      }),

      assignFirstConnection: assign((context) => {
        const { connections } = context.connectionProps;
        const firstConnection = connections[0];
        const connectionID = firstConnection?.ID;
        return {
          connectionID,
          chosenConnection: firstConnection,
        };
      }),

      assignSelectedConnection: assign((context, event) => {
        const { connections } = context.connectionProps;
        const connectionID = event.ID;
        const chosenConnection = connections.find((c) => c.ID === connectionID);

        return {
          connectionID,
          chosenConnection,
        };
      }),

      assignStateProps: assign((_, event) => ({
        stateProps: event.attr,
      })),
      assignSelectedResource: assign((context, event) => {
        const { resources } = context.connectionProps;
        const resourceID = event.ID;
        const chosenResource = resources.find((c) => c.ID === resourceID);
        return {
          resourceID,
          chosenResource,
        };
      }),

      assignConnectionDropMessage: assign((context) => ({
        message: `Are you sure you want to delete connection ${context.chosenConnection.name}?`,
        caption: "This action cannot be undone!",
      })),

      assignResourceDropMessage: assign((context) => ({
        message: `Are you sure you want to delete resource ${context.chosenResource.name}?`,
        caption: "This action cannot be undone!",
      })),

      dropCurrentResource: assign((context, event) => {
        return {
          dirty: true,
          message: null,
          caption: null,
          chosenResource: null,
          connectionProps: {
            ...context.connectionProps,
            resources: context.connectionProps.resources.filter(
              (res) => res.ID !== context.resourceID
            ),
          },
        };
      }),

      dropCurrentConnection: assign((context, event) => {
        return {
          dirty: true,
          message: null,
          caption: null,
          chosenConnection: null,
          connectionProps: {
            ...context.connectionProps,
            connections: context.connectionProps.connections.filter(
              (res) => res.ID !== context.connectionID
            ),
            resources: context.connectionProps.resources.filter(
              (res) => res.connectionID !== context.connectionID
            ),
          },
        };
      }),

      assignEncryptedProp: assign((context, event) => {
        const chosenConnection = {
          ...context.chosenConnection,
          [event.name]: null,
          config: {
            ...context.chosenConnection.config,
            [event.name]: encrypt(event.value),
          },
        };

        return {
          dirty: true,
          chosenConnection,
          connectionProps: {
            ...context.connectionProps,
            connections: context.connectionProps.connections.map((res) =>
              res.ID === chosenConnection.ID ? chosenConnection : res
            ),
          },
        };
      }),

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

        if (chosenConnection.type === "mysql") {
          const res = await invokeMySQL(chosenConnection, chosenResource);
          return {
            columns: objectKeys(res),
            records: res,
          };
        }

        if (chosenConnection.type === "dynamo") {
          return await invokeDynamo(
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
        if (chosenConnection.type === "mysql") {
          const res = await getTable(chosenConnection, chosenResource);
          return res;
        }
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
        if (chosenConnection.type === "mysql") {
          return await getTables(chosenConnection);
        }
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

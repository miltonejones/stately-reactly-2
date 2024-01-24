import { TableRowsOutlined } from "@mui/icons-material";
import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
import invokeResource from "../connector/invokeResource";
import { findMatches } from "../util/findMatches";
import invokeDynamo from "../connector/invokeDynamo";
import describeDynamo from "../connector/describeDynamo";
import resolveNode from "../util/resolveNode";
import invokeMySQL, { getTable, getTables } from "../connector/invokeMySQL";
import { connectionActions } from "./actions/connection";
const connectionMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGMD2A7dZkBcCWGAxADaoCGEA2gAwC6ioADqrHvhgyAB6IAsAjADYAdAE4ArONEBmQdN6SATP0XiANCACeiALT9xADhH8A7OJOLpEk9PmKAvvY1pM2duhLkq-ekhDNWd04eBGkpYV5qQRNRRWp4g2pbDW0EPWl+A2FLUSTBJPF+Xl5BR2cMLFwCdGEXSvcAAgBbVAgyYga8WAbURjAPZFJYMBpfJhY2auDEWWF+ahkVGMVBWOpFFN0VTLETfIMDURMDg3FSpxA6t2raiuuMZtb2zu7e-sJhnAarqoxRzgCkw4fhCikUojmgmUhyMJ3kvE2aUKigixWoZyiolEAhMZUud1+NR+jRabQ6XR6fRqeAgxDAhAoVDoAImQRBugy1DEUME-FEcl44Ns0kROhMJi5vAsvLyUpOeOJN0VD1JzwpbxqkEm6Cg3wJ7kIgxYYD1rkJ-z8gLZoBCOlsIhM8wMJRkSWxElFkWkwhiRSMvFEiXEqnO5TN7lu4eqjzJL0p-WEWvwOtN9WqHzAXwATnBUABXLPIEbMy2sqbshAGPlifnSRQ4qFHEVaXSqfgRcUh2S8vlhBX6pUDlVPcmvKmJiDa3XKjx5xhtHDFsb+MvAm2IcEiaGnXjSRJQoyIvniH11orxcTowSnftRjCRtPD2Pq8dJvApmcMiBM5dW8vrhAoRPdZ+SERRTkES8DE9AwUWoIQzj3ahnSxaRcQuGcH3udAYzVMcEzfD8hw8YZkBzHALXGQJ-24RAzi3KVg1EXtilUI8JFPZRInRK8bww4isMJXDR3jTVJ2TadiMICAs16SiV2otdaLSfQ92EcQFEEAMBCEGRoJbBAzGEa9zGoGIBAOagFFvR8iWI4S4w1Ccp1TbDhBzChNENVAmiaNh5L-JTbXtGsTGKQQtOxQwTEReRhD3MKq34eFkNDfE7zsjKHJfAjxPfSSMtuXy2FcoTkAACzIHU4GkjAwGEd8ADdUAAa3qzCZ2y-CxJcjqfL8r5OoqqqYFgBAmtQZAyHcUYAtXdBplCCKIhlGJxUdOIolFfQ4OYvZEkDKt6wcfjCs61URKcwjdRzWB80LekjWGBpbvuos5sUhaKzCuZ62YowgOFI9rwhIxMgsY5VCkUQbLc86R0c188pTV6CyLQg5wXJcWU+xbYN4H0rPmKV62KGKDIEAmijMOtkRsAwwthwlBJJBGcp6iSXtzNHHrpMgsw+oEvoArSTzOWJwXrPdlHUAzjhMYR1j5SJHSiPZ0LDWyWejC7EdylzUYejNs25h7BetZTLEsH1+SlcVicDREwq5Cw92iFZVexJmI3h59uucznDfRmS5JLKihcW-gdvU+JkLBVQA30RE0WMy9ijrcKwg19Ktd9vDRID-Kubunn3LATzvOKiiw4UiOKz5fJjOVjIo+KZL+CPHJhEOKwtNMJI4nEb3Byy3X2cLlHTaLMuK8XWBq9-ebI-iFE+WdYMVA95tUijopjIsfGDE5KQTs1uH7LH-3ruLt76o8iAvMZc2aJCFRkO7xO7EPsyj3gk8hAHhYbiMg0p9VHmzK+yMbpTzvuXB+tRyrYBajfHmDQcCaD6IQZ+QVEDJXROpcwMQFhoXFI7AyYFgI7nmOKCKlh+DD3vHnS6SMDYwJnvAiqSCUEPTQRg+klAfA4zrgBZK1sGb7kDIGeQWkjzBhEAGJQwZZDrAZgwzKtkuoF2vkHWBnlhAwC+A-dAZAWh6mIHmJo6BYC1SwA1dAzU2ra0YRfCBWioHcOnvfTQ+jMwNCMSY1AZiLFWPGvYya01qizRroFYWyl9AxDEKcQozFJGKAsEeWQBNmLmDSXICU+heBqKcThS+bjWElwekVAaHiTTDWqtYiAdU7EOPagJJhesOZFx0VUkqOjviVXqaE5qU0Zp0GwbEkIRw4JJBUNLWC4g0JHnWtkMy0I34M2OEU9p49tFsLnibCpRYGifAkg0ppE1HFgI0aUq67jun7JqcczMpyhnhNGbQcZi0ZAohkEcXksgZA2FlqkJJPoJTgkvCBOQ0gtkuL9mUwObDGRF0XFmJohoBkwE+fXCFYgrBOikPCMITsdh7CjhIEoKhtKwvAfC255Tb7CGRSmVF6LYBkEatjUsuN651ghGYdEDN5DOmiAichUQRBVkMKoOIvIAwGBpdc1x9LEWHPqsy3UrLDRVSLMQbFIihDtkiIcTICxVA0ydgICIGzeA7jCDkxV2FNFOQ1aVA0U10C6v1cpHQiRu6WDCIC+CfIYiikOArKUthnT6CKBpGFp1c5wvzi678RdPx1KxdEpe30IT6EFVYKISQ9zb10BIeRDMoRmSjpIIojqhI3PHK6z87LOXetflkfI4s+RYgKba8mqQdDFAJkfBK0R0QKE2Qm8+tLk2NtTZPNVGKRpcvDhbEIjotx7kFPyFYStgW6BsArPcRRLBytmfGs+zNtn+1dTo7VnqwB6qzTygCwYTwA1OBYeIxxDieitdiaQVa+RmoEHW1mdK52TgXbfD4HKV21zXbg3cw6j6QUdMsfdaQeyQlyIUTeKTClTqvUm5hCY+mMBzDoThyAWoIK4Z1dBmC224Lld3d0Wd4TFFFCsdshgGaSKUSrbOVynUNrIzAhoFGwBUcQTRujNG3XRkY-wwR3LhFxJ5B2QDkFgx5AZqKQwkJeSod7LEWwQ8iM+xIx0suarJOUeo7RgxfjNDGNMTgMgAAjOkZzbEXNaWdaz49yMOdk053x-j3NeZ868kZkSxnPvU+2iw8UYjBjbNeDIGwDK+vbFpNJKxbUKESPWMDOtlXjhcAAMzwGinonmABWbg-GyUYIQTQcBmMqUKP-CUEUogKFyOsUUthJR4dyGksyuR+RlafLOhM1XatNHq013ALXeiEHQKgLrYowj+qPrBU4yVDDbQWepPaGI9h8q9pZkeSqIMJkxtNWpxFuhVQgDU2AwhhjoA+0NTFNVGl+bCZctpQX-ZPcXIpjAb3fufe+-0P79kM1wFixEv4CXF4vp9clBJMRAO7jCtiBOBmjKXkKMhinDNT452nfd+bNRIcvYyrDj7Oivs-bZxJlHvn6r+eKcU5144mfQ6sQ0d78POePJ52j95O3K2JOYpuRCO7SdcgkOYAGatyWzZKRVhbGAat1b6SHNrHXYBdapSiaIhxBT5HtZIREqw2OOl3EkaNVhddC4N+gI3y2Tetc29txLiGEDJTkN3UwVhdxCDQsNgy8hvRHAQoxQMqw+y3ecTO0jjP5zPc+zYvnIOAuJuzzZkX7PZfxY+SHl+iBThZCsm+qQRQyZioHRHkBmQpRLByTNzPRIhj5UL801qJe4ZD51FXjHNesdJdbLkCIEgDgZEMKpU7GRu6JFtd87fjpHAXC2xAOAnAZxCND3oA4J5xRoTOLuMGP8ctCBsPvUykQoIjqKTSOk5+69IjON3NLJkEGBkI6KdtWFZLIGYDGlZCsF7mJrEjEotJfmhGCrflpG7NQttJAYknsKoOsJIKogPoLggQ1LSGAL-jgmkIBu2I6FIkrqpEfP2roBpPypLGrDYD2MJmDmXjsu4mfmphfiUFyJBHHsUGnqsMwWkF3C3jEBFMKPIEIPAfrp0kRIVF4pQRMhuAcP6gsteO7odKIKKJKGnrBPEFATEIdKAjwfTjnhPAVImlXKLv0suvAIIX-oOioKnGIfKhFEcNtJEIrIKFWJBHmkBAqsQdegil0jApoXjFCPFHIHkLINGrBIiIYA6LyAnDurkIzJEeDtEdBqXBoe4VQfMKYEvuCPBMhFiISp3HWGIPEheEcAGMoQ9qodAmquwt4o5o8spnEfXFECeAGFUU6LUTIMDGCIARpKTPuPsG0QzvYTUt0T4oYq5gEkEpYm4aun-mBI3vELkPKnsMxLIs6EvgNpIICsxAsXYbsl0V4sIKQBQJAAMSIooTbFiBKIBvBGhPpDvL3N3McZBNeHyKYBZpelZrwZAgyqXGgE4X0jzq8XEvjNkIKCkcVqoB6OQldsZBFFWPIMxL3NYYFlCYUZ0Yyg8n0icvlNsQhn-sxFyLIIBkydeBZNlqkD2riTMtTmZDpjcTZncYyq6qykia-EUN6OnryOCmhEVoiDuD6CUCKlHCsOBOCbTsRqSSmlBg4dhKKVsEIFvnELCOlokKYKKHgT6AsvWEGCZEcPyePLerEaUVoQgOlj6NEHGqsMqSsKKPkATACvftWvyHsPaf7CFtJo5nqWHoBu+n2gPGZDYCNoUPFHuLBJYVYOBMlKGQXOGTJkgvJsggxnwlGcdt6M6AzPGTftxhHgdpYYNpEFpNmU5LmY5qsS5m5oEh5t5ifs6ZHA3oCUILyNeDYPBO3q2DWQlMcIhOYLuGqSJvWioZGH7its1qblGXoExHMGEBkCUEolWNtMtA3AAj8ZKReuqZCbYeXnnlDjOKzp9uuaYIcGgWYBgQ-lIToPoXMLEFKNiAINeMSaXpeePCLreeLnDuzgjnDv9q4Q+WFLQYenfpgY-gOifMZN+ahLarjk2cLteczrZHeRBVLgiQDrSUgRWHoOsArDyeBCoplkYTlqhasH9DIJhWhNhT7suQHr0CWfWIyTUfEHksUGkQZMoNbpIJBFZP+TYJYOxbnljPeb2fXPEnMHbhiGcK3u+ToV3mtDECcIYFspPlAFGbahEFECepePIMcEUKdoKOpLuNEBDDMbEAfvYEAA */
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
                    target: "ready.loaded",
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
          !context.columnList?.length
        );
      },
      "no connections are present": (_, event) => !event.connections?.length,
    },
    actions: connectionActions.actions,
  }
);

export const useConnection = (handleClose, handleUpdate) => {
  /**
   * Executes a resource based on the given context.
   * @param {Object} context - The execution context.
   * @param {string} context.resourceID - The ID of the resource to execute.
   * @param {string} context.connectionID - The ID of the connection to use.
   * @param {Object} context.stateProps - The state properties.
   * @param {Object} context.connectionProps - The connection properties.
   * @returns {Object} - The result of the resource execution.
   */
  async function executeResource(context) {
    const { resourceID, connectionID, stateProps, connectionProps } = context;

    const { resources, connections } = connectionProps;

    const chosenConnection = connections.find((c) => c.ID === connectionID);
    const chosenResource = resources.find((c) => c.ID === resourceID);

    if (chosenConnection.type === "mysql") {
      const res = await invokeMySQL(
        chosenConnection,
        chosenResource,
        chosenResource.page || 1
      );

      return {
        columns: Object.keys(res.rows[0]),
        records: res.rows,
        count: res.count,
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

    return await invokeResource(chosenConnection, chosenResource, null, body);
  }
  /**
   * Retrieves table data based on the given context.
   * @param {Object} context - The context object containing resourceID, connectionID, and connectionProps.
   * @returns {Promise} - A promise that resolves to the table data.
   */
  async function getTableData(context) {
    const { resourceID, connectionID, connectionProps } = context;
    const { resources, connections } = connectionProps;

    // Find the chosen connection and resource based on their IDs
    const chosenConnection = connections.find((c) => c.ID === connectionID);
    const chosenResource = resources.find((c) => c.ID === resourceID);

    if (chosenConnection.type === "mysql") {
      // Invoke the MySQL connector to get the table data
      const res = await getTable(chosenConnection, chosenResource);
      // alert(JSON.stringify(res, 0, 2));
      return res.rows || res;
    }

    if (chosenConnection.type === "dynamo") {
      // Invoke the DynamoDB connector to get the table data
      const res = await invokeDynamo(chosenConnection, chosenResource);
      const items = resolveNode(res, ["Items"]);
      return items.columns;
    }
  }

  /**
   * Retrieves tables from a chosen connection based on the connection ID.
   * If the chosen connection is of type "mysql", it invokes the getTables method from the MySQL connector.
   * Otherwise, it invokes the describeDynamo method from the DynamoDB connector.
   * @param {Object} context - The context object containing the connectionProps and connectionID.
   * @returns {Promise} - A promise that resolves with the tables from the chosen connection.
   */
  async function retrieveTables(context) {
    const { connections } = context.connectionProps;
    const chosenConnection = connections.find(
      (c) => c.ID === context.connectionID
    );

    if (chosenConnection.type === "mysql") {
      return await getTables(chosenConnection);
    }

    return await describeDynamo(chosenConnection);
  }

  /**
   * Asynchronously updates the "connections" property in the context object with the given connections.
   * @param {Object} context - The context object to update.
   * @param {Array} connections - The connections to update the context with.
   */
  async function updateConnections(context, connections) {
    await handleUpdate("connections", context.connectionProps.connections);
  }

  /**
   * Asynchronously updates the "resources" in the given context's connection properties.
   * @param {Object} context - The context object.
   * @returns {Promise} A promise that resolves when the update is complete.
   */
  async function updateResources(context) {
    const resources = context.connectionProps.resources;
    return handleUpdate("resources", resources);
  }

  const services = {
    sendClose: async () => handleClose(),
    testResource: executeResource,
    describeTable: getTableData,
    describeResource: retrieveTables,
    sendConnectionUpdate: updateConnections,
    sendResourceUpdate: updateResources,
  };
  const [state, send] = useMachine(connectionMachine, {
    services,
  });

  return {
    state,
    send,
    ...state.context,
    actions: connectionActions.actions,
    services,
    states: connectionMachine.states,
  };
};

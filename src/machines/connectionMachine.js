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
    /** @xstate-layout N4IgpgJg5mDOIC5QGMD2A7dZkBcCWGAxADaoCGEA2gAwC6ioADqrHvhgyAB6IAsAjADYAdAE4ArONEBmQdN6SATP0XiANCACeiALT9xADhH8A7OJOLpEk9PmKAvvY1pM2duhLkq-ekhDNWd04eBGkpYV5qQRNRRWp4g2pbDW0EPWl+A2FLUSTBJPF+Xl5BR2cMLFwCdGEXSvcAAgBbVAgyYga8WAbURjAPZFJYMBpfJhY2auDEWWF+ahkVGMVBWOpFFN0VTLETfIMDURMDg3FSpxA6t2raiuuMZtb2zu7e-sJhnAarqoxRzgCkw4fhCikUojmgmUhyMJ3kvE2aUKigixWoZyiolEAhMZUud1+NR+jRabQ6XR6fRqeAgxDAhAoVDoAImQRBugy1DEUME-FEcl44Ns0kROhMJi5vAsvLyUpOeOJN0VD1JzwpbxqkEm6Cg3wJ7kIgxYYD1rkJ-z8gLZoBCOlsIhM8wMJRkSWxElFkWkwhiRSMvFEiXEqnO5TN7lu4eqjzJL0p-WEWvwOtN9WqHzAXwATnBUABXLPIEbMy2sqbshAGPlifnSRQ4qFHEVaXSqfgRcUh2S8vlhBX6pUDlVPcmvKmJiDa3XKjx5xhtHDFsb+MvAm2IcEiaGnXjSRJQoyIvniH11orxcTowSnftRjCRtPD2Pq8dJvApmcMiBM5dW8vrhAoRPdZ+SERRTkES8DE9AwUWoIQzj3ahnSxaRcQuGcH3udAYzVMcEzfD8hw8YZkBzHALXGQJ-24RAzi3KVg1EXtilUI8JFPZRInRK8bww4isMJXDR3jTVJ2TadiMICAs16SiV2otdaLSfQ92EcQFEEAMBCEGRoJbBAzGEa9zGoGIBAOagFFvR8iWI4S4w1Ccp1TbDhBzChNENVAmiaNh5L-JTbXtGsTGKQQtOxQwTEReRhD3MKq34eFkNDfE7zsjKHJfAjxPfSSMtuXy2FcoTkAACzIHU4GkjAwGEd8ADdUAAa3qzCZ2y-CxJcjqfL8r5OoqqqYFgBAmtQZAyHcUYAtXdBplCCKIhlGJxUdOIolFfQ4OYvZEkDKt6wcfjCs61URKcwjdRzWB80LekjWGBpbvuos5sUhaKzCuZ62YowgOFI9rwhIxMgsY5VCkUQbLc86R0c188pTV6CyLQg5wXJcWU+xbYN4H0rPmKV62KGKDIEAmijMOtkRsAwwthwlBJJBGcp6iSXtzNHHrpMgsw+oEvoArSTzOWJwXrPdlHUAzjhMYR1j5SJHSiPZ0LDWyWejC7EdylzUYejNs25h7BetZTLEsH1+SlcVicDREwq5Cw92iFZVexJmI3h59uucznDfRmS5JLKihcW-gdvU+JkLBVQA30RE0WMy9ijrcKwg19Ktd9vDRID-Kubunn3LATzvOKiiw4UiOK2Vrk7EDPZ9ibI9wJPZR1sOXgGeiAxvcHLLdfZwuUdNosy4rxdYGr395sj+IUT5Z1gxUD3m1SKOimMix8YMTkpBOzW4fskf-eu4u3vqjyIC8xlzZokIVGQ4QUOSwV97Mo94JPIQkkUBYbiMg0p9WHmzC+yMboTxvuXO+tRyrYBalfHmDQcCaD6IQR+QVEDJUvG-KsAhgxmVsOTLerF1JHAEPyd0A9Tq5zPhAgul8g6wM8ggpBKCHpoIwfSSgPgcZ1wAslVY2R4I2EAYkaQJCjyXnbMUKs4grBRwWGYQe9486XSRgbGBU94EwC+HfdAZAWh6mIHmJo6BYC1SwA1dAzU2raw0Ywv2zCoFcMnrfTQwgDENCMSY1AZiLFWPGvYya01qizRroFYWykhByA7NEcWvdVinFkdeN+e9sTnnWOKdRmVbJdTcTokuD0ioDQ8SaYa1VrEQDqnYhx7UBKaL1hzIurDyklVYd8SqNTQnNSmjNOg2DYkhCOHBJIKhpawSUWQ3B60xEWEyC-Bmxx8lOJwufYpgddEzxNqUosDRPgSVqfUiajiwGFK2VddxHS9mVKOZmE5-TwlDNoCMxaMgUQyCOLyWQMgbCy1SKcE84oQKXhAnIaQ6yWmjxYboxkRdFxZiaIaXpMAPn13BCeH5TopDwjCE7HYewo4SBKCobSMKXH5xuSU6+whEUpmRai2AZBGrY1LLjLF4pjImRAgosyggf5YkVseA4thYJWVAc06lWj9Y7IOfVRlupmWGiqkWYgmLhFCHkchf6CxVA0ydgICIqze4aTCOYY+OdT7gNcU5ZVpUDRTXQBqrVykdCJDfpYMIAL4J8hiKKQ4CspQSqIUUC1VK7U0vHI6z81SMXRIXt9CE+h0QH1yPkCVm9dASBEL3PYcRHT6EKLwKNVymEOu-EXT8rL2XuuflkfI4s+RYn0AouZaRigEwPglaI6IFBrPobait9rY3VvHoqtFI0OXhwtiER0W49yCn5CsJWQLdA2AVnuIolheQCB9eW7CRSq2TkndfNVrqwCaqTVygCwYTwA1OBYeIxxDiehNdiaRxbcixAEEeoS1zx1nugVOuts7a7ztwbuHtB9IKOmWButIPZIS5EKOvZiXth3M1hf7bpjAcw6AqkgjhyBkGdXQZghtuD91v3dFneExRRQrHbIYBmgYJCWBVtnS5x6gMJnw4R4jZHSPkfspRvhAjOVCLiTyDs0jILENkAzUUhhIS8jg72WIthxAAdZmOgTMCGgEbAERxBInfH+NMTgMgAAjOkpzbHnKaWdWVrSy6KuM0J8zLUfGZj8ZoYx1m7MOZeYMyJwzb0ycbRYeKMRgxtmvBkDYBlPXti0oAlYvcFCJHrHpnWlbxwuAAGZ4BRT0WzAArNwfjZKMEIJoOA1GVKFD-hKCKUQFC5HWKKWwkp0O5EAWZX90rXPRrlZlUr5XUBVZqyHer6BUDNbFGEb1B9YKnDwfpVIeglGUNMBiPYdYsRluwz7Nzo9MbTSqcRboVUICVNgMIYY6AHtDXRTVOpTmwkXJleN9zV3FxOuqHd17j3nv9De-ZBNcAwsRL+JF+ed6PXJRiDbaRu4wrYgTqpoyl5S3yFLQza1vHAOFYTIDm7GVQcPdYU9l7tOjMw8c-VZzGyNknvHJT4HGAafg4Zw85ncO3nLahFyDjKh+SIVXbj8XkhjgdeiKS-LT4Y0JhK2VpoDz5sNaa1FqDCAKUon7tjrNkhJCIlEcGoo0jl3JRhmdoeo61eTc19rurhBFvNZEd6KsNgv1CDQj1gy8hvRHAQoxQMqw+yO+cf9y785ruPZsazn7LmGHx-9tzunwuIvvP10-RApwshWQfVIIoZMESpYSSAzIUolhWv5DCoY+UU8NNaunuGLedS54R-npH0XWy5AiBIcV+hFE5paxkAhVlDh1kSPXxwFxFsQDgJwGcgiDd6AOKCrdZxdxg2-qloQNhd5Wt3GcBXdCT7MxpHSTfhekRnDftLTIQYMiOm2oUCEVlZBmH0MTCsCrpsuTrEjEotNvmhD6HvlpG7PMJ2noL-mIAzOYFjlWOtsAZzgmHfmAA-jgmkNIu2I6IGMojLHuGhKpgGD6JLGrDYD2Dxn9s7hNmPAVLZHgaMroCUFyJBEHsUFHqsAgTkPtkAjvsULprHgUnxqASwTzjUF4uwYtOBFkDMspkkDCO+qlpKFHpKnkOKFiAcKNhnkwe5pfH1FXLIT0jOvANJlvgeqnLwQGADEcNtJEIrJ-AhGmkBNfjajhhdpAnSjzAoRWEYCiLILbnINeBZClqkIYA6LyIApIIkBYMxJgfxm0ueqXPITYY-vMOBNkIAr3JZJ1lXlvOBD2oxFEOsHbtChIRzmkTIR0l4qJg8hJkEcIoKvkYlEUVpCUdBq4fIGFEWpkFIJIKkdIfCoqnot4pZoFgEkEpYtYXOjkXJokH7oQSQZ2kUEIG-FKIKFIL-vumMQZukaBvSk0aQBQJAG0XEglL9GhKcGZMXkhvoMPgsGSpXvWOITfudpntsu0romgOYd0sztcY2vWNkIKMpjlqoB6AZKYAkhFNeB-MxFYBFEcS7g0bsnAPstfI8jgCcqCYgMxI3HIHkFCZkNEUScxLypMsToKqMbUbhn8RkWUo6syoSYbjbsZLXhKJYIlL0ZWBpD6CUM6D2CsB3OicwXGsRByXoNsQcHELCAlokKYKKIWj6EovWEGCZEcJKe5o6qwhyQlj6EkruKsFHGCEKtXlZPFKsAflHFINEIYSOlIccR5riSZmZkghyclOiDsQzAAmZDYL1oUPFAlGcPWFmg7t8U7q6RiYJqZsJr5kmRYa0dkfgXgr7gWoGeKJPjoCsL7glCdlIJEFpHqaPAmV6RZv5lZoEjZvZmvumRwYbsXpkvEkIAzIQQKfmQkutuKBBFnBfuWf7BrtNrNrgLVr0LKTtKmmEBkCUMGDuttMtHyLyPkPBP8mEcOQXNzjOHznTtOccBCLmWYLAYfggdeFyHyG2J-N-pBNuU5Lubdg0PdvzpDhYSCU2RAaYCaiefvnAUfjtkfNyX9DIL3Kjg+VzonkDnuS+WDnThDvBUzh9osZBo-ogYApknEOBOsLCFYKprECBQGGBVWGhJBerhgFNlrt0vNj6fWI3HqvEHIGFL3JSQgMoMbpIJBFKkYBIjUTGXHsYQnljI9j6foArLupBM2vulKEGlkDyUcDECcIYM3hMDqByb3BEFELupeAMYQl-oKOpGaZ2GYCuidI4EAA */
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
      return res.rows;
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

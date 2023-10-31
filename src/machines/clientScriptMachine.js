import { Code } from "@mui/icons-material";
import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
import generateGuid from "../util/generateGuid";
const clientScriptMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGMA2BLMA7ALgZWQCd0AHHAYlQHsBDCAbQAYBdRUEq2dHdKrNkAA9EAFgBMAdgB0ADhEyAjAGYZEpSqViArBIA0IAJ6IAtADYRATikiFjCxMYyxF5aYsBfd-rSZcBYmSUtAwKrEggHFw8fALCCFpK0gpapmKmCQoiEiKa+kYIxkqmClIKqQoyjKbZqeqmnt4Y2PhEpDhSsK1kAAQAtlQQNKjd6LDdVCTY5LBgON2dE2BMYeyc3Lz84XEuYlI7YolVCsqKeSbmVjZ2Dk4uRR5eID7N-m0dXXP9g8Oj45NY01m8w+ywEkXWMS2iGqSikB2qWlsEjUqgsZwKYjK1hkpiqDgs6gkFhxDSeTT8H3eAU+AyGIzGiwBaE4SxYYLW0U2oDiWl26gsImKphkSls2gU6PUWlkTh0IhSjGOEgOpOeFOpVLafVpPwZ-3IYEEJBoWAYbPC4M5sXOEhK9jKWkRjrEdlM6OMyl2cmqkjS1VtmlV5JaGs61O133pf2wUnQEFQYHIdDNKwiHI21oxBykDnMZTUKR0x3diThFmFOOVFm09nLQd8IbeYa1Xzpv0ZUkg6ywUHIzJmwOpoIt6ch3MQopEUlxyVSWnduKkjAO8uKiSymLEInrL0pzZ6rd10awnYg3d7yCovV63G6yAAFiaYLBh6sohmoQhbAkc6KlDZPSUBIxAXaUyhycwgJyFwSUeNVGzITUDx1KMO0va9b33OYHyfOByAgPgwFjLAADcqAAayI+DXkQrCIzbPUY3Qm85jonCezgBB0FIqhkBoTlllfNN3zHIREERL1snsCQZC0SoCXnQxEGSEoXUqRQDgUbJAzg4MaPaOjD1Q-4pGTbioEHNpphoEjWVTS0P3HeJTD2ZVGGRSwZHLZJy3dSRGCkHQinlZE5GkpQd3VJsPnoo8OzMntLMCdiYCEhzRLiYxBVhe10idXlXUU-JCjUJdtC0csA3KERt10ht9KQmlI3bEyEosrC+xNZAwFQNLRy5MSs1hXMbBhQtbQlJSChUEodC8rRGCAiQUjKSKEIMmKjJamMSKGON+LAboACsbJoDqCKwIjuLIyipGovdNpQ7aT12jBBhwQ6Tt2rCuJ4viBJYPqRIGuJXBKWwvIOCw7C87J0RUuFHEcBRNO0sQ1oawynsYl69vez7To6sBCEIKhCCkEhUH4gAzMnejuvSHvDLacakV79o+47CY+X6yP+jZBPNN8IRB5SihKGT3NMIoUn9ER3QqGRZHUKWtBERhFoqiK6t3UNHua1nidJwgRiwO8BkTCigZFzMZFUPYBUsZxocnSbirEe2NwUAlhXLaGsgxyl+3M-DCOIm6qMZjVg57XneP4gXAaF4Sbc-YwXSnJRodxYlii8soZHRRFpF9HJ1ZdbIZE8R4sAt+Bwnu6l2WBzNjFtKxcsdZICt8qa26KPZbHtZdFcVQONTjBNm9TpyPUqHMKkr2tGFG9FhWkAVc7cLSXDV8fouZ7Hj2nq008RO1bTy7uXXLIqTEFKx3K8w4tzcRxasaeqmZbI+O0nsAT6OUGukac2QpbqyKIqPQfdSzOArD6asFUiT1B1lFWi+sGLHlPOeQBGVxJEjhOrRgckwpVGIe6CqgVBR23UM4TWOh97oMPgbLBzFMIxRSnAXBosEC52sItSQEhTDb2KPLKa34ZRqwsMSb2siLBaEYRtZhmD4oQDPIlLC3DW5KDsKUGE1DbSYgRH5YoOZlxbnEDYHQmJFGNVisZHaeMDpc2+h8LRn5lBZGnIqYhkMdGZDvgUEBBJkTyJxAkQkH8yRfz1souKJkjZk1NubCAACRwtw8UUJWstkg6JdLieQfkCF2ydgkAUmQM62JjlAdxTl5CBS8tlIo0tHAySLpkB20MoHLWUASau7ggA */
    id: "clientScript",

    initial: "idle",

    context: {
      scope: "page",
      machineKey: "clientScript",
      machineName: "Client Script",
      icon: Code,
      scriptProps: {
        page: [],
        application: [],
      },
    },

    states: {
      idle: {},

      "script modal is open": {
        states: {
          idle: {
            on: {
              add: "adding script",
            },
          },

          editing: {
            on: {
              "close script": {
                target: "idle",
                actions: "clearSelectedScript",
              },

              "commit changes": {
                target: "validate javascript",
                actions: ["assignCode", "updateScriptCode"],
              },
            },

            description: `Script is selected and editing interface is active`,
          },

          "commit script changes": {
            invoke: {
              src: "sendClientScriptUpdate",
              onDone: "editing",
            },
          },

          "adding script": {
            on: {
              save: {
                target: "editing",
                actions: "appendScript",
              },

              change: {
                target: "adding script",
                internal: true,
                actions: "assignNewName",
              },

              cancel: "#clientScript.script modal is open",
            },

            description: `User is entering the name of a new script`,
          },

          "validate javascript": {
            invoke: {
              src: "checkCode",

              onDone: "commit script changes",

              onError: {
                target: "error in code",
                actions: "assignProblem",
              },
            },
          },

          "error in code": {
            on: {
              ok: "editing",
            },
          },
        },

        initial: "idle",

        on: {
          "set scope": {
            actions: "assignScope",
          },

          "set script": {
            target: ".editing",
            actions: "assignSelectedScript",
          },

          close: {
            target: "closing",
            actions: "clearSelectedScript",
          },

          expand: {
            actions: assign((context) => ({
              expanded: !context.expanded,
            })),
          },
        },
      },

      closing: {
        invoke: {
          src: "sendClose",
          onDone: {
            target: "idle",
            actions: "sendClose",
          },
        },
      },
    },

    on: {
      load: [
        {
          // target: "editing script",
          actions: "assignScript",

          target: ".script modal is open",
          cond: "no scripts are present",
        },
        {
          target: ".script modal is open.editing",
          actions: "assignScript",
        },
      ],
    },
  },
  {
    guards: {
      "no scripts are present": (_, event) => {
        const scriptProps = {
          page: event.scripts,
          application: event.appScripts,
        };
        return !Object.keys(scriptProps).some(scopeFind(scriptProps));
      },
    },
    actions: {
      assignScript: assign((_, event) => {
        const scriptProps = {
          page: event.scripts,
          application: event.appScripts,
        };
        const internalProps = { ...scriptProps };

        const scope = Object.keys(scriptProps).find(scopeFind(scriptProps));

        if (scope) {
          return {
            scope,
            scriptProps,
            internalProps,
            scriptID: scriptProps[scope][0].ID,
          };
        }
        return { internalProps, scriptProps };
      }),
      assignProblem: assign((context, event) => {
        return {
          error: event.data.message,
          stack: event.data.stack,
        };
      }),
      assignCode: assign((_, event) => ({
        code: event.code,
      })),
      updateScriptCode: assign((context) => ({
        scriptProps: {
          ...context.scriptProps,
          [context.scope]: context.scriptProps[context.scope].map((sc) =>
            sc.ID === context.scriptID ? { ...sc, code: context.code } : sc
          ),
        },
      })),
      assignNewName: assign((_, event) => ({
        name: event.name,
      })),
      appendScript: assign((context) => {
        const scriptID = generateGuid();
        return {
          dirty: true,
          scriptID,
          name: "",
          scriptProps: {
            ...context.scriptProps,
            [context.scope]: (context.scriptProps[context.scope] || []).concat({
              ID: scriptID,
              name: context.name,
              code: `function ${toCamelCase(
                context.name
              )} (page, options) {\n  // your code here\n}`,
            }),
          },
        };
      }),
      assignSelectedScript: assign((_, event) => ({
        scriptID: event.ID,
      })),
      assignScope: assign((_, event) => ({
        scope: event.scope,
      })),
      clearSelectedScript: assign((_, event) => ({
        scriptID: null,
        ID: event.ID,
      })),
      sendClose: assign({
        scriptProps: {
          page: [],
          application: [],
        },
      }),
    },
  }
);

const scopeFind = (props) => (f) => !!props[f] && !!props[f].length;

export const useClientScript = (handleClose, handleUpdate) => {
  const [state, send] = useMachine(clientScriptMachine, {
    services: {
      sendClose: async (context) => handleClose(context.ID),
      checkCode: async (context) => {
        try {
          const attempt = eval(context.code);
          return attempt;
        } catch (ex) {
          throw new Error(ex.message);
        }
      },
      sendClientScriptUpdate: async (context) => {
        const { scope, scriptProps } = context;
        handleUpdate("scripts", scriptProps[scope], scope);
      },
    },
  });

  return {
    state,
    send,
    ...state.context,
    states: clientScriptMachine.states,
  };
};

function toCamelCase(str) {
  return str.replace(/\s(.)/g, function (match, group1) {
    return group1.toUpperCase();
  });
}

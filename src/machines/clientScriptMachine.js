import { Code } from "@mui/icons-material";
import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
import { scriptActions } from "./actions/script";
import codeCheck from "../util/generateText";
const clientScriptMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGMA2BLMA7ALgZWQCd0AHHAYlQHsBDCAbQAYBdRUEq2dHdKrNkAA9EAFgBMAdgB0ADhEyAjAGYZEpSqViArBIA0IAJ6IAtADYRATikiFjCxMYyxF5aYsBfd-rSZcBYmSUtAwKrEggHFw8fALCCFpaClKO9pIySgoSpor6RgjGSqZJCqZiCjKMphIipeqmnt4Y2PhEpDhSsK1kAAQAtlQQNKjd6LDdVCTY5LBgON2dE2BMYeyc3Lz84XEuYlI7YkoORco5hibmVjZ2Dk4uhR5eID7N-m0dXXP9g8Oj45NY01m8w+ywEkXWMS2iDkSj2ZVM5gU2iyWjEuRMShE0gUSMkpkYWhk9nkDSeTT8H3eAU+AyGIzGiwBaE4SxYYLW0U2oDi2isbi0pRxEgsclsWnRCFsMi01kxjE0CPkWQkpOeFOpVLafVpPwZ-3IYEEJBoWAYbPC4M5sRMuNMUkSFgOChFOKUhIlxlxUgkqIRjDUFhsFnUqvJLQ1nWp2u+9L+UzoZpWEQ5G2t+REjBE3ts8rEFTE+IUHrEklkbjqwZ9EjUIlDvnDb0jWq+dN+jKkkHWWCg5GZM2B1NBFpTkO5NoL1gkeZUJcdToltizjvEWMkFmXMjrL0pTZ6Ld1cawHYgXZ7yCovV63G6yAAFiaYLAh6soqmoZLCTKtCJ1DYVIT1DRM5JXSKR+R0FJLGFbIt3VRsPmjVs9WwY9TykAA3TAAHd0G7chCDALDiBwVkk0tN8xwQKokhkcwbHSRgcXkEQFwsO1MW-NxMkqEQBSUWCGzITU9x1WN207HhuykAiiNPG8BjAcgID4MApFw9CqAAa1UtVBPaXcaRjNt-lQySoGkwjiNwqB5IgMAEHUqhkBoTllmfZNX1HIREBzYo2MKEQagqHQlAlEtiiVBQtAsPjqkcATXiEgzEIPcSTzMizZLM2zFLAQhCCoQgpBIVAXIAM0K3opF0xL9IQ-cxJMiTrMyqzuxyhysA05zXJYdzyK8uIsUYb0LEzDMlGDBFXAlDi9lMdRv3EJQCTEWtHhqnd6tE4yUOaqSZLamzzzs6YcAImhen6kcuW8yVGDEEbRV4x6C2rBEJXkGRvR-R6CXlBbKi0BKtqjBrdqPfbzMOuSTsU2AcAma7PNuuJaKsaCXFW-1tCAvIsjhBQf39AlpTkTcNrDWrhMMpDD1MlrYFvKgsO6LKSKwHLyBoZBkDAMhkYhVGfOdWFMQRapLEYSpJFmpFvWlrERWRKoVUp+tqeS8HkMh9LGeZ1n2ewLm7J8LBSPZFG0xxbQpH-X6Dh0b9xWA4wajtmokWraLVHekGI22oydYZqTjQAV37CrCG6MAyrKsBkAoQQEZc1SaDKkjCAACii6WAEpeyp0Hmx24OoeKmgI7Aboo5juOE5wQWrXfJFMjt2p-1dTEWOA0xvzhB6shqLJSgpxoNeLkSg-p8u8oK6Osus-DZkIAwm4ou6BV2PuVpqGKshx2bHSkR78UqHEtEKKp+PV7cA7B0uZ71qS58Ktmjt7E0+dQdfBsQA5YTCh0BUUoa0cQfWAgTR0RN0jfkKHILE-t4IP2nu2c8l5rzJTvA+OASkVJqS6lpHSRd74l1QSZdBV45hYPvN2OAnVuouQ2G5c0L4hZph0EkAMCJgx2HMFUCU6Q7RS00OoIB1YFBIKSoHOm7YEzWQHG0aYNB0IW2HFbd8xhXr2hUNNGQIDtDZA9PYMCqIMgZnsNKH861x532QWQ2RJl5HtQMr2WhMBf7C3yNWEawCCx5nSM4SwxYibZj9FkNaqJyg31sXBaRKDHEoWcTZVxzksDf08WmYwqIZSMR9D+BEC1yh6FdoUaQ5hvyqDkASMp9Rb5xLqgk1KJl0JDHQIMEi3QABWKiaCuOUubAhGltLVRIfYqeiSjytIwB06uPTWkGQYU5JhfAWFkRutbfRMpjgSHzBEokJS8hCOsGNURhx94SEkfUvSNMUqNRQtM9pqdum9Nca-IqJVyqVVGRPUhEzmkPLabMl5CyPhLJ6swvqrCPLsJbmTawAp3oHCKOIGQn0kgFjYtFQo05KhjzJL88ZtMAWQ3ym-XCXMtKZJbtFbEly3TOAWi4CwHp8RgUcNkRQK03SFCke0PsS8BmqUciMzaGoBXdnBSsrAazLawsom7Py+YUWGLKAKBcV8wL2COIoRwGQYkErsfEhxJKQ49ggAVEg1KFWHDtAxS+jFVBrWcIcxAlS7b5LsM4IGly+W3O1vTC1EwSAKNcVgKg1q7rGBiskH8UUoqBR9GuWaoFFBaD4emmKNg-Va0fu2INJAQ0uI+OQAwcBI1xGjWNawJRbDCnUBUTMs03CTkDGUGoiRhQ2MNQ0-1eaKEXioYonoBa8GDJFcQwlxr-n3KPJQzBCEC1St6swCt5xorJEKCtR0tEfFFmAo9S4CRLAlmipBYG1zNYyNNfO6hi7LVjuFYQ0VYzp3EtndVQdC6oxLschC1ZfVQhyubgqnxJ943+gFDYDMeMfLOCkLnb2gVBSMU8I8cNdl4DhDFW0YDG9K1eyzA6J0LplDuldmoO0WM2LaqRDYC9sSbntNQGAPDf98iSF2My4kpR5AxX3XkE40hlwlF9g4dcObr2zrY14z0BIkjK0ULjAJ4gPS8RlETb8uzdn-UqJJppH7mOsfUfKqNmgszmNOYGN00pL4LlLH3RwiG7AZjkPpk1H6oYyetlFZIU5DGaEuWenueRPS7I9kUbT2gClunczOiGZqMLYWst598CIvy0oyMoMatFTASige28wKhibCnxTht9dyEvlxhtlOGqXKIOFhOuZWv5Ar6NmiWMCK1yg1BUI4cQcX31VefuZJmLN37cA5jlerd1tUn2yP46U3rAoSn7tRLExXHUAMG5VsuI2K5Vxrm-WO8dE4zcRiQN1OJrBuDilOcQqJ9AsYziLdcCGnBFCJIF2iLsABGVAcCI16G6jde87vOseyAYgUBbw4B8hkKw5QCzlGDGkPu+gcIQBwLeODjB9C3jAOgGHcOEDyH0HEHEb2kefdR7s9HwFEhJDBxme7uMdsBrSmhd5E2zIzYpwtPzp6FqSCimNELiBu6yASCjr6IU1aMavQZhLt7h1zGwXQrDbCQN3VdFYTQtKqmMQWvlwMex1wLUCuucQvrL2TyG8HZJqu+cmB0HaQUK1JblmDMYulOgDgHyRBxdn-bAUzOefMvpHxncgUCifCRJZaiMRUGFAkCHHD6JAeUIpBryuNI81Vsl0cKV1ZM9rin0orAik5RURQmQkSspGviWihwlR5mmn6iVUBo8HG+pF5rO7Jr4hdoJgK1gwHrmUN7K5Cu7e7cDZaotKSo+l-wxiXi3ofTpGlEiWitEU2wjTRmuw35p89pubm8hKEVfJQLdHuT8o9hOCU6iFTKfsROGxgGIkkg0PuCAA */
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
          idle: {},

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

              drop: {
                target: "dropping script",
                actions: "assignScriptDropMessage",
              },
            },

            description: `Script is selected and editing interface is active`,

            states: {
              viewing: {
                on: {
                  rewrite: "rewriting code",
                },
              },

              "rewriting code": {
                on: {
                  stream: {
                    target: "rewriting code",
                    internal: true,
                    actions: "assignGPT",
                  },

                  stop: "viewing",
                },

                invoke: {
                  src: "validate",
                  onDone: "show written code",
                  onError: "error writing",
                },

                description: `ChatGPT is generating new code based on the user-provided code`,
              },

              "show written code": {
                on: {
                  accept: {
                    target: "pause for effect",
                    actions: ["acceptGPT", "updateScriptCode", "swapId"],
                  },
                  decline: "#clientScript.script modal is open.editing",
                },

                description: `View the code that was generated and accept or decline it.`,
              },

              "pause for effect": {
                after: {
                  1500: {
                    target:
                      "#clientScript.script modal is open.commit script changes",
                    actions: "unSwapId",
                  },
                },
              },

              "error writing": {
                description: `Error occurred generating code`,

                on: {
                  retry: "rewriting code",
                  cancel: "viewing",
                },
              },
            },

            initial: "viewing",
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

          "dropping script": {
            on: {
              no: "editing",
              yes: {
                target: "commit script drop",
                actions: ["dropScript"],
              },
            },
          },

          "commit script drop": {
            invoke: {
              src: "sendClientScriptUpdate",
              onDone: [
                {
                  target: "editing",
                  cond: "scripts in scope",
                },
                "idle",
              ],
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

          add: ".adding script",
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
      "scripts in scope": (context) =>
        !!context.scriptProps[context.scope] &&
        context.scriptProps[context.scope].length,
      "no scripts are present": (_, event) => {
        const scriptProps = {
          page: event.scripts,
          application: event.appScripts,
        };
        return !Object.keys(scriptProps).some(scopeFind(scriptProps));
      },
    },
    actions: scriptActions.actions,
  }
);

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
      validate: async (context) => {
        const { page = [], application = [] } = context.scriptProps;
        const combined = [...page, ...application];
        const scriptProp = combined.find((f) => f.ID === context.scriptID);
        const res = await codeCheck(scriptProp.code, null, (text) => {
          send({
            type: "stream",
            text,
          });
        });
        return res.innerText;
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
    actions: scriptActions.actions,
    states: clientScriptMachine.states,
  };
};

const scopeFind = (props) => (f) => !!props[f] && !!props[f].length;

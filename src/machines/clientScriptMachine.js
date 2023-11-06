import { Code } from "@mui/icons-material";
import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
import { scriptActions } from "./actions/script";
import codeCheck from "../util/generateText";
const clientScriptMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGMA2BLMA7ALgZWQCd0AHHAYlQHsBDCAbQAYBdRUEq2dHdKrNkAA9EAFgBMAdgB0ADhEyAjAGYZEpSqViArBIA0IAJ6IAtADYRATikiFjCxMYyxF5aYsBfd-rSZcBYmSUtAwKrEggHFw8fALCCFpaClKO9pIySgoSpor6RgjGSqZJCqZiCjKMphIipeqmnt4Y2PhEpDhSsK1kAAQAtlQQNKjd6LDdVCTY5LBgON2dE2BMYeyc3Lz84XEuYlI7YkoORco5hibmVjZ2Dk4uhR5eID7N-m0dXXP9g8Oj45NY01m8w+ywEkXWMS2iDkSj2ZVM5gU2iyWjEuRMShE0gUSMkpkYWhk9nkDSeTT8H3eAU+AyGIzGiwBaE4SxYYLW0U2oDi2isbi0pRxEgsclsWnRCFsMi01kxjE0CPkWQkpOeFOpVLafVpPwZ-3IYEEJBoWAYbPC4M5sRMtkOUgk2kYNTEkhxCglxiRjCkpi0lixApEhxqClV5JaGs61O133pfymdDNKwiHI21vyIid9ts8rEFTE+PdZ3yLukMjcdQshx0ahEYd8EbeUa1Xzpv0ZUkg6ywUHIzJmwOpoItqch3JMVeS6kypXsGSqRbythEcPEWMkFgsYnkSnrL0pzZ6rd18awnYg3d7yCovV63G6yAAFiaYLBh6sommoZLCTK-eobBUQl1DRYtylhfkdBSSxhWyPd1SbD4YzbPVsHPS8pAAN0wAB3dAe3IQgwBw4gcFZZNLS-ccEAXWRzBsdJGBxeQRAlBQLFMKRMT9NxMkqEQBV3R41UbMhNSPHU4w7LseB7KQiJIy8HwGMByAgPgwCkfDMKoABrTSRNeMTDxpWN23+dDZKgeTiNI-CoGUiAwAQbSqGQGhOWWd8U0-MchEQHNig4woRBqCodCUCUXWKJUFC0CxBOqRx4NE9oTOQk9pIvKybMUqzHNUsBCEIKhCCkEhUA8gAzUreikQyDyQ48pIsmT7NyuyewKlysB09zPJYbzKL8uIsW9YUnUzJQqwRVwJW4vZTHUP1xCUAltxSoy0qayTzLQtq5IUzqHOvJzphwIiaF6IbRy5fzJUYMRvVFASnoLCQslMCV5Bke0gyegl5SWyotE2xro2avazwO6yjqU07VNgHAJhu3y7ricsrFglx1sYB1UQlLI4QUIM8YJaU5BkMHIx2szUOh7L2tgR8qBw7o8rIrACvIGhkGQMAyFRiF0YC9jYUxBFqksRhKkkeakXtGWsRFZEqhVYTwy28TTJQ09LKZlm2Y57BuacnwsHI9k0fTHFtC46V-oOHQ-XFYtjBqLiQ0kCR4tUD76g1hstfSyH6f1uTjQAVwHGrCG6MAqqqsBkAoQQkY8zSaCqsjCAACjimWAEo+018GW12sOYfKmho7AbpY-jxPk5wIWrW-JFMi42ogJxADWOLX0Vy3R6shqT682pxCIYrvWq6Kkq47y+zCNmQgDFbqj7oFXZfTWmoEqyPHQLyabdie-FKhxLRCiqITGiDsuJLp2fGbk+fSvZ46+xNfnUA3kbEAHFhMKHQFRSjbhxAiQmnEtwk3SP+bIoV1b333DTaez8OzXlvPedKT4XxwDUhpLSvU9IGVLmg8uGCLJYLvHMXBz4exwB6n1DyGwvLmg-MLdMOgkhqA4hWOw5gqgSnSJxaWmh1AgI+qGQOqCp6UN1h2RM9lBxtGmDQTClsRzW2-MYN6Uhr7liKDIMB2hsgensD6VEGRMz2AdpiSexlaaKIssorqJk+wMJgP-EW+QPrelAQWPM6RnCWA9GUFcEgSj4iyNuVE4FHHbXQS4tCbiHIePclgX+Pj0zGFRDKJiPsgwIiWuUPQbtCjSHMH6VQcgCSVIDighCTjkmZQsphIY6BBhkW6AAKw0TQDx6kLbEJ0vpeq5D5FPxSWeDpGBul136R0kyzC3KsL4Owiit0bYmJlMcCQ+ZYlEnKXkUR1gLC5kkQfKJiTtYZRamhOZXSM59IGR49+ZUKrVVqhMh+FDpltMeZ0hZrzlkfFWf1Nhg0OE+S4e3Cm1gBT+wOEUcQMhvpJALBxeKhQ8xrTgrI5pSSFGAuhsVD++FuZ6Rye3eK2IolKFRMFFwFgPT4h9I4bIig1qMsKLc-sy9hmaVcuMhqGoBU9ghesrAmyrZwuou7IK+ZUVmLKAKNimIVx1CdD7T6WIA6PCwCpeA4QxVtDlW3BVUoZT4ydOAqJOIPRqBgbYYkHERT4lBoS1KWkICoDABazecQ9EOFkC6AsJNLDSnlBq30BjSjyBOFWEUtyQ4z0ZIGgB+RFC-UCaUExmgLBhLdgJGUJM-RFNFI9SoqbnGkt9f6zNviQ3SAYpLBNwN+5LhdNYZEwookHPsHYWtrSHkM0vE2m2cVkgOjMZoKJ8UnQekyL9CWSIPpFqcKUEdJKx3h2sthYi9lJ3fgRH+OlGRlAXKMdA4mNQgwwjxim71wc617qrnDfKCMT3UQcLCTcKs+4-Xmj24G5QagqEcOIHdAL32v2sszVmn9uCcwKj++69hpAFi3XmJlk0JR+h9FErEKhMzlCATBnW9aq5Rxjh-BOScU7oeRiQRAiQkj7ySg6cQBMQD+uzqLTcUhyPGKrGkX0+gABGVAcDI16Gx+K1g3Bce3NoUCxAoCPhwAFDIVgRPlDEwciTIA8IQBwI+AKT19CPjAOgTT2mEDyH0HEHEQn9NEnneWV2eR2NKeJEfHjYhKP3Khvuzs5LF7HXQy5paM6XSCVdIurtiBNWyASAZn6EVkFkj+VMqje6aE4KQngxhJrOGWvur3Kwmg6W1KYktQmRa9ibiWqFTc4gbkvsfvl0LaTVFkGiyYHQnFBRrSlhWKsFj6U6AOIfJE3Fguhz1k8kFSzBkfEG5KOQK5va4lqExFQUUCTCccCYsB5RSl3xy3Ilpu7QsfJGFzb92j5WVelFYD1Z3HBCiRGy70+JyzBlUHmWa-LqBcB7Jtg4v0ijCgA3ijiBJY0rjXOxO4H1EieE8EAA */
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

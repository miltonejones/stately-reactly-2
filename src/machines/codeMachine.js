import { assign, createMachine } from "xstate";
import codeCheck, { confirmClose } from "../util/generateText";
import { useMachine } from "@xstate/react";
import useClipboard from "../hooks/useClipboard";
const codeMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGMD2EwDoCWA7bALtgIYA2AygcQWAMSmrEQDaADALqKgAOqsh2VLi4gAHogBMADgCMmACzyAzKwCc8gOyqJANlZT5OgDQgAnogC0M6wFZMUpTdYz5UqTZ3zVSgL4+TaBiYAG7YYADuAASBYJGk2LAEtMgMsGBsnEggvPxEQiLiCFYemB42SjKqqlo60kpKJuZFVawKqlLeqjpVMhLyNn4B6FihEdHDcQlJaaRgyAQZIjkC+VmF1oqYrBr6NuUamhJKxmaWVRqYSv3dWtU2LgP+IDEhYVExk4m0M3MEkWSkRZZZZ5YRrRDueSYHRuVhKDQyGwSLQVRpnaqXfoIjQdI4aXSDZ7DV5jD7xRKYcl-AH-eaCXCwZIACzmAGsgTw+CswaB1hodJgZDpKq4JBIPKwkRo0Qhxa1tO1lHDpF11ISXqN3hMqZSpv9SKRaaDGZqOdkuaCCpZrK1HKp9BUNBUbIcZdY5MpuhIuvJrAj6uriZrxhhPgRdYl9YbiHShIyAEbUZBMs0g+lWoqyVpqKTixTeFQ6BqnWUdTAaJ3yPpFmz4osaQNBYNkqaYZPUADiAAUACqRGC4MAAJ2osUHWowtAgQiweGCqFZWA1bxDsR17YI3b7A+Ho8i49XCDnqGQ1HpGVTFvT4IQiKL5e0rnUKj2shlViUqjaqhkrE0LhUBEpEbEYVxbCkNy3fswEHEcaH3UlhloYch1QIdMG4UhqAAMzQgBbNsgzA7VW0g3toNgvcDxiI9cHnU9QQvDglivVZeUQX8DkuSpznhDxhSkGUnFtHRykOOVRIkECSQnNdSKZTtyJ3OCx0QydEiHMBiDwy9cmvdiEA0GwpEwbxDHxNxf0RYsmisEz7XaO0lGRJE1SeZc1LkiCFM3JSYN3eDqOJBgmDwKBaFERJR0wYhsJoIcAAo9FYFKAEpkiIzywzbHyoOUqjPMpRgIDC3TuQzWQBQRdptl9YVrBsxArg9LwKhcUShS0aTmxI7zFO3fyVIQ2TMCoVkwsiAhUFQOIhHC2Bxu4MrLRvRw7A8B4pDrGQtEEksKiheE3H5e5ZGO7riNDHVYCZVAok08Ih0IGhcFXWhNKoeNlv0sREFUe5yysyUUu2IzpRLRFWAFRF-uOcUnGqKT3My2Tspuu7Igep6CBe1cZLCjLuFMb62N+29ujsAx9hkeF1GfGUpFqBRXFEhFJV6ANkabS6vPDdH7oibHcY88ICcTZB2WY4FWJ5MmrCM+waYkP0dBhfQTiaRm7F6MVVaRPpdAbLnQKy67boFx7npgvHNTFmN2RkTJOT00nCgsZWv3UYVNAqCRnEMRrb397j+SOcydB2R4hm503W35zHBat16XjQImJpiKcZxwOiFyXFHVzR82E8tnHrZT1A09wKBD2PBjzw4EnZfWSoJFKTRtm2b1az2poaahzA-a8fpFFuJHo5N1GzYxrGk7x7hiAAVzSSJcKHSIwGw7DfgiqKaBiuLhwSyHWHSkWC6ni2hbL4l56X2JV-XzffkbjMjJMqHkU9PoHIkN1f1aEUVxZBOF9MoC6scKTBlQKQCAb1xaSyduaF2TdJCtyHnsBE3QR7dD-h6Y4CpPB+hpr4Y2Mlz6tigTAt6yY2QvxvJUOwut5Cd3+oYLagcLAwkuMrKQahxTOVEt4cBk9WwoTQpEYIZBsAQDPFXd6YACBDmJlLZ25V6HOCqrUMGBxRLMJsEJJmSgtrlCcLw2sjhhHkIpGItekj4gyKIHI08uBkBgEBCopBaiDLuwFClPQ9xQ6HAcBrRAMI5DGPwerZWRZLHgXDDPeCPx5iQCNPSWAOU2QIVENSWMuAMKL2XvGBR4QwDW00gARwXnAAgjJIpUD3rFeKR9hKn3znEzACTYhJJoLAmMxoMkSyyTk0E+S76RCKQQEpZSwCVOqbAOh3iGEXGkFWHYOxlb6F-iWFygoPBGNYNWfo2hYm9XiYnRJbjfgpL6WkgZrIhmpKEJgNIuBYEVKqV8BZct2oXDBnCTwxlahGJlPwwUu1XAdHcC6MeRIY4iIpJ0yI3Trm5PSTQwZg5smPLyS8t5MyPlJGYI7FiyCMxWEMHICO1hDa+ihVszWUIoaq0RDILaXgjbjzIe0xFyLemoswPlQKnlM6DmzvORchE4VWLOSXLplzkl8v6YK1SslaL0TPEIJiiC0yu2tNUbMTp4R+yuPxHuHFQYKAjiiSoO0OgcthRPaVHTzlytmAq7F6TlXDTejYjCWECCrwImfblLqkXyp6R6gVg0Cqqtrhq3AWqSVeO+SoEy9x9BVl-D+YFEM-bLKrPaCokJnKqBOVdVsPLw0oqVdGoVslviKK0jpDxOqUFFBcDtBQKgNEGGkE6M1hkcT2CMno7wMJlDAVIT1ctCLQ28sjV6oKQQQolTkXU6KjTD7JTShlKVIbZVhrdRGm5cYo2UTrXjFdpUW0yzJQ8Q64pCE2AVE4el5q9DQi0DTfYw8kRlt5s6g986T0MjPQFFVeMxoTSmjNBgciFrYCWje0lN4rBekVvUf2xxbUymUGglwf5-QqAclHB1XLTmAexq6q5irbnxwSbjQgYA8IJntl8t2yILjD1YXoMUmhRLvlViZLwrKoYHN9IWf92VK1HurXRouDHrZMZY7QeBRLtW3tQ0dbhEodoHOfX+d8XhWgOAqH+Yy+CqjyCkzqGTNHI30fOYxmgLH8ZOIrqYKM7HrQIzbpoTNFMdghKKMrKEz6bjOmOJZGzFa51Vto6exzJdnPMbRR58ZSYmQitnDnCVwaKN2fdSB9JSWr6vWU2lomGWCDJjVSeeNibpYocWXWUo+hJQRyzLoN9RRPT2CLAcsUBsjg6Bi7OoD8WHMKac0plz6Tb7LwfhvLe8wd71KwJuxKx9Wl7oK3F2TCXQOldnhV0Zi3xHLefsh5NbtiFKFMsKIFJjvSSnfMZQ6ZQ3D1ROpOzl06AOFePfymxxdsYEw+ko7z7bFAmV-KraQsIoaODdMrRhOI9CFmqMw+1+WZ0yqo4e+zxXMAg4SQTZxrj3Eaea3LZWnbcRVjw2-DwboVBQh2EPX0Lo-xHDG+GNAuBsLYCHHharyYMsS1oLgVAUOLBVHu10COVRjJClrPId8PFmbjvFDtVX+I+eEUF8L0XiYatMgl6yKXxAoCy8kgPNmMJxS8JRG9mmpRwv2iFFUe0pHccAYF0LkXYvzfwOeY27SBNpyiuPHltpFGA-G+DxbsPmkI9Vzq3XTVDdrsrW8RKAefRtj3DtOYjXvCwUuXxL+dhHgDcJ6D6b8XofwjEAEHI0wcBZf4jsJ6KGCN+h5qM5SrQhhvQjrfjjuPePDeB5N5l5PsBuBMbWxug+iUWm7sde0+vc+zcL6XzQWXjgoTCjqB3XYrhA4uEOqrLQaznKekn7t6fO+LdS5lznn6hRmFfkzT+L0-Q7CKOXCyg1kIoXgfQvuU+-uQgs+b+uA1usuuslwUoW0QElQRqboRkAopiIMzgGwMgdesBieoeGkTakeWcMeecz+MBRuDe9sKe5B6ecajE2e1ON21ovQuyWsBy-0fc6gbo72pQFQ-0RkYor4UBNB2Ur+zereji4UHe8yn+uqRQjgrcvQuYOIWgzg3gPWAErc2goM-izkOI1mU6PM0hxB9BEszyB+dA66DSa+CUG+fulhdBc+Nhi+TGR+Lo0IGhtYHgHQ5QNMDMcIgoOhewkoP4BwZhf2FhVI3wCiBcBApg3A6QyhbaNMW05Y4hAcjgcIDg745wmIHgXcCIxqRsTw0uGA8AWQMQSauetOma0Iusz4koQWHCvQYR9Ql+tqzgvCo2pCeAAgZAlAo4DRX+1ouYA8cIOwFQVwgBfQGuag921ehgxkg8kIfOExKh7s8I92tQugbRtYSO74BgJkjgokIC+I-IRiBuVIUYHqOxbaFgx+bQNMNoz66xhR2y5eXgVQX2fshhNMdeuUfk56EG9RTWHBCA+sgoI27gxwewQ8Gu5QCgagRkUMNQRkkhW+8eYJA0EJ3qLwV6VczxGY1gBgA8KgYoFYnoE6Mo9QnsrUVk5RtqgxcREC-OBJFE4GxJxIUGVck000s0ZJ0JjRhQJx8JUW5QVxKJ+08I4RLox+zgLoewuJ5GL+PJi6hUZOYpqiEpiAFYcgGwQCXokMMgWB2YlJHQMIDgY+MKrhF8oOs8UJBpkxCASuWwpmtQASByOIModJpkEKHcFK-mBux2pcycKMYU5JN4-IrQqsqyz69oH8DMWgWwXgQKDwTJv2ZG-2hc08M20ZQQqcpg6cwwcZBkQo-Qlw2gqO0gSIEc6uuaVJeyFMz6zo1gEZ02yW18QQC298F2T88wVZZMNx3p9QvpemyIA6SsXGkW7MkoOuBulCsCbpnihp7a+g0IigspKU7QX2lpJYnCFwVM0gegzKLobknJ8K4YIOdi0isiUAY56w-ylqWi2gTg+wMo3Q8oBY7QQoiIfaBugOcmcYr5lgRw4oLRRxSoJxRY74CZ9gHgOwf4NMOIeZTpsWE2B2ka6K9ymKwyP0raZKtJFwhxWCL4HRbovo0IpRzkqa4Wjp0B0m+2RO-KBFDyIGZ2sQEyUyr07ycykFIWYoX4lFxxNF2yTo9FngOhQo-CWFrFtm7FRWnFLIGKYAWKPFuKCcsyiQIl8sAMToGBBgvo2wW0IKMlokNYf5MMHQoFqlQONaRJS6YAhlO0SILRauOYuw4oQk3glwRkVwzg+IGJJCt5TqYFh2nqtakJwUxUsZ4pHpVghspkrKxwqs+g3gc5URYKP4VYNl9UjluFHFLlfJblo0xA40QpMGopL5yVuxemJ+4oBwvl7g-lEMeVO0BVug-E3Z5hXJlGTGhOal5VQ0lVep1cG5pFqGLgRw0IW0kI3Q3gWgMo6gcgGCxwagMMGxJVBOwG-KkZKWLGHlQZuBqFXWtQgmMllxRY3gfcKx+1I1h1-Sx1s2qWbmDV7pTV3apkNxugHQ6sLg74oWpQqoEcTZ7gtQz1FyeFxO715Wc2hEVWjeTIZ1fQpkvCKgRiRwkoHQoNmgpQWR5k1w8IsN1GY18mRZfZSNn1g5K8w5K2BAGN0Mtw9Qn4cIhgLZtkxklMZQOIysYokmg1d5w1cNZVtypO5ySVP1Lx1+tonZYSd+KurOkogowCKU7gOYQoRB7hSe8ChlQZ38WtvG2OHC8IJpFkj69wYlT+eJL+Vhu+TeDBZBae31m5KVuNpQwC1Q6g7MAmJ5fs2sFkGwoWvCmgetcBaNyeLebeHts13irWJt6s4m2wnRsgn6LksgrgfoSlUh64TtBtrtdhhlzCHongn4HQRiomSxJ5VYCgSI7gv415LoDlotTqMh9sZdtZwMLgOwqoxkAhEMvQAofs-pzgfsyIHJ+Z8RpERdpB4eeEstntKh1gvidp49DgjkV+ewX4wRXQGiWgeaUdJBDBcd8hhlJqn6xe-Iqs9Q0gghDgWwzkzgCxGhVwp91hrIthTGV9GIfd7cg9HQPNHE3orc496dqaQ2jwfgQAA */
    id: "code",
    initial: "initialState",
    context: {
      tab: 0,
      codeType: 0,
      selectedItems: [],
      curatedItems: [],
      selected_index: 0,
      confirmText: "Let me think about this...",
    },
    states: {
      initialState: {
        on: {
          load: {
            target: "view code list",
            actions: "assignMachineActions",
          },
        },
      },

      "view code list": {
        states: {
          "list all actions": {
            on: {
              check: {
                target: "chatGPT generate new code",
                actions: "assignCode",
              },

              view: {
                target: "view old code",
                actions: "assignCode",
              },

              batch: {
                target: "rewrite selected actions",
                actions: "resetBatch",
              },
            },

            description: `Viewing list of all machine actions. Actions can be selected, viewed or rewritted from here.`,
          },

          "chatGPT generate new code": {
            invoke: {
              src: "validate",

              onDone: {
                target: "show rewritten code",
                actions: ["correctCode", "assignUncopied"],
              },

              onError: "error validating",
            },

            on: {
              stream: {
                actions: "streamCode",
                target: ".rewriting",
              },
            },

            states: {
              loading: {
                after: {
                  60000: "taking too long",
                },
              },

              "taking too long": {
                on: {
                  skip: {
                    target: "#code.view code list.list all actions",
                    actions: "clearCode",
                  },
                },
              },

              rewriting: {},
            },

            initial: "loading",
          },

          "show rewritten code": {
            on: {
              retab: {
                target: "show rewritten code",
                internal: true,
                actions: "assignTab",
              },
            },

            states: {
              viewing: {
                on: {
                  copy: "copying code",

                  back: [
                    {
                      target: "#code.view code list.list all actions",
                      cond: "code has been copied",
                      actions: "clearCode",
                    },
                    "#code.view code list.confirm back",
                  ],
                },
              },

              "copying code": {
                invoke: {
                  src: "copyCode",
                  onDone: {
                    target: "pause for effect",
                    actions: "assignCopied",
                  },
                },
              },

              "pause for effect": {
                after: {
                  1500: "viewing",
                },
              },
            },

            initial: "viewing",
          },

          "view old code": {
            description: `Viewing uncurated machine action`,

            on: {
              back: {
                target: "list all actions",
                actions: "clearCode",
              },

              check: {
                target: "chatGPT generate new code",
                actions: "assignCode",
              },
            },
          },

          "error validating": {
            on: {
              retry: "chatGPT generate new code",
              cancel: {
                target: "list all actions",
                actions: "clearCode",
              },
            },
          },

          "rewrite selected actions": {
            states: {
              "check next action": {
                description: `Check items array for next item and continue loop if one is found.`,

                states: {
                  "pause between requests": {
                    after: {
                      1500: "send request",
                    },
                  },

                  "send request": {
                    always: [
                      {
                        target:
                          "#code.view code list.rewrite selected actions.generate new code",
                        actions: "assignIteratedItem",
                        cond: "more items",
                      },
                      {
                        target:
                          "#code.view code list.rewrite selected actions.show rewritten items",
                        actions: ["resetBatch", "assignUncopied"],
                      },
                    ],
                  },
                },

                initial: "pause between requests",
              },

              "generate new code": {
                invoke: {
                  src: "validate",

                  onDone: {
                    target: "check next action",
                    actions: "iterateItem",
                  },

                  onError: "error rewriting",
                },

                on: {
                  stream: {
                    actions: "streamCode",
                    target: ".rewriting code",
                  },
                },

                description: `Generate new code from chatGPT and stream response to context object.`,

                states: {
                  loading: {
                    after: {
                      60000: "taking too long",
                    },
                  },

                  "taking too long": {
                    on: {
                      skip: {
                        target:
                          "#code.view code list.rewrite selected actions.check next action",
                        actions: "iterateItem",
                      },
                    },
                  },

                  "rewriting code": {},
                },

                initial: "loading",
              },

              "show rewritten items": {
                states: {
                  viewing: {
                    on: {
                      "copy all": "copy batch",
                    },
                  },

                  "copy batch": {
                    invoke: {
                      src: "copyBatch",
                      onDone: {
                        target: "pause for effect",
                        actions: "assignCopied",
                      },
                    },
                  },

                  "pause for effect": {
                    after: {
                      1500: "viewing",
                    },
                  },
                },

                initial: "viewing",

                on: {
                  back: [
                    {
                      target: "#code.view code list.list all actions",
                      cond: "code has been copied",
                      actions: "clearCode",
                    },
                    "#code.view code list.confirm batch back",
                  ],
                },
              },

              "error rewriting": {
                on: {
                  retry: "generate new code",
                  cancel: {
                    target: "check next action",
                    actions: "iterateItem",
                  },
                },

                description: `An error occured in chatGPT somewhere.`,
              },
            },

            initial: "check next action",
          },

          "confirm batch back": {
            on: {
              no: "rewrite selected actions.show rewritten items",

              nag: {
                target: "confirm batch back",
                internal: true,
                actions: "assignComplaint",
              },
            },

            description: `If code has not been copied, user must confirm exiting.`,
            entry: "resetComplaint",

            states: {
              streaming: {
                invoke: {
                  src: "complain",
                  onDone: "waiting",
                },
              },

              waiting: {
                on: {
                  yes: {
                    target: "spite",
                    actions: "clearCode",
                  },
                },
              },

              spite: {
                entry: "affirmComplaint",

                after: {
                  500: "#code.view code list.list all actions",
                },
              },
            },

            initial: "streaming",
          },

          "confirm back": {
            on: {
              no: "show rewritten code",

              nag: {
                target: "confirm back",
                internal: true,
                actions: "assignComplaint",
              },
            },

            description: `If code has not been copied, user must confirm exiting.`,
            entry: "resetComplaint",

            states: {
              streaming: {
                invoke: {
                  src: "complain",
                  onDone: "waiting",
                },
              },

              waiting: {
                on: {
                  yes: {
                    target: "spite",
                    actions: "clearCode",
                  },
                },
              },

              spite: {
                entry: "affirmComplaint",

                after: {
                  500: "#code.view code list.list all actions",
                },
              },
            },

            initial: "streaming",
          },
        },

        initial: "list all actions",

        on: {
          close: "initialState",

          select: {
            actions: ["selectCode"],
          },

          "select all": {
            actions: ["selectAllCode"],
          },

          "set code type": {
            target: "view code list",
            internal: true,
            actions: "assignCodeType",
          },
        },
      },
    },
  },
  {
    guards: {
      "code has been copied": (context) => Boolean(context.copied),
      "more items": (context) =>
        context.selected_index < context.selectedItems.length,
    },
    actions: {
      assignMachineActions: assign((_, event) => {
        return {
          machineActions: event.actions,
          machineServices: event.services,
          tag: event.tag,
        };
      }),
      iterateItem: assign((context) => {
        const selectedName = context.selectedItems[context.selected_index];
        const selected_index = context.selected_index + 1;
        // const progress = (selected_index / context.selectedItems.length) * 100;
        return {
          curatedItems: context.curatedItems.concat({
            name: selectedName,
            code: context.curatedCode,
          }),
          selected_index,
          // progress,
        };
      }),
      assignIteratedItem: assign((context) => {
        const {
          selected_index,
          selectedItems,
          machineActions,
          machineServices,
          codeType,
        } = context;
        const selectedName = selectedItems[selected_index];
        const actionList = [machineActions, machineServices][codeType];
        const action = actionList[selectedName];
        console.log({
          machineActions,
          machineServices,
          codeType,
          actionList,
          selectedName,
          action,
        });
        const progress = ((selected_index + 1) / selectedItems.length) * 100;

        return {
          selectedCode: (action.assignment || action).toString(),
          curatedCode: null,
          selectedName,
          message: `Rewriting code for action "${selectedName}"...`,
          progress: Math.max(progress, 1),
        };
      }),
      resetBatch: assign({
        selected_index: 0,
        progress: 0,
        tab: 0,
        message: "",
      }),
      selectAllCode: assign((context, event) => ({
        curatedItems: [],
        selectedItems: context.selectedItems.length
          ? []
          : Object.keys(
              [context.machineActions, context.machineServices][
                context.codeType
              ]
            ),
      })),
      selectCode: assign((context, event) => ({
        curatedItems: [],
        selectedItems: context.selectedItems.includes(event.name)
          ? context.selectedItems.filter((f) => f !== event.name)
          : context.selectedItems.concat(event.name),
      })),
      assignCode: assign((_, event) => ({
        selectedCode: event.code,
        selectedName: event.name,
      })),
      assignCodeType: assign((_, event) => ({
        codeType: event.codeType,
      })),
      assignTab: assign((_, event) => ({
        tab: event.tab,
      })),
      correctCode: assign((_, event) => ({
        curatedCode: event.data,
      })),
      streamCode: assign((_, event) => ({
        curatedCode: event.text,
      })),
      clearCode: assign({
        selectedCode: null,
        curatedCode: null,
        selectedName: null,
      }),
      assignCopied: assign({ copied: true }),
      assignUncopied: assign({ copied: false }),
      resetComplaint: assign({
        confirmText: "Let me think about this...",
      }),
      affirmComplaint: assign({
        confirmText: "Fine, be that way...",
      }),
      assignComplaint: assign((_, event) => ({
        confirmText: event.text,
      })),
    },
  }
);

export const useCode = () => {
  const clip = useClipboard();
  const [state, send] = useMachine(codeMachine, {
    services: {
      complain: async () => {
        const res = await confirmClose((text) => {
          send({
            type: "nag",
            text,
          });
        });
        return res.innerText;
      },

      validate: async (context) => {
        const res = await codeCheck(
          context.selectedCode,
          context.selectedName,
          (text) => {
            send({
              type: "stream",
              text,
            });
          }
        );
        return res.innerText;
      },
      copyBatch: async (context) => {
        const code = context.curatedItems.map((c) => c.code).join("\n\n");
        clip.copy(code);
      },
      copyCode: async (context) => {
        clip.copy(context.curatedCode);
      },
    },
  });

  return {
    state,
    send,
    ...state.context,
    states: codeMachine.states,
  };
};

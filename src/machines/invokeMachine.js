import { useMachine } from "@xstate/react";
import { createMachine } from "xstate";
import setState from "./handlers/setState";
import dataExec from "./handlers/dataExec";
import pathOpen from "./handlers/pathOpen";
import modalOpen from "./handlers/modalOpen";
import scriptRun from "./handlers/scriptRun";
import { invokeActions } from "./actions/invoke";
const invokeMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEsB2A3A9gazAOmQgBswBiIzAQwgG0AGAXUVAAdNZkAXZTVZkAB6IAbACYALHgCsARlFThU8QE4pdMQGYANCACeiALSiA7AA48dGaYl0Fw69fEBfJzrRZcBDDjRQABGDoYKicsKSULCzBtIz8bBzcvPxCCKIy4qLSGlLKMsr5dCqiOvoIBhoaeBoSonTydHT5UsbOriDuOPgd2L4BQSGwXh5gfqhgApx9wZykELxd3p7dCx69gdODy6Pjk+shCB0AxpSJqPQM53HsXDx8SIKI6cqZUqLKwhUNYs0liOJ0lWayn+MmyUlMhVMwhcbkWKx8qH8e1CQ062wmUxCpDAACccZgcXgWEQTgAzAkAW1RS0Wa36KK2YwxyIO3mOp3Ol3u8RuSXuKRkxnyFg04mMwglMlezWKekeULwKmUxjUguMxlqqhh7Th1LpG2pIyZu3p2LxBKJJM45JxVOWesRmIZcPRJumrKw7NunJkTG511OyUQxgspilxg0EreUleym0ctS-2kYujplkYve2vt3X1AzwhwAFmBDtg-Da-BSCfgAK4sCAnEbHIhEXqHTAUthjLFzMaGvs5x3IwaF4ul8uVnE1usNvxNluOtsd+b7I4nb2MLmsAO3IMIXJ0PBClQQr72d6-BCq6TqDR1DUyCXArO6gdI+nDoslssEitVvCktAIF-SdSE3EAeUDflHjoUwQ3eURRFMfI3hPUwLwjEMpEjYQ5CUdQPlEZ9hgdN8DRHL9xz-ADUCAicyBoX0rgSHcoLKYRxGEPBREjBCNGBW95DQhMMKySV5H+CUNBkIjOnzdtiTATgyB7eEaWIxcFKUj1MC9XhOVif1mL5UAUgMQUD1ECUw0hBpzPjUoDHESM8BkKUoUhFpjAfKQZM8DSSCU2Z5n7XV-MUsBtN0s4N0YwzeTuEzgw+PA0zVLynOsezDHEHLpEUHCcn44RCl8-BcXxHE-DQPwWHxQ44A4RFSGOVB6qIMCIJYxK2OUKo0lkRQj2yZQhIc9JOIUUUFHeRR8ihUq8HKn9qtqnSGt8UhJzbIIcQ67djIeBAKikFL1Uad4MmMRp0MkZ4VFvD48msdQFqWyqVrq9ams4TAoCgEg9qMhLDqMCNDyu9N1CQ9j5AvcpKmqJzsgBCokOVBbXydD9R2-Sq6LwWt6yU2dKGbVt5OXGY3stMlKRC1ZB3ffNPzHH98cJmc53Jpcu04SK1z0jcDK3IHdzMjjRIjHIEKw7yLzFcx1XeTzTH+NMfO1VBMAgOB+GWJj4rFrzMOqOQAUspyAThrCJvEKExQ+YqAWMDHiDAA3IO6gx1SqcVajqVQ3nVcQ4YQ8xTA0VKIylJRlDoF22mzWlGY2D2usOrDzClew6hMNIVSkC8RrwfJlVV5o+JyqUMeT0i80ZHYnTTg6BVV3qOJy4RcgyRQFHlkxDxyePXjSapLI0GuGbrlFyNZvGq2b4GUnBTjs4hBD7wLi9I8qcQsIyAFXNsEbJ4RafsYotm-w54muYXCnecX3cPkkNfc83mN5aukusOqGCI0UJHU+PQU55lnrjYC+BqK0QXnFT2h1XKuSyPIIUqsJRmFGn8YEipZZd0yg0BCC0wpKSfqxAwj5kFm2qOxW8WUyg5V6pCdiqhXIfBjK9c071UA1U+rARqUBSFe1woeVWVgrDH1gioC8phzBiAhBoIU+EobQhcE4IAA */
    id: "invoke",

    initial: "idle",

    context: {
      event_index: 0,
      events: [],
      overtime: [],
    },

    states: {
      idle: {
        on: {
          load: {
            target: "invoking events",
            actions: ["assignEventProps", "assignCurrentEvent", "initIgnore"],
          },
        },
      },

      "invoking events": {
        states: {
          "invoke next event": {
            invoke: {
              src: "invokeNext",

              onDone: {
                target: "check for more",
                actions: [
                  "updateApplication",
                  "incrementEvent",
                  "assignCurrentEvent",
                ],
              },

              onError: [
                {
                  target: "#invoke.invoking events",
                  cond: "ignore errors",
                  actions: ["incrementEvent", "assignCurrentEvent"],
                },
                {
                  target: "#invoke.error in processing",
                  actions: "assignProblem",
                },
              ],
            },
          },

          "check for more": {
            states: {
              "update calling component": {
                invoke: {
                  src: "notifyUpdate",
                  onDone: "find more",
                  onError: {
                    target: "#invoke.error in processing",
                    actions: "assignProblem",
                  },
                },
              },

              "find more": {
                always: [
                  {
                    target: "#invoke.invoking events.invoke next event",
                    cond: "more events",
                  },
                  "#invoke.complete",
                ],
              },
            },

            initial: "update calling component",
          },
        },

        initial: "check for more",

        on: {
          append: {
            actions: "appendEventProps",
          },
        },
      },

      complete: {
        invoke: {
          src: "notifyClose",
          onDone: [
            {
              target: "idle",
              cond: "no more work",
            },
            {
              target: "invoking events",
              actions: "assignOvertime",
            },
          ],
        },
      },

      "error in processing": {
        on: {
          cancel: "idle",

          recover: {
            target: "invoking events",
            actions: ["incrementEvent", "assignCurrentEvent"],
          },

          toggle: {
            target: "error in processing",
            internal: true,
            actions: "toggleIgnore",
          },
        },

        description: `Central processing for any error anywhere in the process`,
      },
    },
  },
  {
    guards: {
      "no more work": (context) => !context.overtime.length,
      "more events": (context) => context.event_index < context.events.length,
      "ignore errors": (context) => !!context.ignore,
    },
    actions: invokeActions.actions,
  }
);

export const useInvoke = (handleClose, handleUpdate) => {
  const [state, send] = useMachine(invokeMachine, {
    services: {
      notifyClose: async (context) => handleClose(context.application),
      notifyUpdate: async (context) => handleUpdate(context.application),
      invokeNext: async (context) => {
        const { action, event } = context.events[context.event_index];
        if (!action) {
          throw new Error(
            `No handler for event index "${context.event_index}"`
          );
        }

        const handler = handlers[action.type];
        console.log(
          '----------%cInvoking "%s" event %s',
          "color: yellow",
          event,
          action.type,
          context.event_index
        );

        if (!handler) {
          throw new Error(`No handler for event type "${action.type}"`);
        }

        return await handler(context);
      },
    },
  });

  return {
    state,
    send,
    ...state.context,
    states: invokeMachine.states,
    actions: invokeActions.actions,
  };
};

const handlers = {
  dataExec,
  setState,
  modalOpen,
  scriptRun,
  pathOpen,
};

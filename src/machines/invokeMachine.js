import { useMachine } from "@xstate/react";
import { createMachine } from "xstate";
import setState from "./handlers/setState";
import dataExec from "./handlers/dataExec";
import pathOpen from "./handlers/pathOpen";
import execRef from "./handlers/execRef";
import openLink from "./handlers/openLink";
import modalOpen from "./handlers/modalOpen";
import scriptRun from "./handlers/scriptRun";
import { invokeActions } from "./actions/invoke";
import React from "react";
import { AppStateContext } from "../context";
const invokeMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEsB2A3A9gazAOmQgBswBiIzAQwgG0AGAXUVAAdNZkAXZTVZkAB6IAbACYALHgCsARlFThU8QE4pdMQGYANCACeiALSiA7AA48dGaYl0Fw69fEBfJzrRZcBDDjRQABGDoYKicsKSULCzBtIz8bBzcvPxCCKIy4qLSGlLKMsr5dCqiOvoIBhoaeBoSonTydHT5UsbOriDuOPgd2L4BQSGwXh5gfqhgApx9wZykELxd3p7dCx69gdODy6Pjk+shCB0AxpSJqPQM53HsXDx8SIKI6cqZUqLKwhUNYs0liOJ0lWayn+MmyUlMhVMwhcbkWKx8qH8e1CQ062wmUxCpDAACccZgcXgWEQTgAzAkAW1RS0Wa36KK2YwxyIO3mOp3Ol3u8RuSXuKRkxnyFg04mMwglMlezWKekeULwKmUxjUguMxlqqhh7Th1LpG2pIyZu3p2LxBKJJM45JxVOWesRmIZcPRJumrKw7NunJkTG511OyUQxgspilxg0EreUleym0ctS-2kYujplkYve2vt3X1AzwhwAFmBDtg-Da-BSCfgAK4sCAnEbHIhEXqHTAUthjLFzMaGvs5x3IwaF4ul8uVnE1usNvxNluOtsd+b7I4nb2MLmsAO3IMIXJ0PBClQQr72d6-BCq6TqDR1DUyCXArO6gdI+nDoslssEitVvC1+tOEbShm1bdtO2mM18UJYkyUpftaUHd980-McfwnKdAOA0CF3A5dOA9TAvV4TlYn9BId35Qx0mELJhAjHJRHkDQHykC8xXMdV3haMx-jTKRn2GB03wNEcv3HP9STQCBf0nUhNxAHlAyohAZDoUwQ3eJjTHyN4T1MC8IxDKRI2EOQlHUD5REEzphKdD9R2-HFZPwKTUBkjD5N9K4KL5UAUgMYRxFo0RIyYjRgVveQDITIy6LM+R-glFibM8RdiTAIDZnmBChPSkggMI4izg3Mit18u5-Oo4wD1ECUw0hBpBQBC8DHESM8BkKUoUhHjWNS-B8sysge3hGk8vAgqwCKtcSI3bzyN5SqHgQcVKjTNVjHSDRrHjUo2vESQFAUKV8na4RCgGvBcWgvw0D8Fh8UOOAOERUhjlQZ6iAUpTKKqsphGUKo0lkRQj2yZQYv2mjpA+cQFHeRR8ihK6bp-e7HqIl7fFISc2yCHEfu3PyVoqKQ8A0mr8iCkxGkMyRnhUW8Pjyax1FR81nIxp7sbezhMCgKASCJirdyMCNDxq9N1B0mm2ITcpKmqdrsgBCodOVFw2lQTAIDgfhlh8paxa24zqjkAE6valqFZM2ilChWRLFBGNTCuwgSCN5T-oMdUqnFWo6lUN51XEVrtIpnbZAjKUlGUOhjHdxCRIGL2-pWkzzClew6hMNIVXl0pIbwfJlXEKEzAaWxlCT1YkINRkdidNOSYFUwVEVILgtyDJFAUdiTEPHIE9eNJqjqjRa4RFOUTEtDnIwlvlpScFaOziEmPvAuLx2yp4eVsMxH4xO2mzZP7JQxyJMnf9pyA2cQPnfx0vwpfdzhzqFA3vPBRjdiapLiZao6kIyKB2lPHo9c8xzyci5PAbkPJVjfipLqXUsjyCFO3CUZgoZ-GBIqEyD5IahQaExK6Q0gLIJ9o+dBFtqhBVvHtQwh0gaQiCqoLqHwYwc1utzLGsBXpQCoStAw5lDztysFYauGkVAXlMOYI+AIhSWRltCLWQA */
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
                    actions: "stripApplication",
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
      "ignore errors": (context) => !!context.ignoreErrors,
    },
    actions: invokeActions.actions,
  }
);

export const useInvoke = (handleClose, handleUpdate) => {
  const stuff = React.useContext(AppStateContext);

  const [state, send] = useMachine(invokeMachine, {
    services: {
      notifyClose: async (context) =>
        handleClose(context.application, context.clientLib),
      notifyUpdate: async (context) =>
        handleUpdate(context.application, context.clientLib),
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
          context.event_index,
          stuff
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
  execRef,
  openLink,
};

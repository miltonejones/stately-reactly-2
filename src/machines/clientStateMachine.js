import { RecentActors } from "@mui/icons-material";
import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
const clientStateMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGMA2BLMA7ALgZRwEMcwBiVAe0IgG0AGAXUVAAcLZ0d0KtmQAPRACYAnCIB0ARiEAWOgA4A7AGY6yxQFZpAGhABPRAFoxEujMWSlQ+fMkz5ygL6PdaTLgLEysMDgAEsMgULGD0TEggbBxcPHyCCIp0dOL2igBsaco2MspCafK6BgiG0mLiyll5dGlmkiJCzq4Y2PhEJKQ+-oHBoZLhrOyc3LwR8WlCiikilhby9kpzhUaSdBbl6bmSWxrpQhqNIG4tniTikENYUAFtZGjsoYx8UUOxo4gyaZOSWQ5pMiIZZTjJYIaSTRQTDT1ITKAFqdQHI4eG5nCAXK6wG6kACuLAgXjCT0GMRGoHi8ny4nkCjoGlp-yB+RB3xk4j+kLs-yUdP2LkOzWRXlR6OuXlILEIMEJEWeJLiiBW6hSUL2Ghk1jokgyIOMZTMswhNjsc0RAtaQvOXEuovaYH4EqwtEeMuJw3lCDS4gUeTsdBEULk8hEih1OWUVI0uVyMjk5mUGjSpvc5tOlvQ1sxQoATmBqHpSEEALaFzjSgbRN1vBDq1kKOx2f0aClq0NCKmKMRCaSRunxkRJ44otMZlE5vMdChZnBlyKu15k4TyNt5LsyOppDSRoSyUMAql7Paw2xaJcyAeC1Noq0Y0e5iD56hO-qzivzgSIHlUnIQkQOBQ7D5Qxqdsu1UT4EzPPkkRTMBhWvG1YLHe9SAAK1gHgZ1lSsFwSalxBED5Iw3X86S1HV8kkKkaj+FQtGo+RzxguD0xvIUixLfxoIQvxkAAC0IS44FICAeFg9MADcKAAa1g6CTlg4dWNOdjOB4s1uL4gSYFgBAJIoZBiGGMJMLnUl3w9BwvS2EQsnMLdlEkHUu09ZQYwpOyzDDBioLNeTmJHIVOngzMSD8LBCELW5+MEkzXzMsYYXEPYti1NItgyRQQ30IxFHsfCYxqXK7B+BofOTPzFIQ8QgpY7jwsigsBOQMBUFil54veepxAsP11BsoR9X9HUIU9LtqUy+NNT2RMysHC0r1qkLYJqgLQvq7xCHEh5nywt94h2DRuqSWRt0SXJVh1NVklWBMiLqBxLEYiqFtWhSXquNCeD8CgACMULAZAcGE0S2rlKsVi2bq+zME6E3jHVYVZJR2WqSx6nkSMnpRO4OEuYGsDErBJJk8Q5OxyhcagXSif0wyMMYUHsPMwxw0+SwshUabEgBEEVyOtc1HSeoVBUZw+SwCgIDgPgya8Ik4vdQwtDZWYOdyBNubSHVvgpKlKj+GpBd5JpypRdAIFQMB5fa90Bu1jHxA0GF1X9IFN2qUqTbmy8RSW62wZw52kvGesAU3XId2y4pfhSAr8jD53IK9i83t928839pn4hjcFZDEQX2bBBHbCkTngz+NdbABLH5rTtiKGLVSuKWnjou0zO9sQP55CS6YARsH8oQKKPDAd1RtySOw0hEJJ0hrn3gpRFalLAMKIqtl0FarOk2yI6wQ7jnJyO+KQl00dI6TMNL59Txfa-gz6sG+v6AZwDuOoQYMJF-WEZ81T5qhaxHsRKQrk-QUU0NGG+pMKYsXfu6Nckx1AOQTv3PIvNgI5FWFfCoTZq5iyAA */
    id: "clientState",

    initial: "idle",

    context: {
      scope: "page",
      sortResults: false,
      pageNum: 1,
      pageSize: 10,
      stateProps: {
        page: [],
        application: [],
      },
      machineKey: "clientState",
      machineName: "Client State Variable",
      icon: RecentActors,
    },

    states: {
      idle: {},

      "editing state": {
        on: {
          close: "closing",

          update: {
            actions: ["updateState", "statePaginate"],
          },

          page: {
            target: "editing state",
            internal: true,
            actions: ["assignPage", "statePaginate"],
          },

          expand: {
            target: "editing state",
            internal: true,
            actions: ["assignExpanded", "statePaginate"],
          },
        },

        states: {
          ready: {
            on: {
              commit: "commit client state changes",

              sort: {
                actions: ["assignSort", "statePaginate"],
              },

              add: "setting state name",
              json: {
                target: "editing json object",
                actions: "assignJSON",
              },
            },

            description: `Modal is open and idle. All actions are handled by the modal logic.`,
          },

          "commit client state changes": {
            invoke: {
              src: "sendClientStateUpdate",
              onDone: {
                target: "ready",
                actions: "assignClean",
              },
            },
          },

          "setting state name": {
            on: {
              change: {
                internal: true,
                actions: "assignNewName",
              },

              cancel: "#clientState.editing state",
              save: {
                target: "ready",
                actions: ["appendState", "statePaginate"],
              },
            },
          },

          "editing json object": {
            on: {
              done: {
                target: "ready",
                actions: "updateJSON",
              },
            },
          },
        },

        initial: "ready",
      },

      closing: {
        invoke: {
          src: "sendClose",
          onDone: {
            target: "idle",
            actions: "clearState",
          },
        },
      },
    },

    on: {
      load: {
        target: ".editing state",
        actions: ["assignState", "statePaginate"],
      },

      "set scope": [
        {
          actions: "assignScope",
          cond: "scope is valid",
          target: ".editing state",
          description: `Ignore scope request if this no state viariables for it exist`,
        },
        {
          target: ".editing state",
          actions: () => alert("Scope is not valid for this state"),
        },
      ],
    },
  },
  {
    guards: {
      "scope is valid": (context, event) => !!context.stateProps[event.scope],
    },
    actions: {
      assignJSON: assign((_, event) => ({
        json: event.json,
        jsonKey: event.key,
      })),
      updateJSON: assign((context, event) => {
        if (!event.json) {
          return;
        }
        const updatedProps = context.stateProps[context.scope].map((prop) =>
          prop.Key === context.jsonKey
            ? { ...prop, Value: JSON.parse(event.json) }
            : prop
        );
        return {
          dirty: true,
          stateProps: {
            ...context.stateProps,
            [context.scope]: updatedProps,
          },
        };
      }),
      assignScope: assign((_, event) => ({
        scope: event.scope,
      })),
      assignNewName: assign((_, event) => ({
        name: event.name,
      })),
      // assignDirty: assign({
      //   dirty: true,
      // }),
      assignClean: assign({
        dirty: false,
      }),
      assignSort: assign((context) => {
        const fn = (a, b) => (a.Key > b.Key ? 1 : -1);
        const { sortResults: oldSetting, internalProps } = context;
        const sortResults = !oldSetting;
        if (!sortResults)
          return {
            stateProps: internalProps,
            sortResults,
          };
        const { page, application } = internalProps;
        const sortedPage = !page ? null : [...page].sort(fn);
        const sortedApp = [...application].sort(fn);
        return {
          sortResults,
          stateProps: {
            page: sortedPage,
            application: sortedApp,
          },
        };
      }),
      assignPage: assign((_, event) => ({
        pageNum: event.page,
      })),
      statePaginate: assign((context) => {
        const { pageNum, pageSize, stateProps } = context;

        const paginate = (array) => {
          if (!array) return {};
          const page_count = Math.ceil(array.length / pageSize);
          const slice_start = (pageNum - 1) * pageSize;
          const visible = array.slice(slice_start, slice_start + pageSize);
          return {
            page_count,
            visible,
          };
        };

        const page = paginate(stateProps.page);
        const application = paginate(stateProps.application);

        // alert(JSON.stringify(application));

        return {
          pagedProps: {
            page,
            application,
          },
        };
      }),
      updateState: assign((context, event) => {
        const { key: Key, datatype: Type, value: Value } = event;
        const updatedProps = context.stateProps[context.scope].map((prop) =>
          prop.Key === Key ? { ...prop, Key, Type, Value } : prop
        );
        return {
          dirty: true,
          stateProps: {
            ...context.stateProps,
            [context.scope]: updatedProps,
          },
        };
      }),
      appendState: assign((context) => {
        const prop = context.name.split(",").map((name) => ({
          Key: name,
          Value: "",
          Type: "string",
        }));
        const updatedProps = context.stateProps[context.scope].concat(prop);

        return {
          dirty: true,
          name: "",
          internalProps: {
            ...context.internalProps,
            [context.scope]: updatedProps,
          },
          stateProps: {
            ...context.stateProps,
            [context.scope]: updatedProps,
          },
        };
      }),
      assignState: assign((_, event) => ({
        scope: !!event.state?.length ? "page" : "application",
        pageNum: 1,
        internalProps: {
          page: event.state,
          application: event.appState,
        },
        stateProps: {
          page: event.state,
          application: event.appState,
        },
      })),
      assignExpanded: assign((context) => ({
        expanded: !context.expanded,
        pageSize: context.expanded ? 10 : 20,
        pageNum: 1,
      })),
      clearState: assign({
        stateProps: {
          page: [],
          application: [],
        },
      }),
    },
  }
);

export const useClientState = (handleClose, handleUpdate) => {
  const [state, send] = useMachine(clientStateMachine, {
    services: {
      sendClose: async () => handleClose(),
      sendClientStateUpdate: async (context) => {
        const { scope, stateProps } = context;
        handleUpdate("state", stateProps[scope], scope);
      },
    },
  });

  return {
    state,
    send,
    ...state.context,
    states: clientStateMachine.states,
  };
};

import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
import generateGuid from "../util/generateGuid";
const eventEditMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5RgG5gHYBcCiECWmAxLGJgASobmYBOeUMNA2gAwC6ioADgPawF4e6TiAAeiALQBGFgE4AbADp5ADhYqALACYAzGpWyA7AFYANCACekvYp1T5MlXsMrDW+VoC+n85Sy4CYlIKNCwyAEMAY0xBdFYOJBBefhihEXEEaTkNRRMDB3c1HXdzKwQpKR1FY2N5WWM1IzkWQ3lvX1CcfCJIngBbPoJ4kWSBNMSMhxzDHRY5WR0dQxZalVLrFS1FWSlDF0qDDVmV9vBOgMxFPAgAGzBCHi4MYcTR1OEJxHcWZRXdYtkcxMNXWmSc21axiWDhqUkBKlOfi6BCut3uEBojxe3D4Yw+oAyUMUcJYdWMGj29kqOlBEi0Kik1S0jjmc3JFR0iPO3VRd0IkRoYHCmDA2KSuPe6UQhkZxi0GlqLCWWgWblBOiUOiMVJYFS09JMGi5VAuihQeDAAHcQlR+Tc+KL2CMJbEpZlKrJthoNPI9i55BpZCVLIg4UoffUtDMVOSVPpjf4eb10AAzPA0PpkDGPfnhdCRMA3MVvV2fd1SLY1Bxx+W+pxSWlaBq5WQK3bGNkaDkJ5GXZNpjNZzFcflCAd9Ysu8YEyTGOHE1ytpWyQ5OWnaLayLf1DSbVotHumkjoCBkfvpzP8KDocI3QgQIRgK7oFA8ADWT6RR4wp-Pg6vN43AgeAvjwkTCrE8STikpYzpkhgrtUHj2E0LRxmsIaZFqihxnoiorICu4Ij4Zwmjyx6ngArlwEDCmAZ79H0eYQPej7Pq+H6KF+5E-mQ1G0SKDEDMxwGgeB7xQU6rxTviYiILuhjEoGiw6B2LhHGYmF0g4igrA42QLAsFTeCR6A8BAcAiNxBDOjB05yWCdTVD6riaWUEhQlU26tt68gtGph48tcdy2XibpZFotLgoGW41Isca6nYgUouaVo2lgoWSmWFSMlqUxzMqWhsqCYZen58jFDMMzqMlfZjheQ6PJlsEOXSBjOaoJjrgqijyrF+oeIs8jGLVigUQxqYNQBt7NfZGQSJssouV1Wm+YoMWRu4-zDaN438XRQlMSes2yYS8rOS06g6IGqhrlpMg-BtFLGEGTa1F4JlAA */
    id: "eventEdit",

    initial: "idle",

    context: {
      currentEvent: null,
      supported: [],
      dirty: false,
    },

    states: {
      idle: {
        on: {
          open: {
            target: "view event",
            actions: "assignEvent",
          },

          drop: {
            target: "confirm drop",
            actions: "assignDropID",
          },

          create: {
            target: "view event",
            actions: "assignCreate",
          },
        },

        description: `Modal is idle, viewing the list of events`,
      },

      "view event": {
        on: {
          close: {
            target: "idle",
            actions: "clearEvent",
          },
        },

        description: `Current event is viewable in the UI.`,
      },

      "confirm drop": {
        on: {
          cancel: "idle",
          confirm: "send confirm signal",
        },

        description: `Show confirm message before sending drop signal to calling component.`,
      },

      "send confirm signal": {
        invoke: {
          src: "sendDrop",
          onDone: "idle",
        },
      },

      "send update command": {
        invoke: {
          src: "sendUpdate",
          onDone: {
            target: "#eventEdit",
            actions: "assignClean",
          },
        },

        description: `Send updates to calling component.`,
      },
    },

    on: {
      "set event trigger": {
        actions: "assignEventTrigger",
      },

      "set event action": {
        actions: "assignEventAction",
      },

      commit: {
        target: ".send update command",
        actions: "assignEventUpdate",
      },
    },
  },
  {
    actions: {
      assignEvent: assign((_, event) => ({
        currentEvent: event.step,
        supported: event.supported.split(","),
      })),
      assignCreate: assign((context, event) => ({
        supported: event.supported.split(","),
        currentEvent: {
          ID: generateGuid(),
          event: "",
          componentID: "",
          action: {
            type: "",
            target: "",
            open: false,
          },
        },
      })),
      assignEventTrigger: assign((context, event) => ({
        currentEvent: {
          ...context.currentEvent,
          event: event.handler,
        },
        dirty: true,
      })),
      assignEventAction: assign((context, event) => ({
        dirty: true,
        currentEvent: {
          ...context.currentEvent,
          action: {
            ...context.currentEvent.action,
            [event.name]: event.value,
          },
        },
      })),
      assignDropID: assign((_, event) => ({
        ID: event.ID,
      })),
      assignEventUpdate: assign((_, event) => ({
        step: event.step,
        pageID: event.pageID,
        componentID: event.componentID,
        resourceID: event.resourceID,
      })),
      assignClean: assign({
        dirty: false,
      }),
      clearEvent: assign({
        currentEvent: null,
        supported: [],
      }),
    },
  }
);

export const useEventEdit = (handleDrop, handleUpdate) => {
  const [state, send] = useMachine(eventEditMachine, {
    services: {
      sendDrop: async (context) => {
        handleDrop(context.ID);
      },

      sendUpdate: async (context) => {
        const { pageID, componentID, resourceID, step } = context;
        handleUpdate(step, { pageID, componentID, resourceID });
      },
    },
  });

  return {
    state,
    send,
    ...state.context,
    states: eventEditMachine.states,
  };
};

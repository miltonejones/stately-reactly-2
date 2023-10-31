import { assign, createMachine } from "xstate";
import { setComponent } from "../connector/setComponent";
import { getComponents } from "../connector/getComponents";
import { useMachine } from "@xstate/react";
const librarianMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBsCWAjATgQ067AdgHSoTJgDEA9gA5gEDaADALqKg1WyoAuqVBdiAAeiALQAmAJxMiTefIBsUiQHYAzAA4ALJoA0IAJ6IAjCaIBWbeqsWpiq+tUTFAX1cG0WXPmIRUsDTI2IaoBFAABGiwPETRPBGk5BQAxgAWhDDMbEggnNx8AkKiCNpMikSa0opMFqpWihLaJgbGCCYSEkQm1lLqnZqKPQ7unhg4eIRxVNgQESlUALacBPQJ8RQQAmAkBABuVADWO14TvtOz80sra1EBPAhhBynYhYys2UL5vPyCuSViJyWVSNTo2CyadROfRGUwSdRERS9DraCxIiwSJhSUYgU4+Kb+QLBULhO4xIjpTJgK7LbYEBI0TC0MCYHiGTbbXYHY5xcb4vwBIIhMKReIUjLhakLWmrekRRnM1mGR77KgvN7ZT65b5vYriJyyeHWJFMdTlTEtWEIA3dJiaVT2TQmKQdEyKNweXF8yYConC0kbFLILhgLUcLg-Ir-RAuOTOVSqMqoxM6RStcQmJjmEwYiSZ7TwvOKQbuT0EKgQOBCPE+r4R3XRhBiZqaIhG9Qms2NLPpptNVRyKQOkyaO1DJzaHE185JMB1gq-PV9zSthTyCzlJjD7SqXtiTPZ3P5wtunRT73nQlCkmi+7zyN-UAlCQrts2e07ldqWp7nNSSxDjITQbhYEKqOe3g+kQV7EiKZKxPEiRkHO2r1oujYFq2Q6joo6gqGigxSHuziDg6dpMNo2hDFIk6etOBKCrBAb3OKVI0jccoKnQSr3g2T6IFCFTwmBn5VKoP5Wma-4jroGJ1FYQ7gXRF5TMGlzShx6x3qhC5RvxTbqKicgmBolGKKomhoi6vaukQBo7i+hnuhR2KlkAA */
    id: "librarian",
    initial: "idle",
    states: {
      idle: {
        on: {
          open: "load component list",
        },
      },

      "displaying list": {
        states: {
          "list idle": {
            on: {
              change: {
                target: "change component property",
                actions: "updateProperty",
              },
            },
          },

          "change component property": {
            invoke: {
              src: "commitComponentDefinition",
              onDone: "#librarian.load component list",
            },
          },
        },

        initial: "list idle",

        on: {
          close: "idle",
        },
      },

      "load component list": {
        invoke: {
          src: "refreshComponentList",
          onDone: {
            target: "displaying list",
            actions: "assignComponentList",
          },
        },
      },
    },
  },
  {
    actions: {
      updateProperty: assign((context, event) => {
        const { componentItems } = context;
        const { name, key, value } = event;
        const componentData = componentItems.find(
          (f) => f.ComponentName === name
        );

        const updatedData = {
          ...componentData,
          [key]: value,
        };

        return {
          componentData: updatedData,
        };
      }),
      assignComponentList: assign((_, event) => {
        const componentItems = event.data.map((datum) => ({
          ...datum,
          Attributes: JSON.parse(datum.Attributes),
        }));
        return {
          componentItems,
        };
      }),
    },
    services: {
      commitComponentDefinition: async (context) => {
        const { componentData } = context;
        const component = {
          ...componentData,
          Attributes: JSON.stringify(componentData.Attributes),
        };
        return await setComponent(component);
      },
      refreshComponentList: async (context) => {
        return await getComponents();
      },
    },
  }
);

export const useLibrarian = () => {
  const [state, send] = useMachine(librarianMachine);

  return {
    state,
    send,
    ...state.context,
    states: librarianMachine.states,
  };
};

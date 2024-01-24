import { getUpdatedAppState } from "../actions/reactly";

export const reactlyServiceProvider = {
  create: (invoker) => {
    async function invokeEventList(context, eventType, eventOwner, css) {
      const { appData, page, clientLib, preview } = context;

      // Check if the invoker state can load
      if (!invoker.state.can("load")) {
        return;
      }

      // Determine the type based on the invoker state
      const type = invoker.state.can("append") ? "append" : "load";

      // Filter the appData events for the specified eventType
      const invoked = eventOwner.events.filter((f) => f.event === eventType);

      // If no events are invoked, return
      if (!invoked.length) {
        return;
      }

      // Log the invocation details
      console.log("INVOKE %c%s", `border:${css};color:lime`, eventType, type);
      // Send the invocation details to the invoker
      invoker.send({
        type,
        eventType,
        events: invoked,
        options: {},
        application: appData,
        page,
        preview,
        clientLib,
      });
    }

    /**
     * Asynchronously invokes an application load event.
     * @param {Object} context - The context object containing appData, page and clientLib
     */
    async function invokeApplicationLoad(context) {
      invokeEventList(
        context,
        "onApplicationLoad",
        context.appData,
        "solid 1px lime"
      );
    }

    /**
     * Asynchronously invokes a function based on the given context.
     * @param {Object} context - The context object containing appData, page and clientLib
     */
    async function invokePageLoad(context) {
      invokeEventList(context, "onPageLoad", context.page, "dotted 1px lime");
    }

    function invokeEvent({
      events,
      eventType,
      options,
      e,
      page,
      appData,
      clientLib,
      send,
      state,
      preview,
    }) {
      if (!events) return;
      const invoked = events
        .filter((f) => f.event === eventType)
        .filter((f) => f.action.type !== "setState");
      const setters = events
        .filter((f) => f.event === eventType)
        .filter((f) => f.action.type === "setState");
      if (!appData) return;

      let updatedClientLib = clientLib;

      if (setters.length) {
        setters.map((step) => {
          send({
            type: "update state",
            options,
            step,
          });
        });

        // update clientLib before passing it into the invoker
        updatedClientLib = setters.reduce((out, step) => {
          const updatedState = getUpdatedAppState(
            {
              ...state.context,

              // pass updated clientLib to keep state setter current
              //  with the values it is updating
              clientLib: out,
            },
            {
              // pass action and options into the state setter
              options,
              step,
            }
          ).clientLib;

          // extract updated page/application data and append to clientLib
          const { page, application } = updatedState;

          return {
            ...out,
            page,
            application,
          };
        }, clientLib);
      }

      // invoke remaining events
      if (!invoked.length) return;
      invoker.send({
        type: "load",
        eventType,
        page,
        events: invoked,
        options,
        application: appData,
        clientLib: updatedClientLib,
        preview,
        e,
      });
    }

    return {
      invokeEventList,
      invokeApplicationLoad,
      invokePageLoad,
      invokeEvent,
    };
  },
};

import { assign } from "xstate";
import getScriptList from "../../util/getScriptList";
import eventHydrate from "../../util/eventHydrate";

/**
 * Assigns overtime to a context object.
 * @param {Object} context - The context object.
 * @returns {Object} - The updated context object with overtime assigned.
 */
const assignOvertime = assign((context) => {
  // Destructure overtime from context
  const { overtime } = context;

  // Remove the last element from overtime array and assign it to settings
  const settings = overtime.pop();

  // Log a message with the number of events in settings
  console.log(
    "%cStarting overtime session with %d events",
    "color:magenta;font-weight:600;border:solid 2px red;padding:2px",
    settings.events.length
  );

  // Return the updated context object with overtime assigned
  return {
    ...settings,
    overtime,
    event_index: 0,
  };
});

/**
 * Assigns event properties to a session object.
 * @param {Object} _ - Placeholder for unused argument.
 * @param {Object} event - Event object.
 * @returns {Object} - Session object with assigned event properties.
 */
const assignEventProps = assign((context, event) => {
  // Hydrate event to append any pre/post events from data events
  const hydratedEventSession = eventHydrate(event);
  const { clientLib } = hydratedEventSession;

  // data and component props from the application
  const { resourceData, setupData } = context;

  // Log starting new session with number of events
  console.log(
    "%cStarting new '%s' session with %d event%s",
    "color:red;font-weight:600;border:solid 2px magenta;padding:2px",
    event.eventType,
    hydratedEventSession.events.length,
    hydratedEventSession.events.length === 1 ? "" : ""
  );

  // Return session object with assigned event properties
  return {
    ...hydratedEventSession,
    event_index: 0,

    // if true, errors will be ignored
    ignoreErrors: false,

    // keeping a record for future functionality, maybe
    memory: [],

    // overtime is deprecated
    overtime: [],

    // preserve resource and setup data in case it gets passed as NULL or EMPTY
    resourceData: clientLib.resources || event.resourceData || resourceData,
    setupData: clientLib.setups || event.setupData || setupData,
  };
});

/**
 * This function takes a context and an event as input and returns an object with updated overtime property.
 * @param {Object} context - The context object.
 * @param {Object} event - The event object.
 * @returns {Object} - The updated context object with overtime property.
 */
const appendEventProps = assign((context, event) => {
  // Hydrate the event object using a utility function
  const hydratedEventSession = eventHydrate(event);

  // Concatenate the existing events to the overtime property in the context object
  return {
    overtime: context.overtime.concat(hydratedEventSession),
  };
});

/**
 * Assigns a problem by extracting error and stack information from an event.
 * @param {Object} context - The context object.
 * @param {Object} event - The event object containing error and stack information.
 * @returns {Object} - The assigned problem object with error and stack properties.
 */
function assignProblem(context, event) {
  // Extract error and stack information from the event
  const { message, stack } = event.data;

  // Create a problem object with error and stack properties
  const problem = {
    error: message,
    stack: stack,
  };

  // Return the assigned problem object
  return problem;
}

/**
 * Updates the application and page based on the given context and event data.
 * @param {Object} context - The current context.
 * @param {Object} event - The event data.
 * @returns {Object} - The updated application and page.
 */
function updateApplication(context, event) {
  // Check if event data exists
  if (!event.data) {
    return;
  }

  const application = event.data;
  if (application.clientLib) {
    return {
      ...application,
    };
  }
  return {
    application,
  };
  // // Check if page exists in context
  // if (!context.page) {

  // }

  // // Find the page in the application based on the page ID in the context
  // const page = application.pages.find((p) => p.ID === context.page.ID);

  // return {
  //   application,
  //   page,
  // };
}

/**
 * Assigns the current event, script, memory, error, and stack to the context object.
 * @param {Object} context - The context object.
 * @returns {Object} - The updated context object.
 */
const assignCurrentEvent = assign((context) => {
  const currentEvent = context.events[context.event_index];

  // If there is no current event, return the context object as is
  if (!currentEvent) return context;

  const memory = context.memory.concat(currentEvent);

  // If the current event action type is "scriptRun", find the script with the matching ID
  if (currentEvent.action.type === "scriptRun") {
    const scripts = getScriptList(context.application);
    const script = scripts.find((f) => f.ID === currentEvent.action.target);

    // Return the updated context object with the current event, script, memory, error, and stack
    return {
      currentEvent,
      script,
      memory,
      error: null,
      stack: null,
    };
  }

  // Return the updated context object with the current event, memory, error, and stack
  return {
    currentEvent,
    error: null,
    stack: null,
    script: null,
    memory,
  };
});

export const invokeActions = {
  actions: {
    assignProblem: assign(assignProblem),
    updateApplication: assign(updateApplication),
    initIgnore: assign({ ignoreErrors: false }),
    toggleIgnore: assign((_, event) => ({
      ignoreErrors: event.ignoreErrors,
    })),
    stripApplication: assign((context) => {
      const { navigation, ...application } = context.application;
      return { application };
    }),
    incrementEvent: assign((context) => ({
      event_index: context.event_index + 1,
    })),
    assignCurrentEvent,
    appendEventProps,
    assignOvertime,
    assignEventProps,
  },
};

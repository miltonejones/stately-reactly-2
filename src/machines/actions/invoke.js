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
const assignEventProps = assign((_, event) => {
  // Hydrate event using utility function
  const settings = eventHydrate(event);

  // Log starting new session with number of events
  console.log(
    "%cStarting new session with %d events",
    "color:red;font-weight:600;border:solid 2px magenta;padding:2px",
    settings.events.length
  );

  // Return session object with assigned event properties
  return {
    ...settings,
    event_index: 0,
    ignore: false,
    memory: [],
    overtime: [],
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
  const settings = eventHydrate(event);

  // Concatenate the existing settings to the overtime property in the context object
  return {
    overtime: context.overtime.concat(settings),
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

  // Check if page exists in context
  if (!context.page) {
    return {
      application,
    };
  }

  // Find the page in the application based on the page ID in the context
  const page = application.pages.find((p) => p.ID === context.page.ID);

  return {
    application,
    page,
  };
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
    initIgnore: assign({ ignore: false }),
    toggleIgnore: assign((_, event) => ({
      ignore: event.ignore,
    })),
    incrementEvent: assign((context) => ({
      event_index: context.event_index + 1,
    })),
    assignCurrentEvent,
    appendEventProps,
    assignOvertime,
    assignEventProps,
  },
};

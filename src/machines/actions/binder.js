import { assign } from "xstate";

/**
 * This function takes two parameters, "_" and "event".
 * It returns an object with the following properties:
 * - bindingData: an object with properties resourceID, bindings, typeMap, and columnMap.
 *   - resourceID: the value of event.ID.
 *   - bindings: an empty object.
 *   - typeMap: an empty object.
 *   - columnMap: an empty array.
 *
 * @param {*} _ - The first parameter, ignored in this function.
 * @param {*} event - The second parameter, an object with an ID property.
 * @returns {object} - An object with bindingData property.
 */
const assignResourceData = (_, event) => ({
  bindingData: {
    resourceID: event.ID,
    bindings: {},
    typeMap: {},
    columnMap: [],
  },
});

// The assignResourceData function can now be used as an argument in the assign function:
// const assignResourceData = assign(/* GENERATED CODE GOES HERE */);

/**
 * Parses the bindings from an event object and returns the binding data.
 * @param {Object} _ - Unused parameter.
 * @param {Object} event - The event object containing the bindings.
 * @returns {Object} - The binding data parsed from the event object.
 */
const parseBindings = (_, event) => ({
  bindingData: JSON.parse(event.bindings),
});

// Assign the parseBindings function to the assignBindings variable
const assignBindings = assign(parseBindings);

/**
 * Assigns an alias to a field in the bindings object of the bindingData.
 * @param {object} context - The context object.
 * @param {object} event - The event object.
 * @param {string} event.field - The field to assign the alias to.
 * @param {string} event.alias - The alias to assign to the field.
 * @returns {object} - The updated bindingData object.
 */
const assignFieldAlias = (context, event) => {
  // Destructure field and alias from event object
  const { field, alias } = event;

  // Destructure bindingData from context object
  const { bindingData } = context;

  // Destructure bindings from bindingData object
  const { bindings } = bindingData;

  // Assign the alias to the field in the bindings object
  Object.assign(bindings, { [field]: alias });

  // Create an updatedData object with the updated bindings
  const updatedData = {
    ...bindingData,
    bindings,
  };

  // Return the updated bindingData object
  return {
    bindingData: updatedData,
  };
};

/**
 * This function takes two parameters, but only uses the second parameter.
 * It returns an object with a single property "selectedProp" whose value is the "prop" property of the event parameter.
 *
 * @param {*} _ - The first parameter, which is not used in the function.
 * @param {*} event - The second parameter, an object that contains the "prop" property.
 * @returns {Object} - An object with a single property "selectedProp" whose value is the "prop" property of the event parameter.
 */
const assignSelectedProp = (_, event) => ({
  selectedProp: event.prop,
});

/**
 * Function to assign state binding data.
 * @param {*} _ - The first parameter, which is not used in the function.
 * @param {object} event - The event object.
 * @returns {object} - The binding data object.
 */
const assignStateBinding = (_, event) => {
  return {
    bindingData: {
      stateName: event.state,
    },
  };
};

/**
 * This function takes in a context and event object and updates the bindingData based on the field provided in the event.
 * If the field already exists in the bindings, it will be deleted. Otherwise, it will be added to the bindings and typeMap.
 * The columnMap will also be updated accordingly.
 * @param {object} context - The context object.
 * @param {object} event - The event object.
 * @param {string} event.field - The field to be updated in the bindingData.
 * @param {object} context.bindingData - The bindingData object.
 * @param {object} context.bindingData.bindings - The bindings object.
 * @param {object} context.bindingData.columnMap - The columnMap array.
 * @param {object} context.bindingData.typeMap - The typeMap object.
 * @returns {object} - The updated bindingData object.
 */
const assignFieldBinding = (context, event) => {
  const { field } = event;
  const { bindingData } = context;
  const { bindings, columnMap, typeMap } = bindingData;

  if (bindings[field]) {
    // If the field already exists in the bindings, delete it and update the columnMap
    delete bindings[field];
    delete typeMap[field];
    const updatedMap = columnMap.filter((f) => f !== field);
    const updatedData = {
      ...bindingData,
      columnMap: updatedMap,
      bindings,
      typeMap,
    };
    return {
      bindingData: updatedData,
    };
  }

  // If the field does not exist in the bindings, add it and update the columnMap
  Object.assign(bindings, {
    [field]: field,
  });
  Object.assign(typeMap, {
    [field]: {
      type: "Text",
      settings: {},
    },
  });
  const updatedMap = columnMap.concat(field);
  const updatedData = {
    ...bindingData,
    columnMap: updatedMap,
    bindings,
    typeMap,
  };
  return {
    bindingData: updatedData,
  };
};

export const binderActions = {
  actions: {
    assignResourceData: assign((_, event) => ({
      bindingData: {
        resourceID: event.ID,
        bindings: {},
        typeMap: {},
        columnMap: [],
      },
    })),
    assignBindings: assign((_, event) => ({
      bindingData: JSON.parse(event.bindings),
    })),
    assignFieldAlias: assign((context, event) => {
      const { field, alias } = event;
      const { bindingData } = context;
      const { bindings } = bindingData;
      Object.assign(bindings, { [field]: alias });

      const updatedData = {
        ...bindingData,
        bindings,
      };

      return {
        bindingData: updatedData,
      };
    }),
    assignSelectedProp: assign((_, event) => ({
      selectedProp: event.prop,
    })),
    assignStateBinding: assign((_, event) => {
      return {
        bindingData: {
          stateName: event.state,
        },
      };
    }),
    assignFieldBinding: assign((context, event) => {
      const { field } = event;
      const { bindingData } = context;
      const { bindings, columnMap, typeMap } = bindingData;

      if (bindings[field]) {
        delete bindings[field];
        delete typeMap[field];
        const updatedMap = columnMap.filter((f) => f !== field);
        const updatedData = {
          ...bindingData,
          columnMap: updatedMap,
          bindings,
          typeMap,
        };

        return {
          bindingData: updatedData,
        };
      }
      Object.assign(bindings, { [field]: field });
      Object.assign(typeMap, {
        [field]: {
          type: "Text",
          settings: {},
        },
      });
      const updatedMap = columnMap.concat(field);
      const updatedData = {
        ...bindingData,
        columnMap: updatedMap,
        bindings,
        typeMap,
      };

      return {
        bindingData: updatedData,
      };
    }),
  },
};

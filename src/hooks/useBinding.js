import objectKeys from "../util/objectKeys";
import stateRead from "../util/stateRead";

const useBinding = (machine, component, isParent, source) => {
  const { page, appData, clientLib } = machine;
  const owner = page || appData;

  // const isParent = component?.ComponentType === "Repeater";
  // console.log({ clientLib });
  // function to parse a value using the current page context
  const getStateValue = (value) =>
    stateRead({
      value,
      page,
      application: appData,
      clientLib,
    });

  if (!!component && !!owner.components) {
    const parentComponent = isParent
      ? component
      : findHighestAncestor(owner.components, component);
    if (parentComponent.ComponentType === "Repeater") {
      const bindings = getRepeaterBindings(
        parentComponent,
        clientLib.resources,
        getStateValue
      );

      if (bindings) {
        return bindings;
      }
    }
  }

  return { repeaterBindings: [], repeaterItems: [] };

  function findHighestAncestor(objects, component) {
    const adult = objects.find((f) => f.ID === component?.componentID);
    if (adult?.ComponentType === "Repeater") {
      return adult;
    }
    if (adult) {
      return findHighestAncestor(objects, adult);
    }
    return component;
  }

  function getRepeaterBindings(component, resourceData, getStateValue) {
    let repeaterBindings = [];
    let repeaterItems = [];
    let repeaterCount = 0;

    // filter by component type (is this necessary? presence of a 'bindings' setting might be
    // good enough and cover more component types)
    if (component?.ComponentType === "Repeater") {
      // find the binding setting for this component
      const binding = component.settings.find(
        (f) => f.SettingName === "bindings"
      );
      if (binding) {
        // parse the binding object from the component settings
        const bindingDef = JSON.parse(binding.SettingValue);

        // if component is bound to a state variable, parse that value as data rows
        if (bindingDef?.stateName) {
          repeaterItems = getStateValue(bindingDef.stateName);
          console.log({ repeaterItems, bindingDef });
          if (!!repeaterItems && repeaterItems.hasOwnProperty("length")) {
            repeaterCount = repeaterItems.length;
            repeaterBindings = objectKeys(repeaterItems).map(
              (key) => `${component.ComponentName}.${key}`
            );
            return { repeaterBindings, repeaterItems, repeaterCount };
          }
        }

        if (
          bindingDef?.resourceID &&
          resourceData &&
          resourceData[bindingDef.resourceID]
        ) {
          const response = resourceData[bindingDef.resourceID];

          repeaterItems = response.rows || response;
          repeaterCount = response.count || repeaterItems.length;
          // console.log({ response, repeaterItems, repeaterCount });
          if (!!repeaterItems && repeaterItems.hasOwnProperty("length")) {
            repeaterBindings = objectKeys(repeaterItems).map(
              (key) => `${component.ComponentName}.${key}`
            );
            // console.log({ repeaterBindings, repeaterItems, repeaterCount });
            return { repeaterBindings, repeaterItems, repeaterCount };
          }
        }
      }
    }

    return null;
  }
};

export default useBinding;

import objectKeys from "../util/objectKeys";
import stateRead from "../util/stateRead";

const useBinding = (machine, component, isParent) => {
  const { page, appData } = machine;
  const owner = page || appData;

  // function to parse a value using the current page context
  const getStateValue = (value) =>
    stateRead({
      value,
      page,
      application: appData,
    });
  console.log({ owner, page, appData });
  if (!owner.components) {
    return { repeaterBindings: [], repeaterItems: [] };
  }
  const parentComponent = isParent
    ? component
    : findHighestAncestor(owner.components, component);

  return getRepeaterBindings(
    parentComponent,
    machine.resourceData,
    getStateValue
  );
};

function findHighestAncestor(objects, component) {
  const adult = objects.find((f) => f.ID === component?.componentID);
  if (adult) {
    return findHighestAncestor(objects, adult);
  }
  return component;
}

function getRepeaterBindings(component, resourceData, getStateValue) {
  let repeaterBindings = [];
  let repeaterItems = [];

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
        if (!!repeaterItems && repeaterItems.hasOwnProperty("length")) {
          repeaterBindings = objectKeys(repeaterItems).map(
            (key) => `${component.ComponentName}.${key}`
          );
        }
      }

      // if component is bound to a data resource, add its data rows
      if (bindingDef?.resourceID && resourceData) {
        repeaterItems = resourceData[bindingDef.resourceID];
        if (!!repeaterItems && repeaterItems.hasOwnProperty("length")) {
          repeaterBindings = objectKeys(repeaterItems).map(
            (key) => `${component.ComponentName}.${key}`
          );
        }
      }
    }
  }

  return { repeaterBindings, repeaterItems };
}

export default useBinding;

const attachBindings = (component, clientLib, repeaterItem) => {
  const { settings, boundProps } = component;
  if (!boundProps) return component.settings;
  let output = settings || [];
  boundProps.map((prop) => {
    const { boundTo, attribute, oppose } = prop;
    if (attribute === "component" || !boundTo) return;
    const [scope, key] = boundTo.split(".");

    if (repeaterItem && repeaterItem[key]) {
      output = output
        .filter((s) => s.SettingName !== attribute)
        .concat({
          SettingName: attribute,
          SettingValue: repeaterItem[key],
          debug: 2,
        });
      return prop;
    }

    if (scope === "application") {
      const boundProp = clientLib.application[key];
      output = output
        .filter((s) => s.SettingName !== attribute)
        .concat({
          SettingName: attribute,
          SettingValue: oppose ? !boundProp : boundProp,
          debug: 1,
        });
      return prop;
    }

    const boundProp = clientLib.page[scope];
    output = output
      .filter((s) => s.SettingName !== attribute)
      .concat({
        SettingName: attribute,
        SettingValue: oppose ? !boundProp : boundProp,
        debug: 3,
      });
    return prop;
  });

  const uniqueKeys = [...new Set(output.map((f) => f.SettingName))];
  const uniqueProps = uniqueKeys.map((key) =>
    output.find((obj) => obj.SettingName === key)
  );

  return uniqueProps;
};

export default attachBindings;

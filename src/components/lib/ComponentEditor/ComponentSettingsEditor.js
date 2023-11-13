import { Collapse, Divider, Stack } from "@mui/material";
import { ComponentInput } from "./ComponentInput";
import OrderSlider from "./OrderSlider";
import Nowrap from "../../../styled/Nowrap";
import Flex from "../../../styled/Flex";
import React from "react";
import { TinyButton } from "../../../styled/TinyButton";

export const ComponentSettingsEditor = (props) => {
  const [expanded, setExpanded] = React.useState({
    General: true,
  });
  const expandNode = (node) =>
    setExpanded({
      ...expanded,
      [node]: !expanded[node],
    });
  const { machine, component, repeaterBindings } = props;
  const { componentData } = machine;

  const attributes = [
    {
      title: "hidden",
      key: "settings",
      type: "bool",
      description: "When TRUE the component is not rendered.",
      category: "Visibility",
    },
    {
      title: "debug",
      alias: "Debug Mode",
      key: "settings",
      type: "bool",
      description: "When TRUE the component is in debug mode.",
      category: "Developer",
    },
  ].concat(componentData?.Attributes);

  const unsortedProps = !attributes
    ? []
    : attributes.filter(
        (setting) =>
          !!setting &&
          setting.type !== "object" &&
          !(setting.title.toLowerCase().indexOf("no value") > -1) &&
          !(setting.title === "children" && componentData.allowChildren)
      );

  const sortedProps = unsortedProps.reduce((out, prop) => {
    const propKey = prop.category || "Miscellaneous";
    if (!out[propKey]) {
      out[propKey] = [];
    }
    out[propKey].push(prop);
    return out;
  }, {});

  const { General, Miscellaneous, Visibility, Unused, ...rest } = sortedProps;
  const propList = {
    Visibility,
    General,
    ...rest,
    Miscellaneous,
    Unused,
  };

  return (
    <>
      <Stack spacing={2}>
        {/* Unused */}
        {Object.keys(propList).map((category) => {
          const settingGroup = propList[category];

          const containsProp =
            !!settingGroup &&
            settingGroup.some(
              (setting) =>
                component.settings &&
                component.settings.some(
                  (opt) =>
                    opt.SettingName === setting.title && !!opt.SettingValue
                )
            );

          const collapseIcon = containsProp
            ? "Delete"
            : expanded[category]
            ? "ExpandLess"
            : "ExpandMore";

          if (!settingGroup?.length) {
            return; // <i />;
          }
          return (
            <Stack key={category}>
              <Flex sx={{ mt: 1 }} onClick={() => expandNode(category)}>
                <TinyButton icon={expanded[category] ? "Remove" : "Add"} />
                <Nowrap hover variant="caption" bold muted>
                  {category}
                </Nowrap>
                <TinyButton icon={collapseIcon} />
              </Flex>
              <Divider />
              <Collapse in={expanded[category] || containsProp}>
                <Stack spacing={1}>
                  {settingGroup.map((setting) => (
                    <ComponentInput
                      machine={machine}
                      repeaterBindings={repeaterBindings}
                      stateList={machine.stateList}
                      stateReference={machine.stateReference}
                      setting={setting}
                      key={setting.title}
                      component={component}
                      onUnbind={(attribute) =>
                        machine.send({
                          type: "unbind",
                          attribute,
                        })
                      }
                      onBind={(attribute, boundTo, oppose) =>
                        machine.send({
                          type: "bind",
                          attribute,
                          boundTo,
                          oppose,
                        })
                      }
                      onBindingConfigure={() => {
                        machine.send("configure binding");
                      }}
                      onConfigure={() =>
                        machine.send({
                          type: "configure",
                          setting,
                        })
                      }
                      onChange={(value) => {
                        machine.send({
                          type: "update",
                          key: "settings",
                          field: setting.title,
                          value,
                        });
                      }}
                    />
                  ))}
                </Stack>
              </Collapse>
            </Stack>
          );
        })}
      </Stack>
    </>
  );
};

import { Stack } from "@mui/material";
import { ComponentInput } from "./ComponentInput";
import OrderSlider from "./OrderSlider";
import CommonForm from "../CommonForm/CommonForm";

export const ComponentSettingsEditor = (props) => {
  const { machine, component, repeaterBindings } = props;
  const { page, appData, Library } = machine;
  const { componentData } = machine;
  let siblings;

  const owner = page || appData;

  if (page) {
    siblings = page.components.filter(
      (f) => f.componentID === component.componentID
    );
  } else {
    siblings = appData.components.filter(
      (f) => f.componentID === component.componentID
    );
  }
  if (!Library) return <i />;

  const iconOf = (key) => {
    const type = Library.find((s) => s.ComponentName === key);
    return type?.Icon;
  };

  const ticks = siblings.map((s) => ({
    value: s.order,
    label: s.ComponentName,
    icon: iconOf(s.ComponentType) || "CheckBoxOutlineBlankRounded",
  }));

  const formProps = [
    {
      alias: "Component Order",
      title: "order",
      description:
        "Sets where the component displays in relation to its sibling components.",
      when: siblings.length > 1,
      component: OrderSlider,
      props: {
        ticks,
        onChange: (e) => {
          machine.send({
            type: "update",
            order: e,
          });
        },
      },
    },
    {
      alias: "Parent Component",
      title: "componentID",
      type: owner.components?.map((f) => ({
        value: f.ID,
        label: f.ComponentName,
      })),
      description: "The component that contains this component.",
    },
    {
      title: "ComponentName",
      field: "name",
      alias: "Component Name",
      description: "The name of the component.",
    },
    // {
    //   title: "hidden",
    //   key: "settings",
    //   type: "boolean",
    //   types: reduced,
    //   description: "When TRUE the component is not rendered.",
    // },
    // {
    //   title: "debug",
    //   alias: "Debug Mode",
    //   key: "settings",
    //   type: "boolean",
    //   types: reduced,
    //   description: "When TRUE the component is in debug mode.",
    // },
  ];

  const attributes = [
    {
      title: "hidden",
      key: "settings",
      type: "bool",
      description: "When TRUE the component is not rendered.",
    },
    {
      title: "debug",
      alias: "Debug Mode",
      key: "settings",
      type: "bool",
      description: "When TRUE the component is in debug mode.",
    },
  ].concat(componentData?.Attributes);

  return (
    <>
      <CommonForm
        fields={formProps}
        record={component}
        onChange={(name, value, key) => {
          if (key) {
            return machine.send({
              type: "update",
              field: name,
              value,
              key,
            });
          }
          machine.send({
            type: "update",
            [name]: value,
          });
        }}
      />

      <Stack spacing={2}>
        {!!attributes &&
          attributes
            .filter(
              (setting) =>
                !!setting &&
                setting.type !== "object" &&
                !(setting.title.toLowerCase().indexOf("no value") > -1) &&
                !(setting.title === "children" && componentData.allowChildren)
            )
            .map((setting) => (
              <>
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
              </>
            ))}
      </Stack>
    </>
  );
};

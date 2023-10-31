import { Stack, TextField } from "@mui/material";
import { ComponentInput } from "./ComponentInput";
import OrderSlider from "./OrderSlider";
import EditBlock from "../../../styled/EditBlock";
import SearchInput from "../../../styled/SearchInput";

export const ComponentSettingsEditor = (props) => {
  const { machine, component, repeaterBindings } = props;
  const { page, appData, Library } = machine;
  const { componentData } = machine;
  let siblings;

  const owner = page || appData;

  // const { repeaterBindings } = useBinding(machine, component);

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

  return (
    <>
      <Stack spacing={2}>
        {siblings.length > 1 && (
          <EditBlock
            title="Component Order"
            description="Sets where the component displays in relation to its sibling components."
          >
            <OrderSlider
              onChange={(e) => {
                machine.send({
                  type: "update",
                  order: e,
                });
              }}
              ticks={ticks}
              value={component.order}
            />
          </EditBlock>
        )}

        <EditBlock
          title="Parent Component"
          description="The component that contains this component."
        >
          <SearchInput
            onChange={(e) => {
              machine.send({
                type: "update",
                componentID: e.target.value,
              });
            }}
            autoComplete="off"
            size="small"
            label="name"
            field="ComponentName"
            id="ID"
            options={owner.components}
            value={component.componentID}
          />
        </EditBlock>

        <EditBlock title="Name" description="The name of the component.">
          <TextField
            autoComplete="off"
            size="small"
            label="name"
            onChange={(e) => {
              machine.send({
                type: "update",
                name: e.target.value,
              });
            }}
            value={component.ComponentName}
          />
        </EditBlock>

        {!!componentData &&
          componentData.Attributes.filter(
            (setting) =>
              setting.type !== "object" &&
              !(setting.title.toLowerCase().indexOf("no value") > -1) &&
              !(setting.title === "children" && componentData.allowChildren)
          ).map((setting) => (
            <>
              <ComponentInput
                repeaterBindings={repeaterBindings}
                stateList={machine.stateList}
                setting={setting}
                key={setting.title}
                component={component}
                onUnbind={(attribute) =>
                  machine.send({
                    type: "unbind",
                    attribute,
                  })
                }
                onBind={(attribute, boundTo) =>
                  machine.send({
                    type: "bind",
                    attribute,
                    boundTo,
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

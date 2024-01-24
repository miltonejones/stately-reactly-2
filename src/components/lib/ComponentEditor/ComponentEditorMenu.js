import { Box, Popover, Stack, Typography } from "@mui/material";
import Flex from "../../../styled/Flex";
import { TinyButton } from "../../../styled/TinyButton";
import { useMenu } from "../../../machines/menuMachine";
import OrderSlider from "./OrderSlider";
import CommonForm from "../CommonForm/CommonForm";

export default function ComponentEditorMenu({ component, machine }) {
  const { page, appData, Library, iconOf, componentData } = machine;

  const owner = page || appData;
  const menu = useMenu();
  if (!owner || !Library) {
    return <i />;
  }

  const siblings = owner.components.filter(
    (f) => f.componentID === component.componentID
  );

  const ticks = siblings.map((s) => ({
    value: s.order,
    label: s.ComponentName,
    icon: iconOf(s.ComponentType) || "CheckBoxOutlineBlankRounded",
  }));

  const formProps = [
    {
      title: "ComponentName",
      field: "name",
      alias: "Component Name",
      description: "The name of the component.",
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
  ];

  return (
    <>
      <Stack
        sx={{
          backgroundColor: (theme) => theme.palette.grey[100],
          width: "100%",
          p: 0.5,
          borderRadius: 1,
        }}
      >
        <Typography onClick={menu.handleClick} variant="body2">
          <b>{component.ComponentName}</b>
        </Typography>
        <Flex onClick={menu.handleClick}>
          <TinyButton icon={componentData?.Icon || "Info"} />
          <Typography variant="caption">{component.ComponentType}</Typography>
        </Flex>
      </Stack>
      <Popover {...menu.menuProps}>
        <Box sx={{ p: 2, width: 400 }}>
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
        </Box>
      </Popover>
    </>
  );
}

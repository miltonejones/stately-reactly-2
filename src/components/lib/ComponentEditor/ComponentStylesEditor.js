import React from "react";
import { Collapse, Divider, Grid, Stack } from "@mui/material";
import { STYLEBIT } from "../../../constants";
import { ComponentInput } from "./ComponentInput";
import Flex from "../../../styled/Flex";
import Spacer from "../../../styled/Spacer";
import { Close, ExpandLess, ExpandMore } from "@mui/icons-material";
import { TinyButton } from "../../../styled/TinyButton";
import { reduceStyles } from "../../../util/reduceStyles";
import Nowrap from "../../../styled/Nowrap";

export const ComponentStylesEditor = (props) => {
  const [bits, setBits] = React.useState(0);
  const swapBit = (val) =>
    setBits((bit) => (bit & val ? bit - val : Number(bit) + Number(val)));

  const { component, machine } = props;
  const { componentData } = machine.state.context;
  const bit = componentData?.Styles || props.bit || 0;
  const validKeys = Object.keys(STYLEBIT).filter(
    (key) => !!displayItems[STYLEBIT[key]] && !!(bit & STYLEBIT[key])
  );
  return (
    <>
      {validKeys.map((key, index) => {
        const settingGroup = displayItems[STYLEBIT[key]];
        if (!settingGroup) {
          return <>No setting for key {STYLEBIT[key]}</>;
        }
        return (
          <Stack sx={{ mt: 2 }} spacing={1}>
            <Flex onClick={() => swapBit(STYLEBIT[key])}>
              <Nowrap
                hover
                muted={!(index === 0 || !!(bits & STYLEBIT[key]))}
                variant="caption"
                sx={{ textTransform: "capitalize" }}
              >
                <b>{key.toLowerCase()}</b>
              </Nowrap>
              <Spacer />
              <TinyButton
                icon={
                  settingGroup.some(
                    (setting) =>
                      component.styles &&
                      component.styles.some(
                        (opt) => opt.Key === setting.title && !!opt.Value
                      )
                  )
                    ? Close
                    : index === 0 || !!(bits & STYLEBIT[key])
                    ? ExpandLess
                    : ExpandMore
                }
              />
            </Flex>
            <Divider />

            <Collapse
              in={
                index === 0 ||
                !!(bits & STYLEBIT[key]) ||
                settingGroup.some(
                  (setting) =>
                    component.styles &&
                    component.styles.some(
                      (opt) => opt.Key === setting.title && !!opt.Value
                    )
                )
              }
            >
              <Grid container spacing={0.5}>
                {settingGroup.map((setting) => (
                  <Grid item xs={setting.xs || 12}>
                    {" "}
                    <ComponentInput
                      machine={machine}
                      setting={setting}
                      key={setting.title}
                      component={component}
                      hidden={!!setting.when && !setting.when(component)}
                      keyName="Key"
                      valueName="Value"
                      typeKey="styles"
                      onChange={(value) => {
                        machine.send({
                          type: "update",
                          key: "styles",
                          field: setting.title,
                          value,
                          keyName: "Key",
                          valueName: "Value",
                        });
                      }}
                    />{" "}
                  </Grid>
                ))}
              </Grid>
            </Collapse>
          </Stack>
        );
      })}
    </>
  );
};

const displayItems = {
  [STYLEBIT.LAYOUT]: [
    {
      title: "display",
      type: "flex,grid",
      default: "flex",
      description: "Flexgrid display type",
    },
    {
      alias: "direction",
      title: "flex-direction",
      type: "row,column",
      default: "column",
      description: "Flexgrid direction",
      when: (component) => {
        const args = reduceStyles(component.styles);
        return args.display === "flex";
      },
    },
    {
      title: "align-items",
      type: "stretch,flex-start,flex-end,center,baseline",
      default: "center",
      description: "Vertical alignment",
    },
    {
      title: "justify-content",
      type: "flex-start,flex-end,center,space-between,space-around,space-evenly,start,end,left,right",
      default: "center",
      description: "Horizontal alignment",
    },
    {
      alias: "spacing",
      title: "gap",
      type: "",
      default: "",
      description: "Spacing between items",
    },
    {
      title: "grid-template-rows",
      type: "gridspec",
      default: "",
      xs: 6,
      description: "Rows in the grid",
      when: (component) => {
        const args = reduceStyles(component.styles);
        return args.display === "grid";
      },
    },
    {
      title: "grid-template-columns",
      type: "gridspec",
      default: "",
      xs: 6,
      description: "Columns in the grid",
      when: (component) => {
        const args = reduceStyles(component.styles);
        return args.display === "grid";
      },
    },
  ],
  [STYLEBIT.DIMENSION]: [
    {
      title: "width",
      type: "",
      default: 0,
      xs: 4,
    },
    {
      title: "min-width",
      type: "",
      default: 0,
      xs: 4,
    },
    {
      title: "max-width",
      type: "",
      default: 0,
      xs: 4,
    },
    {
      title: "height",
      type: "",
      default: 0,
      xs: 4,
    },
    {
      title: "min-height",
      type: "",
      default: 0,
      xs: 4,
    },
    {
      title: "max-height",
      type: "",
      default: 0,
      xs: 4,
    },
    {
      title: "overflow",
      type: "hidden,auto,scroll",
    },
  ],
  [STYLEBIT.POSITION]: [
    {
      title: "position",
      type: "absolute,fixed,relative,unset,static,sticky,initial,inherit",
      default: "none",
      description: "Position of the component",
    },
    {
      title: "left",
      type: "",
      default: 0,
      xs: 6,
    },
    {
      title: "right",
      type: "",
      default: 0,
      xs: 6,
    },
    {
      title: "top",
      type: "",
      default: 0,
      xs: 6,
    },
    {
      title: "bottom",
      type: "",
      default: 0,
      xs: 6,
    },
  ],
  [STYLEBIT.COLOR]: [
    {
      title: "color",
      type: "",
      default: "black",
      description: "Fore color of the container element",
    },
    {
      title: "mix-blend-mode",
      type: "normal,multiply,screen,overlay,darken,lighten,color-dodge,color-burn,hard-light,soft-light,difference,exclusion,hue,saturation,color,luminosity",
      default: "",
      description:
        "Sets how an element's content should blend with the content of the element's parent and the element's background",
    },
  ],
  [STYLEBIT.BORDER]: [
    {
      title: "border-style",
      type: "solid,dotted,inset,none",
      default: "none",
      description: "Style of the border",
    },
    {
      title: "border-color",
      type: "",
      default: "",
      description: "Color of the border",
      when: (component) => {
        const args = reduceStyles(component.styles);
        return !!args["border-style"] && args["border-style"] !== "none";
      },
    },
    {
      title: "border-width",
      type: "",
      default: 0,
      description: "Size of the border in pixels",
      when: (component) => {
        const args = reduceStyles(component.styles);
        return !!args["border-style"] && args["border-style"] !== "none";
      },
    },
  ],
  [STYLEBIT.BACKGROUND]: [
    {
      title: "background-color",
      type: "",
      default: "",
      description: "Color of the background",
    },
  ],
  [STYLEBIT.SPACING]: [
    {
      title: "margin",
      type: "",
      default: "",
      xs: 6,
      description: "Margin around the component",
    },
    {
      title: "padding",
      type: "",
      default: "",
      xs: 6,
      description: "Padding inside the component",
    },
  ],
};

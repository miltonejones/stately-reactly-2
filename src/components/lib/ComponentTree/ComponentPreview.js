import React from "react";
import { Error } from "@mui/icons-material";
import { Library } from "../../reactly";
import Flex from "../../../styled/Flex";
import { reduceStyles } from "../../../util/reduceStyles";
import ComponentMenu from "./ComponentMenu";
import useBinding from "../../../hooks/useBinding";
import { useTheme } from "@mui/material";
import { attachBindings } from "../../../util";

function ComponentNode(props) {
  const {
    componentList,
    currentComponent,
    application,
    page,
    selectComponent,
    invoke,
    register,
    current,
    bindText,
    iconList,
    create,
    isEditMode,
    getStateValue,
    machine,
    repeaterItem,
    repeaterIndex,
  } = props;

  // set hover state for the component
  const [hover, setHover] = React.useState(false);
  const theme = useTheme();
  const { clientLib } = machine;

  // find any repeater data for this component
  const { repeaterItems, repeaterBindings } = useBinding(
    machine,
    current,
    true,
    "ComponentPreview"
  );

  // get the list of child compoents for this component
  const childComponents = componentList.filter(
    (comp) => comp.componentID === current.ID
  );

  // load the MUI component from the Reactly library
  const Tag = Library[current.ComponentType];
  if (!Tag) {
    // print an error message if not defined. this means go add the component to reactly/index.js
    return (
      <Flex>
        <Error />
        No definition for {current.ComponentType}
      </Flex>
    );
  }

  // a reference to invoke events in the invoke component machine
  const invokeEvent = (event, eventType, options) => {
    invoke(
      current.events,
      eventType,
      {
        ...options,
        item: {
          ...repeaterItem,
          index: repeaterIndex,
          // row: repeaterItem,

          // deprecate other properties for these standard ones
          row: repeaterIndex,
          rowData: repeaterItem,
          rowItems: repeaterItems,
        },
      },
      event
    );
  };

  // handle native MUI events like onClick and onChange
  const nativeProps = ["onClick", "onChange", "onClose"].filter((f) =>
    current.events.some((e) => e.event === f)
  );

  // a reference to any bindings for the MUI 'value' property
  const valueBinding = current.boundProps?.find((f) => f.attribute === "value");

  // a reference to any bindings for the MUI 'checked' property
  const checkedBinding = current.boundProps?.find(
    (f) => f.attribute === "checked"
  );

  // create an array of resolved values for data-bound settings
  const boundSettings = attachBindings(
    current,
    machine.clientLib,
    repeaterItem
  );

  // attach any data-bound values to their corresponding settings
  const tagProps = boundSettings.reduce((out, setting) => {
    out[setting.SettingName] = setting.SettingValue;
    return out;
  }, {});

  // extract the 'children' property from the other tag properties
  const { children, ...muiProps } = tagProps;

  // TRUE if this component is selected in the interface
  const selected = currentComponent?.ID === current.ID;

  // set outline style based on hover state
  const sx = hover
    ? { outline: "dotted 1px gray" }
    : selected
    ? {
        outline: `solid 2px ${theme.palette.primary.main}`,
        position: "relative",
      }
    : {};

  // set tag styles based on styles property of the component JSON
  const style = reduceStyles(current.styles);

  // for modal components, set the OPEN state based on the presence of their ID
  // in the clientLib.modals object
  const open = !clientLib.modals ? false : clientLib.modals[current.ID];

  const openProp = current.ComponentType === "Collapse" ? "in" : "open";
  const openSx = { [openProp]: !!open };

  // for Collapse components the 'open' property is called 'in'
  if (muiProps.hasOwnProperty("in")) {
    Object.assign(openSx, { in: muiProps.in });
  }

  // if component has a bound 'value' property, implement 2-way binding
  if (valueBinding) {
    Object.assign(openSx, {
      onChange: (e) => bindText(valueBinding.boundTo, e.target.value),
    });
  }

  // if component has a bound 'checked' property, implement 2-way binding
  if (checkedBinding) {
    Object.assign(openSx, {
      onChange: (e) => bindText(checkedBinding.boundTo, e.target.checked),
    });
  }

  nativeProps.map((prop) =>
    Object.assign(openSx, {
      [prop]: (e) => {
        const param = e.target.hasOwnProperty("checked") ? "checked" : "value";
        invokeEvent(e, prop, { [param]: e.target[param] });
      },
    })
  );

  // images are just weird. print them on their own
  // TODO: implement image events like onLoad and onClick
  if (current.ComponentType === "Image") {
    return <Tag sx={{ ...sx, ...style }} {...muiProps} />;
  }

  const childSelected = (id, open = false) => {
    const kids = componentList.filter((f) => f.componentID === id);
    kids.map((kid) => {
      open = open || kid.ID === currentComponent?.ID;
      current.ComponentName === "confirm modal" &&
        console.log({
          id: kid.ID,
          name: kid.ComponentName,
          open,
          current: currentComponent?.ID,
        });
      open = childSelected(kid.ID, open);
      return open;
    });
    return open;
  }; //

  const faux = selected || childSelected(current.ID);
  // const libType = iconList[current.ComponentType];

  if (muiProps.hidden) {
    return <i />;
  }

  return (
    <Tag
      sx={{ ...sx, ...style }}
      {...muiProps}
      faux={faux}
      resourceData={clientLib.resources}
      type={current.ComponentType}
      boundSettings={boundSettings}
      invokeEvent={invokeEvent}
      register={(setup) => register(current.ID, setup)}
      getStateValue={getStateValue}
      {...openSx}
      onMouseEnter={() => !selected && isEditMode && setHover(true)}
      onMouseLeave={() => !selected && isEditMode && setHover(false)}
    >
      {!!selected && isEditMode && !(repeaterIndex > 0) && (
        <>
          <ComponentMenu
            create={create}
            current={current}
            iconList={iconList}
          />
        </>
      )}
      {hover && isEditMode && !selected && (
        <>
          <ComponentMenu
            create={create}
            current={current}
            iconList={iconList}
          />
        </>
      )}
      {children}
      {muiProps.debug && <pre>{JSON.stringify(muiProps, 0, 2)}</pre>}
      {!!childComponents && (
        <ComponentPreview
          create={create}
          invoke={invoke}
          machine={machine}
          bindText={bindText}
          application={application}
          page={page}
          iconList={iconList}
          component={currentComponent}
          componentList={componentList}
          components={childComponents}
          selectComponent={selectComponent}
          register={register}
          isEditMode={isEditMode}
          getStateValue={getStateValue}
          repeaterBindings={repeaterBindings}
          repeaterItems={repeaterItems}
          repeaterItem={repeaterItem}
          repeaterIndex={repeaterIndex}
        />
      )}
    </Tag>
  );
}

export default function ComponentPreview(props) {
  const {
    components,
    component: currentComponent,
    repeaterItems,
    repeaterItem,
    repeaterIndex,
  } = props;
  const items = components.sort((a, b) => (a.order > b.order ? 1 : -1));

  if (repeaterItems?.length) {
    return (
      <>
        {repeaterItems.map((item, k) => (
          <>
            {items.map((cmp, i) => {
              return (
                <>
                  <ComponentNode
                    key={cmp.ID}
                    currentComponent={currentComponent}
                    current={cmp}
                    {...props}
                    repeaterIndex={k}
                    repeaterItem={item}
                  />{" "}
                </>
              );
            })}
          </>
        ))}
      </>
    );
  }
  return (
    <>
      {items.map((cmp, i) => (
        <ComponentNode
          key={cmp.ID}
          repeaterIndex={repeaterIndex}
          currentComponent={currentComponent}
          repeaterItem={repeaterItem}
          current={cmp}
          {...props}
        />
      ))}
    </>
  );
}

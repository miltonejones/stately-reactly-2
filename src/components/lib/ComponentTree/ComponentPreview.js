import React from "react";
import { Error } from "@mui/icons-material";
import { Library } from "../../reactly";
import Flex from "../../../styled/Flex";
import { reduceStyles } from "../../../util/reduceStyles";
import { stateValue } from "../../../util/stateValue";
import ComponentMenu from "./ComponentMenu";
import useBinding from "../../../hooks/useBinding";
import { useTheme } from "@mui/material";

function ComponentNode(props) {
  const {
    componentList,
    currentComponent,
    resourceData,
    modalData,
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

  // find any repeater data for this component
  const { repeaterItems, repeaterBindings } = useBinding(
    machine,
    current,
    true
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
        no definition for {current.ComponentType}
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
        item: { ...repeaterItem, index: repeaterIndex, row: repeaterItem },
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
    application,
    page,
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
        outline: `solid 2px green`,
        position: "relative",
      }
    : {};

  // set tag styles based on styles property of the component JSON
  const style = reduceStyles(current.styles);

  // for modal components, set the OPEN state based on the presence of their ID
  // in the application.modalData object
  const open = !modalData ? false : modalData[current.ID];

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
    });
    return open;
  }; //

  const faux = selected || childSelected(current.ID);

  return (
    <Tag
      sx={{ ...sx, ...style }}
      {...muiProps}
      faux={faux}
      type={current.ComponentType}
      resourceData={resourceData}
      boundSettings={boundSettings}
      invokeEvent={invokeEvent}
      register={(setup) => register(current.ID, setup)}
      getStateValue={getStateValue}
      {...openSx}
      onMouseEnter={() => !selected && setHover(true)}
      onMouseLeave={() => !selected && setHover(false)}
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
      {hover && !selected && (
        <>
          <ComponentMenu
            create={create}
            current={current}
            iconList={iconList}
          />
        </>
      )}
      {children}
      {!!childComponents && (
        <ComponentPreview
          create={create}
          invoke={invoke}
          machine={machine}
          bindText={bindText}
          application={application}
          resourceData={resourceData}
          page={page}
          iconList={iconList}
          modalData={modalData}
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

const attachBindings = (component, application, page, repeaterItem) => {
  const { settings, boundProps } = component;
  const { state: pageState } = page || { state: [] };
  if (!boundProps) return component.settings;
  let output = settings || [];
  boundProps.map((prop) => {
    const { boundTo, attribute } = prop;
    if (attribute === "component") return;
    if (!boundTo) return;
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
      const boundProp = application.state.find((s) => s.Key === key);
      // key === "banner_image" && console.log({ scope, key, boundProp });
      if (boundProp) {
        output = output
          .filter((s) => s.SettingName !== attribute)
          .concat({
            SettingName: attribute,
            SettingValue: stateValue(boundProp),
            debug: 1,
          });
      }
      return prop;
    }
    if (!pageState) return;
    const boundProp = pageState.find((s) => s.Key === boundTo);
    if (boundProp) {
      output = output
        .filter((s) => s.SettingName !== attribute)
        .concat({
          SettingName: attribute,
          SettingValue: stateValue(boundProp),
          debug: 2,
        });
    }
    return prop;
  });

  const uniqueKeys = [...new Set(output.map((f) => f.SettingName))];
  const uniqueProps = uniqueKeys.map((key) =>
    output.find((obj) => obj.SettingName === key)
  );

  // console.log({ output, uniqueProps });
  return uniqueProps;
};

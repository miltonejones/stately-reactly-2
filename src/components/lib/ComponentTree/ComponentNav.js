import {
  Add,
  CheckBoxOutlineBlankRounded,
  Delete,
  Remove,
  Sync,
} from "@mui/icons-material";
import Flex from "../../../styled/Flex";
import Nowrap from "../../../styled/Nowrap";
import { TinyButton } from "../../../styled/TinyButton";
import { Chip, Collapse } from "@mui/material";
import findMaxNumber from "../../../util/findMaxNumber";
import useBinding from "../../../hooks/useBinding";

export default function ComponentNav(props) {
  const { components, component: currentComponent } = props;
  const items = components.sort((a, b) => (a.order > b.order ? 1 : -1));

  if (!props.iconList) {
    return <>Icon list did not load</>;
  }
  return (
    <>
      {items.map((component) => (
        <ComponentChild
          {...props}
          component={component}
          currentComponent={currentComponent}
        />
      ))}
    </>
  );
}

const ComponentChild = (props) => {
  const {
    componentList,
    component,
    currentComponent,
    send,
    create,
    expand,
    expanded,
    machine,
    iconList = {},
    ml = 1,
  } = props;
  const selectComponent = (ID) => {
    send({
      type: "edit",
      ID,
    });
  };

  const childComponents = componentList.filter(
    (comp) => comp.componentID === component.ID
  );

  // find any repeater data for this component
  const { repeaterItems } = useBinding(
    machine,
    component,
    true,
    "Component Nav"
  );

  const highest = findMaxNumber(childComponents.map((f) => f.order));

  const libRecord = iconList[component.ComponentType];
  const marginLeft = !!childComponents.length ? ml : ml + 2;
  return (
    <>
      <Flex sx={{ ml: marginLeft }}>
        {!!childComponents.length && (
          <TinyButton
            onClick={() => expand(component.ID)}
            icon={!!expanded[component.ID] ? Remove : Add}
          />
        )}
        <TinyButton icon={libRecord?.icon || CheckBoxOutlineBlankRounded} />
        <Nowrap
          hover
          variant="body2"
          color={!!component.events.length ? "error" : "inherit"}
          bold={currentComponent?.ID === component.ID}
          onClick={() => selectComponent(component.ID)}
        >
          {component.ComponentName}
          {component.ComponentType === "Repeater" && !!repeaterItems && (
            <Chip
              sx={{ ml: 1 }}
              color="success"
              icon={<Sync />}
              label={repeaterItems.length}
              size="small"
            />
          )}
        </Nowrap>
        <TinyButton
          onClick={() => send("drop")}
          hidden={currentComponent?.ID !== component.ID}
          icon={Delete}
        />
      </Flex>
      <Collapse
        in={
          !!expanded[component.ID] ||
          (!childComponents.length && !!libRecord?.allowChildren)
        }
      >
        {!!childComponents && (
          <ComponentNav
            create={create}
            expand={expand}
            machine={machine}
            expanded={expanded}
            send={send}
            iconList={iconList}
            component={currentComponent}
            componentList={componentList}
            components={childComponents}
            ml={ml + 4}
          />
        )}
        {!!libRecord?.allowChildren && (
          <Flex sx={{ ml: ml + 4 }}>
            <TinyButton icon={Add} />
            <Nowrap
              onClick={() => create(component.ID, highest + 50)}
              hover
              variant="caption"
            >
              Add component to <b>{component.ComponentName}</b>
            </Nowrap>
          </Flex>
        )}
      </Collapse>
    </>
  );
};

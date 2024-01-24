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
import { HilitText } from "../../../styled";

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

const childNames = (component, components, output = []) => {
  const offspring = components.filter((c) => c.componentID === component.ID);
  offspring.map((c) => {
    output.push(c.ComponentName);
    childNames(c, components, output);
  });
  return output;
};

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

  const { searchParam } = machine;
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

  const kindred = childNames(component, componentList);
  const matching =
    !!searchParam &&
    kindred.some((f) => f.toLowerCase().indexOf(searchParam) > -1);

  return (
    <>
      {/* {JSON.stringify(matching)} */}
      <Flex sx={{ ml: marginLeft }}>
        {!!childComponents.length && (
          <TinyButton
            onClick={() => expand(component.ID)}
            icon={matching || !!expanded[component.ID] ? Remove : Add}
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
          <HilitText value={searchParam}>{component.ComponentName}</HilitText>
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
          matching ||
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

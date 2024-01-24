import SearchInput from "../../../styled/SearchInput";

const exposedProps = {
  onPageChange: ["page"],
  onProgress: ["currentTime", "duration", "progress", "current_time_formatted"],
  onCellClick: ["column", "row", "rowItems", "rowData", "ID"],
  onCrumbClick: ["value"],
  onChipChange: ["value"],
  onChange: ["value", "checked"],
  dataLoaded: ["rows", "count"],
};

export default function ParamSelect({
  machine,
  eventType,
  stateOnly,
  repeaterBindings = [],
  ...props
}) {
  const { expandedList, page } = machine;

  const eventParams = exposedProps[eventType];

  const itemProps = !repeaterBindings
    ? []
    : ["rowData", "rowItem", "row"].map((f) => `item.${f}`);
  const eventProps = !eventParams ? [] : eventParams.map((p) => `event.${p}`);

  const totalList =
    !!stateOnly || !eventParams
      ? expandedList.concat(itemProps)
      : itemProps.concat(eventProps).concat(expandedList); // [...itemProps, ...eventProps, ...expandedList];

  const items = (
    !page?.parameters
      ? totalList
      : Object.keys(page.parameters)
          .map((p) => `parameters.${p}`)
          .concat(totalList)
  ).concat(repeaterBindings);

  return (
    <>
      {/* {JSON.stringify({
        eventParams: (!eventParams).toString(),
        stateOnly: (!!stateOnly).toString(),
      })}
      <hr />
      <hr />
      {JSON.stringify(itemProps)}
      <hr />
      {JSON.stringify(totalList)}
      <hr />
      {JSON.stringify(items)}
      <hr /> */}
      {JSON.stringify(repeaterBindings)}
      <SearchInput options={items} {...props} />
    </>
  );
}

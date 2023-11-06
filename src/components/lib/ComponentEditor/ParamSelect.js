import SearchInput from "../../../styled/SearchInput";

const exposedProps = {
  onPageChange: ["page"],
  onProgress: ["currentTime", "duration", "progress", "current_time_formatted"],
  onCellClick: ["column", "row", "rows", "ID"],
  onChange: ["value", "checked"],
};

export default function ParamSelect({
  machine,
  eventType,
  stateOnly,
  repeaterBindings = [],
  ...props
}) {
  const { stateList, page } = machine;

  const eventParams = exposedProps[eventType];
  const totalList =
    !!stateOnly || !eventParams
      ? stateList
      : eventParams.map((p) => `event.${p}`).concat(stateList);

  const items = (
    !page?.parameters
      ? totalList
      : Object.keys(page.parameters)
          .map((p) => `parameters.${p}`)
          .concat(totalList)
  ).concat(repeaterBindings);

  // if (repeaterBindings) {
  //   return <>{JSON.stringify(repeaterBindings)}</>;
  // }

  return <SearchInput options={items} {...props} />;
}

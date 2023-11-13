export const stateValue = (prop, oppose) => {
  let response = prop.Type === "number" ? Number(prop.Value) : prop.Value;
  if (prop.Type === "object") {
    try {
      response = JSON.parse(prop.Value);
    } catch (ex) {}
  }
  if (prop.Type === "boolean") {
    response = oppose ? !Boolean(prop.Value) : Boolean(prop.Value);
  }
  return response;
};

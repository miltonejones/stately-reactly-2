export const stateValue = (prop) => {
  let response = prop.Type === "number" ? Number(prop.Value) : prop.Value;
  if (prop.Type === "object") {
    try {
      response = JSON.parse(prop.Value);
    } catch (ex) {}
  }
  if (prop.Type === "boolean") {
    response = Boolean(prop.Value);
  }
  return response;
};

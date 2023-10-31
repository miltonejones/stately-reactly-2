export const restoreObjectLabels = (object) => {
  return Object.keys(object).reduce((out, key) => {
    const value = object[key];
    const label = prefixOf(value);
    out[key] = { [label]: value };
    return out;
  }, {});
};

const prefixOf = (value) => {
  if (!isNaN(value) && !!value) {
    return "N";
  }
  switch (typeof value) {
    case "object":
      return "M";
    case "string":
      return "S";
    case "boolean":
      return "BOOL";
    default:
      return "S";
  }
};

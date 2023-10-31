export const reduceStyles = (object) => {
  if (!object) return {};
  return object.reduce((out, setting) => {
    out[setting.Key] = setting.Value;
    return out;
  }, {});
};

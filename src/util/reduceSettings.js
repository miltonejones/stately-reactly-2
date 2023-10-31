export const reduceSettings = (object) => {
  if (!object) return {};
  return object.reduce((out, setting) => {
    out[setting.SettingName] = setting.SettingValue;
    return out;
  }, {});
};

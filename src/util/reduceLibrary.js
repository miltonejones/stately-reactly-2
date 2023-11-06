export default function reduceLibrary(attributes) {
  const array = JSON.parse(attributes);
  return array.reduce((out, attr) => {
    out[attr.title] = attr;
    return out;
  }, {});
}

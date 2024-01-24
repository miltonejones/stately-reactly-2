export default function extractProp(object, key) {
  if (!object) return;
  const [owner, property] = key.split("/");
  if (property && object[owner]) {
    return object[owner][property];
  }
  return object[owner];
}

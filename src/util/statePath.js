export default function statePath(object) {
  return JSON.stringify(object).replace(/[{}"]/g, "").replace(/:/g, "/");
}

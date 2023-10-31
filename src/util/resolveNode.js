import objectKeys from "./objectKeys";

export default function resolveNode(object, node) {
  const key = node.shift();
  const descendent = object[key];

  if (node.length) {
    return resolveNode(descendent, node);
  }

  if (!descendent) {
    return {};
  }

  if (descendent.length) {
    return {
      columns: objectKeys(descendent),
      records: descendent,
    };
  }

  return descendent;
}

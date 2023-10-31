export default function editResource(app, resourceID, fn) {
  const resource = app.resources.find((p) => p.ID === resourceID);
  fn(resource);
  app.resources = app.resources.map((c) =>
    c.ID === resourceID ? resource : c
  );
  app.dirty = true;
  return resource;
}

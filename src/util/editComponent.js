import editPage from "./editPage";

export default function editComponent(app, pageID, componentID, fn) {
  if (pageID) {
    return editPage(app, pageID, (page) => {
      const component = page.components.find((p) => p.ID === componentID);
      fn(component);
      page.components = page.components.map((c) =>
        c.ID === componentID ? component : c
      );
      return component;
    });
  }
  const component = app.components.find((p) => p.ID === componentID);
  fn(component);
  app.components = app.components.map((c) =>
    c.ID === componentID ? component : c
  );
  app.dirty = true;
  return component;
}

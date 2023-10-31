export default function editPage(app, pageID, fn) {
  const page = app.pages.find((p) => p.ID === pageID);
  fn(page);
  app.pages = app.pages.map((c) => (c.ID === pageID ? page : c));
  app.dirty = true;
  return page;
}

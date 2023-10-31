import editPage from "./editPage";

export default function editState(app, pageID, stateKey, fn) {
  const [_, actual] = stateKey.split(".");
  app.dirty = true;
  if (!actual) {
    return editPage(app, pageID, (page) => {
      const state = page.state.find((p) => p.Key === stateKey);
      fn(state);
      page.state = page.state.map((c) => (c.Key === stateKey ? state : c));
      return state;
    });
  }
  const state = app.state.find((p) => p.Key === actual);
  fn(state);
  app.state = app.state.map((c) => (c.Key === actual ? state : c));
  const page = app.pages.find((f) => f.ID === pageID);
  return page;
}

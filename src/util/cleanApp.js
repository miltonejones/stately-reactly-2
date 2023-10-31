const stripDirty = (object) => {
  const { dirty, ...rest } = object;
  return rest;
};

export const cleanApp = (app) => ({
  ...app,
  dirty: false,
  pages: app.pages.map((page) => {
    return {
      ...page,
      components: page.components.map(stripDirty),
    };
  }),
});

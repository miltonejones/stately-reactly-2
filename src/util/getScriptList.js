const getScriptList = (application) => {
  const applicationScripts = application.pages.reduce((out, pg) => {
    if (!pg.scripts?.length) return out;
    pg.scripts.map((sc) => {
      out.push({
        ...sc,
        page: pg.PageName,
      });
    });
    return out;
  }, []);

  application.scripts.map((sc) => {
    applicationScripts.push({
      ...sc,
      page: "application",
    });
  });

  return applicationScripts;
};

export default getScriptList;

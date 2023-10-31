import stateRead from "../../util/stateRead";

const setState = async (context) => {
  const { page, application, currentEvent, options } = context;
  const { action } = currentEvent;
  const { target } = action;
  const [scope, term] = target.split(".");
  let actionProp;
  console.log({ options, term });
  if (!!term && options.item) {
    actionProp = options.item[term];
  } else {
    actionProp = getClientStateValue(context);
  }

  if (typeof target !== "string") return target;

  // set state value of the target state
  if (target.indexOf(".") < 0) {
    const stateProp = page.state.find((s) => s.Key === target);

    const updatedProp = {
      ...stateProp,
      Value: actionProp,
    };

    const updatedPage = {
      ...page,
      state: page.state.map((s) =>
        s.Key === updatedProp.Key ? updatedProp : s
      ),
    };

    const updatedApp = {
      ...application,
      pages: application.pages.map((page) =>
        page.ID === updatedPage.ID ? updatedPage : page
      ),
    };
    return updatedApp;
  }

  if (scope === "application") {
    const stateProp = application.state.find((s) => s.Key === term);

    const updatedProp = {
      ...stateProp,
      Value: actionProp,
    };

    const updatedApp = {
      ...application,
      state: application.state.map((s) =>
        s.Key === updatedProp.Key ? updatedProp : s
      ),
    };

    return updatedApp;
  }

  console.log(
    `%cIgnoring "%s" because we don't play like that`,
    "color: lime",
    target
  );
};

const getClientStateValue = (context) => {
  const { page, application, options, currentEvent } = context;
  const { action } = currentEvent;
  const { value } = action;

  return stateRead({ value, page, application, options });
};

export default setState;

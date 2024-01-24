import stateRead from "../../util/stateRead";

const openLink = (context) => {
  const { application, currentEvent } = context;

  const address = getClientStateValue(context);
  if (currentEvent.action.open) {
    window.open(address);
  } else {
    window.location.href = address;
  }

  return application;
};

export default openLink;

const getClientStateValue = (context) => {
  const { page, application, options, currentEvent, clientLib } = context;

  return stateRead({
    value: currentEvent.action.target,
    page,
    application,
    options,
    clientLib,
  });
};

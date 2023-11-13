const stateRead = ({ value, page, application, options = {}, clientLib }) => {
  let actionProp, stateProp;

  if (typeof value === "string") {
    const [scope, actual] = value.split(".");
    console.log({ scope, actual, clientLib, options });
    switch (scope) {
      case "event":
        actionProp = options[actual];
        break;
      case "application":
        if (clientLib) {
          actionProp = clientLib.application[actual];
        } else {
          stateProp = application.state.find((s) => s.Key === actual);
          if (stateProp) {
            actionProp = stateProp.Value;
          }
        }
        break;
      case "parameters":
        actionProp = clientLib.parameters[actual] || page.parameters[actual];
        // if (clientLib) {
        //   actionProp = clientLib.parameters[actual];
        // } else if (page.parameters) {
        //   actionProp = page.parameters[actual];
        // }
        break;
      default:
        if (clientLib) {
          actionProp = clientLib.page[scope];
        } else {
          stateProp = page.state.find((s) => s.Key === scope);
          if (stateProp) {
            actionProp = stateProp.Value;
          } else {
            console.log("Could not find value for [%s]", value);
          }
        }
    }
    return actionProp;
  }
  return value;
};

export default stateRead;

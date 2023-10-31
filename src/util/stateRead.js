const stateRead = ({ value, page, application, options = {} }) => {
  let actionProp, stateProp;

  if (typeof value === "string") {
    const [scope, actual] = value.split(".");
    switch (scope) {
      case "event":
        actionProp = options[actual];
        break;
      case "application":
        stateProp = application.state.find((s) => s.Key === actual);
        if (stateProp) {
          actionProp = stateProp.Value;
        }
        break;
      case "parameters":
        if (page.parameters) {
          actionProp = page.parameters[actual];
        }
        break;
      default:
        stateProp = page.state.find((s) => s.Key === scope);
        if (stateProp) {
          actionProp = stateProp.Value;
        } else {
          console.log("Could not find value for [%s]", value);
        }
    }
    return actionProp;
  }
  return value;
};

export default stateRead;

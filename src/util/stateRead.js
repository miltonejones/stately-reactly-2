import extractProp from "./extractProp";

const stateRead = ({ value, page, application, options = {}, clientLib }) => {
  let actionProp, stateProp;

  if (typeof value === "string") {
    const [scope, actual] = value.split(".");

    switch (scope) {
      case "event":
        actionProp = options[actual];
        break;
      case "application":
        if (clientLib) {
          actionProp = extractProp(clientLib.application, actual);
        } else {
          stateProp = application.state.find((s) => s.Key === actual);
          if (stateProp) {
            actionProp = stateProp.Value;
          }
        }
        break;
      case "parameters":
        actionProp = clientLib.parameters[actual] || page.parameters[actual];
        break;
      default:
        if (clientLib) {
          actionProp = extractProp(clientLib.page, scope);
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

  console.log({ value });
  return value;
};

export default stateRead;

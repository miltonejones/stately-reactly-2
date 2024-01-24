const execRef = (context) => {
  const { application, currentEvent, clientLib } = context;

  const target = clientLib.setups[currentEvent.action.target];
  const method = target[currentEvent.action.method];

  typeof method === "function" && method();

  return application;
};

export default execRef;

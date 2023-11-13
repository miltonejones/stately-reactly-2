const eventHydrate = (event) => {
  const { events, application } = event;
  const { resources } = application;

  const hydrated = events.reduce((out, ev) => {
    if (ev.action.type !== "dataExec") {
      out.push(ev);
      return out;
    }

    const resource = resources.find((f) => f.ID === ev.action.target);

    if (!resource.events?.length) {
      out.push(ev);
      return out;
    }

    const before = resource.events.filter((f) => f.event === "loadStarted");
    const after = resource.events.filter((f) => f.event === "dataLoaded");
    const cluster = [...before, ev, ...after];

    return out.concat(cluster);
  }, []);

  const settings = {
    ...event,
    eventType: event.eventType,
    events: hydrated,
  };
  console.log({ settings });
  return settings;
};

export default eventHydrate;

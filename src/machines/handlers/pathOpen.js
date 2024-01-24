import stateRead from "../../util/stateRead";

const pathOpen = (context) => {
  const { application, currentEvent, options, preview, clientLib } = context;
  const { action } = currentEvent;
  const { target, data: params } = action;

  const page = application.pages.find((f) => f.ID === target);
  const data = { ...params };

  Object.keys(data).map((term) => {
    // alert(JSON.stringify(options));
    // alert(JSON.stringify(data) + "\n\n" + term);
    const value = data[term];

    const [_, key] = typeof value !== "string" ? [] : value.split(".");

    if (
      !!key &&
      options.item &&
      options.item.hasOwnProperty(key) &&
      typeof options.item[key] !== "undefined"
    ) {
      // if this is from a Repeater binding, set the updatedProp value to the
      // corresponding repeater.item value
      const updatedProp = options.item[key];
      // console.log({ options, item: options.item, key });
      Object.assign(data, { [term]: updatedProp });
      return;
    }

    const param = stateRead({
      value: data[term],
      page,
      application,
      clientLib,
      options,
    });
    // alert(param);
    Object.assign(data, { [term]: param });
  });

  if (preview === "on") {
    // return alert(page.PagePath);
    let pathList = ["", "app", application.path, page.PagePath];
    if (data) {
      pathList = pathList.concat(Object.values(data));
    }

    window.location.href = pathList.join("/");
  }

  const packaged = {
    ...application,
    navigation: {
      path: page.PagePath,
      data,
    },
  };
  return packaged;
};

export default pathOpen;

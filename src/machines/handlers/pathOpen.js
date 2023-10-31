import stateRead from "../../util/stateRead";

const pathOpen = (context) => {
  const { application, currentEvent, options } = context;
  const { action } = currentEvent;
  const { target, data: params } = action;

  const page = application.pages.find((f) => f.ID === target);
  const data = { ...params };

  Object.keys(data).map((term) => {
    const param = stateRead({
      value: data[term],
      page,
      application,
      options,
    });

    Object.assign(data, { [term]: param });
  });

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

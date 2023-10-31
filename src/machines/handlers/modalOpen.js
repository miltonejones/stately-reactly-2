const modalOpen = (context) => {
  const { application, currentEvent } = context;
  const { action } = currentEvent;
  const { target, open } = action;

  const packaged = {
    ...application,
    modalData: {
      key: target,
      open,
    },
  };
  return packaged;
};

export default modalOpen;
